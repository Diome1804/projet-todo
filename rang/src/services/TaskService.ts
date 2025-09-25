import { Task } from "@prisma/client";
import { TaskRepository } from "../repositories/TaskRepository.js";

export class TaskService {
  private repository: TaskRepository;

  constructor(repository?: TaskRepository) {
    this.repository = repository || new TaskRepository();
  }

  async getAllTasks(userId: number, page: number = 1, limit: number = 10, search: string = '', status: string = 'all'): Promise<{
    tasks: Task[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    try {
      return this.repository.findAllPaginated(userId, page, limit, search, status);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTaskById(id: number): Promise<Task | null> {
    return this.repository.findById(id);
  }

  async createTask(data: Partial<Task>, userId: number): Promise<Task> {
    return this.repository.create({
      lex_name: String(data.lex_name),
      lex_description: String(data.lex_description),
      completed: Boolean((data as any).completed) || false,
      photoUrl: (data as any).photoUrl ?? null,
      audioUrl: (data as any).audioUrl ?? null,
      userId,
    } as any);
  }

  async updateTask(id: number, userId: number, data: Partial<Task>): Promise<Task> {
    return this.repository.update(id, userId, data);
  }

  async deleteTask(id: number, userId: number): Promise<void> {
    return this.repository.delete(id, userId);
  }

  async completedTask(id: number): Promise<Task> {
    return this.repository.completedTask(id);
  }

  async grantPermission(taskId: number, ownerId: number, granteeId: number, canEdit?: boolean, canDelete?: boolean): Promise<void> {
    return this.repository.grantPermission(taskId, ownerId, granteeId, canEdit, canDelete);
  }

  async revokePermission(taskId: number, ownerId: number, granteeId: number): Promise<void> {
    return this.repository.revokePermission(taskId, ownerId, granteeId);
  }

  async getAvailableUsers(excludeUserId: number): Promise<any[]> {
    // Pour l'instant, retourner une liste statique d'utilisateurs de test
    // TODO: Intégrer avec UserRepository quand disponible
    return [
      { id: 2, name: 'Alice Dupont', email: 'alice@example.com' },
      { id: 3, name: 'Bob Martin', email: 'bob@example.com' },
      { id: 4, name: 'Claire Bernard', email: 'claire@example.com' },
    ].filter(u => u.id !== excludeUserId);
  }
}