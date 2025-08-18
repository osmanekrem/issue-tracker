import {protectedProcedure, router} from "@/lib/trpc";
import {createProjectSchema, updateProjectSchema} from "@/schemas/project";
import {db} from "@/db";
import {project} from "@/db/schema/project";
import {successResponse} from "@/utils/response";
import {z} from "zod";
import {count, desc, eq} from "drizzle-orm";
import {user} from "@/db/schema/auth";
import {paginationRequestSchema} from "@/schemas/pagination";

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
    getProjects: protectedProcedure.query(async ({ctx}) => {
        const data = await db.select({
            id: project.id,
            title: project.title,
            description: project.description,
            ownerId: project.ownerId,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            owner: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
            }
        }).from(project).leftJoin(
            user,
            eq(project.ownerId, user.id),
        ).orderBy(desc(project.createdAt));

        if (!data.length) {
            return successResponse([], "Kullanıcıya ait proje bulunamadı");
        }

        return successResponse(data, "Projeler başarıyla getirildi");
    }),
    getProjectsPaginated: protectedProcedure.input(
        paginationRequestSchema
    ).query(async ({ctx, input}) => {
        const {limit, offset} = input;

        const data = await db.select(
            {
            id: project.id,
            title: project.title,
            description: project.description,
            ownerId: project.ownerId,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            owner: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
            }
        }).from(project)
            .orderBy(desc(project.createdAt))
                .limit(limit).offset(offset)
            .leftJoin(
                user,
                eq(project.ownerId, user.id),
            )

        if (!data.length) {
            return successResponse({
                items: [],
                total: 0,
            }, "Kullanıcıya ait proje bulunamadı");
        }

        const [{count: totalCount}] = await db.select({count: count()}).from(project)

        return successResponse({
            items: data,
            total: totalCount,
        }, "Projeler başarıyla getirildi");
    }),
    getProjectById: protectedProcedure.input(z.string()).query(async ({ctx, input}) => {
        const data = await db.select({
            id: project.id,
            title: project.title,
            description: project.description,
            ownerId: project.ownerId,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            owner: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
            }
        }).from(project).where(eq(
            project.id,
            input,
        ))
            .leftJoin(
                user,
                eq(project.ownerId, user.id),
            )
            .limit(1);

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
    getProjectsByOwnerId: protectedProcedure.input(z.string()).query(async ({ctx, input}) => {
        const data = await db.select().from(project).where(eq(project.ownerId, input)).orderBy(desc(project.createdAt));

        if (!data.length) {
            return successResponse([], "Kullanıcıya ait proje bulunamadı");
        }

        return successResponse(data, "Projeler başarıyla getirildi");
    })
})