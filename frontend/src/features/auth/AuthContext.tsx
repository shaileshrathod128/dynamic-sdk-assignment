import { createContext, use } from "react";
import type { AuthCtx } from "../../types";

export const AuthContext = createContext<AuthCtx | null>(null);

export const useAuth = () => {
  const hasContext = use(AuthContext);
  if (!hasContext) throw new Error("useAuth must be used within AuthProvider");
  return hasContext;
};
