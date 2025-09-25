export interface IRepository<T> {
    findAll(page?: number, limit?: number): Promise<T[] | {
        tasks: T[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<T | null>;
    create(data: Omit<T, "id">): Promise<T>;
    update(id: number, userId: number, data: Partial<T>): Promise<T>;
    delete(id: number, userId: number): Promise<void>;
}
//# sourceMappingURL=Irepository.d.ts.map