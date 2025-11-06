import React from "react";
import MessageItem from "./MessageItem";
import { useHistoryStore } from "../HistoryContext";

export const HistoryPanel: React.FC = () => {
  const { items } = useHistoryStore();
  return (
    <>
      <h2 className="font-semibold my-3">Signed Messages</h2>
      {items.length === 0 ? (
        <div className="text-sm text-slate-500">No messages yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <MessageItem {...item} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
