import { TaskService } from "../services/TaskService.js";
import { ErrorMessages } from "../enums/ErrorMessages.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { CreateTaskSchema, GrantPermissionSchema } from "../validation/schemas/TaskSchemas.js";
const taskService = new TaskService();
export class TaskController {
    static async getAllTasks(req, res) {
        try {
            // Paramètres de pagination
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const status = req.query.status || 'all';
            const result = await taskService.getAllTasks(req.user.id, page, limit, search, status);
            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.ErreurServeur });
        }
    }
    static async getTaskById(req, res) {
        try {
            const id = Number(req.params.id);
            const task = await taskService.getTaskById(id);
            if (!task) {
                res.status(HttpStatus.NOT_FOUND).json({ message: ErrorMessages.TacheNonTrouvee });
                return;
            }
            res.json(task);
        }
        catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.ErreurServeur });
            return;
        }
    }
    static async createTask(req, res) {
        try {
            // Validate text fields (file comes via multer). In multipart, empty strings are common; treat empty URLs as undefined.
            const rawBody = req.body || {};
            const normalized = {
                lex_name: typeof rawBody.lex_name === "string" ? rawBody.lex_name : "",
                lex_description: typeof rawBody.lex_description === "string" ? rawBody.lex_description : "",
                photoUrl: typeof rawBody.photoUrl === "string" && rawBody.photoUrl.trim().length > 0 ? rawBody.photoUrl : undefined,
                audioUrl: typeof rawBody.audioUrl === "string" && rawBody.audioUrl.trim().length > 0 ? rawBody.audioUrl : undefined,
            };
            const parsed = CreateTaskSchema.safeParse(normalized);
            if (!parsed.success) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: parsed.error.issues });
                return;
            }
            const { lex_name, lex_description, photoUrl, audioUrl } = parsed.data;
            const files = req.files;
            let finalPhotoUrl = photoUrl;
            let finalAudioUrl = audioUrl;
            if (files) {
                if (files.photo && files.photo[0]) {
                    finalPhotoUrl = `/uploads/${files.photo[0].filename}`;
                }
                if (files.audio && files.audio[0]) {
                    finalAudioUrl = `/uploads/${files.audio[0].filename}`;
                }
            }
            const task = await taskService.createTask({
                lex_name,
                lex_description,
                photoUrl: finalPhotoUrl,
                audioUrl: finalAudioUrl
            }, req.user.id);
            res.status(HttpStatus.CREATED).json(task);
        }
        catch (error) {
            if (error?.issues) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: error.issues });
                return;
            }
            res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.BAD_REQUEST || "Erreur lors de la création" });
        }
    }
    static async updateTask(req, res) {
        try {
            const id = Number(req.params.id);
            const task = await taskService.updateTask(id, req.user.id, req.body);
            res.json(task);
        }
        catch (error) {
            res.status(HttpStatus.FORBIDDEN).json({ message: "Non autorisé" });
        }
    }
    static async deleteTask(req, res) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id) || id <= 0) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.BAD_REQUEST });
                return;
            }
            await taskService.deleteTask(id, req.user.id);
            res.json({ message: "Tâche supprimée" });
        }
        catch (error) {
            const msg = error?.message || "";
            const code = msg.includes("Tâche introuvable") ? HttpStatus.NOT_FOUND : msg.includes("Non autorisé") ? HttpStatus.FORBIDDEN : HttpStatus.BAD_REQUEST;
            res.status(code).json({ message: msg || ErrorMessages.BAD_REQUEST });
        }
    }
    static async completedTask(req, res) {
        try {
            const lex_Id = Number(req.params.id);
            const lex_task = await taskService.completedTask(lex_Id);
            res.json(lex_task);
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json({ errors });
        }
    }
    static async grantPermission(req, res) {
        try {
            const taskId = Number(req.params.id);
            if (!Number.isFinite(taskId) || taskId <= 0) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.BAD_REQUEST });
                return;
            }
            // Coerce types from multipart/form-data or JSON where booleans may be strings
            const raw = req.body || {};
            const coerceBool = (v) => {
                if (typeof v === 'boolean')
                    return v;
                if (typeof v === 'string') {
                    const s = v.trim().toLowerCase();
                    if (s === 'true' || s === '1' || s === 'yes' || s === 'on')
                        return true;
                    if (s === 'false' || s === '0' || s === 'no' || s === 'off')
                        return false;
                    return undefined;
                }
                if (typeof v === 'number')
                    return v === 1 ? true : v === 0 ? false : undefined;
                return undefined;
            };
            const normalized = {
                granteeId: Number(raw.granteeId),
                canEdit: coerceBool(raw.canEdit),
                canDelete: coerceBool(raw.canDelete),
            };
            const parsed = GrantPermissionSchema.safeParse(normalized);
            if (!parsed.success) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: parsed.error.issues });
                return;
            }
            const { granteeId, canEdit, canDelete } = parsed.data;
            if (granteeId === req.user.id) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "Impossible de se donner une permission à soi-même" });
                return;
            }
            await taskService.grantPermission(taskId, req.user.id, granteeId, canEdit, canDelete);
            res.status(HttpStatus.OK).json({ message: "Permission accordée" });
        }
        catch (error) {
            if (error?.issues) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: error.issues });
                return;
            }
            const msg = error?.message || ErrorMessages.ErreurServeur;
            const code = msg.includes("Non autorisé")
                ? HttpStatus.FORBIDDEN
                : msg.includes("Tâche introuvable")
                    ? HttpStatus.NOT_FOUND
                    : HttpStatus.BAD_REQUEST;
            res.status(code).json({ message: msg });
        }
    }
    static async revokePermission(req, res) {
        try {
            const taskId = Number(req.params.id);
            const granteeId = Number(req.params.userId);
            await taskService.revokePermission(taskId, req.user.id, granteeId);
            res.status(HttpStatus.OK).json({ message: "Permission révoquée" });
        }
        catch (error) {
            const msg = error?.message || ErrorMessages.ErreurServeur;
            const code = msg.includes("Non autorisé")
                ? HttpStatus.FORBIDDEN
                : msg.includes("Tâche introuvable")
                    ? HttpStatus.NOT_FOUND
                    : HttpStatus.BAD_REQUEST;
            res.status(code).json({ message: msg });
        }
    }
}
//# sourceMappingURL=TaskController.js.map