import { Hono } from "hono";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import { eq } from "drizzle-orm";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string(),
  amount: z.string(),
});
type Expense = z.infer<typeof expenseSchema>;
const createPostSchema = expenseSchema.omit({
  id: true,
});
const fakeExpenses: Expense[] = [
  { id: 1, title: "Dinner", amount: "1000" },
  { id: 2, title: "Lunch", amount: "1000" },
  { id: 3, title: "Breakfast", amount: "1000" },
  { id: 4, title: "Brunch", amount: "1000" },
];
export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id));
    return c.json({ expenses: expenses });
  })
  .post("/", getUser, zValidator("json", createPostSchema), async (c) => {
    const expense = c.req.valid("json");
    const user = c.var.user;
    const result = await db.insert(expensesTable).values({
      ...expense,
      amount: expense.amount.toString(),
      userId: user.id,
    }).returning();

    
    return c.json(result,201)
  })
  .get("/:id{[0-9]+}", getUser, (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((x) => x.id === id);
    if (!expense) {
      return c.notFound();
    }

    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", getUser, (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((expense) => expense.id === id);

    return c.json(expense);
  })
  .get("/total", getUser, (c) => {
    const total = fakeExpenses.reduce(
      (acc, expense) => acc + Number(expense.amount),
      0
    );
    return c.json({ total });
  });
