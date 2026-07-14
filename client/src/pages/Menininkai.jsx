import React from "react";
import { useNavigate } from "react-router-dom";
import "./Menininkai.css";
import useFetch from "../hooks/useFetch";

const Menininkai = () => {
  const navigate = useNavigate();
  const {
    data: menininkai,
    loading,
    error,
  } = useFetch("http://localhost:5000/api/users");

  if (loading) return <p>Kraunami menininkai...</p>;
  if (error) return <p>Klaida: {error}</p>;

  return (
    <div className="artists-page-grid">
      {menininkai &&
        menininkai.map((menininkas) => (
          <div
            className="artists-page-card"
            key={menininkas._id}
            onClick={() => navigate(`/menininkai/${menininkas._id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="artists-page-img-container">
              <img
                className="artists-page-avatar"
                src={
                  menininkas.profileImage ||
                  "https://api.dicebear.com/7.x/bottts/svg?seed=default"
                }
                alt={menininkas.name}
              />
            </div>

            <h1 className="artists-page-name">{menininkas.name}</h1>
            <p className="artists-page-style-label">Kūrybos stilius</p>
            <p className="artists-page-genre">
              {Array.isArray(menininkas.zanrai) && menininkas.zanrai.length > 0
                ? menininkas.zanrai.join(", ")
                : menininkas.zanrai || "Nenurodytas žanras"}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Menininkai;
