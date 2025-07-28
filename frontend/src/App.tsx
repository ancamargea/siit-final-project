import { Routes, Route } from "react-router-dom";
import { Nav } from "./navigation/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import StoreList from "./pages/StoreList";
import StoreDetail from "./pages/StoreDetail";
import AdminDashboard from "./pages/AdminDashboard";
import { PrivateRoute } from "./features/Auth/PrivateRoute";

import AddStore from "./features/Stores/AddStore";
import EditStore from "./features/Stores/EditStore";
import "./App.css";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/stores/:id" element={<StoreDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/stores/add"
          element={
            <PrivateRoute allowedRoles={["owner"]}>
              <AddStore />
            </PrivateRoute>
          }
        />

        <Route
          path="/stores/:id/edit"
          element={
            <PrivateRoute allowedRoles={["owner"]}>
              <EditStore />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
