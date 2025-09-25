import { Task } from "@prisma/client";
import { TaskRepository } from "../repositories/TaskRepository.js";
export declare class TaskService {
    private repository;
    constructor(repository?: TaskRepository);
    getAllTasks(userId: number, page?: number, limit?: number, search?: string, status?: string): Promise<{
        tasks: Task[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }>;
    getTaskById(id: number): Promise<Task | null>;
    createTask(data: Partial<Task>, userId: number): Promise<Task>;
    updateTask(id: number, userId: number, data: Partial<Task>): Promise<Task>;
    deleteTask(id: number, userId: number): Promise<void>;
    completedTask(id: number): Promise<Task>;
    grantPermission(taskId: number, ownerId: number, granteeId: number, canEdit?: boolean, canDelete?: boolean): Promise<void>;
    revokePermission(taskId: number, ownerId: number, granteeId: number): Promise<void>;
}
//# sourceMappingURL=TaskService.d.ts.map