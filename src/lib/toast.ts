/**
 * Toast notification utility using Sonner.
 *
 * Usage:
 *   import { toast } from "@/lib/toast";
 *
 *   toast.success("User created successfully!");
 *   toast.error("Failed to save changes.");
 *   toast.info("Please check your email.");
 *   toast.warning("This action cannot be undone.");
 *   toast.loading("Saving...");
 *
 *   // With custom options
 *   toast.success("Done!", { description: "Your changes have been saved." });
 *
 *   // Promise toast (shows loading, then success/error)
 *   toast.promise(saveData(), {
 *     loading: "Saving...",
 *     success: "Saved!",
 *     error: "Failed to save.",
 *   });
 *
 *   // Dismiss a toast
 *   const id = toast.loading("Processing...");
 *   toast.dismiss(id);
 */

export { toast } from "sonner";
