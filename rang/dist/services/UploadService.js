import multer from "multer";
import path from "node:path";
import fs from "node:fs";
export class UploadService {
    dir;
    maxSize;
    allowedMime;
    publicBasePath;
    storage;
    constructor(options) {
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
            destination: (_req, _file, cb) => cb(null, this.dir),
            filename: (_req, file, cb) => {
                const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname || "");
                cb(null, `${unique}${ext}`);
            },
        });
    }
    single(field) {
        return multer({
            storage: this.storage,
            limits: { fileSize: this.maxSize },
            fileFilter: (_req, file, cb) => {
                const ok = this.allowedMime.includes(file.mimetype);
                if (!ok)
                    return cb(new Error("Type de fichier non supporté"));
                cb(null, true);
            },
        }).single(field);
    }
    fields(fields) {
        return multer({
            storage: this.storage,
            limits: { fileSize: this.maxSize },
            fileFilter: (_req, file, cb) => {
                const ok = this.allowedMime.includes(file.mimetype);
                if (!ok)
                    return cb(new Error(`Type de fichier non supporté: ${file.mimetype}`));
                cb(null, true);
            },
        }).fields(fields);
    }
    publicUrl(filename) {
        return `${this.publicBasePath}/${filename}`;
    }
}
//# sourceMappingURL=UploadService.js.map