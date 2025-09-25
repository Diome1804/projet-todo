import { SignOptions } from "jsonwebtoken";
export type JwtPayload = {
    id: number;
} & Record<string, any>;
export declare class TokenService {
    private readonly secret;
    constructor(secret?: string | undefined);
    sign(payload: JwtPayload, options?: SignOptions): string;
    verify(token: string): JwtPayload;
    decode<T = unknown>(token: string): T | null;
}
//# sourceMappingURL=TokenService.d.ts.map