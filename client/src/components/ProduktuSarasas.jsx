import React from "react";
import ProductCard from "./Produktai";
import "./ProduktuSarasas.css";

const ProductList = ({ produktai, loading }) => {
  const surusiuotiProduktai = [...produktai].sort((a, b) => {
    return a.isParduotas === b.isParduotas ? 0 : a.isParduotas ? 1 : -1;
  });

  return (
    <div className="product-list-section">
      {loading ? (
        <p className="product-list-loading">Kraunami produktai...</p>
      ) : surusiuotiProduktai.length > 0 ? (
        <div className="product-list-grid">
          {surusiuotiProduktai.map((produktas) => (
            <ProductCard
              key={produktas._id || produktas.id}
              produktas={produktas}
            />
          ))}
        </div>
      ) : (
        <p className="product-list-empty">Šiuo metu produktų nėra.</p>
      )}
    </div>
  );
};

export default ProductList;
