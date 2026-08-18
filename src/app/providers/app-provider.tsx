import type{ ReactNode } from "react";
import { QueryProvider } from "@/app/providers/query-provider";

interface Props {
  children: ReactNode;
}

export function AppProvider({
  children,
}: Props) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}