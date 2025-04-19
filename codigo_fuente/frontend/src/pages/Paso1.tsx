import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActividades } from '../services/actividadService';
import { getHorarios, getFechasDisponibles, getHorariosDisponiblesPorFecha } from '../services/horarioService';
import { parseISO, format } from 'date-fns';
const Paso1 = () => {
    const navigate = useNavigate();

    const [actividad, setActividad] = useState<number | ''>('');
    const [cantidad, setCantidad] = useState<number | ''>('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    const [actividades, setActividades] = useState<any[]>([]);
    const [horarios, setHorarios] = useState<any[]>([]);
    const [horariosFiltrados, setHorariosFiltrados] = useState<any[]>([]);
    const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);

    const [errors, setErrors] = useState({
        actividad: false,
        cantidad: false,
        fecha: false,
        hora: false,
    });

    const handleStepClick = (step: number) => {
        if (step === 1) navigate('/');
    };

    const handleNext = () => {
        const newErrors = {
            actividad: !actividad,
            cantidad: !cantidad,
            fecha: !fecha,
            hora: !hora,
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).includes(true)) {
            navigate('/paso2', { state: { cantidad } });
        }
    };

    const isFechaHoraEnabled = actividad && cantidad;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
        const { value } = e.target;

        if (field === 'actividad') setActividad(Number(value));
        if (field === 'cantidad') setCantidad(Number(value));
        if (field === 'fecha') setFecha(value);
        if (field === 'hora') setHora(value);

        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const actividadesData = await getActividades();
                setActividades(actividadesData);

                const horariosData = await getHorarios();
                setHorarios(horariosData);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchHorarios = async () => {
          if (actividad && fecha && cantidad) {
            try {
              const horariosDisponibles = await getHorariosDisponiblesPorFecha(
                Number(actividad),
                fecha,
                Number(cantidad)
              );
              setHorariosFiltrados(horariosDisponibles);
              console.log(horariosDisponibles)
            } catch (error) {
              console.error('Error al obtener horarios disponibles:', error);
            }
          }
        };
      
        fetchHorarios();
      }, [actividad, fecha, cantidad]);
      
    

    useEffect(() => {
        const fetchFechas = async () => {
            if (actividad && cantidad) {
                try {
                    const fechas = await getFechasDisponibles(Number(actividad), Number(cantidad));
                    const fechasOrdenadas = fechas.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
                    setFechasDisponibles(fechasOrdenadas);
                } catch (error) {
                    console.error('Error al obtener fechas disponibles:', error);
                }
            } else {
                setFechasDisponibles([]);
            }
        };
        fetchFechas();
    }, [actividad, cantidad]);

    return (
        <div style={containerStyle}>
            <Navbar />

            <div style={stepperContainerStyle}>
                <div style={{ width: 'fit-content' }}>
                    <Stepper currentStep={1} onStepClick={handleStepClick} />
                </div>
            </div>

            <main style={mainStyle}>
                <div style={cardStyle}>
                    <h2 style={titleStyle}>
                        Completar los siguientes datos para avanzar en su inscripción
                    </h2>

                    {/* Actividad y Cantidad */}
                    <div style={rowStyle}>
                        <div style={fieldContainerStyle}>
                            <label htmlFor="actividad" style={labelStyle}>Actividad</label>
                            <select
                                id="actividad"
                                value={actividad}
                                onChange={(e) => handleInputChange(e, 'actividad')}
                                style={{ ...selectStyle, borderColor: errors.actividad ? 'red' : '#ccc' }}
                            >
                                <option value="">Seleccione...</option>
                                {actividades.map((act) => (
                                    <option key={act.id} value={act.id}>{act.nombre}</option>
                                ))}
                            </select>
                            {errors.actividad && <p style={errorStyle}>Campo obligatorio</p>}
                        </div>

                        <div style={fieldContainerStyle}>
                            <label htmlFor="cantidad" style={labelStyle}>Cantidad de Personas</label>
                            <select
                                id="cantidad"
                                value={cantidad}
                                onChange={(e) => handleInputChange(e, 'cantidad')}
                                style={{ ...selectStyle, borderColor: errors.cantidad ? 'red' : '#ccc' }}
                            >
                                <option value="">Seleccione...</option>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            {errors.cantidad && <p style={errorStyle}>Campo obligatorio</p>}
                        </div>
                    </div>

                    {/* Fecha y Hora */}
                    <div style={rowStyle}>
                        <div style={fieldContainerStyle}>
                            <label htmlFor="fecha" style={labelStyle}>Fecha</label>
                            <select
                                id="fecha"
                                value={fecha}
                                onChange={(e) => handleInputChange(e, 'fecha')}
                                style={{
                                    ...selectStyle,
                                    opacity: isFechaHoraEnabled ? 1 : 0.5,
                                    borderColor: errors.fecha ? 'red' : '#ccc',
                                }}
                                disabled={!isFechaHoraEnabled}
                            >
                                <option value="">Seleccione...</option>
                                {fechasDisponibles.map((f) => (
  <option key={f} value={f}>
    {format(parseISO(f), 'dd/MM/yyyy')}
  </option>
))}

                            </select>
                            {errors.fecha && <p style={errorStyle}>Campo obligatorio</p>}
                        </div>

                        <div style={fieldContainerStyle}>
                            <label htmlFor="hora" style={labelStyle}>Hora</label>
                            <select
                                id="hora"
                                value={hora}
                                onChange={(e) => handleInputChange(e, 'hora')}
                                style={{
                                    ...selectStyle,
                                    opacity: isFechaHoraEnabled ? 1 : 0.5,
                                    borderColor: errors.hora ? 'red' : '#ccc',
                                }}
                                disabled={!isFechaHoraEnabled}
                            >
                                <option value="">Seleccione...</option>
                                {horariosFiltrados.map((h) => (
                                    <option key={h.id} value={h.hora_inicio}>
                                        {h.hora_inicio.slice(0, 5)} hs
                                    </option>
                                ))}
                            </select>
                            {errors.hora && <p style={errorStyle}>Campo obligatorio</p>}
                        </div>
                    </div>

                    {/* Botones */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                        <button onClick={() => navigate('/')} style={buttonBackStyle}>
                            Volver
                        </button>
                        <button onClick={handleNext} style={buttonNextStyle}>
                            Siguiente
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Estilos

const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: 'white',
    alignItems: 'center',
};

const stepperContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 0',
};

const mainStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: 24,
    width: '100%',
};

const cardStyle = {
    width: 'clamp(300px, 80vw, 768px)',
    padding: 20,
    background: 'white',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
};

const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 20,
};

const fieldContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
};

const labelStyle = {
    fontFamily: 'Montserrat',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'left' as const,
};

const selectStyle = {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontFamily: 'Montserrat',
    fontSize: 16,
    boxSizing: 'border-box' as const,
};

const titleStyle = {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 18,
    color: '#90A955',
};

const errorStyle = {
    color: 'red',
    fontSize: 12,
};

const buttonBackStyle = {
    padding: '6px 16px',
    backgroundColor: '#90A955',
    color: 'black',
    fontFamily: 'Montserrat',
    fontSize: 14,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
};

const buttonNextStyle = {
    padding: '6px 16px',
    backgroundColor: '#ccc',
    color: 'white',
    fontFamily: 'Montserrat',
    fontSize: 14,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
};

export default Paso1;
