import React, { useEffect, useMemo, useState } from "react";
import type { HistoryCtx, HistoryItem, VerifyResult } from "../../types";
import { HistoryContext } from "./HistoryContext";

const STORAGE_KEY = "signed-messages-v1";

const HistoryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addPending = (message: string, signature: string) => {
    const id = crypto.randomUUID();
    const item: HistoryItem = {
      id,
      message,
      signature,
      createdAt: Date.now(),
    };
    setItems((prev) => [item, ...prev]);
    return id;
  };

  const setResult = (id: string, result: VerifyResult) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, result } : i)));
  };

  const clear = () => setItems([]);

  const value = useMemo<HistoryCtx>(
    () => ({ items, addPending, setResult, clear }),
    [items]
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

export default HistoryProvider;
