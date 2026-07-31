import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface RegisterFormProps {
  form: UseFormReturn<any>;
  id: string;
  onSubmit: (data: any) => void;
}

export default function RegisterForm({ form, id: formId, onSubmit }: RegisterFormProps): React.JSX.Element {
  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      <Controller
        name="firstName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="firstName">
              First Name
            </FieldLabel>
            <Input
              {...field}
              id="firstName"
              aria-invalid={fieldState.invalid}
              placeholder="Enter first name"
              className="rounded-none"
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
            <FieldLabel htmlFor="lastName">Last Name<span className="text-red-500">*</span></FieldLabel>
            <Input
              {...field}
              id="lastName"
              aria-invalid={fieldState.invalid}
              placeholder="Enter last name"
              className="rounded-none"
              autoComplete="off"
            />
          </Field>
        )}
      />
      <Controller
        name="phone"
        control={form.control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="phone">
              Phone <span className="text-red-500">*</span>
            </FieldLabel>

            <Input
              {...field}
              id="phone"
              inputMode="numeric"
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              maxLength={11}
              className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""
                }`}

                onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
              ];

              if (
                !/[0-9]/.test(e.key) &&
                !allowedKeys.includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            />
          </Field>
        )}
      />
    </form>
  );
}
