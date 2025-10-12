import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;
rootEl.textContent = "Loading app...";
console.log("[main] Mounting React app");

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
