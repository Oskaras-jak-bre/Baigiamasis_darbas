import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    pavadinimas: "",
    kaina: "",
    kategorija: "",
    aprasas: "",
  });

  const [nuotraukos, setNuotraukas] = useState([]);
  const [virselioIndeksas, setVirselioIndeksas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const pasirinktiFailai = Array.from(e.target.files);
    if (pasirinktiFailai.length > 3) {
      setError("Galite pasirinkti maksimaliai 3 nuotraukas.");
      return;
    }
    setNuotraukas(pasirinktiFailai);
    setVirselioIndeksas(0);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nuotraukos.length === 0) {
      setError("Būtina įkelti bent vieną nuotrauką");
      return;
    }
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("pavadinimas", formData.pavadinimas);
    data.append("kaina", formData.kaina);
    data.append("kategorija", formData.kategorija);
    data.append("aprasas", formData.aprasas);
    data.append("virselioIndeksas", virselioIndeksas);

    nuotraukos.forEach((failas) => {
      data.append("nuotraukos", failas);
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Nepavyko įkelti");

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const PRODUKTU_KATEGORIJOS = [
    "Tapyba",
    "Grafika",
    "Skulptūra",
    "Fotografija",
    "Keramika",
    "Tekstilė",
    "Skaitmeninis menas",
    "Kita",
  ];

  return (
    <div className="add-product-page">
      {success && (
        <div className="upload-success-overlay">
          <div className="upload-success-card">
            <div className="success-checkmark">✨</div>
            <h2>Kūrinys sėkmingai įkeltas!</h2>
            <p>
              Jūsų darbas <strong>{formData.pavadinimas}</strong> sėkmingai
              pridėtas į galeriją.
            </p>
            <p className="redirect-countdown">
              Netrukus būsite nukreipti į pagrindinį puslapį...
            </p>
          </div>
        </div>
      )}

      <div
        className="add-product-container"
        style={{ opacity: success ? 0.2 : 1, transition: "opacity 0.3s" }}
      >
        <h2>Įkelti naują kūrinį</h2>
        {error && <p className="add-product-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="add-product-group">
            <label>Pavadinimas:</label>
            <input
              type="text"
              name="pavadinimas"
              className="add-product-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-product-group">
            <label>Kaina (€):</label>
            <input
              type="number"
              name="kaina"
              className="add-product-input"
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-product-group">
            <label>Kategorija:</label>
            <select
              name="kategorija"
              className="add-product-select"
              value={formData.kategorija}
              onChange={handleChange}
              required
            >
              <option value="">-- Pasirinkite kategoriją --</option>
              {PRODUKTU_KATEGORIJOS.map((kat, idx) => (
                <option key={idx} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>
          <div className="add-product-group">
            <label>Aprašas:</label>
            <textarea
              name="aprasas"
              className="add-product-textarea"
              onChange={handleChange}
              required
            />
          </div>
          <div className="add-product-group">
            <label>Nuotraukos (iki 3):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              required
            />
          </div>

          {nuotraukos.length > 1 && (
            <div className="profile-edit-photos-zone">
              <label>Pasirinkite pagrindinę nuotrauką:</label>
              <div className="profile-edit-photos-grid">
                {nuotraukos.map((failas, idx) => (
                  <div
                    key={idx}
                    className={`profile-edit-photo-item ${virselioIndeksas === idx ? "is-cover" : ""}`}
                  >
                    <img src={URL.createObjectURL(failas)} alt="" />
                    <div className="profile-photo-controls">
                      <input
                        type="radio"
                        name="naujasVirselis"
                        checked={virselioIndeksas === idx}
                        onChange={() => setVirselioIndeksas(idx)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="add-product-submit-btn"
            disabled={loading}
          >
            {loading ? "Įkeliama..." : "Paskelbti prekę"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
