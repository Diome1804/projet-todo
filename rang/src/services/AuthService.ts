import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository.js";
import { TokenService } from "./TokenService.js";

export class AuthService {
  private tokenService = new TokenService();

  constructor(private users = new UserRepository()) {
      //
  }

  //inscription
  async register(email: string, password: string, name: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new Error("Email déjà utilisé");
    }

    const hash = await bcrypt.hash(password, 10);
    // Utiliser l'email comme nom par défaut
    //const name = email.split('@')[0] || email; // Prendre la partie avant @ comme nom, ou l'email entier si split échoue
    const user = await this.users.create(email, hash, name) as any;
    // console.log(user.name);
    // console.log(name);

    return {
      message: "Utilisateur créé avec succès",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
      

      
    };
  }

 //connexion
  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email) as any;
    if (!user || !user.isActive) {
      throw new Error("Identifiants invalides");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new Error("Identifiants invalides");
    }

    const token = this.tokenService.sign({ id: user.id });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  //récupération de mot de passe via question de sécurité
  async forgotPassword(email: string, _securityQuestion: string, _securityAnswer: string, newPassword: string) {
    const user = await this.users.findByEmail(email) as any;
    if (!user || !user.isActive) {
      throw new Error("Utilisateur non trouvé");
    }

    // Vérifier la question/réponse de sécurité (simplifié pour l'exemple)
    // Dans un vrai système, vous stockeriez ces informations en base
    // const expectedAnswer = this.getSecurityAnswer(email);
    // if (securityAnswer.toLowerCase() !== expectedAnswer.toLowerCase()) {
    //   throw new Error("Réponse de sécurité incorrecte");
    // }

    const hash = await bcrypt.hash(newPassword, 10);
    await this.users.updatePassword(user.id, hash);

    return { message: "Mot de passe mis à jour avec succès" };
  }

  async getUsers() {
    return this.users.findAll();
  }

  // // Méthode utilitaire pour simuler les réponses de sécurité (à remplacer par une vraie implémentation)
  // private getSecurityAnswer(email: string): string {
  //   // Simulation - en production, ces données seraient en base de données
  //   const securityAnswers: { [key: string]: string } = {
  //     "test@example.com": "paris",
  //     "admin@example.com": "admin123"
  //   };
  //   return securityAnswers[email] || "default";
  // }
}
