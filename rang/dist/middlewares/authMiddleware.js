import { TokenService } from "../services/TokenService.js";
import { ErrorMessages } from "../enums/ErrorMessages.js";
import { HttpStatus } from "../enums/HttpStatus.js";
const tokenService = new TokenService();
export function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.TokenManquant });
        return;
    }
    try {
        const payload = tokenService.verify(token);
        req.user = { id: payload.id };
        next();
        return;
    }
    catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.TokenInvalide });
        return;
    }
}
//# sourceMappingURL=authMiddleware.js.map