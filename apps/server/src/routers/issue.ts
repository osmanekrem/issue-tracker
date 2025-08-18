import {protectedProcedure, router} from "@/lib/trpc";
import {createIssueRequestSchema, updateIssueRequestSchema} from "@/schemas/issue";
import {successResponse} from "@/utils/response";
import {db} from "@/db";
import {issue, priority, status} from "@/db/schema/issue";
import {z} from "zod";
import {desc, eq} from "drizzle-orm"
import {getIssues} from "@/utils/issues";



export const issueRouter = router({
    createIssue: protectedProcedure.input(createIssueRequestSchema).mutation(async ({ctx, input}) => {
        const data = await db.insert(issue).values({
            id: crypto.randomUUID(),
            title: input.title,
            description: input.description,
            statusId: input.statusId,
            priorityId: input.priorityId,
            assigneeId: null,
            reporterId: ctx.session.user.id,
            projectId: input.projectId,
        }).returning();

        if (!data.length || !data[0]) {
            throw new Error("Issue oluşturulamadı");
        }

        return successResponse(data[0], "Issue başarıyla oluşturuldu");
    }),
    getIssues: protectedProcedure.input(
        z.object({
            projectId: z.string().optional(),
            statusId: z.string().optional(),
            assigneeId: z.string().optional(),
            reporterId: z.string().optional(),
            id: z.string().optional(),
            sorting: z.object({
                column: z.enum([
                    'createdAt',
                    'updatedAt',
                    'priorityId'
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
        const data = await getIssues({
            filters: {
                projectId: input.projectId,
                statusId: input.statusId,
                assigneeId: input.assigneeId,
                reporterId: input.reporterId,
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

        return successResponse(data, "Issues başarıyla getirildi");
    }),
    getIssueById: protectedProcedure.input(z.string()).query(async ({input}) => {
        const {items:data} = await getIssues({
            filters: {id: input},
            pagination: {limit: 1, offset: 0}
        })

        if (!data.length || !data[0]) {
            throw new Error("Issue not found");
        }

        return successResponse(data[0], "Issue başarıyla getirildi");
    }),
    updateIssue: protectedProcedure.input(updateIssueRequestSchema).mutation(async ({input}) => {
        const {id, ...updateData} = input;

        const data = await db.update(issue).set(updateData).where(eq(issue.id, id)).returning();

        if (!data.length || !data[0]) {
            throw new Error("Issue güncellenemedi");
        }

        return successResponse(data[0], "Issue başarıyla güncellendi");
    }),
    deleteIssue: protectedProcedure.input(z.string()).mutation(async ({input}) => {
        const data = await db.delete(issue).where(eq(issue.id, input)).returning();

        if (!data.length || !data[0]) {
            throw new Error("Issue silinemedi");
        }

        return successResponse(data[0], "Issue başarıyla silindi");
    }),
    getPriorities: protectedProcedure.query(async () => {
        const data = await db.select().from(priority);

        if (!data.length) {
            throw new Error("Priorities not found");
        }

        return successResponse(data, "Priorities başarıyla getirildi");

    }),
    getStatuses: protectedProcedure.query(async () => {
        const data = await db.select().from(status);

        if (!data.length) {
            throw new Error("Statuses not found");
        }

        return successResponse(data, "Statuses başarıyla getirildi");
    })
})