import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Select from "react-select";


interface RegisterFormProps {
  form: UseFormReturn<any>;
  id: string;
  onSubmit: (data: any) => void;
}

export default function RegisterForm({ form, id: formId, onSubmit }: RegisterFormProps): React.JSX.Element {
  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
              <FieldLabel htmlFor="lastName">Last Name<span className="text-red-500">*</span></FieldLabel>
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
                className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
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
        <Controller
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ];

            return (
              <Field>
                <FieldLabel
                  htmlFor="gender"
                  className={fieldState.invalid ? "text-red-500" : ""}
                >
                  Gender <span className="text-red-500">*</span>
                </FieldLabel>

                <Select
                  inputId="gender"
                  options={options}
                  value={options.find((o) => o.value === field.value) ?? null}
                  onChange={(option) => field.onChange(option?.value ?? "")}
                  onBlur={field.onBlur}
                  classNames={{
                    control: () =>
                      fieldState.invalid
                        ? "!ring-red-500 !shadow-[0_0_0_1px_#ef4444] rounded-none"
                        : "!border-gray-200 !rounded-none",
                  }}
                />
              </Field>
            );
          }}
        />
        <div className="col-span-2">
          <Controller
            name="status"
            control={form.control}
            defaultValue="active"
            render={({ field, fieldState }) => {
              const options = [
                { value: "pending", label: "Pending" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ];

              return (
                <Field>
                  <FieldLabel
                    htmlFor="status"
                    className={fieldState.invalid ? "text-red-500" : ""}
                  >
                    Status

                  </FieldLabel>

                  <Select
                    inputId="status"
                    options={options}
                    value={options.find((o) => o.value === field.value) ?? null}
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    onBlur={field.onBlur}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    classNames={{
                      control: () =>
                        fieldState.invalid
                          ? "!ring-red-500 !shadow-[0_0_0_1px_#ef4444] rounded-none"
                          : "!border-gray-200 !rounded-none",
                    }}
                  />
                </Field>
              );
            }}
          />
        </div>
            <Controller
          name="country"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = [
              { value: "bangladesh", label: "Bangladesh" },
            ];

            return (
              <Field>
                <FieldLabel
                  htmlFor="country"
                  className={fieldState.invalid ? "text-red-500" : ""}
                >
                  Country <span className="text-red-500">*</span>
                </FieldLabel>

                <Select
                  inputId="country"
                  options={options}
                  value={options.find((o) => o.value === field.value) ?? null}
                  onChange={(option) => field.onChange(option?.value ?? "")}
                  onBlur={field.onBlur}
                  classNames={{
                    control: () =>
                      fieldState.invalid
                        ? "!ring-red-500 !shadow-[0_0_0_1px_#ef4444] rounded-none"
                        : "!border-gray-200 !rounded-none",
                  }}
                />
              </Field>
            );
          }}
        />
        <Controller
          name="city"
          control={form.control}
          render={({ field, fieldState }) => {
            const options = [
              { value: "dhaka", label: "Dhaka" },
              { value: "chittagong", label: "Chittagong" },
              { value: "khulna", label: "Khulna" },
              { value: "rajshahi", label: "Rajshahi" },
              { value: "barisal", label: "Barisal" },
              { value: "sylhet", label: "Sylhet" },
            ];

            return (
              <Field>
                <FieldLabel
                  htmlFor="city"
                  className={fieldState.invalid ? "text-red-500" : ""}
                >
                  City <span className="text-red-500">*</span>
                </FieldLabel>

                <Select
                  inputId="city"
                  options={options}
                  value={options.find((o) => o.value === field.value) ?? null}
                  onChange={(option) => field.onChange(option?.value ?? "")}
                  onBlur={field.onBlur}
                  classNames={{
                    control: () =>
                      fieldState.invalid
                        ? "!ring-red-500 !shadow-[0_0_0_1px_#ef4444] rounded-none"
                        : "!border-gray-200 !rounded-none",
                  }}
                />
              </Field>
            );
          }}
        />
        <div className="col-span-2">
          <Controller
          name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address">
                  Address
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  rows={4}
                  id="address"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter store location"
                  className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
              </Field>
            )}
          />
        </div>
      </div>
      <div className="">
        <h3 className="text-lg font-semibold mb-2">Store</h3>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="storeName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="storeName">
                  Name
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="storeName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter store name"
                  className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
              </Field>
            )}
          />
          <Controller
            name="role"
            control={form.control}
            defaultValue="user"
            render={({ field, fieldState }) => {
              const options = [
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
              ];

              return (
                <Field>
                  <FieldLabel
                    htmlFor="role"
                    className={fieldState.invalid ? "text-red-500" : ""}
                  >
                    Role
                  </FieldLabel>

                  <Select
                    inputId="role"
                    options={options}
                    value={options.find((o) => o.value === field.value) ?? null}
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    onBlur={field.onBlur}
                    classNames={{
                      control: () =>
                        fieldState.invalid
                          ? "!ring-red-500 !shadow-[0_0_0_1px_#ef4444] rounded-none"
                          : "!border-gray-200 !rounded-none",
                    }}
                  />
                </Field>
              );
            }}
          />
          <div className="col-span-2">
            <Controller
              name="storeLocation"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="storeLocation">
                  Location
                </FieldLabel>
                <Textarea
                  {...field}
                  rows={4}
                  id="storeLocation"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter store location"
                  className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                  autoComplete="off"
                />
              </Field>
            )}
          />
          </div>
        </div>
      </div>
      <div className="">
        <h3 className="text-lg font-semibold mb-2">Login Credentials</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
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
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter email"
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
                    aria-invalid={fieldState.invalid}
                    placeholder="Re-enter password"
                    className={`rounded-none ${fieldState.invalid ? "border-red-500" : ""}`}
                    autoComplete="off"
                  />
                </Field>
              )}
            />
        
        </div>
      </div>
    </form>
  );
}
