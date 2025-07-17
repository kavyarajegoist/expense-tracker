import { createFileRoute } from "@tanstack/react-router";
import { api, userQueryOption } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/profile")({
  component: Profile,
});


function Profile() {
  const {isPending,data,error} = useQuery(userQueryOption
)
  if(isPending) return "Loading..."
  if(error) return "not logged in"
  return <div className="p-2">Hello {data.user.given_name}
    <a href="/api/logout">Logout</a>
  </div>;
}
