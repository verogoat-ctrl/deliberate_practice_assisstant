import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mds/mds-reactjs-library";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider preventFontLoading>
      <App />
    </ThemeProvider>
  </StrictMode>
);
