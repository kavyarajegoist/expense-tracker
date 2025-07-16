import { hc } from "hono/client";
import type{ ApiRoutes } from "../../../server/app";
import { queryOptions} from "@tanstack/react-query";
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

export const userQueryOption = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getProfile,
  staleTime:Infinity
});