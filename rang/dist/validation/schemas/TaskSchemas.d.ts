import { z } from "zod";
export declare const CreateTaskSchema: z.ZodObject<{
    lex_name: z.ZodString;
    lex_description: z.ZodString;
    photoUrl: z.ZodOptional<z.ZodString>;
    audioUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const GrantPermissionSchema: z.ZodObject<{
    granteeId: z.ZodNumber;
    canEdit: z.ZodOptional<z.ZodBoolean>;
    canDelete: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=TaskSchemas.d.ts.map