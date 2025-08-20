import {pgTable, pgView, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth";
import {project} from "@/db/schema/project";

export const issue = pgTable("issue",{
    id: text("id").primaryKey(),
    title: varchar("title", {length: 255}).notNull(),
    description: text("description").notNull(),
    statusId: text("status_id")
        .notNull()
        .references(() => status.id, {onDelete: "cascade"}),
    createdAt: timestamp(
        "created_at"
    ).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: timestamp(
        "updated_at"
    ).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    priorityId: text("priority_id")
        .notNull()
        .references(() => priority.id, {onDelete: "cascade"}),
    assigneeId: text("assignee_id")
        .references(() => user.id, {onDelete: "set null"}),
    reporterId: text("reporter_id")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
    projectId: text("project_id")
        .notNull()
        .references(() => project.id, {onDelete: "cascade"}),

})

export const status = pgTable("status", {
    id: text("id").primaryKey(),
    name: varchar("name", {length: 50}).notNull(),
    color: varchar("color", {length: 20}).notNull(),
});

export const priority = pgTable("priority", {
    id: text("id").primaryKey(),
    name: varchar("name", {length: 50}).notNull(),
    color: varchar("color", {length: 20}).notNull(),
});