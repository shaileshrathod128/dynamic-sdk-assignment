import React from "react";
import { AuthProvider } from "./features/auth/AuthProvider";
import HistoryProvider from "./features/history/HistoryProvider";

export default function AppProviders({ children }: React.PropsWithChildren) {
  return (
    <AuthProvider>
      <HistoryProvider>{children}</HistoryProvider>
    </AuthProvider>
  );
}
