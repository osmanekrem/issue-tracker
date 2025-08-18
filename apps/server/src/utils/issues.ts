import {and, asc, count, desc, eq} from "drizzle-orm";
import {db} from "@/db";
import {issue, priority, status} from "@/db/schema/issue";
import {alias} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth";
import {project} from "@/db/schema/project";

export interface GetIssuesOptions {
    filters?: {
        id?: string;
        projectId?: string;
        statusId?: string;
        assigneeId?: string;
        reporterId?: string;
    };
    sorting?: {
        column: 'createdAt' | 'updatedAt' | 'priorityId';
        direction: 'asc' | 'desc';
    };
    pagination?: {
        limit: number;
        offset: number;
    };
}

const reporter = alias( user, "reporter");
const assignee = alias(user, "assignee");
export const baseQuery = db.select({
    id: issue.id,
    title: issue.title,
    statusId: issue.statusId,
    priorityId: issue.priorityId,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    description: issue.description,
    projectId: issue.projectId,
    reporterId: issue.reporterId,
    assigneeId: issue.assigneeId,
    reporter: {
        id: reporter.id,
        firstName: reporter.firstName,
        lastName: reporter.lastName,
        image: reporter.image
    },
    assignee: {
        id: assignee.id,
        firstName: assignee.firstName,
        lastName: assignee.lastName,
        image: assignee.image
    },
    project: {
        id: project.id,
        title: project.title,
    },
    status: {
        id: status.id,
        name: status.name,
        color: status.color,
    },
    priority: {
        id: priority.id,
        name: priority.name,
        color: priority.color,
    }
}).from(issue)
    .leftJoin(reporter, eq(issue.reporterId, reporter.id))
    .leftJoin(assignee, eq(issue.assigneeId, assignee.id))
    .leftJoin(project, eq(issue.projectId, project.id))
    .leftJoin(status, eq(issue.statusId, status.id))
    .leftJoin(priority, eq(issue.priorityId, priority.id));
export async function getIssues(options: GetIssuesOptions = {}) {
    const { filters = {}, sorting = { column: 'createdAt', direction: 'desc' }, pagination = { page: 1, pageSize: 20 } } = options;

    const conditions = [];
    if (filters.projectId) {
        conditions.push(eq(issue.projectId, filters.projectId));
    }
    if (filters.statusId) {
        conditions.push(eq(issue.statusId, filters.statusId));
    }
    if (filters.assigneeId) {
        conditions.push(eq(issue.assigneeId, filters.assigneeId)); // Gerekirse tip dönüşümü yapılır
    }
    if (filters.reporterId) {
        conditions.push(eq(issue.reporterId, filters.reporterId)); // Gerekirse tip dönüşümü yapılır
    }
    if (filters.id) {
        conditions.push(eq(issue.id, filters.id)); // Gerekirse tip dönüşümü yapılır
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orderByColumn = issue[sorting.column];
    const orderByClause = sorting.direction === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

    const limit = options.pagination?.limit || 20;
    const offset = options.pagination?.offset || 0;

    const issuesPromise = baseQuery
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

    const totalCountPromise = db.select({ value: count() })
        .from(issue)
        .where(whereClause);

    const [data, totalCountResult] = await Promise.all([issuesPromise, totalCountPromise]);

    const totalItems = totalCountResult[0].value;

    return {
        items: data,
        total: totalItems,
    };
}