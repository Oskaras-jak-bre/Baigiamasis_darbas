import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DarboInfo.css";
import ContactModal from "../components/ContactModal";

const DarboInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menininkas, setMenininkas] = useState(null);
  const [produktas, setProduktas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagrindineFoto, setPagrindineFoto] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((productsData) => {
        const surastasProduktas = productsData.find((p) => p.id === Number(id));
        setProduktas(surastasProduktas);

        if (surastasProduktas) {
          if (
            surastasProduktas.nuotraukos &&
            surastasProduktas.nuotraukos.length > 0
          ) {
            setPagrindineFoto(surastasProduktas.nuotraukos[0]);
          }

          return fetch(
            `http://localhost:5000/api/users/search?vardas=${encodeURIComponent(surastasProduktas.autorius)}`,
          )
            .then((res) => {
              if (!res.ok) throw new Error("Autorius nerastas");
              return res.json();
            })
            .then((authorData) => {
              if (authorData && !authorData.message) {
                setMenininkas(authorData);
              }
            })
            .catch(() => {
              console.log(
                "Autorius nerastas sistemoje, naudojami laikinieji duomenys.",
              );
              setMenininkas({
                vardas: surastasProduktas.autorius,
                zanras: "Menininkas",
                nuotrauka:
                  "https://api.dicebear.com/7.x/bottts/svg?seed=" +
                  surastasProduktas.autorius,
                email: "Nenurodytas",
                telefonas: "Nenurodytas",
              });
            });
        }
      })
      .catch((err) => {
        console.error("Klaida kraunant duomenis:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="product-info-status">Kraunama informacija...</div>;
  if (!produktas)
    return <div className="product-info-status">Produktas nerastas</div>;

  return (
    <div className="product-info-container">
      <div className="product-info-card">
        <div className="product-info-header-block">
          <div className="product-info-title">
            <h1>{produktas.pavadinimas}</h1>
          </div>

          <div className="product-info-main-img-wrap">
            <img
              src={
                pagrindineFoto ||
                "https://placehold.co/500x500?text=Nėra+Nuotraukos"
              }
              alt={produktas.pavadinimas}
              className="product-info-main-img"
            />
          </div>

          <div className="product-info-gallery">
            {produktas.nuotraukos &&
              produktas.nuotraukos.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Nuotrauka ${index + 1}`}
                  className={`product-info-gallery-img ${pagrindineFoto === url ? "product-info-gallery-img--active" : ""}`}
                  onClick={() => setPagrindineFoto(url)}
                />
              ))}
          </div>
        </div>

        <div>
          <div className="product-info-meta-block">
            <p className="product-info-author">
              Kūrinio autorius: {produktas.autorius}
            </p>
            <p className="product-info-price">
              Kūrinio kaina: {produktas.kaina} €
            </p>
            <p>Žanras: {produktas.kategorija}</p>
          </div>
          <div className="product-info-description">
            <p className="product-info-description-title">Aprašymas</p>
            <p className="product-info-description-text">{produktas.aprasas}</p>
          </div>
        </div>
        <button
          className="product-info-buy-btn"
          onClick={() =>
            navigate("/Isigyti", { state: { produktas, pagrindineFoto } })
          }
        >
          Įsigyti
        </button>
      </div>

      {menininkas && (
        <div className="product-info-artist-box">
          <div className="product-info-artist-card">
            <div className="product-info-artist-details">
              <p className="product-info-artist-header">Kūrinio autorius</p>
              <h3 className="product-info-artist-name">{menininkas.vardas}</h3>
            </div>
            <div className="product-info-artist-img-frame">
              <img
                className="product-info-artist-img"
                src={
                  menininkas.nuotrauka ||
                  "https://api.dicebear.com/7.x/bottts/svg?seed=default"
                }
                alt={menininkas.vardas}
                onError={(e) => {
                  e.target.src =
                    "https://api.dicebear.com/7.x/bottts/svg?seed=err";
                }}
              />
            </div>
            <div className="product-info-artist-actions">
              <button
                className="product-info-artist-btn"
                onClick={() => navigate(`/menininkai/${menininkas.id || id}`)}
              >
                Daugiau info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DarboInfo;
