import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { useResourceConfig } from "@/features/resources/hooks/use-resource";
import type { ResourceField } from "@/features/resources/types";
import type { ZodType } from "zod";

/* -------------------------------------------------------------------------- */
/*                           Generate Zod Schema                              */
/* -------------------------------------------------------------------------- */

function generateZodSchema(fields: ResourceField[]): ZodType<Record<string, unknown>> {
  const shape: Record<string, ZodType<unknown>> = {};

  for (const field of fields) {
    let fieldSchema: ZodType<unknown>;

    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Invalid email address");
        break;
      case "number":
        fieldSchema = z.coerce.number();
        if (field.min !== undefined) (fieldSchema as z.ZodNumber).min(field.min);
        if (field.max !== undefined) (fieldSchema as z.ZodNumber).max(field.max);
        break;
      case "phone":
        fieldSchema = z.string().regex(/^\d{11}$/, "Phone must be exactly 11 digits");
        break;
      case "url":
        fieldSchema = z.string().url("Invalid URL");
        break;
      case "select":
      case "multi-select":
        fieldSchema = z.string();
        break;
      case "checkbox":
        fieldSchema = z.boolean();
        break;
      case "date":
        fieldSchema = z.string();
        break;
      case "file":
        fieldSchema = z.string().optional();
        break;
      default:
        fieldSchema = z.string();
        if (field.pattern) {
          fieldSchema = z.string().regex(new RegExp(field.pattern), field.patternMessage ?? "Invalid format");
        }
        break;
    }

    if (!field.required && field.type !== "file") {
      fieldSchema = (fieldSchema as z.ZodString).optional();
    }

    shape[field.name] = fieldSchema;
  }

  return z.object(shape) as ZodType<Record<string, unknown>>;
}

/* -------------------------------------------------------------------------- */
/*                           Generate Default Values                          */
/* -------------------------------------------------------------------------- */

function generateDefaultValues(fields: ResourceField[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    } else {
      switch (field.type) {
        case "checkbox":
          defaults[field.name] = false;
          break;
        case "number":
          defaults[field.name] = "";
          break;
        default:
          defaults[field.name] = "";
          break;
      }
    }
  }
  return defaults;
}

/* -------------------------------------------------------------------------- */
/*                            Render Form Field                               */
/* -------------------------------------------------------------------------- */

function FormFieldRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
}: {
  field: ResourceField;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
}): React.JSX.Element {
  const baseClassName = `rounded-none ${error ? "border-red-500" : ""}`;

  switch (field.type) {
    case "select":
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <select
            id={field.name}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={!!error}
            className={`w-full rounded-none border border-gray-200 bg-white px-3 py-2 text-sm ${baseClassName}`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    case "textarea":
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Textarea
            id={field.name}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            rows={4}
            aria-invalid={!!error}
            className={baseClassName}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    case "checkbox":
      return (
        <Field data-invalid={!!error}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.name}
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              aria-invalid={!!error}
              className="h-4 w-4"
            />
            <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </FieldLabel>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    case "file":
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <input
            type="file"
            id={field.name}
            onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
            onBlur={onBlur}
            aria-invalid={!!error}
            className={`w-full rounded-none border border-gray-200 bg-white px-3 py-2 text-sm ${baseClassName}`}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    case "number":
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Input
            type="number"
            id={field.name}
            value={value === "" ? "" : String(value ?? "")}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            onBlur={onBlur}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            aria-invalid={!!error}
            className={baseClassName}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    case "email":
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Input
            type="email"
            id={field.name}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            aria-invalid={!!error}
            className={baseClassName}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    case "phone":
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Input
            type="tel"
            id={field.name}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            maxLength={11}
            inputMode="numeric"
            aria-invalid={!!error}
            className={baseClassName}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    case "url":
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Input
            type="url"
            id={field.name}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            aria-invalid={!!error}
            className={baseClassName}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    case "date":
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Input
            type="date"
            id={field.name}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={!!error}
            className={baseClassName}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );

    default:
      return (
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor={field.name} className={error ? "text-red-500" : ""}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </FieldLabel>
          <Input
            type="text"
            id={field.name}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            aria-invalid={!!error}
            className={baseClassName}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </Field>
      );
  }
}

/* -------------------------------------------------------------------------- */
/*                           Generic Form Page                                */
/* -------------------------------------------------------------------------- */

interface GenericFormPageProps {
  resourceName: string;
  recordId?: string;
  mode?: "create" | "edit";
}

export default function GenericFormPage({
  resourceName,
  recordId,
  mode = "create",
}: GenericFormPageProps): React.JSX.Element {
  const navigate = useNavigate();
  const { data: resource, isLoading: configLoading } = useResourceConfig(resourceName);

  const schema = useMemo(() => {
    if (!resource) return null;
    return generateZodSchema(resource.fields);
  }, [resource]);

  const defaultValues = useMemo(() => {
    if (!resource) return {};
    return generateDefaultValues(resource.fields);
  }, [resource]);

  const form = useForm<Record<string, unknown>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = (data: Record<string, unknown>) => {
    console.log("Submit:", resourceName, mode, recordId, data);
  };

  if (configLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading form...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Resource "{resourceName}" not found.</p>
      </div>
    );
  }

  const visibleFields = resource.fields.filter((f) => !f.hidden);
  const halfWidth = visibleFields.length > 3;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "create" ? `Create ${resource.label}` : `Edit ${resource.label}`}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {mode === "create"
            ? `Fill in the details to create a new ${resource.label.toLowerCase()}.`
            : `Update the ${resource.label.toLowerCase()} information.`}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className={`grid gap-4 ${halfWidth ? "grid-cols-2" : "grid-cols-1"}`}>
          {visibleFields.map((field) => {
            const fieldError = errors[field.name]?.message as string | undefined;
            return (
              <div key={field.name} className={field.type === "textarea" || field.type === "checkbox" ? "col-span-full" : ""}>
                <FormFieldRenderer
                  field={field}
                  value={control._formValues[field.name]}
                  onChange={(val) => control._formValues[field.name] = val}
                  onBlur={() => {}}
                  error={fieldError}
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? `Create ${resource.label}` : `Update ${resource.label}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
