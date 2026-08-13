import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Inicio from "./pages/inicio/Inicio";
import Dashboard from "./pages/dashboard/Dashboard";
import Scraping from "./pages/scraping/Scraping";
import Reportes from "./pages/reportes/Reportes";
import MainLayout from "./layouts/MainLayout";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* APLICACIÓN */}

        <Route element={<MainLayout />}>

          {/* INICIO */}

          <Route
            path="/inicio"
            element={<Inicio />}
          />


          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* SCRAPING */}

          <Route
            path="/scraping"
            element={<Scraping />}
          />


          {/* REPORTES */}

          <Route
            path="/reportes"
            element={<Reportes />}
          />

          <Route
            path="/reports"
            element={<Reportes />}
          />

        </Route>


        {/* RUTA DESCONOCIDA */}

        <Route
          path="*"
          element={<Navigate to="/inicio" replace />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;