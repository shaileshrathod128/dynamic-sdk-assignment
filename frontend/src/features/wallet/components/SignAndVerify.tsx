import { useMemo, useState } from "react";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { verifySignature } from "../../auth/services/dynamicHeadless";
import { useHistoryStore } from "../../history/HistoryContext";
import { useAuth } from "../../auth/AuthContext";

export default function SignAndVerify() {
  const { addPending, setResult } = useHistoryStore();
  const { address, primaryWallet } = useAuth();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const canSign = useMemo(() => Boolean(primaryWallet), [primaryWallet]);

  const signAndVerify = async (e: any) => {
    e.preventDefault();
    if (!address) return;
    setBusy(true);
    try {
      const signer = await getSigner(primaryWallet);
      const signature = await signer.signMessage(message);
      const id = addPending(message, signature);

      const data = await verifySignature(message, signature);
      setResult(id, data);
    } catch (e: any) {
      const id = addPending(message, "");
      setResult(id, { error: e?.message || "Signing failed" });
    } finally {
      setMessage("");
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="text-xs text-gray-600">Connected wallet</div>
      <div className="mb-3 font-mono wrap-break-word text-xs">
        {address || "—"}
      </div>

      <form action="" onSubmit={signAndVerify}>
        <div className="flex gap-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            className="input"
            required
          />
          <button disabled={!canSign || busy || !message} className="btn">
            {busy ? "Signing…" : "Sign & Verify"}
          </button>
        </div>
      </form>
    </div>
  );
}
