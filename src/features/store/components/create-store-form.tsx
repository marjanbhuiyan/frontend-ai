// OLD: useEffect was used to close the dialog after the internal mutation
// succeeded. The mutation now lives in the parent dialog, so it's unused here.
// import { useEffect } from "react";
// OLD (self-managed form): the form was created internally, so useForm/zodResolver
// were used here. Now the form instance is created by the parent dialog and
// injected via the `form` prop — these imports are no longer used here.
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Store as StoreIcon, CircleAlertIcon, XIcon } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// OLD: createStoreSchema was used when this component built its own resolver.
// Now the parent injects the form (already built with the schema), so only the
// types are needed here.
// import { createStoreSchema, type CreateFormProps, type CreateStoreForm } from "@/features/store/types";
import { type CreateFormProps, type CreateStoreForm } from "@/features/store/types";
import ImageUpload from "@/utils/image-upload";
// OLD: useCreateStore was called here for the internal mutation + pending state.
// The parent dialog now owns the mutation and passes `onSubmit` instead.
// import { useCreateStore } from "@/features/store/hooks/use-store";


export function CreateStoreForm({ form, onSubmit }: CreateFormProps): React.JSX.Element {
  return (
    <Form {...form}>
      {/* id="form-rhf-demo" lets the dialog footer's "Add" button (which uses
          form="form-rhf-demo") submit this form from outside the component. */}
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* ── Logo uploader (drag/drop + preview) ── */}
        <ImageUpload
          value={form.watch("logo")}
          onChange={(value) => {
            form.setValue("logo", value as File);
            form.clearErrors("logo");
          }}
        >
          {({ preview, remove, openFileDialog, dragging }) => (
            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                <div
                  className={cn(
                    "group/avatar relative h-40 w-full cursor-pointer overflow-hidden rounded-xs border border-dashed transition-colors",
                    dragging
                      ? "border-primary bg-primary/5"
                      : preview
                        ? "border-solid border-gray-300"
                        : "border-gray-300 hover:border-gray-400",
                  )}
                  onClick={openFileDialog}
                >
                  {preview ? (
                    <img src={preview} alt="Banner" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                      <StoreIcon className="size-8 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">Upload banner</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                {preview && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={remove}
                    className="absolute end-2 top-2 z-10 size-8 rounded-full bg-white shadow-sm"
                  >
                    <XIcon className="size-4" />
                  </Button>
                )}
              </div>
              {form.formState.errors.logo?.message && (
                <p className="flex items-center gap-1.5 text-xs text-red-600">
                  <CircleAlertIcon className="size-3.5" />
                  {form.formState.errors.logo.message}
                </p>
              )}
            </div>
          )}
        </ImageUpload>
        {/* ── Name + Phone on one row ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="store-name">Store Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="store-name"
                    placeholder="e.g. Acme Corp"
                    aria-invalid={fieldState.invalid}
                    className={cn(fieldState.invalid && "border-red-500 focus-visible:ring-red-500")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. 01712345678"
                    aria-invalid={fieldState.invalid}
                    className={cn(fieldState.invalid && "border-red-500 focus-visible:ring-red-500")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Address ── */}
        <FormField
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g. 123 Main St, Dhaka"
                  aria-invalid={fieldState.invalid}
                  className={cn(fieldState.invalid && "border-red-500 focus-visible:ring-red-500")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── OLD (self-managed mutation): this submit button used the local
             createStore.isPending state. The mutation now lives in the parent
             dialog, whose footer renders the submit ("Add") button instead —
             so this duplicate button is removed. ──
        <Button type="submit" className="w-full" disabled={createStore.isPending}>
          {createStore.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating store...
            </>
          ) : (
            "Create store"
          )}
        </Button> */}
      </form>
    </Form>
  );
}

export default CreateStoreForm;
