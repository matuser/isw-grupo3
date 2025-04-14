import logo from '../assets/logo.png';

const Inicio = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
    }}>
      {/* Header */}
      <header style={{
        width: '100%',
        padding: '12px 24px',
        backgroundColor: 'white',
        boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="Logo" style={{ height: 32 }} />
          <span style={{
            fontSize: 24,
            fontFamily: 'McLaren',
            color: '#32A430'
          }}>
            EcoHarmonyPark
          </span>
        </div>
      </header>

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
        }}>
          ¡Bienvenido a EcoHarmonyPark!
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          fontFamily: 'McLaren',
          margin: '16px 0'
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
      </main>
    </div>
  );
};

export default Inicio;
