// src/routes/_authenticated.tsx

import { userQueryOption } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";


const Login = ()=>{
    return <div>You have to Login
      <a href="/api/login">Login!</a>
    </div>
}
const Component = ()=>{
    const {user} = Route.useRouteContext();
    if(!user)
        return <Login/>
    return <Outlet/>
}
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({context}) => {
    // userQueryOption
    const queryClient = context.queryClient;
    try {
      
      const data = await  queryClient.fetchQuery(userQueryOption);
       return data;
    } catch (error) {
      console.log(error)
      return {user:null}
    }
  },
  component:Component
});
