import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/auth/schemas";
import type{ LoginInput } from "@/features/auth/types";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/features/auth/hooks/use-auth";



export default function LoginPage(): React.JSX.Element {
  const login= useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });
  const onSubmit = (data: LoginInput) => {
    login.mutate(data);
  };
  return (
    <div className="relative min-h-screen bg-[#f5f5f5] overflow-hidden font-sans">
      <header className="absolute top-0 left-0 w-full z-10 px-6 py-4 flex items-center">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 8.5L12 15L20 8.5L12 2Z" fill="#1976d2" />
            <path d="M4 8.5L12 22L20 8.5L12 15L4 8.5Z" fill="#42a5f5" opacity="0.7" />
          </svg>
          <span className="text-[1.1rem] font-semibold text-gray-800 tracking-wide">Mantis</span>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-16 pb-24 px-6">
        <div className="w-full max-w-md space-y-8">
          <h3 className="text-[1.5rem] font-bold text-gray-800 tracking-wide text-center">Login</h3>
        </div>
        <form className="w-full md:max-w-md space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button className="w-full h-10 rounded-[4px]" type="submit">Login</Button>
       </form>
      </main>

      <footer className="absolute bottom-0 left-0 w-full flex items-center justify-between px-6 py-4 z-10">
        <span className="text-[0.78rem] text-gray-500">
          &copy; Made with love by Team{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">CodedThemes</a>
        </span>
        <div className="flex items-center gap-4">
          <a href="#" className="text-[0.78rem] text-gray-500 hover:underline">Terms and Conditions</a>
          <a href="#" className="text-[0.78rem] text-gray-500 hover:underline">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
