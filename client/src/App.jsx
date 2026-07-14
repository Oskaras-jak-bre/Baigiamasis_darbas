import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Padding from "./components/Padding";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Menininkai from "./pages/Menininkai";
import MenininkasInfo from "./pages/Menininkas_info";
import MenininkuDarbai from "./pages/MenininkuDarbai";
import DarboInfo from "./pages/DarboInfo";
import AddProduct from "./pages/AddProduct";
import SearchResults from "./pages/Search";
import Profilis from "./pages/Profilis";
import Isigyti from "./pages/Isigyti";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Header user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/menininkai" element={<Menininkai />} />
            <Route path="/apie" element={<About />} />
            <Route path="/produktai/:id" element={<DarboInfo />} />
            <Route path="/ikelti-preke" element={<AddProduct />} />
            <Route path="/Menininkų-darbai" element={<MenininkuDarbai />} />
            <Route path="/menininkai/:id" element={<MenininkasInfo />} />
            <Route path="/paieska" element={<SearchResults />} />
            <Route path="/Isigyti" element={<Isigyti />} />
            <Route
              path="/profilis"
              element={
                user ? (
                  <Profilis user={user} setUser={setUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>

        <Padding />
      </div>
    </Router>
  );
}

export default App;
