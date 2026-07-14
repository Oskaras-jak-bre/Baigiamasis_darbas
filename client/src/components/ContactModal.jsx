import React from "react";
import "./ContactModal.css";

const ContactModal = ({ isOpen, onClose, artistName, email, phone }) => {
  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <h2>Susisiekti su autoriumi</h2>
        <p className="contact-modal-subtitle">
          Menininkas: <strong>{artistName}</strong>
        </p>

        <div className="contact-modal-info-line">
          <span className="contact-modal-icon">✉</span>
          <div>
            <label>El. paštas:</label>
            <a href={`mailto:${email}`}>{email || "Nenurodytas"}</a>
          </div>
        </div>

        <div className="contact-modal-info-line">
          <span className="contact-modal-icon">📞</span>
          <div>
            <label>Telefonas:</label>
            <a href={`tel:${phone}`}>{phone || "Nenurodytas"}</a>
          </div>
        </div>

        <button className="contact-modal-ok-btn" onClick={onClose}>
          Uždaryti
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
