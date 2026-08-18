import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/platform/auth/auth.schema";
import type { LoginCredentials } from "@/platform/auth/auth.types";
import { useLogin } from "@/platform/auth/auth.hooks";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button} from "@/components/ui/button";
import { Input} from "@/components/ui/input";

export function LoginPage() {
  const login = useLogin();
  const form = useForm<LoginCredentials>({
      resolver:
        zodResolver(
          loginSchema,
        ),

      defaultValues: {
        email: "",
        password: "",
      },
    });


  const onSubmit = (values: LoginCredentials) => {
      login.mutate( values );
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Sign in
          </h1>

          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(
            onSubmit,
          )}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Controller
              name="email"
              control={form.control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter email"
                    className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="password"
              control={form.control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                    Password
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter password"
                    className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
          </div>

          {login.isError && (
            <p className="text-sm text-destructive">
              Unable to sign in.
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={
              login.isPending
            }
          >
            {login.isPending
              ? "Signing in..."
              : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}