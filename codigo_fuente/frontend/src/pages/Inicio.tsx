import React from 'react';
import logo from '../assets/logo.png';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Inicio.module.css';

const Inicio = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/paso1');
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className={styles.main}>
        {/* Logo grande */}
        <img src={logo} alt="Logo grande" className={styles.logo} />

        {/* Título */}
        <h1 className={styles.title}>
          ¡Bienvenido a EcoHarmonyPark!
        </h1>

        {/* Subtítulo */}
        <p className={styles.subtitle}>
          Haga clic en el siguiente botón y disfrute de nuestras actividades
        </p>

        {/* Botón */}
        <button onClick={handleClick} className={styles.button}>
          Inscribirse a actividad
        </button>
      </main>
    </div>
  );
};

export default Inicio;