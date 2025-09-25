import { Request, Response } from "express";
import { z } from "zod";
import { ActionType } from "@prisma/client";
import { HistoryService } from "../services/HistoryService.js";

const querySchema = z.object({
  taskId: z.coerce.number().int().positive().optional(),
  actorId: z.coerce.number().int().positive().optional(),
  action: z.nativeEnum(ActionType).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export class HistoryController {

  static async list(req: Request, res: Response) {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: "ValidationError",
        details: parsed.error.flatten(),
      });
    }

    try {
      const data = await HistoryService.list(parsed.data);
      const items = data.items.map((log) => ({
        id: log.id,
        taskId: log.taskId,
        actorId: log.actorId,
        action: log.action,
        details: log.details ?? null,
        createdAt: log.createdAt,
        actor: log.actor, // { id, email }
        task: log.task,   // { id, lex_name }
      }));

      return res.json({
        items,
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (e: any) {
      return res.status(500).json({ error: "ServerError", message: e?.message ?? "Unexpected error" });
    }
  }
}
