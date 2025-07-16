// src/routes/_authenticated.tsx

import { createFileRoute, Outlet } from "@tanstack/react-router";


const Login = ()=>{
    return <div>You are logged in</div>
}
const Component = ()=>{
    const {user} = Route.useRouteContext();
    if(!user)
        return <Login/>
    return <Outlet/>
}
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    // userQueryOption
    return {user:{name:"kavyaraj"}}
  },
  component:Component
});
