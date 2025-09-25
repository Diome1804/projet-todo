import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
export declare class TaskController {
    static getAllTasks(req: AuthRequest, res: Response): Promise<void>;
    static getTaskById(req: Request, res: Response): Promise<void>;
    static createTask(req: AuthRequest, res: Response): Promise<void>;
    static updateTask(req: AuthRequest, res: Response): Promise<void>;
    static deleteTask(req: AuthRequest, res: Response): Promise<void>;
    static completedTask(req: Request, res: Response): Promise<void>;
    static grantPermission(req: AuthRequest, res: Response): Promise<void>;
    static revokePermission(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=TaskController.d.ts.map