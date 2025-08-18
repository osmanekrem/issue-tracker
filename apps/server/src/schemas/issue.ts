import {z} from "zod";

export const createIssueRequestSchema = z.object({
    title: z.string().min(1, "Başlık zorunludur"),
    description: z.string().min(1, "Açıklama zorunludur"),
    statusId: z.string().min(1, "Durum zorunludur"),
    priorityId: z.string().min(1, "Öncelik zorunludur"),
    assigneeId: z.string().min(1, "Atanan kullanıcı ID'si zorunludur").optional(),
    projectId: z.string().min(1, "Proje ID'si zorunludur"),
})

export const updateIssueRequestSchema = z.object({
    id: z.string().min(1, "ID zorunludur"),
    title: z.string().min(1, "Başlık zorunludur").optional(),
    description: z.string().min(1, "Açıklama zorunludur").optional(),
    statusId: z.string().min(1, "Durum zorunludur").optional(),
    priorityId: z.string().min(1, "Öncelik zorunludur").optional(),
    assigneeId: z.string().min(1, "Atanan kullanıcı ID'si zorunludur").optional(),
    projectId: z.string().min(1, "Proje ID'si zorunludur").optional(),
})

