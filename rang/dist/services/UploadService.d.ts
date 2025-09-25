export type UploadOptions = {
    dir?: string;
    maxSizeMB?: number;
    allowedMime?: string[];
    publicBasePath?: string;
};
export declare class UploadService {
    private readonly dir;
    private readonly maxSize;
    private readonly allowedMime;
    private readonly publicBasePath;
    private readonly storage;
    constructor(options?: UploadOptions);
    single(field: string): any;
    fields(fields: Array<{
        name: string;
        maxCount: number;
    }>): any;
    publicUrl(filename: string): string;
}
//# sourceMappingURL=UploadService.d.ts.map