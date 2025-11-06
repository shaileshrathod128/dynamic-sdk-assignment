import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import AppProviders from "./AppProviders.tsx";

const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID as string;
// const apiBaseUrl = import.meta.env.VITE_DYNAMIC_BASE_URL as string | undefined;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId,
        // apiBaseUrl,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <AppProviders>
        <App />
      </AppProviders>
    </DynamicContextProvider>
  </StrictMode>
);
