import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store as StoreIcon, CircleAlertIcon, XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type React from "react";
import { cn } from "@/lib/utils";
import { createStoreSchema, type CreateStoreForm } from "@/features/store/types";
import ImageUpload from "@/utils/image-upload";
import { useCreateStore } from "@/features/store/hooks/use-store";



// const createStoreSchema = z.object({
//   name: z.string().min(2, "Store name must be at least 2 characters").max(100),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   currency: z.string().optional(),
//   logo: z.instanceof(File).optional(),
// });

// type CreateStoreFormData = z.infer<typeof createStoreSchema>;

/* Optional `onSuccess` lets the onboarding gate know a store was created so it
   can re-check the store count and advance (closing this modal). The original
   `{ open }` signature is kept working via the optional prop. */
function CreateStoreModal({ open, onSuccess }: { open: boolean; onSuccess?: () => void }): React.JSX.Element {
  // const [logoPreview, setLogoPreview] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const createStore = useCreateStore();

  // Notify the caller once the create-store mutation succeeds so the gate can
  // refetch the store list and decide the next step (1 store -> nothing).
  useEffect(() => {
    if (createStore.isSuccess) {
      onSuccess?.();
    }
  }, [createStore.isSuccess, onSuccess]);

  const form = useForm<CreateStoreForm>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  // const handleLogoChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (!file) return;
  //     form.setValue("logo", file);
  //     const reader = new FileReader();
  //     reader.onload = () => setLogoPreview(reader.result as string);
  //     reader.readAsDataURL(file);
  //   },
  //   [form],
  // );

  const onSubmit = (formData: CreateStoreForm) => {
    createStore.mutate(formData);   
  }

  return (
    <Dialog open={open} onOpenChange={() => { }} disablePointerDismissal>
      <DialogContent showCloseButton={false} className="md:min-w-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create your store</DialogTitle>
          <DialogDescription>
            You need a store to start using the dashboard. Fill in the details below to get started.
          </DialogDescription>
        </DialogHeader>


        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ImageUpload control={form.control} name="logo" />
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 bg-gray-50 text-gray-400 hover:border-gray-400 hover:text-gray-500"
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                ) : (
                  <StoreIcon className="h-6 w-6" />
                )}
              </button>
              <div>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" />
                  Upload logo
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, optional</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 01712345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123 Main St, Dhaka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={createStore.isPending}>
              {createStore.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating store...
                </>
              ) : (
                "Create store"
              )}
            </Button>
          </form>
        </Form> */}

        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="rounded-none border bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center justify-center">
                  <ImageUpload
                    value={form.watch("logo")}
                    onChange={(value) => {
                      form.setValue("logo", value as File);
                      form.clearErrors("logo");
                    }}
                  >
                    {({ preview, remove, openFileDialog, dragging }) => (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div
                            className={cn(
                              "group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
                              dragging
                                ? "border-primary bg-primary/5"
                                : preview
                                  ? "border-solid border-muted-foreground/25"
                                  : "border-muted-foreground/25 hover:border-muted-foreground/20",
                            )}
                            onClick={openFileDialog}
                          >
                            {preview ? (
                              <img
                                src={preview}
                                alt="Logo"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <StoreIcon className="text-muted-foreground size-6" />
                              </div>
                            )}
                          </div>

                          {preview && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={remove}
                              className="absolute end-0.5 top-0.5 z-10 size-6 rounded-full dark:bg-zinc-800 hover:dark:bg-zinc-700"
                            >
                              <XIcon className="size-3.5" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-0.5 text-left">
                          <p className="text-sm font-medium">
                            {preview ? "Logo uploaded" : "Upload logo"}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            PNG, JPG up to 5MB
                          </p>
                        </div>

                        {form.formState.errors.logo?.message && (
                          <p className="flex items-center gap-1.5 text-xs text-destructive">
                            <CircleAlertIcon className="size-3.5" />
                            {form.formState.errors.logo.message}
                          </p>
                        )}
                      </div>
                    )}
                  </ImageUpload>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel htmlFor="store-name">
                          Store Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="store-name"
                            placeholder="e.g. Acme Corp"
                            aria-invalid={fieldState.invalid}
                            className={cn(fieldState.invalid && "border-destructive focus-visible:ring-destructive")}
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
                              className={cn(fieldState.invalid && "border-destructive focus-visible:ring-destructive")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            className={cn(fieldState.invalid && "border-destructive focus-visible:ring-destructive")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          </form>

        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStoreModal;
