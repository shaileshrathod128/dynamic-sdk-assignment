import { useState } from "react";
import { useAuth } from "../AuthContext";
export default function EmailHeadless() {
  const { email, step, error, setEmail, sendCode, verifyCode } = useAuth();
  const [otp, setOtp] = useState("182597");

  return (
    <div className="p-4 border bg-white rounded-lg border-gray-400">
      {step === "email" && (
        <div>
          <div>
            <label>Email: </label>
          </div>
          <div className="flex gap-3">
            <input
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="input"
            />
            <button onClick={sendCode} disabled={!email} className="btn">
              Send Code
            </button>
          </div>
        </div>
      )}
      {step === "otp" && (
        <div>
          <div>
            <label>OTP: </label>
          </div>
          <div className="flex gap-3">
            <input
              defaultValue={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="input"
            />
            <button
              onClick={() => verifyCode(otp)}
              disabled={!otp}
              className="btn"
            >
              Verify
            </button>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
}
