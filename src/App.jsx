import { Routes, Route } from "react-router";
import "./App.css";
import Login from "./pages/auth/Login";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/dashboard/Products";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
      </Route>
    </Routes>
  );
}

export default App;
