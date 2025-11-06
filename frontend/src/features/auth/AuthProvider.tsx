import React, { useEffect, useMemo, useState } from "react";
import {
  useConnectWithOtp,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { AuthContext } from "./AuthContext";
import type { AuthCtx, Step } from "../../types";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();
  const { primaryWallet } = useDynamicContext();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(primaryWallet?.address);

  useEffect(() => {
    setAddress(primaryWallet?.address);
  }, [primaryWallet]);

  const sendCode = React.useCallback(async () => {
    setError(null);
    try {
      await connectWithEmail(email);
      setStep("otp");
    } catch (e: unknown) {
      if (e && typeof e === "object" && "message" in e) {
        setError((e as { message?: string }).message || "Failed to send code");
      } else {
        setError("Failed to send code");
      }
    }
  }, [connectWithEmail, email]);

  const verifyCode = React.useCallback(
    async (otp: string) => {
      setError(null);
      try {
        await verifyOneTimePassword(otp);
        setStep("ready");
      } catch (e: unknown) {
        if (e && typeof e === "object" && "message" in e) {
          setError((e as { message?: string }).message || "Invalid code");
        } else {
          setError("Invalid code");
        }
      }
    },
    [verifyOneTimePassword]
  );

  const logout = async () => {
    localStorage.clear();
    setAddress("");
    setEmail("");
    setStep("email");
  };

  const value = useMemo<AuthCtx>(
    () => ({
      step,
      email,
      address,
      error,
      setEmail,
      sendCode,
      verifyCode,
      logout,
      primaryWallet,
    }),
    [step, email, address, error, primaryWallet, sendCode, verifyCode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
