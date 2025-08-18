import z from "zod";

export const createProjectSchema = z.object({
        title: z.string().min(1, "Proje adı zorunludur"),
        description: z.string().optional(),
    ownerId: z.string().optional(),
    });

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const editProjectSchema = z.object({
        title: z.string().min(1, "Proje adı zorunludur"),
        description: z.string().optional(),
    ownerId: z.string().optional(),
    });

export type EditProjectSchema = z.infer<typeof editProjectSchema>;