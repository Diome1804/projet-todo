import { TaskRepository } from "../repositories/TaskRepository.js";
export class TaskService {
    repository;
    constructor(repository) {
        this.repository = repository || new TaskRepository();
    }
    async getAllTasks(userId, page = 1, limit = 10, search = '', status = 'all') {
        try {
            return this.repository.findAllPaginated(userId, page, limit, search, status);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getTaskById(id) {
        return this.repository.findById(id);
    }
    async createTask(data, userId) {
        return this.repository.create({
            lex_name: String(data.lex_name),
            lex_description: String(data.lex_description),
            completed: Boolean(data.completed) || false,
            photoUrl: data.photoUrl ?? null,
            audioUrl: data.audioUrl ?? null,
            userId,
        });
    }
    async updateTask(id, userId, data) {
        return this.repository.update(id, userId, data);
    }
    async deleteTask(id, userId) {
        return this.repository.delete(id, userId);
    }
    async completedTask(id) {
        return this.repository.completedTask(id);
    }
    async grantPermission(taskId, ownerId, granteeId, canEdit, canDelete) {
        return this.repository.grantPermission(taskId, ownerId, granteeId, canEdit, canDelete);
    }
    async revokePermission(taskId, ownerId, granteeId) {
        return this.repository.revokePermission(taskId, ownerId, granteeId);
    }
}
//# sourceMappingURL=TaskService.js.map