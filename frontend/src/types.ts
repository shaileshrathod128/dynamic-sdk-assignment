export type VerifyResult =
  | { isValid: boolean; signer: string; originalMessage: string }
  | { error: string };

export type HistoryItem = {
  id: string;
  message: string;
  signature: string;
  result: VerifyResult;
  createdAt: number;
};

export type HistoryCtx = {
  items: HistoryItem[];
  addPending: (message: string, signature: string) => HistoryItem["id"];
  setResult: (id: string, result: VerifyResult) => void;
  clear: () => void;
};
export type Step = "email" | "otp" | "ready";
export type AuthCtx = {
  step: Step;
  email: string;
  address?: string;
  error?: string | null;
  setEmail: (v: string) => void;
  sendCode: () => Promise<void>;
  verifyCode: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  primaryWallet: any;
};
