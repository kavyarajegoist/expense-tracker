import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "./lib/api";
import { useQuery } from "@tanstack/react-query";

async function fetchTotalSpent() {
  const response = await api.expenses["total"].$get();
  if (!response.ok) {
    throw new Error("server error");
  }
  const data = await response.json();
  return data;
}

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchTotalSpent,
  });

  if (error) <div>An error has occurred</div>;

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>{isPending ? "..." : data?.total}</CardContent>
      </Card>
    </>
  );
}

export default App;
