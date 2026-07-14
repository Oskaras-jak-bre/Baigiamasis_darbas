import React, { useState, useEffect } from "react";
import "./Profilis.css";

const Profilis = ({ user, setUser }) => {
  const [profileForm, setProfileForm] = useState({
    name: user.vardas || "",
    email: user.email || "",
    telefonas: user.telefonas || "",
    aprasymas: user.aprasymas || "",
  });

  const [selectedZanrai, setSelectedZanrai] = useState(user.zanrai || []);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    pavadinimas: "",
    kaina: "",
    aprasas: "",
    kategorija: "",
    nuotraukos: [],
  });
  const [message, setMessage] = useState("");
  const [naujosNuotraukos, setNaujasNuotraukas] = useState([]);
  const [virselioIndeksas, setVirselioIndeksas] = useState(0);

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

  const handleGenreToggle = (zanras) => {
    if (selectedZanrai.includes(zanras)) {
      setSelectedZanrai(selectedZanrai.filter((z) => z !== zanras));
    } else {
      setSelectedZanrai([...selectedZanrai, zanras]);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((users) => {
        const dbUser = users.find((u) => u.email === user.email);
        if (dbUser) {
          const freshData = {
            ...user,
            id: dbUser._id,
            vardas: dbUser.name,
            email: dbUser.email,
            telefonas: dbUser.telefonas || "",
            zanrai: dbUser.zanrai || [],
            aprasymas: dbUser.aprasymas || "",
            profileImage: dbUser.profileImage,
          };
          setProfileForm({
            name: dbUser.name,
            email: dbUser.email,
            telefonas: dbUser.telefonas || "",
            aprasymas: dbUser.aprasymas || "",
          });
          setSelectedZanrai(dbUser.zanrai || []);
          setUser(freshData);
          localStorage.setItem("user", JSON.stringify(freshData));
        }
      });

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (p) => p.autorius.toLowerCase() === user.vardas.toLowerCase(),
        );
        setMyProducts(filtered);
      });
  }, [user.email, user.vardas, setUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("email", profileForm.email);
      formData.append("telefonas", profileForm.telefonas);
      formData.append(
        "aprasymas",
        profileForm.aprasymas.replace(/\r/g, "").slice(0, 990),
      );
      formData.append("zanrai", selectedZanrai.join(","));
      if (newProfileImage) formData.append("profileImage", newProfileImage);

      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        const updatedSessionUser = {
          ...user,
          vardas: result.user.name,
          email: result.user.email,
          telefonas: result.user.telefonas,
          zanrai: result.user.zanrai,
          aprasymas: result.user.aprasymas,
          profileImage: result.user.profileImage,
        };
        setUser(updatedSessionUser);
        localStorage.setItem("user", JSON.stringify(updatedSessionUser));
        setNewProfileImage(null);
        setMessage("Profilis atnaujintas!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("Klaida atnaujinant profilį.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Ar tikrai norite ištrinti šį kūrinį?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setMyProducts(myProducts.filter((p) => p.id !== id));
    } catch (err) {
      alert("Klaida ištrinant");
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product.id);
    setProductForm({
      pavadinimas: product.pavadinimas,
      kaina: product.kaina,
      aprasas: product.aprasas,
      kategorija: product.kategorija || "",
      nuotraukos: product.nuotraukos || [],
    });
    setNaujasNuotraukas([]);
    setVirselioIndeksas(0);
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("pavadinimas", productForm.pavadinimas);
      data.append("kaina", productForm.kaina);
      data.append("aprasas", productForm.aprasas);
      data.append("kategorija", productForm.kategorija);
      data.append("virselioIndeksas", virselioIndeksas);

      productForm.nuotraukos.forEach((foto) =>
        data.append("esamosNuotraukos", foto),
      );
      naujosNuotraukos.forEach((failas) => data.append("nuotraukos", failas));

      const res = await fetch(
        `http://localhost:5000/api/products/${editingProduct}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        },
      );

      const result = await res.json();
      if (result.success) {
        setMyProducts(
          myProducts.map((p) => (p.id === editingProduct ? result.product : p)),
        );
        setEditingProduct(null);
        alert("Kūrinys atnaujintas!");
      }
    } catch (err) {
      alert("Klaida redaguojant.");
    }
  };

  return (
    <div className="profile-page">
      <h1>Mano Profilis</h1>
      <div className="profile-current-info-card">
        <div className="profile-current-avatar-wrap">
          <img
            src={user.profileImage || "/icons/default-avatar.png"}
            alt="Profilis"
            className="profile-current-avatar"
          />
        </div>
        <div className="profile-current-details">
          <span className="profile-badge">Dabartinė vieša informacija</span>
          <h2>{user.vardas}</h2>
          <p style={{ margin: "2px 0", color: "#666" }}>
            ✉ {user.email} | 📞 {user.telefonas || "Nenurodytas"}
          </p>
          <div className="profile-genres-badges-wrap">
            {user.zanrai &&
              user.zanrai.map((z, idx) => (
                <span key={idx} className="profile-genre-badge">
                  {z}
                </span>
              ))}
          </div>
          <p className="profile-current-bio">
            {user.aprasymas || "Aprašymo nėra."}
          </p>
        </div>
      </div>

      {message && <p className="profile-msg">{message}</p>}

      <div className="profile-layout">
        <form onSubmit={handleProfileSubmit} className="profile-info-form">
          <h2>Koreguoti profilį</h2>
          <div className="profile-group">
            <label>Naujas Vardas Pavardė:</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
              required
            />
          </div>
          <div className="profile-group">
            <label>Keisti El. Paštą:</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
              required
            />
          </div>
          <div className="profile-group">
            <label>Keisti Telefono Numerį:</label>
            <input
              type="tel"
              value={profileForm.telefonas}
              onChange={(e) =>
                setProfileForm({ ...profileForm, telefonas: e.target.value })
              }
            />
          </div>
          <div className="profile-group">
            <label>Keisti profilio nuotrauką:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewProfileImage(e.target.files[0])}
            />
          </div>
          <div className="profile-group">
            <label>Keisti meno žanrus:</label>
            <div className="profile-genres-grid">
              {MENO_ZANRAI.map((z, idx) => (
                <label key={idx} className="profile-genre-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedZanrai.includes(z)}
                    onChange={() => handleGenreToggle(z)}
                  />{" "}
                  {z}
                </label>
              ))}
            </div>
          </div>
          <div className="profile-group">
            <label>Keisti aprašymą:</label>
            <textarea
              maxLength={990}
              value={profileForm.aprasymas}
              onChange={(e) =>
                setProfileForm({ ...profileForm, aprasymas: e.target.value })
              }
              rows="4"
            />
          </div>
          <button type="submit" className="profile-save-btn">
            Išsaugoti pakeitimus
          </button>
        </form>

        <div className="profile-products-zone">
          <h2>Mano įkelti kūriniai ({myProducts.length})</h2>
          {editingProduct && (
            <form
              onSubmit={handleProductUpdate}
              className="profile-edit-product-modal"
            >
              <h3>Redaguoti kūrinį</h3>
              <div className="profile-group">
                <label>Pavadinimas:</label>
                <input
                  type="text"
                  value={productForm.pavadinimas}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      pavadinimas: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="profile-group">
                <label>Kaina (€):</label>
                <input
                  type="number"
                  value={productForm.kaina}
                  onChange={(e) =>
                    setProductForm({ ...productForm, kaina: e.target.value })
                  }
                  required
                />
              </div>
              <div className="profile-group">
                <label>Kategorija (Žanras):</label>
                <select
                  value={productForm.kategorija}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      kategorija: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Pasirinkite žanrą --</option>
                  {MENO_ZANRAI.map((z, idx) => (
                    <option key={idx} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
              <div className="profile-group">
                <label>Aprašas:</label>
                <textarea
                  value={productForm.aprasas}
                  onChange={(e) =>
                    setProductForm({ ...productForm, aprasas: e.target.value })
                  }
                  required
                  rows="3"
                />
              </div>
              <div className="profile-group">
                <label>Įkelti naujų nuotraukų:</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setNaujasNuotraukas(Array.from(e.target.files))
                  }
                />
              </div>
              <div className="modal-btns">
                <button type="submit" className="modal-save">
                  Išsaugoti
                </button>
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setEditingProduct(null)}
                >
                  Atšaukti
                </button>
              </div>
            </form>
          )}

          <div className="profile-products-list">
            {myProducts.map((product) => {
              if (editingProduct === product.id) return null;
              return (
                <div key={product.id} className="profile-product-item">
                  <img
                    src={product.nuotraukos[0]}
                    alt=""
                    className="profile-product-thumb"
                  />
                  <div className="profile-product-details">
                    <h4>{product.pavadinimas}</h4>
                    <p>{product.kaina} €</p>
                  </div>
                  <div className="profile-product-actions">
                    <button
                      onClick={() => startEditProduct(product)}
                      className="action-edit-btn"
                    >
                      Redaguoti
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="action-delete-btn"
                    >
                      Ištrinti
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilis;
