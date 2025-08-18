import {z} from "zod";

export const createProjectSchema = z.object({
    title: z.string().min(1, "Proje adı zorunludur"),
    description: z.string().optional(),
    ownerId: z.string().optional(),
})

export const updateProjectSchema = z.object({
    id: z.string().min(1, "Proje ID'si zorunludur"),
    title: z.string().min(1, "Proje adı zorunludur"),
    description: z.string().optional(),
    ownerId: z.string().optional(),
})