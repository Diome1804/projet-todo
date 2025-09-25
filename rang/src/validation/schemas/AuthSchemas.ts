import { z } from "zod";

export const CredentialsSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre")
});

export const RegisterSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères")
});

export const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis")
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
  securityQuestion: z.string().min(5, "La question de sécurité doit contenir au moins 5 caractères"),
  securityAnswer: z.string().min(2, "La réponse doit contenir au moins 2 caractères"),
  newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre")
});