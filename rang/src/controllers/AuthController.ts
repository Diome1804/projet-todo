import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { ErrorMessages } from "../enums/ErrorMessages.js";
import { RegisterSchema, LoginSchema, ForgotPasswordSchema } from "../validation/schemas/AuthSchemas.js";
import { HttpStatus } from "../enums/HttpStatus.js";

const auth = new AuthService();

export class AuthController {

  static async register(req: Request, res: Response) {
    try {
      // console.log("=== REGISTER REQUEST ===");
      // console.log("Headers:", req.headers['content-type']);
      // console.log("Body reçu:", JSON.stringify(req.body, null, 2));
      // console.log("Raw body:", req.body);

      const { email, password ,name} = RegisterSchema.parse(req.body);
      // console.log("Données validées:", { email, password });

      const result = await auth.register(email, password,name);
      // console.log("Inscription réussie:", result);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error: any) {
      // console.error("=== REGISTER ERROR ===");
      // console.error("Error type:", error.constructor.name);
      // console.error("Error message:", error.message);
      // console.error("Error stack:", error.stack);
      // console.error("Error details:", error);

      if (error?.issues) {
        console.error("Validation issues:", error.issues);
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: error.issues });
        return;
      }
      const msg = (error?.message as string) || ErrorMessages.ErreurServeur;
      const code = msg.includes(ErrorMessages.EmailDejaUtilise) ? HttpStatus.CONFLICT : msg.includes("Configuration manquante") ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST;
      res.status(code).json({ message: msg });
    }
  }


  static async login(req: Request, res: Response) {
    try {
      const { email, password } = LoginSchema.parse(req.body);
      const result = await auth.login(email, password);
      res.json(result);
    } catch (error: any) {
      if (error?.issues) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: error.issues });
        return;
      }
      const msg = (error?.message as string) || ErrorMessages.ErreurServeur;
      const code = msg.includes(ErrorMessages.IdentifiantsInvalides) ? HttpStatus.UNAUTHORIZED : msg.includes("Configuration manquante") ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST;
      res.status(code).json({ message: msg });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email, securityQuestion, securityAnswer, newPassword } = ForgotPasswordSchema.parse(req.body);
      const result = await auth.forgotPassword(email, securityQuestion, securityAnswer, newPassword);
      res.json(result);
    } catch (error: any) {
      if (error?.issues) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.ValidationError, issues: error.issues });
        return;
      }
      const msg = (error?.message as string) || ErrorMessages.ErreurServeur;
      const code = msg.includes("Utilisateur non trouvé") ? HttpStatus.NOT_FOUND :
                   msg.includes("Réponse de sécurité incorrecte") ? HttpStatus.UNAUTHORIZED :
                   HttpStatus.BAD_REQUEST;
      res.status(code).json({ message: msg });
    }
  }

  static async getUsers(_req: Request, res: Response) {
    try {
      const users = await auth.getUsers();
      const safeUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
      }));
      res.json(safeUsers);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ErrorMessages.ErreurServeur });
    }
  }
}
