import { User } from "@prisma/client";
export declare class UserRepository {
    private prisma;
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    create(email: string, passwordHash: string, name: string): Promise<User>;
    updatePassword(userId: number, newPasswordHash: string): Promise<User>;
    findById(id: number): Promise<User | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map