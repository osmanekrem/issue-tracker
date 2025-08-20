import {db} from "@/db";
import {project} from "@/db/schema/project";
import {user} from "@/db/schema/auth";
import {and, asc, count, desc, eq} from "drizzle-orm";

export interface GetProjectsOptions {
    filters?: {
        id?: string
        ownerId?: string
    };
    sorting?: {
        column: 'createdAt' | 'updatedAt';
        direction: 'asc' | 'desc';
    };
    pagination?: {
        limit: number;
        offset: number;
    };
}

export const baseQuery = db.select({
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
)

export async function getProjects(options: GetProjectsOptions = {}) {
    const { filters = {}, sorting = { column: 'createdAt', direction: 'desc' }, pagination = { page: 1, pageSize: 20 } } = options;

    const conditions = [];
    if (filters.ownerId) {
        conditions.push(eq(project.ownerId, filters.ownerId));
    }
    if (filters.id) {
        conditions.push(eq(project.id, filters.id));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orderByColumn = project[sorting.column];
    const orderByClause = sorting.direction === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

    const limit = options.pagination?.limit || 20;
    const offset = options.pagination?.offset || 0;

    const issuesPromise = baseQuery
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

    const totalCountPromise = db.select({ value: count() })
        .from(project)
        .where(whereClause);

    const [data, totalCountResult] = await Promise.all([issuesPromise, totalCountPromise]);

    const totalItems = totalCountResult[0].value;

    return {
        items: data,
        total: totalItems,
    };
}