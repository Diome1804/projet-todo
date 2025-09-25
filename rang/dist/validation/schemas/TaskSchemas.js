import { z } from "zod";
import { ErrorMessages } from "../../enums/ErrorMessages.js";
export const CreateTaskSchema = z.object({
    lex_name: z.string().min(1, ErrorMessages.MissingUserName),
    lex_description: z.string().min(1, ErrorMessages.InvalidDescription),
    photoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
});
export const GrantPermissionSchema = z.object({
    granteeId: z.number().int().positive(),
    canEdit: z.boolean().optional(),
    canDelete: z.boolean().optional(),
});
//# sourceMappingURL=TaskSchemas.js.map