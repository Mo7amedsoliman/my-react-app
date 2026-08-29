import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Supports weights 100-700
import "@fontsource-variable/ibm-plex-sans/wght.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
