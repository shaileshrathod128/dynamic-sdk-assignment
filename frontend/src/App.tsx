import EmailHeadless from "./features/auth/components/EmailHeadless";
import SignAndVerify from "./features/wallet/components/SignAndVerify";
import { HistoryPanel } from "./features/history/components/HistoryPanel";
import { useAuth } from "./features/auth/AuthContext";

export default function App() {
  const { step, logout, address } = useAuth();
  return (
    <div className="h-screen bg-white text-black">
      <div className="max-w-[960px] m-0 mx-auto py-10 px-4">
        <h1 className="mb-2 font-bold text-lg flex justify-between">
          Dynamic Headless Assignment
          {address && (
            <button onClick={logout} className="btn">
              Logout
            </button>
          )}
        </h1>
        <p className="text-gray-600 text-md mb-4">Email OTP (headless).</p>
        {["email", "otp"].includes(step) ? (
          <EmailHeadless />
        ) : (
          <div className="p-3 border rounded-lg bg-white border-gray-200">
            <SignAndVerify />
            <HistoryPanel />
          </div>
        )}
      </div>
    </div>
  );
}
