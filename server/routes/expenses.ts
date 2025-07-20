import { Hono } from "hono";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import { eq, desc, sum, and } from "drizzle-orm";
import { createPostSchema } from "../sharedTypes";
import { insertExpenseSchema} from "../db/schema/expenses";

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    insertExpenseSchema
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100);
    return c.json({ expenses: expenses });
  })
  .post("/", getUser, zValidator("json", createPostSchema), async (c) => {
    const expense = c.req.valid("json");
    const user = c.var.user;
    const validatedExpense = insertExpenseSchema.parse({...expense,userId:user.id})
    const result = await db
      .insert(expensesTable)
      .values(validatedExpense)
      .returning().then(res=>res[0]);

    return c.json(result, 201);
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .then((res) => res[0]);
    if (!expense) {
      return c.notFound();
    }

    return c.json(expense);
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const expense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .returning()
      .then((res) => res[0]);
    if (!expense) {
      return c.notFound();
    }

    return c.json(expense);
  })
  .get("/total", getUser, async (c) => {
    const user = c.var.user;
    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((res) => res[0]);

    return c.json(result);
  });
