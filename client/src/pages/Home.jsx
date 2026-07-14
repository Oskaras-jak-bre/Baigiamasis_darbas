import React from "react";
import "./Home.css";
import ProductList from "../components/ProduktuSarasas";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const Home = () => {
  const navigate = useNavigate();

  const { data: savaitesMenininkas, loading: artistLoading } = useFetch(
    "http://localhost:5000/api/users/savaites-menininkas",
  );
  const { data: produktai, loading: productsLoading } = useFetch(
    "http://localhost:5000/api/products",
  );

  const loading = artistLoading || productsLoading;

  return (
    <div className="home-container">
      <div className="home-wrapper">
        <div className="home-artist-section">
          <div className="home-title-block">
            <h1 className="home-main-title">Savaitės menininkas</h1>
          </div>
          <div className="home-artist-card-wrapper">
            <div
              className="home-artist-card"
              onClick={() =>
                savaitesMenininkas?._id &&
                navigate(`/menininkai/${savaitesMenininkas._id}`)
              }
            >
              {loading ? (
                <p>Kraunama informacija...</p>
              ) : savaitesMenininkas ? (
                <div className="home-artist-profile">
                  <div className="home-artist-img-info-block">
                    <div className="home-artist-img-block">
                      <img
                        className="home-artist-avatar"
                        src={
                          savaitesMenininkas.profileImage ||
                          "/icons/default-avatar.png"
                        }
                        alt={savaitesMenininkas.name}
                      />
                    </div>
                    <div className="home-artist-info-block">
                      <h1>{savaitesMenininkas.name}</h1>
                      <h2 className="home-artist-genre">
                        {Array.isArray(savaitesMenininkas.zanrai)
                          ? savaitesMenininkas.zanrai.join(", ")
                          : savaitesMenininkas.zanrai || "Nenurodytas žanras"}
                      </h2>
                    </div>
                  </div>

                  <div className="home-artist-descr-block">
                    <h2>Aprašymas</h2>
                    <p className="home-artist-descr">
                      {savaitesMenininkas.aprasymas ||
                        "Šis autorius dar nepridėjo aprašymo."}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Menininkų informacija nerasta.</p>
              )}
            </div>
          </div>
        </div>
        <ProductList produktai={produktai || []} loading={loading} />
      </div>
    </div>
  );
};

export default Home;
