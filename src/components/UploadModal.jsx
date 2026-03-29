import React from 'react';
import { FiLoader } from 'react-icons/fi';

const UploadModal = ({ isOpen, title, subtitle, loading, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-panel glass-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Panel administrativo</p>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
        {loading ? (
          <div className="loader-block">
            <FiLoader className="spin" />
            <span>Procesando archivos y sincronizando con Firebase...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default UploadModal;
