import { PrismaClient } from "@prisma/client";
export class UserRepository {
    prisma = new PrismaClient();
    async findAll() {
        return this.prisma.user.findMany();
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async create(email, passwordHash, name) {
        console.log("UserRepository.create - Données reçues:", { email, passwordHash, name });
        const result = await this.prisma.user.create({
            data: {
                email,
                password: passwordHash,
                name
            }
        });
        console.log("UserRepository.create - Utilisateur créé:", result);
        return result;
    }
    async updatePassword(userId, newPasswordHash) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { password: newPasswordHash }
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
}
//# sourceMappingURL=UserRepository.js.map