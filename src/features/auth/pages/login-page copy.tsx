import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flame, Shield, Cloud, Database, Store, Loader2 } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LoginForm from "../components/login-form";
import { useLogin, useInitApp } from "@/features/auth/hooks/use-auth";
import { useCreateStore } from "@/features/store/hooks/use-create-store";
import { useAuth } from "@/features/auth/hooks/auth-context";
import type { StoreInfo } from "@/features/auth/types";

const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
});

type Step = "login" | "store-creation" | "store-selection";

export default function LoginPage(): React.JSX.Element {
  const { stores, setHasStore, setStores, user } = useAuth();
  const login = useLogin();
  const initApp = useInitApp();
  const createStore = useCreateStore();
  const [step, setStep] = useState<Step>("login");
  const [initAttempted, setInitAttempted] = useState(false);

  const storeForm = useForm<{ name: string }>({
    resolver: zodResolver(storeSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!login.data || initAttempted) return;
    if (user) return;
    setInitAttempted(true);
    const { hasStore, stores: loginStores } = login.data.data;
    if (!hasStore) {
      setStep("store-creation");
    } else if (loginStores && loginStores.length > 1) {
      setStep("store-selection");
    } else if (loginStores && loginStores.length === 1) {
      initApp.mutate(loginStores[0]);
    }
  }, [login.data, initAttempted, user]);

  const handleStoreSelect = useCallback((store: StoreInfo) => {
    initApp.mutate(store);
  }, [initApp]);

  const onCreateStore = useCallback(async (data: { name: string }) => {
    try {
      const res = await createStore.mutateAsync({ name: data.name, phone: "", address: "" });
      const newStore: StoreInfo = { id: res.data.id, name: res.data.name, roleId: 0 };
      setHasStore(true);
      setStores([newStore]);
      initApp.mutate(newStore);
    } catch {
      // error handled by createStore
    }
  }, [createStore, initApp, setHasStore, setStores]);

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

      <div className="absolute left-0 top-0 h-full w-[340px] pointer-events-none select-none overflow-hidden">
        <div className="absolute" style={{ left: "-80px", top: "50%", transform: "translateY(-50%)", width: "320px", height: "320px", filter: "blur(38px)", opacity: 0.72 }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1565c0 0%, #42a5f5 60%, #90caf9 100%)", clipPath: "polygon(0% 0%, 60% 0%, 100% 50%, 60% 100%, 0% 100%, 40% 50%)", borderRadius: "8px" }} />
        </div>
        <div className="absolute" style={{ left: "-60px", top: "50%", transform: "translateY(-42%)", width: "270px", height: "270px", filter: "blur(36px)", opacity: 0.55 }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #43a047 0%, #a5d6a7 70%, #e8f5e9 100%)", clipPath: "polygon(0% 0%, 60% 0%, 100% 50%, 60% 100%, 0% 100%, 40% 50%)", borderRadius: "8px" }} />
        </div>
        <div className="absolute" style={{ left: "30px", top: "50%", transform: "translateY(-35%)", width: "160px", height: "140px", filter: "blur(32px)", opacity: 0.38, background: "linear-gradient(135deg, #ef9a9a 0%, #f8bbd0 100%)", borderRadius: "50%" }} />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-16 pb-24">
        {step === "login" && (
          <>
            <LoginForm />
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-[0.8rem] text-gray-500">Check other login views</p>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3.5 py-1.5 text-[0.8rem] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                  <Flame className="h-4 w-4 text-amber-500" />
                  Firebase
                </button>
                <button className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3.5 py-1.5 text-[0.8rem] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                  <Shield className="h-4 w-4 text-orange-600" />
                  Auth0
                </button>
                <button className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3.5 py-1.5 text-[0.8rem] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                  <Cloud className="h-4 w-4 text-amber-600" />
                  Aws
                </button>
                <button className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-md px-3.5 py-1.5 text-[0.8rem] text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                  <Database className="h-4 w-4 text-emerald-400" />
                  Supabase
                </button>
              </div>
            </div>
          </>
        )}

        {step === "store-creation" && (
          <Card className="w-full max-w-[400px]">
            <CardHeader>
              <CardTitle className="text-center">Create Your Store</CardTitle>
              <p className="text-[0.85rem] text-muted-foreground text-center">You need a store to get started.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={storeForm.handleSubmit(onCreateStore)} className="space-y-4">
                <FormField
                  control={storeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Store" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {createStore.isError && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-[0.82rem] text-red-700">{createStore.error?.message}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={createStore.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-md text-[0.95rem] transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  {createStore.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
                  ) : (
                    "Create Store"
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "store-selection" && (
          <Card className="w-full max-w-[400px]">
            <CardHeader>
              <CardTitle className="text-center">Select Store</CardTitle>
              <p className="text-[0.85rem] text-muted-foreground text-center">Choose a store to continue.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {initApp.isPending && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {!initApp.isPending && stores.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => handleStoreSelect(store)}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-left"
                >
                  <Store className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{store.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {store.id}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
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
