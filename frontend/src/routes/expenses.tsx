import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

async function getTotalExpenses() {

  const response = await api.expenses.$get();
  if (!response.ok) {
    throw new Error("server error");
  }
  const data = await response.json();
  return data.expenses;
}

function Expenses() {
  const { isPending, data } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getTotalExpenses,
  });
  return (
    <div className="p-2 max-w-lg mx-auto">
      <Table>
        <TableCaption>A list of your recent expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4 " />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 " />
                    </TableCell>
                  </TableRow>
                ))
            : data?.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
