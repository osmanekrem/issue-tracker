import z from "zod";

export const createIssueSchema = z.object({
    title: z.string().min(1, "Başlık zorunludur"),
    description: z.string().min(1, "Açıklama zorunludur"),
    projectId: z.string().min(1, "Proje seçilmelidir"),
    assigneeId: z.string().optional(),
    priorityId: z.string().min(1, "Öncelik seçilmelidir"),
    statusId: z.string().min(1, "Durum seçilmelidir"),
})

export type CreateIssueSchema = z.infer<typeof createIssueSchema>;

export const editIssueSchema = createIssueSchema.extend({
    title: z.string().min(1, "Başlık zorunludur"),
    description: z.string().min(1, "Açıklama zorunludur"),
    projectId: z.string().min(1, "Proje seçilmelidir"),
    assigneeId: z.string().optional(),
    priorityId: z.string().min(1, "Öncelik seçilmelidir"),
    statusId: z.string().min(1, "Durum seçilmelidir"),

});

export type EditIssueSchema = z.infer<typeof editIssueSchema>;