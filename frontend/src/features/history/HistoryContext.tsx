import { createContext, use } from "react";
import type { HistoryCtx } from "../../types";
export const HistoryContext = createContext<HistoryCtx | null>(null);
export const useHistoryStore = () => {
  const hasContext = use(HistoryContext);
  if (!hasContext)
    throw new Error("useHistoryStore must be used within HistoryProvider");
  return hasContext;
};
