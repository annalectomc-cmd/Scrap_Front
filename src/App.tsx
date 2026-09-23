import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./features/auth/pages/login/Login";
import Inicio from "./features/home/pages/Inicio";
import Dashboard from "./features/dashboard/pages/Dashboard";
import Scraping from "./features/scraping/pages/Scraping";
import Reportes from "./features/reports/pages/Reportes";
import MainLayout from "./layout/MainLayout";

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