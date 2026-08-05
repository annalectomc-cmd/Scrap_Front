import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route element={<MainLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;