import logo from '../assets/logo.png';
import Stepper from '../components/Stepper';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { useState } from 'react'; // Importa useState si no lo tienes

const Inicio = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Estado para el paso actual

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    if (step === 2) {
      navigate('/paso2');
    }
    if (step === 3) {
      navigate('/detalle');
    }
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

      {/* Stepper */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 0',
      }}>
        <div style={{ width: 'fit-content', justifyContent: 'center' }}>
          <Stepper currentStep={currentStep} onStepClick={handleStepClick} /> {/* Pasa currentStep y onStepClick */}
        </div>
      </div>

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
        {/* Contenido principal de la página de inicio (pasos 1 y 2) */}
        {currentStep < 3 && (
          <>
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
            <button style={{
              padding: '12px 24px',
              fontSize: 18,
              fontFamily: 'McLaren',
              backgroundColor: '#12BA12',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer'
            }}>
              Inscribirse a actividad
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default Inicio;