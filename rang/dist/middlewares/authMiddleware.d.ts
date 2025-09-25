import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: number;
    };
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=authMiddleware.d.ts.map