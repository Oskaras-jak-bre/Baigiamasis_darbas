import { useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("products");
  const [genreQuery, setGenreQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    navigate(
      `/paieska?type=${searchType}&query=${encodeURIComponent(searchQuery)}&genre=${encodeURIComponent(genreQuery)}`,
    );
  };

  const MENO_ZANRAI = [
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
    <div className="header-main-box">
      <div className="header-logo-zone">
        <Link to="/">
          <img src="/logo.png" alt="logotipas" className="header-logo-img" />
        </Link>
      </div>

      <div className="header-nav-zone">
        <div className="header-navigation">
          <nav>
            <ul className="header-btn-list">
              <li className="header-nav-btn">
                <Link to="/">Pagrindinis</Link>
              </li>
              <li className="header-nav-btn">
                <Link to="/menininkai">Menininkai</Link>
              </li>
              <li className="header-nav-btn">
                <Link to="/Menininkų-darbai">Menininkų darbai</Link>
              </li>
              <li className="header-nav-btn">
                <Link to="/apie">Apie</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-search-zone">
          <form onSubmit={handleSearch} className="header-search-form">
            <div>
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setGenreQuery("");
                }}
                className="header-search-select"
              >
                <option value="products">Kūriniai</option>
                <option value="artists">Menininkai</option>
              </select>
            </div>

            <div>
              <select
                value={genreQuery}
                onChange={(e) => setGenreQuery(e.target.value)}
                className="header-search-select header-genre-select"
              >
                <option value="">Visi žanrai</option>
                {MENO_ZANRAI.map((z, indeksas) => (
                  <option key={indeksas} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                type="text"
                placeholder="Raktinis žodis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header-search-input"
              />
            </div>
            <div>
              <button type="submit" className="header-search-btn">
                <img src="/icons/search.png" alt="paieška" />
              </button>
            </div>
          </form>
        </div>

        <div className="header-auth-zone">
          {user ? (
            <div className="header-logged-in-block">
              <button
                onClick={() => navigate("/ikelti-preke")}
                className="header-link-btn"
              >
                Įkelti prekę
              </button>
              <button onClick={onLogout} className="header-link-btn">
                Atsijungti
              </button>
              <div
                className="header-profile-click"
                onClick={() => navigate("/profilis")}
              >
                <img
                  src={user.profileImage || "/icons/default-avatar.png"}
                  alt="Profilio nuotrauka"
                  className="header-profile-avatar"
                />
                <span className="header-username">Sveiki, {user.vardas}</span>
              </div>
            </div>
          ) : (
            <div className="header-logged-in-block">
              <button
                onClick={() => navigate("/login")}
                className="header-link-btn"
              >
                Prisijungti
              </button>
              <button
                onClick={() => navigate("/register")}
                className="header-link-btn"
              >
                Registruotis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
