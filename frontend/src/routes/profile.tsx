import { createFileRoute } from "@tanstack/react-router";
import {  userQueryOption } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export const Route = createFileRoute("/profile")({
  component: Profile,
});


function Profile() {
  const {isPending,data,error} = useQuery(userQueryOption
)
  if(isPending) return "Loading..."
  if(error) return "not logged in"
  return (
    <div className="p-2">
      <Avatar>
      {
      data.user.picture &&  
      <AvatarImage src={data.user.picture} alt={data.user.given_name} />
      }  
        <AvatarFallback>{data.user.given_name}</AvatarFallback>
      </Avatar>
      Hello {data.user.given_name}
      <a href="/api/logout">Logout</a>
    </div>
  );
}
