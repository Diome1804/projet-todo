import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import type { Request } from "express";

export type UploadOptions = {
  dir?: string;
  maxSizeMB?: number;
  allowedMime?: string[];
  publicBasePath?: string;
};

export class UploadService {
  private readonly dir: string;
  private readonly maxSize: number;
  private readonly allowedMime: string[];
  private readonly publicBasePath: string;
  private readonly storage: any;

  constructor(options?: UploadOptions) {
    this.dir = options?.dir ?? path.join(process.cwd(), "uploads");
    this.maxSize = (options?.maxSizeMB ?? 5) * 1024 * 1024;
    this.allowedMime = options?.allowedMime ?? [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "audio/webm",
      "audio/wav",
      "audio/mp3",
      "audio/mpeg",
      "audio/ogg",
    ];
    this.publicBasePath = options?.publicBasePath ?? "/uploads";

    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }

    this.storage = multer.diskStorage({
      destination: (_req: any, _file: any, cb: any) => cb(null, this.dir),
      filename: (_req: any, file: any, cb: any) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname || "");
        cb(null, `${unique}${ext}`);
      },
    });
  }

  single(field: string) {
    return multer({
      storage: this.storage,
      limits: { fileSize: this.maxSize },
      fileFilter: (_req: Request, file: any, cb: any) => {
        const ok = this.allowedMime.includes(file.mimetype);
        if (!ok) return cb(new Error("Type de fichier non supporté"));
        cb(null, true);
      },
    }).single(field);
  }

  fields(fields: Array<{ name: string; maxCount: number }>) {
    return multer({
      storage: this.storage,
      limits: { fileSize: this.maxSize },
      fileFilter: (_req: Request, file: any, cb: any) => {
        const ok = this.allowedMime.includes(file.mimetype);
        if (!ok) return cb(new Error(`Type de fichier non supporté: ${file.mimetype}`));
        cb(null, true);
      },
    }).fields(fields);
  }

  publicUrl(filename: string): string {
    return `${this.publicBasePath}/${filename}`;
  }
}
