import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import CountrySearch from "./pages/CountrySearch";
import ProtectedRoute from "./pages/ProtectedRoute";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ApiKeyManagement from "./pages/ApiKeyManagement";
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/country"
          element={
            <ProtectedRoute>
              <CountrySearch />
            </ProtectedRoute>
          }
        />
        <Route
  path="/manage"
  element={
    <ProtectedRoute>
      <ApiKeyManagement />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
