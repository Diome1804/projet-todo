import { PrismaClient, ActionType } from "@prisma/client";
declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export type HistoryFilters = {
    taskId?: number | undefined;
    actorId?: number | undefined;
    action?: ActionType | undefined;
    from?: Date | undefined;
    to?: Date | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
};
export declare class HistoryService {
    static log(params: {
        taskId: number;
        actorId: number;
        action: ActionType;
        details?: string | null;
    }): Promise<{
        id: number;
        createdAt: Date;
        taskId: number;
        actorId: number;
        action: import("@prisma/client").$Enums.ActionType;
        details: string | null;
    }>;
    static list(filters: HistoryFilters): Promise<{
        items: ({
            task: {
                id: number;
                lex_name: string;
            };
            actor: {
                id: number;
                email: string;
            };
        } & {
            id: number;
            createdAt: Date;
            taskId: number;
            actorId: number;
            action: import("@prisma/client").$Enums.ActionType;
            details: string | null;
        })[];
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    }>;
}
export { prisma, ActionType };
//# sourceMappingURL=HistoryService.d.ts.map