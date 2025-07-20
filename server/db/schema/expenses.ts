import { numeric, text, pgTable, serial, index, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema,createSelectSchema } from "drizzle-zod";
import z from "zod";
export const expenses = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date:date("date").notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (expenses) => [index("name_idx").on(expenses.userId)]
);

export const insertExpenseSchema = createInsertSchema(expenses,{
  title:z.string().min(3,"Title should me of minimum lenght 3."),
  amount:z.string().regex(/^\d+(\.\d{1,2})?$/,"Amount should a monetary value")
})
export const selectExpenseSchema = createSelectSchema(expenses)