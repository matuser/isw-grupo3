import logo from '../assets/logo.png';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/paso1');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
    }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        textAlign: 'center',
      }}>
        {/* Logo grande */}
        <img src={logo} alt="Logo grande" style={{ width: 'clamp(120px, 20vw, 300px)', height: 'auto' }} />

        {/* Título */}
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 40px)',
          fontFamily: 'McLaren',
          margin: 0,
          color: '#32A430'
        }}>
          ¡Bienvenido a EcoHarmonyPark!
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          fontFamily: 'McLaren',
          margin: '16px 0',
          color: '#32A430'
        }}>
          Haga clic en el siguiente botón y disfrute de nuestras actividades
        </p>

        {/* Botón */}
        <button
          onClick={handleClick}
          style={{
            padding: '12px 24px',
            fontSize: 18,
            fontFamily: 'McLaren',
            backgroundColor: '#12BA12',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer'
          }}
        >
          Inscribirse a actividad
        </button>
      </main>
    </div>
  );
};

export default Inicio;