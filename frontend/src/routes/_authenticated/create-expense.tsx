import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import {
  createExpense,
  expenseQueryOption,
  loadingQueryOption,
} from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { type AnyFieldApi } from "@tanstack/react-form";
import { createPostSchema } from "../../../../server/sharedTypes";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-300">
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function CreateExpense() {
  const queryClinet = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    validators: {
      onChange: createPostSchema,
    },
    onSubmit: async ({ value }) => {
      const exsistingExpenses =
        await queryClinet.ensureQueryData(expenseQueryOption);
      navigate({ to: "/expenses" });

      queryClinet.setQueryData(loadingQueryOption.queryKey, { expense: value });
      try {
        const newExpense = await createExpense({ value });
        queryClinet.setQueryData(expenseQueryOption.queryKey, [
          newExpense,
          ...exsistingExpenses,
        ]);
        toast.success("Expense Created",{description:`Successfully created a new expense: ${newExpense.id}`});
      } catch (error) {
        toast("Error", {
          description: "Something Went Wrong",
        });
      } finally {
        queryClinet.setQueryData(loadingQueryOption.queryKey, {});
      }
    },
  });

  return (
    <div className="p-2 ">
      <h2>Create Expense</h2>

      <form
        className="max-w-xl mx-auto space-y-4"
        onSubmit={(e) => {
          (e.preventDefault(), e.stopPropagation());
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          children={(field) => {
            return (
              <>
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              </>
            );
          }}
        />
        <form.Field
          name="amount"
          children={(field) => {
            return (
              <>
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Amount</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              </>
            );
          }}
        />
        <form.Field
          name="date"
          children={(field) => {
            return (
              <>
                <div className="space-y-2">
                  <Calendar
                    mode="single"
                    selected={new Date(field.state.value)}
                    onSelect={(date) =>
                      field.handleChange((date ?? new Date()).toISOString())
                    }
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                  />
                  <FieldInfo field={field} />
                </div>
              </>
            );
          }}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="mt-2" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
