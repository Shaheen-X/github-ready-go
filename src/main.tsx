import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;
console.log("[main] Mounting React app");

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
