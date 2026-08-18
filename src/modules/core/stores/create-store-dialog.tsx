import { useForm} from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { api } from "@/platform/api/axios";

import {
  queryKeys,
} from "@/platform/query/query-keys";

import {
  useActiveStoreStore,
} from "@/platform/stores/active-store.store";

const schema = z.object({
  name: z
    .string()
    .min(2, "Store name is required")
    .max(100),
});

type FormValues =
  z.infer<typeof schema>;

interface Props {
  open: boolean;
}

async function createStore(
  values: FormValues,
) {
  const response =
    await api.post(
      "/stores",
      values,
    );

  return response.data.data;
}

export function CreateStoreDialog({
  open,
}: Props) {
  const queryClient =
    useQueryClient();

  const setActiveStore =
    useActiveStoreStore(
      (state) =>
        state.setActiveStore,
    );

  const form =
    useForm<FormValues>({
      resolver:
        zodResolver(schema),

      defaultValues: {
        name: "",
      },
    });

  const mutation =
    useMutation({
      mutationFn: createStore,

      onSuccess: async (
        store,
      ) => {
        setActiveStore(
          store.id,
        );

        await queryClient.invalidateQueries(
          {
            queryKey:
              queryKeys.app
                .bootstrap,
          },
        );
      },
    });

  const onSubmit =
    (values: FormValues) => {
      mutation.mutate(values);
    };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Your Store
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit,
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({
                field,
              }) => (
                <FormItem>
                  <FormLabel>
                    Store Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      placeholder="My Store"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                mutation.isPending
              }
            >
              {mutation.isPending
                ? "Creating..."
                : "Create Store"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}