import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CountrySearch from "./components/CountrySearch";
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import ApiKeyManager from "./components/ApiKeyManager";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/country" element={<CountrySearch />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/apikey" element={<ApiKeyManager />} />
      </Routes>
    </Router>
  );
}

export default App;
