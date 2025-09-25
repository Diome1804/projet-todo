import jwt, { SignOptions } from "jsonwebtoken";

export type JwtPayload = { id: number } & Record<string, any>;

export class TokenService {
  private readonly secret: string;

  constructor(secret = process.env.SECRET) {
    if (!secret) {
      throw new Error("Configuration manquante: SECRET");
    }
    this.secret = secret;
  }

  sign(payload: JwtPayload, options: SignOptions = { expiresIn: "1h" }): string {
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }

  decode<T = unknown>(token: string): T | null {
    return jwt.decode(token) as T | null;
  }
}
