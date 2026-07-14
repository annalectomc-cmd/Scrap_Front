import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import './index.css'
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-vh-100 bg-info bg-gradient bg-opacity-10">
      <nav className="navbar bg-body-tertiary">
        <header className="brand-name">
          <h1>Scrapping TikTok</h1>
        </header>
      </nav>
      <App />
    </div>
  </StrictMode>,
);
