import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <header style={{
      width: '100%',
      padding: '24px 10px',
      backgroundColor: 'white',
      boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '0 auto',
    }}>
      {/* Contenedor para el Botón Hamburguesa con margen */}
      <div style={{ marginRight: '20px' }}>
        <button onClick={toggleMenu} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          width: '30px',
          height: '22px',
        }}>
          <span style={{ height: '3px', backgroundColor: '#333', width: '100%' }} />
          <span style={{ height: '3px', backgroundColor: '#333', width: '100%' }} />
          <span style={{ height: '3px', backgroundColor: '#333', width: '100%' }} />
        </button>
      </div>

      {/* Logo y nombre centrados */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <img src={logo} alt="Logo" style={{ height: 32 }} />
        <span style={{
          fontSize: 24,
          fontFamily: 'Montserrat',
          color: '#90A955'
        }}>
          EcoHarmonyPark
        </span>
      </div>

      
      <div style={{ width: 30 }}></div>

      {/* Sidebar */}
      {isOpen && (
        <div
          ref={sidebarRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '300px',
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          {/* Ítems del menú */}
          <Link to="/" onClick={handleMenuClick} style={{ ...menuItemStyle, color: '#32A430', textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#32A430" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Inicio</span>
          </Link>
          <div onClick={handleMenuClick} style={{ ...menuItemStyle, color: '#32A430' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#32A430" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Mis inscripciones</span>
          </div>
        </div>
      )}
    </header>
  );
};

const menuItemStyle = {
  padding: '12px',
  borderRadius: '8px',
  backgroundColor: '#f0f0f0',
  width: '90%', 
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
};

export default Navbar;