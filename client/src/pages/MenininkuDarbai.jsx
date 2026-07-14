import React from "react";
import ProductList from "../components/ProduktuSarasas";
import "./MenininkuDarbai.css";
import useFetch from "../hooks/useFetch";

const MenininkuDarbai = () => {
  const {
    data: produktai,
    loading,
    error,
  } = useFetch("http://localhost:5000/api/products");

  if (error) return <div className="works-page-error">Klaida: {error}</div>;

  return <ProductList produktai={produktai || []} loading={loading} />;
};

export default MenininkuDarbai;
