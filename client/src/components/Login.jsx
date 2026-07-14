import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onLoginSuccess(data.user);
        navigate("/");
      } else {
        setError(data.message || "Prisijungti nepavyko");
      }
    } catch (err) {
      setError("Serverio klaida. Bandykite vėliau");
    }
  };

  return (
    <div className="login-module">
      <div className="login-content">
        <div className="login-header-zone">
          <h2 className="login-title">Prisijungimas</h2>
          {error && <p className="login-error-text">{error}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label className="login-label">El. Paštas</label>
            <input
              id="login-email"
              name="email"
              autoComplete="email"
              className="login-input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="pvz@menas.lt"
            />
          </div>
          <div className="login-input-group">
            <label className="login-label">Slaptažodis</label>
            <input
              id="login-password"
              name="password"
              className="login-input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="******"
            />
          </div>
          <div className="login-btn-zone">
            <button type="submit" className="login-submit-btn">
              Prisijungti
            </button>
          </div>
        </form>
        <div className="login-no-account-zone">
          <div className="login-no-account-box">
            <p className="login-no-account-text">Neturite paskyros?</p>
            <p className="login-register-link">
              <span onClick={() => navigate("/register")}>
                Užsiregistruokite
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
