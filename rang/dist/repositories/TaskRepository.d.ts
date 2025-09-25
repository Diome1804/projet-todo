import { Task } from "@prisma/client";
import { IRepository } from "./Irepository.js";
export declare class TaskRepository implements IRepository<Task> {
    private lex_prisma;
    findAll(): Promise<Task[]>;
    findAllPaginated(userId: number, page?: number, limit?: number, search?: string, status?: string): Promise<{
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
    findById(id: number): Promise<Task | null>;
    create(data: Omit<Task, "id">): Promise<Task>;
    private canEditTask;
    private canDeleteTask;
    update(id: number, userId: number, data: Partial<Task>): Promise<Task>;
    delete(id: number, userId: number): Promise<void>;
    completedTask(id: number): Promise<Task>;
    grantPermission(taskId: number, ownerId: number, granteeId: number, canEdit?: boolean, canDelete?: boolean): Promise<void>;
    revokePermission(taskId: number, ownerId: number, granteeId: number): Promise<void>;
}
//# sourceMappingURL=TaskRepository.d.ts.map