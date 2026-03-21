import React from 'react';
import { FiGrid, FiHome, FiImage, FiLogOut, FiShield } from 'react-icons/fi';

const navItems = [
  { id: 'home', label: 'Inicio', icon: <FiHome /> },
  { id: 'gallery', label: 'Galería', icon: <FiImage /> },
  { id: 'admin', label: 'Admin', icon: <FiShield /> },
];

const Navbar = ({ activePage, onNavigate, user, onLogout }) => (
  <header className="navbar glass-card">
    <div className="brand" onClick={() => onNavigate('home')} role="button" tabIndex={0}>
      <div className="brand-icon">
        <FiGrid />
      </div>
      <div>
        <p className="eyebrow">IPUC · Ministerio Digital</p>
        <h1>DECOM Villa del Río</h1>
      </div>
    </div>

    <nav className="nav-links">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={activePage === item.id ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onNavigate(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="nav-user">
      {user ? (
        <>
          <span>{user.email}</span>
          <button type="button" className="outline-btn" onClick={onLogout}>
            <FiLogOut />
            Salir
          </button>
        </>
      ) : (
        <span className="status-pill">Modo público</span>
      )}
    </div>
  </header>
);

export default Navbar;
