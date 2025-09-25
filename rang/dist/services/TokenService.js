import jwt from "jsonwebtoken";
export class TokenService {
    secret;
    constructor(secret = process.env.SECRET) {
        if (!secret) {
            throw new Error("Configuration manquante: SECRET");
        }
        this.secret = secret;
    }
    sign(payload, options = { expiresIn: "1h" }) {
        return jwt.sign(payload, this.secret, options);
    }
    verify(token) {
        return jwt.verify(token, this.secret);
    }
    decode(token) {
        return jwt.decode(token);
    }
}
//# sourceMappingURL=TokenService.js.map