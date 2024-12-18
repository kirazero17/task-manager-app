import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Import assets
import App from "./App.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// Import components
import { Dialog } from "src/components/ui/dialog";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Dialog>
      <App />
      <ToastContainer />
    </Dialog>
  </BrowserRouter>
);
