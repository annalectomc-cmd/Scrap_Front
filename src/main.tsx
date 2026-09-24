import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App";
import { NotificationsProvider } from "./features/notifications/context/NotificationsContext";
import { ThemeProvider } from "./features/theme/context/ThemeContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </ThemeProvider>
  </StrictMode>
);