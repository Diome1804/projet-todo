import { Request, Response } from "express";
export declare class AuthController {
    static register(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static forgotPassword(req: Request, res: Response): Promise<void>;
    static getUsers(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map