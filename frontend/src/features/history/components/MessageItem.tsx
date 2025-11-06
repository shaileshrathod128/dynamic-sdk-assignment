import classNames from "classnames";
import type { HistoryItem } from "../../../types";

const MessageItem = ({ result, createdAt, message }: HistoryItem) => {
  const isErrorOccured = result && "error" in result;
  const baseContainerClass = classNames({
    "border-red-600 bg-red-50": isErrorOccured,
    "border-green-600 bg-green-50": !isErrorOccured,
    "border p-5 rounded": true,
  });
  return (
    <div className={baseContainerClass}>
      <div className="text-xs text-gray-400">
        {new Date(createdAt).toLocaleString()}
      </div>
      <div className="my-2">
        <strong>Message:</strong> {message}
      </div>
      {isErrorOccured ? (
        <div className="text-red-500 text-xs wrap-break-word">
          {result.error}
        </div>
      ) : result ? (
        <div className="mt-2">
          <div>
            Valid: <strong>{String(result.isValid)}</strong>
          </div>
          <div className="text-xs wrap-break-word">Signer: {result.signer}</div>
        </div>
      ) : (
        <div className="mt-3 text-gray-300">Verifying…</div>
      )}
    </div>
  );
};

export default MessageItem;
