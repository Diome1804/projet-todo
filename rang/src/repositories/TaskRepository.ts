import { PrismaClient, Task } from "@prisma/client";
import { IRepository } from "./Irepository.js";

export class TaskRepository implements IRepository<Task> {
  private lex_prisma: PrismaClient = new PrismaClient();

  async findAll(): Promise<Task[]> {
    return this.lex_prisma.task.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findAllPaginated(userId: number, page: number = 1, limit: number = 10, search: string = '', status: string = 'all'): Promise<{
    tasks: Task[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    const skip = (page - 1) * limit;

    // Construire les conditions de filtrage
    const where: any = {
      OR: [
        { userId }, // Tasks owned by the user
        {
          permissions: {
            some: {
              granteeId: userId
            }
          }
        } // Tasks shared with the user
      ]
    };

    // Filtrage par recherche
    if (search) {
      where.AND = [
        {
          OR: [
            { lex_name: { contains: search, mode: 'insensitive' } },
            { lex_description: { contains: search, mode: 'insensitive' } }
          ]
        }
      ];
    }

    // Filtrage par statut
    if (status === 'completed') {
      where.completed = true;
    } else if (status === 'pending') {
      where.completed = false;
    }
    // 'all' ne nécessite pas de filtre supplémentaire

    // Compter le total d'éléments
    const totalItems = await this.lex_prisma.task.count({ where });

    // Récupérer les tâches paginées avec permissions
    const tasks = await this.lex_prisma.task.findMany({
      where,
      include: {
        permissions: {
          where: {
            granteeId: userId
          }
        }
      },
      skip,
      take: limit,
      orderBy: { id: 'desc' }, // Plus récentes en premier
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    };
  }

  async findById(id: number): Promise<Task | null> {
    return this.lex_prisma.task.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<Task, "id">): Promise<Task> {
    return this.lex_prisma.task.create({ data });
  }

  private async canEditTask(id: number, userId: number): Promise<boolean> {
    const [owner, perm] = await Promise.all([
      this.lex_prisma.task.findFirst({ where: { id, userId } }),
      (this.lex_prisma as any).taskPermission.findFirst({ where: { taskId: id, granteeId: userId, canEdit: true } }),
    ]);
    return !!owner || !!perm;
  }

  private async canDeleteTask(id: number, userId: number): Promise<boolean> {
    const [owner, perm] = await Promise.all([
      this.lex_prisma.task.findFirst({ where: { id, userId } }),
      (this.lex_prisma as any).taskPermission.findFirst({ where: { taskId: id, granteeId: userId, canDelete: true } }),
    ]);
    return !!owner || !!perm;
  }

  async update(id: number, userId: number, data: Partial<Task>): Promise<Task> {
    const allowed = await this.canEditTask(id, userId);
    if (!allowed) throw new Error("Non autorisé");
    await this.lex_prisma.task.update({ where: { id }, data });
    return (await this.findById(id)) as Task;
  }

  async delete(id: number, userId: number): Promise<void> {
    const allowed = await this.canDeleteTask(id, userId);
    if (!allowed) throw new Error("Non autorisé");
    await this.lex_prisma.task.delete({ where: { id } });
  }

  async completedTask(id: number): Promise<Task> {
    const task = await this.lex_prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new Error("Tâche introuvable");
    }

    return this.lex_prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });
  }

  // Permissions CRUD
  async grantPermission(taskId: number, ownerId: number, granteeId: number, canEdit?: boolean, canDelete?: boolean): Promise<void> {
    const taskById = await this.lex_prisma.task.findUnique({ where: { id: taskId } });
    if (!taskById) {
      throw new Error("Tâche introuvable");
    }
    if (taskById.userId !== ownerId) {
      throw new Error("Non autorisé");
    }

    const existing = await (this.lex_prisma as any).taskPermission.findUnique({
      where: { taskId_granteeId: { taskId, granteeId } },
    });

    const finalCanEdit = typeof canEdit === "boolean" ? canEdit : existing?.canEdit ?? false;
    const finalCanDelete = typeof canDelete === "boolean" ? canDelete : existing?.canDelete ?? false;

    if (!finalCanEdit && !finalCanDelete) {
      await (this.lex_prisma as any).taskPermission.deleteMany({ where: { taskId, granteeId } });
      return;
    }

    await (this.lex_prisma as any).taskPermission.upsert({
      where: { taskId_granteeId: { taskId, granteeId } },
      create: { taskId, granteeId, canEdit: finalCanEdit, canDelete: finalCanDelete },
      update: { canEdit: finalCanEdit, canDelete: finalCanDelete },
    });
  }

  async revokePermission(taskId: number, ownerId: number, granteeId: number): Promise<void> {
    const taskById = await this.lex_prisma.task.findUnique({ where: { id: taskId } });
    if (!taskById) throw new Error("Tâche introuvable");
    if (taskById.userId !== ownerId) throw new Error("Non autorisé");

    await (this.lex_prisma as any).taskPermission.deleteMany({ where: { taskId, granteeId } });
  }
}
