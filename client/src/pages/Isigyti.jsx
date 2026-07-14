import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Isigyti.css";

const Isigyti = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pirkimoSekme, setPirkimoSekme] = useState(false);
  const { produktas, pagrindineFoto } = location.state || {};

  const [pirkejas, setPirkejas] = useState({
    vardas: "",
    elPastas: "",
    telefonas: "",
    adresas: "",
  });

  if (!produktas) {
    return (
      <div className="checkout-status">
        <h1>Įsigyti</h1>
        <p>Informacija apie prekę nerasta.</p>
      </div>
    );
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${produktas.id}/pirkti`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pirkejas }),
        },
      );

      if (response.ok) {
        setPirkimoSekme(true);
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else {
        alert("Nepavyko užregistruoti pirkimo. Bandykite vėliau.");
      }
    } catch (error) {
      console.error(error);
      alert("Serverio klaida.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="isigyti-page-wrapper">
      {pirkimoSekme && (
        <div className="order-success-overlay">
          <div className="order-success-card">
            <div className="success-icon">🎉</div>
            <h2>Užsakymas priimtas!</h2>
            <p>
              Kūrinys <strong>{produktas.pavadinimas}</strong> sėkmingai
              rezervuotas.
            </p>
            <p className="sub-text">
              Informacija išsiųsta autoriui ({produktas.autorius}). Netrukus
              būsite nukreipti...
            </p>
          </div>
        </div>
      )}
      <div className="isigyti-box">
        <div className="isigyti-box-logo">
          <h1>Įsigyti</h1>
        </div>
        <div className="isigyti-info-buy">
          <div className="isigyti-box-info">
            <div className="isigyti-box-description">
              <p>
                Perkamas kūrinys: <strong>{produktas.pavadinimas}</strong>
              </p>
              <p>
                Kaina: <strong>{produktas.kaina} €</strong>
              </p>
              <div className="isigyti-photo-wrapper">
                <img
                  className="isigyti-product-photo"
                  src={
                    pagrindineFoto ||
                    "https://placehold.co/500x500?text=Nėra+Nuotraukos"
                  }
                  alt={produktas.pavadinimas}
                />
              </div>
            </div>
          </div>
          <div className="Isigyti-buyer-info">
            <h3>Pirkėjo duomenys</h3>
            <form className="checkout-form" onSubmit={handleOrderSubmit}>
              <div className="form-group">
                <label htmlFor="vardas">Vardas, Pavardė *</label>
                <input
                  type="text"
                  id="vardas"
                  placeholder="Jonė Jonaitė"
                  required
                  value={pirkejas.vardas}
                  onChange={(e) =>
                    setPirkejas({ ...pirkejas, vardas: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="elPastas">El. pašto adresas *</label>
                <input
                  type="email"
                  id="elPastas"
                  placeholder="jone@pavyzdys.lt"
                  required
                  value={pirkejas.elPastas}
                  onChange={(e) =>
                    setPirkejas({ ...pirkejas, elPastas: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefonas">Telefono numeris *</label>
                <input
                  type="tel"
                  id="telefonas"
                  placeholder="+37060000000"
                  required
                  value={pirkejas.telefonas}
                  onChange={(e) =>
                    setPirkejas({ ...pirkejas, telefonas: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="adresas">Pristatymo adresas *</label>
                <input
                  type="text"
                  id="adresas"
                  placeholder="Vilniaus g. 10-2, Vilnius"
                  required
                  value={pirkejas.adresas}
                  onChange={(e) =>
                    setPirkejas({ ...pirkejas, adresas: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="checkout-btn">
                Įsigyti
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Isigyti;
