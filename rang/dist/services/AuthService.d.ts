import { UserRepository } from "../repositories/UserRepository.js";
export declare class AuthService {
    private users;
    private tokenService;
    constructor(users?: UserRepository);
    register(email: string, password: string, name: string): Promise<{
        message: string;
        user: {
            id: any;
            email: any;
            name: any;
        };
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            name: any;
        };
    }>;
    forgotPassword(email: string, _securityQuestion: string, _securityAnswer: string, newPassword: string): Promise<{
        message: string;
    }>;
    getUsers(): Promise<{
        id: number;
        name: string | null;
        email: string;
        password: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
//# sourceMappingURL=AuthService.d.ts.map