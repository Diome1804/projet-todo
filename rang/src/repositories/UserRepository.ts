import { PrismaClient, User } from "@prisma/client";

export class UserRepository {
  private prisma: PrismaClient = new PrismaClient();

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string, passwordHash: string, name: string): Promise<User> {
    console.log("UserRepository.create - Données reçues:", { email, passwordHash, name });
    const result = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name
      } as any
    });
    console.log("UserRepository.create - Utilisateur créé:", result);
    return result;
  }

  async updatePassword(userId: number, newPasswordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash }
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
