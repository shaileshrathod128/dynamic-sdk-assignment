import type { VerifyResult } from "../../../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export async function verifySignature(message: string, signature: string) {
  const res = await fetch(`${BACKEND_URL}/verify-signature`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature }),
  });
  const data: VerifyResult = await res.json();
  return data;
}
