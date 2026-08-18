import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { registerApi } from "@/platform/auth/auth.api";
import { useAuthStore } from "@/platform/auth/auth.store";
import { queryClient } from "@/platform/query/query-client";
import { InputField } from "@/shared/components/input-field";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    firstName: z
      .string()
      .min(2),

    lastName: z
      .string()
      .optional(),

    email: z
      .string()
      .email(),

    password: z
      .string()
      .min(8),

    passwordConfirmation:
      z
        .string()
        .min(8),
  })
  .refine(
    (data) =>
      data.password ===
      data.passwordConfirmation,
    {
      path: [
        "passwordConfirmation",
      ],

      message:
        "Passwords do not match",
    },
  );

type RegisterValues =
  z.infer<typeof schema>;

export function RegisterPage() {
  const navigate =
    useNavigate();

  const setToken =
    useAuthStore(
      (state) =>
        state.setAccessToken,
    );

  const form =
    useForm<RegisterValues>({
      resolver:
        zodResolver(schema),

      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation:
          "",
      },
    });

  const mutation =
    useMutation({
      mutationFn:
        registerApi,

      onSuccess: (
        response,
      ) => {
        setToken(
          response.accessToken,
        );

        queryClient.clear();

        navigate(
          "/dashboard",
          {
            replace: true,
          },
        );
      },
    });

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        Create Account
      </h1>

      <form
        onSubmit={form.handleSubmit(
          (values) =>
            mutation.mutate(
              values,
            ),
        )}
        className="space-y-4"
      >
        <InputField
          label="First Name"
          {...form.register(
            "firstName",
          )}
          error={
            form.formState
              .errors.firstName
              ?.message
          }
        />

        <InputField
          label="Last Name"
          {...form.register(
            "lastName",
          )}
        />

        <InputField
          label="Email"
          type="email"
          {...form.register(
            "email",
          )}
          error={
            form.formState
              .errors.email
              ?.message
          }
        />

        <InputField
          label="Password"
          type="password"
          {...form.register(
            "password",
          )}
          error={
            form.formState
              .errors.password
              ?.message
          }
        />

        <InputField
          label="Confirm Password"
          type="password"
          {...form.register(
            "passwordConfirmation",
          )}
          error={
            form.formState
              .errors
              .passwordConfirmation
              ?.message
          }
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
            : "Create Account"}
        </Button>
      </form>
    </div>
  );
}