import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRegister } from "@/features/auth/hooks/use-auth";

/* ── Local register schema ──
   The shared `registertSchema` (used by the full onboarding/user form) requires
   many extra fields (role, store, address, country, ...) that this page doesn't
   use. Defining a local schema here keeps this page self-contained and does NOT
   touch the shared schema used by the existing register flows. */
const genderOptions = ["male", "female", "other"] as const;

const registerFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    /* gender is a plain string so the select can start empty ("" placeholder);
       the refine enforces that a real option is chosen before submit. */
    gender: z
      .string()
      .min(1, "Gender is required")
      .refine(
        (value) => genderOptions.includes(value as (typeof genderOptions)[number]),
        "Gender is required"
      ),
    phone: z
      .string()
      .min(11, "Phone number must be 11 digits")
      .max(11, "Phone number must be 11 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage(): React.JSX.Element {
  const register = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    /* useRegister expects a FormData (see auth-api.registerApi → /auth/register). */
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("gender", values.gender);
    formData.append("phone", values.phone);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);
    register.mutate(formData);
  };

  return (
    /* ── Layout mirrors the Login page exactly (header, centered card, footer) ── */
    <div className="relative min-h-screen overflow-hidden font-sans">
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
          <h3 className="text-[1.5rem] font-bold text-gray-800 tracking-wide text-center">Register</h3>
        </div>

        <form className="w-full md:max-w-md space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* ── First name + Last name on one row ── */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName">
                    First Name
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="firstName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter first name"
                    className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lastName">
                    Last Name
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="lastName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter last name"
                    className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
          </div>

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">
                  Email
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter email"
                  className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
              </Field>
            )}
          />

          {/* ── Gender select + Phone on one row ── */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="gender">
                    Gender
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <select
                    {...field}
                    id="gender"
                    aria-invalid={fieldState.invalid}
                    className={`h-10 w-full rounded-none border bg-white px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${fieldState.invalid ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">
                    Phone
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter phone number"
                    className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
          </div>

          <Controller
            name="password"
            control={form.control}
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

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirm password"
                  className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
              </Field>
            )}
          />

          <Button className="w-full h-10 rounded-[4px]" type="submit" disabled={register.isPending}>
            {register.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
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
