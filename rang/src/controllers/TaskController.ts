import { Request, Response } from "express";
import { TaskService } from "../services/TaskService.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { ErrorMessages } from "../enums/ErrorMessages.js";
import { HttpStatus } from "../enums/HttpStatus.js";
import { CreateTaskSchema, GrantPermissionSchema } from "../validation/schemas/TaskSchemas.js";

const taskService = new TaskService();

export class TaskController {
  static async getAllTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Paramètres de pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || '';
      const status = req.query.status as string || 'all';

      const result = await taskService.getAllTasks(req.user!.id, page, limit, search, status);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.ErreurServeur });
    }
  }

  static async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const task = await taskService.getTaskById(id);
      if (!task) {
        res.status(HttpStatus.NOT_FOUND).json({ message: ErrorMessages.TacheNonTrouvee });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.ErreurServeur });
      return;
    }
  }

  static async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Validate text fields (file comes via multer). In multipart, empty strings are common; treat empty URLs as undefined.
      const rawBody: any = req.body || {};
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

      const files = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      let finalPhotoUrl: string | undefined = photoUrl;
      let finalAudioUrl: string | undefined = audioUrl;
      
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
      } as any, req.user!.id);
      res.status(HttpStatus.CREATED).json(task);
    } catch (error: any) {
      if (error?.issues) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: error.issues });
        return;
      }
      res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.BAD_REQUEST || "Erreur lors de la création" });
    }
  }

  static async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const task = await taskService.updateTask(id, req.user!.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).json({ message: "Non autorisé" });
    }
  }

  static async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id) || id <= 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.BAD_REQUEST });
        return;
      }
      await taskService.deleteTask(id, req.user!.id);
      res.json({ message: "Tâche supprimée" });
    } catch (error: any) {
      const msg = error?.message || "";
      const code = msg.includes("Tâche introuvable") ? HttpStatus.NOT_FOUND : msg.includes("Non autorisé") ? HttpStatus.FORBIDDEN : HttpStatus.BAD_REQUEST;
      res.status(code).json({ message: msg || ErrorMessages.BAD_REQUEST });
    }
  }

  static async completedTask(req: Request, res: Response): Promise<void> {
    try {
      const lex_Id: number = Number(req.params.id);
      const lex_task = await taskService.completedTask(lex_Id);
      res.json(lex_task);
    } catch (error: any) {
      const errors = error.errors ?? [{ message: error.message }];
      res.status(HttpStatus.BAD_REQUEST).json({ errors });
    }
  }

  static async grantPermission(req: AuthRequest, res: Response): Promise<void> {
    try {
      const taskId = Number(req.params.id);
      if (!Number.isFinite(taskId) || taskId <= 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.BAD_REQUEST });
        return;
      }

      // Coerce types from multipart/form-data or JSON where booleans may be strings
      const raw: any = req.body || {};
      const coerceBool = (v: any): boolean | undefined => {
        if (typeof v === 'boolean') return v;
        if (typeof v === 'string') {
          const s = v.trim().toLowerCase();
          if (s === 'true' || s === '1' || s === 'yes' || s === 'on') return true;
          if (s === 'false' || s === '0' || s === 'no' || s === 'off') return false;
          return undefined;
        }
        if (typeof v === 'number') return v === 1 ? true : v === 0 ? false : undefined;
        return undefined;
      };

      const normalized = {
        granteeId: Number(raw.granteeId),
        canEdit: coerceBool(raw.canEdit),
        canDelete: coerceBool(raw.canDelete),
      } as const;

      const parsed = GrantPermissionSchema.safeParse(normalized);
      if (!parsed.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: parsed.error.issues });
        return;
      }
      const { granteeId, canEdit, canDelete } = parsed.data as { granteeId: number; canEdit?: boolean; canDelete?: boolean };

      if (granteeId === req.user!.id) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Impossible de se donner une permission à soi-même" });
        return;
      }
      await taskService.grantPermission(taskId, req.user!.id, granteeId, canEdit, canDelete);
      res.status(HttpStatus.OK).json({ message: "Permission accordée" });
    } catch (error: any) {
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


  static async revokePermission(req: AuthRequest, res: Response): Promise<void> {
    try {
      const taskId = Number(req.params.id);
      const granteeId = Number(req.params.userId);
      await taskService.revokePermission(taskId, req.user!.id, granteeId);
      res.status(HttpStatus.OK).json({ message: "Permission révoquée" });
    } catch (error: any) {
      const msg = error?.message || ErrorMessages.ErreurServeur;
      const code = msg.includes("Non autorisé")
        ? HttpStatus.FORBIDDEN
        : msg.includes("Tâche introuvable")
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST;
      res.status(code).json({ message: msg });
    }
  }

  static async getAvailableUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const taskId = Number(req.params.id);
      if (!Number.isFinite(taskId) || taskId <= 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.BAD_REQUEST });
        return;
      }

      // Vérifier que l'utilisateur est propriétaire de la tâche
      const task = await taskService.getTaskById(taskId);
      if (!task || task.userId !== req.user!.id) {
        res.status(HttpStatus.FORBIDDEN).json({ message: "Non autorisé" });
        return;
      }

      // Récupérer tous les utilisateurs sauf le propriétaire
      const users = await taskService.getAvailableUsers(req.user!.id);
      res.json(users);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.ErreurServeur });
    }
  }
}