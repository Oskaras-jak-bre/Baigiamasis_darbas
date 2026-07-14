import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductList from "../components/ProduktuSarasas";
import "./Search.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "products";
  const query = queryParams.get("query") || "";
  const genre = queryParams.get("genre") || "";

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const lowerQuery = query.toLowerCase();

    if (type === "products") {
      fetch("http://localhost:5000/api/products")
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((p) => {
            const matchesText =
              p.pavadinimas.toLowerCase().includes(lowerQuery) ||
              p.kategorija.toLowerCase().includes(lowerQuery) ||
              p.autorius.toLowerCase().includes(lowerQuery);
            const matchesGenre = genre ? p.kategorija === genre : true;

            return matchesText && matchesGenre;
          });
          setFilteredProducts(filtered);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      fetch("http://localhost:5000/api/users")
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((u) => {
            const matchesText =
              u.name.toLowerCase().includes(lowerQuery) ||
              (Array.isArray(u.zanrai) &&
                u.zanrai.some((z) => z.toLowerCase().includes(lowerQuery)));

            const matchesGenre = genre
              ? Array.isArray(u.zanrai) && u.zanrai.includes(genre)
              : true;

            return matchesText && matchesGenre;
          });
          setFilteredArtists(filtered);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [type, query, genre]);

  return (
    <div className="search-page">
      <h1 className="search-page-title">
        Paieškos rezultatai frazei:{" "}
        <span className="search-keyword">„{query}“</span>
      </h1>
      <p className="search-page-meta">
        Paieškos sritis:{" "}
        <strong>{type === "products" ? "Kūriniai" : "Menininkai"}</strong>
      </p>

      {loading ? (
        <p className="search-status">Kraunami rezultatai...</p>
      ) : type === "products" ? (
        <div className="search-results-wrap">
          {filteredProducts.length > 0 ? (
            <ProductList produktai={filteredProducts} loading={false} />
          ) : (
            <p className="search-no-results">
              Nepavyko rasti kūrinių pagal šią užklausą.
            </p>
          )}
        </div>
      ) : (
        <div className="search-artists-grid">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <div
                className="search-artist-card"
                key={artist._id}
                onClick={() => navigate(`/menininkai/${artist._id}`)}
              >
                <div className="search-artist-img-frame">
                  <img
                    src={artist.profileImage || "/icons/default-avatar.png"}
                    alt={artist.name}
                    className="search-artist-avatar"
                  />
                </div>
                <h3>{artist.name}</h3>
                <p className="search-artist-genre">
                  {Array.isArray(artist.zanrai) && artist.zanrai.length > 0
                    ? artist.zanrai.join(", ")
                    : "Nenurodytas žanras"}
                </p>
              </div>
            ))
          ) : (
            <p className="search-no-results">
              Nepavyko rasti menininkų pagal šią užklausą.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
