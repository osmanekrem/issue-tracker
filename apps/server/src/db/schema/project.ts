import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/auth";

export const project = pgTable("project", {
    id: text("id").primaryKey(),
    title: text("name").notNull(),
    description:text("description"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    ownerId: text("owner_id")
        .notNull()
        .references(() => user.id, {onDelete: "cascade"}),
})