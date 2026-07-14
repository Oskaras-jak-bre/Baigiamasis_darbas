import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Menininkas_info.css";
import ProductList from "../components/ProduktuSarasas";
import ContactModal from "../components/ContactModal";

const MenininkasInfo = () => {
  const { id } = useParams();
  const [menininkas, setMenininkas] = useState(null);
  const [menininkoProduktai, setMenininkoProduktai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Nepavyko gauti menininko duomenų");
        return res.json();
      })
      .then((usersData) => {
        const surastasVartotojas = usersData.find((u) => u._id === id);

        if (!surastasVartotojas) {
          throw new Error("Menininkas nerastas");
        }
        setMenininkas(surastasVartotojas);

        return fetch("http://localhost:5000/api/products")
          .then((res) => res.json())
          .then((productsData) => {
            const filtruotiKuriniai = productsData.filter(
              (p) =>
                p.autorius.toLowerCase() ===
                surastasVartotojas.name.toLowerCase(),
            );
            setMenininkoProduktai(filtruotiKuriniai);
            setLoading(false);
          });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="artist-info-status">
        Kraunama menininko informacija...
      </div>
    );
  }

  if (error) {
    return (
      <div className="artist-info-status artist-info-error">
        Klaida: {error}
      </div>
    );
  }

  return (
    <div className="artist-info-page">
      <div className="artist-info-card">
        <div className="artist-info-avatar-wrap">
          <img
            src={menininkas.profileImage || "/icons/default-avatar.png"}
            alt={menininkas.name}
            className="artist-info-avatar"
          />
        </div>
        <div className="artist-info-details">
          <h1 className="artist-info-name">{menininkas.name}</h1>
          <h2 className="artist-info-genre">
            {Array.isArray(menininkas.zanrai)
              ? menininkas.zanrai.join(", ")
              : menininkas.zanrai || "Nenurodytas žanras"}
          </h2>
          <p className="artist-info-bio">
            {menininkas.aprasymas || "Šis autorius neturi aprašymo."}
          </p>
          <button
            className="artist-info-contact-trigger-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Rodyti menininko kontaktus
          </button>
        </div>
      </div>

      <div className="artist-info-gallery-section">
        <h2 className="artist-info-gallery-title">Visi autoriaus kūriniai</h2>
        <ProductList produktai={menininkoProduktai} loading={false} />
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artistName={menininkas.name}
        email={menininkas.email}
        phone={menininkas.telefonas}
      />
    </div>
  );
};

export default MenininkasInfo;
