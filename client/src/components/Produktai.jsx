import React from "react";
import { useNavigate } from "react-router-dom";
import "./Produktai.css";

const ProductCard = ({ produktas }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`product-card ${produktas.isParduotas ? "product-sold" : ""}`}
      onClick={() =>
        !produktas.isParduotas && navigate(`/produktai/${produktas.id}`)
      }
    >
      <div className="product-card-img-wrap">
        {produktas.isParduotas && <div className="sold-badge">PARDUOTA</div>}
        <img
          src={produktas.nuotraukos[0]}
          alt={produktas.pavadinimas}
          className="product-card-img"
        />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-title">{produktas.pavadinimas}</h3>
        <p className="product-card-category">Žanras: {produktas.kategorija}</p>
        <p className="product-card-author">Autorius: {produktas.autorius}</p>
        <p className="product-card-price">
          {produktas.isParduotas ? "Neprieinama" : `${produktas.kaina} €`}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
