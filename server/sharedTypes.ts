import z from "zod";
import { insertExpenseSchema } from "./db/schema/expenses";
export const expenseSchema = insertExpenseSchema.omit({userId:true,createdAt:true})
export type Expense = z.infer<typeof expenseSchema>;
export const createPostSchema = expenseSchema.omit({
  id: true,
});
