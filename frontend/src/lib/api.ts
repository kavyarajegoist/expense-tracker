import { hc } from "hono/client";
import type { ApiRoutes } from "../../../server/app";
import { queryOptions } from "@tanstack/react-query";
import {
  createPostSchema,
  type CreatePostSchema,
} from "../../../server/sharedTypes";
const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getProfile() {
  const response = await api.me.$get();
  if (!response.ok) {
    throw new Error("server error");
  }
  const data = await response.json();
  return data;
}
async function getTotalExpenses() {
  const response = await api.expenses.$get();
  if (!response.ok) {
    throw new Error("server error");
  }
  const data = await response.json();
  return data.expenses;
}

export const userQueryOption = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getProfile,
  staleTime: Infinity,
});

export const expenseQueryOption = queryOptions({
  queryKey: ["get-all-expenses"],
  queryFn: getTotalExpenses,
  staleTime: 1000 * 60 * 5,
});

export const createExpense = async ({ value }: { value: CreatePostSchema }) => {
  new Promise((reslove) => setTimeout(reslove, 3000));
  const res = await api.expenses.$post({ json: value });
  if (!res.ok) throw new Error("server error");

  const newExpense = await res.json();
  return newExpense;
};

export const loadingQueryOption = queryOptions<{ expense?: CreatePostSchema }>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});

export const deleteExpense = async ({ id }: { id: number }) => {
  new Promise((reslove) => setTimeout(reslove, 3000));
  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  });
  if (!res.ok) throw new Error("server error");
};
