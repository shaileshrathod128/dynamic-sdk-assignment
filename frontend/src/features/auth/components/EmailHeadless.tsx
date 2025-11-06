import { useState } from "react";
import { useAuth } from "../AuthContext";
export default function EmailHeadless() {
  const { email, step, error, setEmail, sendCode, verifyCode } = useAuth();
  const [otp, setOtp] = useState("");

  const emailFormSubmit = (e: any) => {
    e.preventDefault();
    sendCode();
  };
  const otpFormSubmit = (e: any) => {
    e.preventDefault();
    verifyCode(otp);
  };

  return (
    <div className="p-4 border bg-white rounded-lg border-gray-400">
      {step === "email" && (
        <div>
          <form action="" onSubmit={emailFormSubmit}>
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
              <button disabled={!email} className="btn">
                Send Code
              </button>
            </div>
          </form>
        </div>
      )}
      {step === "otp" && (
        <div>
          <form action="" onSubmit={otpFormSubmit}>
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
              <button disabled={!otp} className="btn">
                Verify
              </button>
            </div>
          </form>
        </div>
      )}
      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
}
