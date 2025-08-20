import {protectedProcedure, router} from "../lib/trpc";
import {createProjectSchema, updateProjectSchema} from "../schemas/project";
import {db} from "../db";
import {project} from "../db/schema/project";
import {successResponse} from "../utils/response";
import {z} from "zod";
import { eq} from "drizzle-orm";
import {getProjects} from "@/utils/projects";

export const projectRouter = router({
    createProject: protectedProcedure.input(createProjectSchema).mutation(async ({ctx, input}) => {
        const data = await db.insert(project).values({
            title: input.title,
            description: input.description,
            id: crypto.randomUUID(),
            ownerId: input.ownerId || ctx.session.user.id,
        }).returning()

        if (!data.length || !data[0]) {
            throw new Error("Proje oluşturulamadı");
        }

        return successResponse(data[0], "Proje başarıyla oluşturuldu");
    }),
    getProjects: protectedProcedure.input(
        z.object({
            ownerId: z.string().optional(),
            id: z.string().optional(),
            sorting: z.object({
                column: z.enum([
                    'createdAt',
                    'updatedAt',
                ]).default('createdAt'),
                direction: z.enum(['asc', 'desc']).default('desc')
            }).optional(),
            pagination: z.object({
                limit: z.number().min(1).default(20),
                offset: z.number().min(0).default(0)
            }).optional()
        })
    ).query(async ({
                       input
                   }) => {
        const data = await getProjects({
            filters: {
                ownerId: input.ownerId,
                id: input.id
            },
            sorting: {
                column: input.sorting?.column || 'createdAt',
                direction: input.sorting?.direction || 'desc'
            },
            pagination: {
                limit: input.pagination?.limit || 20,
                offset: input.pagination?.offset || 0
            }
        })

        return successResponse(data, "Projeler başarıyla getirildi");
    }),
    getProjectById: protectedProcedure.input(z.string()).query(async ({ctx, input}) => {
        const {items:data} = await getProjects({
            filters: {id: input},
            pagination: {limit: 1, offset: 0}
        })

        if (!data.length || !data[0]) {
            throw new Error("Proje bulunamadı");
        }

        return successResponse(data[0], "Proje başarıyla getirildi");
    }),
    deleteProject: protectedProcedure.input(z.string()).mutation(async ({ctx, input}) => {
        const data = await db.delete(project).where(eq(project.id, input)).returning();

        if (!data.length || !data[0]) {
            throw new Error("Proje silinemedi");
        }

        return successResponse(data[0], "Proje başarıyla silindi");
    }),
    updateProject: protectedProcedure.input(updateProjectSchema).mutation(async ({ctx, input}) => {
        const {id, ...updateData} = input;

        const data = await db.update(project).set({
            ...updateData,
            updatedAt: new Date(),
            ownerId: updateData.ownerId || ctx.session.user.id,
        }).where(eq(project.id, id)).returning();

        if (!data.length || !data[0]) {
            throw new Error("Proje güncellenemedi");
        }

        return successResponse(data[0], "Proje başarıyla güncellendi");
    }),
})