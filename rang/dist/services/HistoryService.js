import { PrismaClient, ActionType } from "@prisma/client";
const prisma = new PrismaClient();
export class HistoryService {
    static async log(params) {
        const { taskId, actorId, action, details } = params;
        return prisma.actionLog.create({
            data: { taskId, actorId, action, details: details ?? null },
        });
    }
    static async list(filters) {
        const page = Math.max(1, filters.page ?? 1);
        const pageSizeRaw = filters.pageSize ?? 20;
        const pageSize = Math.max(1, Math.min(100, pageSizeRaw));
        const where = {};
        if (typeof filters.taskId === 'number')
            where.taskId = filters.taskId;
        if (typeof filters.actorId === 'number')
            where.actorId = filters.actorId;
        if (filters.action)
            where.action = filters.action;
        if (filters.from || filters.to) {
            where.createdAt = {};
            if (filters.from)
                where.createdAt.gte = filters.from;
            if (filters.to)
                where.createdAt.lte = filters.to;
        }
        const [total, items] = await Promise.all([
            prisma.actionLog.count({ where }),
            prisma.actionLog.findMany({
                where,
                include: {
                    actor: { select: { id: true, email: true } },
                    task: { select: { id: true, lex_name: true } },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);
        return {
            items,
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        };
    }
}
export { prisma, ActionType };
//# sourceMappingURL=HistoryService.js.map