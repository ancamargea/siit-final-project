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
import ReviewStore from "./features/Stores/ReviewStore";
import "./App.css";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profile edit for both regular users and admins */}
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["user", "owner"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/stores" element={<StoreList />} />
        <Route path="/stores/:id" element={<StoreDetail />} />

        {/* Admin dashboard page — only for owners */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["owner"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/add-store"
          element={
            <PrivateRoute allowedRoles={["owner"]}>
              <AddStore />
            </PrivateRoute>
          }
        />

        {/* Edit store: allowed for both users and owners */}
        <Route
          path="/stores/:id/edit"
          element={
            <PrivateRoute allowedRoles={["user", "owner"]}>
              <EditStore />
            </PrivateRoute>
          }
        />

        {/* Logged-in users can leave reviews */}
        <Route
          path="/stores/:id/review"
          element={
            <PrivateRoute>
              <ReviewStore />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
