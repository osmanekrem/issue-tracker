import {z} from "zod";

export const paginationRequestSchema = z.object({
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
})

export type PaginationRequest = z.infer<typeof paginationRequestSchema>;

export const paginationResponseSchema = z.object({
    total: z.number().int().min(0),
    items: z.array(z.unknown()),
})

export type PaginationResponse = z.infer<typeof paginationResponseSchema>;