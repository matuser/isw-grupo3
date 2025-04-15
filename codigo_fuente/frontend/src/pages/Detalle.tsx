
import Stepper from '../components/Stepper';
import Navbar from '../components/Navbar';
import { FiList, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Detalle = () => {
  const navigate = useNavigate();

  const handleStepClick = (step: number) => {
    if (step === 1 ) navigate('/');
    if (step === 2 ) navigate('/paso2');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      alignItems: 'center',
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
          <Stepper currentStep={3} onStepClick={handleStepClick}/>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24,
        textAlign: 'center',
        width: '100%',
      }}>
        {/* Tarjeta de Detalle de inscripción */}
        <div style={{
          width: 'clamp(300px, 80vw, 768px)',
          padding: 20,
          background: 'white',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          {/* Título */}
          <div style={{ paddingBottom: 15 }}>
            <div style={{ color: 'black', fontSize: 24, fontFamily: 'McLaren', fontWeight: '400', wordWrap: 'break-word' }}>Detalle de inscripción</div>
          </div>

          {/* Actividad y Fecha */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiList size={20} color="black" /> {/* Icono de lista */}
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'McLaren', fontWeight: '400', wordWrap: 'break-word' }}>Actividad: Tirolesa</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'McLaren', fontWeight: '400', wordWrap: 'break-word' }}>Fecha: 25/06/2025</div>
            </div>
          </div>

          {/* Visitantes y Hora */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiUser size={20} color="black" /> {/* Icono de usuario */}
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'McLaren', fontWeight: '400', wordWrap: 'break-word' }}>Visitantes: 2</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'McLaren', fontWeight: '400', wordWrap: 'break-word' }}>Hora: 11:00 am</div>
            </div>
          </div>

          {/* Datos de los visitantes */}
          <div style={{ width: '100%', paddingTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', width: '100%', justifyContent: 'center' }}>
              <FiUser size={18} color="black" /> {/* Icono de usuario */}
              <div style={{ color: 'black', fontSize: 18, fontFamily: 'McLaren', fontWeight: '400', wordWrap: 'break-word' }}>Leopoldo Lorenzo</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', width: '100%', justifyContent: 'center' }}>
              <FiUser size={18} color="black" /> {/* Icono de usuario */}
              <div style={{ color: 'black', fontSize: 18, fontFamily: 'McLaren', fontWeight: '400', wordWrap: 'break-word' }}>Francisco Saggiorato</div>
            </div>
          </div>

          {/* Aceptar términos y condiciones */}
          <div style={{ width: '100%', paddingTop: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}> {/* Aumenté aún más el paddingTop */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" style={{ width: 16, height: 16 }} />
              <div style={{ color: '#009ADA', fontSize: 16, fontFamily: 'McLaren', fontWeight: '400', lineHeight: '23px', wordWrap: 'break-word' }}>Aceptar términos y condiciones</div>
            </div>
          </div>

          {/* Contenedor para los botones */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: 30,
          }}>
            {/* Botón Cancelar */}
            <button style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              padding: '8px 16px',
              background: '#D91600',
              overflow: 'hidden',
              borderRadius: 12,
              color: 'white',
              fontSize: 16,
              fontFamily: 'McLaren',
              fontWeight: '400',
              wordWrap: 'break-word',
              border: 'none',
              cursor: 'pointer',
            }}>
              Cancelar
            </button>
            {/* Botón Finalizar Inscripción */}
            <button style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              padding: '8px 16px',
              background: '#12BA12',
              overflow: 'hidden',
              borderRadius: 12,
              color: 'white',
              fontSize: 16,
              fontFamily: 'McLaren',
              fontWeight: '400',
              wordWrap: 'break-word',
              border: 'none',
              cursor: 'pointer',
            }}>
              Finalizar Inscripción
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detalle;