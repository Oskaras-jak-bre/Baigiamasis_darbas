import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = ({ onRegisterSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedZanrai, setSelectedZanrai] = useState([]);
  const [aprasymas, setAprasymas] = useState("");
  const [telefonas, setTelefonas] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("Slaptažodžiai nesutampa");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("zanrai", selectedZanrai.join(","));
      formData.append("aprasymas", aprasymas.replace(/\r/g, "").slice(0, 990));
      formData.append("telefonas", telefonas);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Registracija sėkminga!");
        if (onRegisterSuccess) onRegisterSuccess(data.user);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Registracija nepavyko");
      }
    } catch (error) {
      setError("Serverio klaida. Bandykite vėliau");
    }
  };

  const MENO_ZANRAI = [
    "Tapyba",
    "Grafika",
    "Skulptūra",
    "Fotografija",
    "Keramika",
    "Tekstilė",
    "Skaitmeninis menas",
    "Iliustracija",
    "Kita",
  ];
  const handleGenreChange = (zanras) => {
    if (selectedZanrai.includes(zanras)) {
      setSelectedZanrai(selectedZanrai.filter((z) => z !== zanras));
    } else {
      setSelectedZanrai([...selectedZanrai, zanras]);
    }
  };

  return (
    <div className="register-module">
      <div className="register-content">
        <div className="register-header-zone">
          <h2>Registracija</h2>
          {error && <p className="register-error-text">{error}</p>}
          {success && <p className="register-success-text">{success}</p>}
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-input-group">
            <label className="register-label">Vardas Pavardė</label>
            <input
              id="reg-name"
              type="text"
              className="register-input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Vardas Pavardė"
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">El. paštas</label>
            <input
              id="reg-email"
              type="email"
              className="register-input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="pvz@menas.lt"
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">Telefono numeris</label>
            <input
              id="reg-phone"
              type="tel"
              className="register-input-field"
              value={telefonas}
              onChange={(e) => setTelefonas(e.target.value)}
              required
              placeholder="+37060000000"
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">Slaptažodis</label>
            <input
              id="reg-password"
              type="password"
              className="register-input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="******"
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">Pakartokite slaptažodį</label>
            <input
              id="reg-confirm-password"
              type="password"
              className="register-input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="******"
            />
          </div>
          <div className="register-input-group">
            <label className="register-label">Profilio nuotrauka</label>
            <input
              id="reg-profile-image"
              type="file"
              accept="image/*"
              className="register-input-field"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>
          <div className="register-input-group">
            <label>Jūsų meno žanrai (galima kelis):</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginTop: "5px",
              }}
            >
              {MENO_ZANRAI.map((z, i) => (
                <label
                  key={i}
                  style={{
                    display: "flex",
                    gap: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedZanrai.includes(z)}
                    onChange={() => handleGenreChange(z)}
                  />
                  {z}
                </label>
              ))}
            </div>
          </div>
          <div className="register-input-group">
            <label className="register-label" htmlFor="aprasymas">
              Kūrybos aprašymas
            </label>
            <textarea
              id="aprasymas"
              name="aprasymas"
              className="register-textarea"
              value={aprasymas}
              onChange={(e) => setAprasymas(e.target.value)}
              rows="4"
              maxLength={990}
            />
          </div>
          <small style={{}} className="register-input-description">
            Liko simbolių: {990 - aprasymas.length}
          </small>
          <div className="register-btn-zone">
            <button type="submit" className="register-submit-btn">
              Registruotis
            </button>
          </div>
        </form>

        <div className="register-has-account-zone">
          <div className="register-has-account-box">
            <p className="register-has-account-text">Jau turite paskyrą?</p>
            <p className="register-login-link">
              <span onClick={() => navigate("/login")}>Prisijunkite</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
