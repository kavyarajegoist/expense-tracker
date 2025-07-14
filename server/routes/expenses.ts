import { Hono } from "hono";
import z from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string(),
  amount: z.number().int(),
});
type Expense = z.infer<typeof expenseSchema>;
const createPostSchema = expenseSchema.omit({
  id: true,
});
const fakeExpenses: Expense[] = [
  { id: 1, title: "Dinner", amount: 1000 },
  { id: 2, title: "Lunch", amount: 1000 },
  { id: 3, title: "Breakfast", amount: 1000 },
  { id: 4, title: "Brunch", amount: 1000 },
];
export const expensesRoute = new Hono()
.get("/", (c) => {
  return c.json({ expenses: fakeExpenses });
})
.post("/", zValidator("json", createPostSchema), async (c) => {
  const data = c.req.valid("json");
  fakeExpenses.push({ ...data, id: fakeExpenses.length + 1 });

  console.log(data.amount);
  return c.json(data);
})
.get("/:id{[0-9]+}", (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const expense = fakeExpenses.find((x) => x.id === id);
  if (!expense) {
    return c.notFound();
  }

  return c.json(expense);
})
.delete("/:id{[0-9]+}", (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const expense = fakeExpenses.find((expense) => expense.id === id);

  return c.json(expense);
})
.get("/total", (c) => {
  const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  return c.json({ total });
})

