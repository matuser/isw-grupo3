import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getActividades } from '../services/actividadService';
import { getHorarios } from '../services/horarioService';

const Paso1 = () => {
    const navigate = useNavigate();

    const [actividad, setActividad] = useState<number | ''>('');
    const [cantidad, setCantidad] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [actividades, setActividades] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [horariosFiltrados, setHorariosFiltrados] = useState([]);


    // Estado para errores de validación
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
        // Verificación de campos obligatorios
        const newErrors = {
            actividad: !actividad,
            cantidad: !cantidad,
            fecha: !fecha,
            hora: !hora,
        };
        setErrors(newErrors);

        // Si no hay errores
        if (!newErrors.actividad && !newErrors.cantidad && !newErrors.fecha && !newErrors.hora) {
            navigate('/paso2', {
                state: { cantidad }, // Pasar la cantidad al paso 2
            });
        }
    };

    const isFechaHoraEnabled = actividad && cantidad;

    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    const formattedToday = today.toISOString().split('T')[0];
    const formattedMaxDate = maxDate.toISOString().split('T')[0];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
        const { value } = e.target;
        if (field === 'actividad') setActividad(value);
        if (field === 'cantidad') setCantidad(value);
        if (field === 'fecha') setFecha(value);
        if (field === 'hora') setHora(value);

        // Limpiar el error del campo correspondiente
        setErrors((prevErrors) => ({ ...prevErrors, [field]: false }));
    };

    // Se conecta a la API para obtener las actividades y horarios disponibles
    useEffect(() => {
        const fetchData = async () => {
            try {
                const actividadesData = await getActividades();
                setActividades(actividadesData);
                console.log(actividadesData);
                const horariosData = await getHorarios();
                setHorarios(horariosData);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        console.log('Actividad:', actividad);
        
        if (actividad && fecha) {
            console.log('Actividad:', actividad);
            console.log('Fecha:', fecha);
            const filtrados = horarios.filter(
                (h) =>
                    h.id_actividad === Number(actividad) &&
                    h.fecha === fecha
            );
            setHorariosFiltrados(filtrados);
        } else {
            setHorariosFiltrados([]);
        }
    }, [actividad, fecha, horarios]);    


    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            alignItems: 'center',
        }}>
            <Navbar />

            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px 0',
            }}>
                <div style={{ width: 'fit-content', justifyContent: 'center' }}>
                    <Stepper currentStep={1} onStepClick={handleStepClick} />
                </div>
            </div>

            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 24,
                textAlign: 'center',
                width: '100%',
            }}>
                <div style={{
                    width: 'clamp(300px, 80vw, 768px)',
                    padding: 20,
                    background: 'white',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                }}>
                    <h2 style={{ fontFamily: 'Montserrat', fontWeight: 400, fontSize: 18, color: '#90A955' }}>
                        Completar los siguientes datos para avanzar en su inscripción
                    </h2>

                    {/* Columna 1 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
                        <div style={fieldContainerStyle}>
                            <label htmlFor="actividad" style={labelStyle}>Actividad</label>
                            <select
                                id="actividad"
                                value={actividad}
                                onChange={(e) => handleInputChange(e, 'actividad')}
                                style={{
                                    ...selectStyle,
                                    borderColor: errors.actividad ? 'red' : '#ccc',
                                }}
                            >
                                <option value="">Seleccione...</option>
                                {actividades.map((act) => (
                                    <option key={act.id} value={act.id}>
                                        {act.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.actividad && <p style={{ color: 'red', fontSize: 12 }}>Campo obligatorio</p>}
                        </div>

                        <div style={fieldContainerStyle}>
                            <label htmlFor="cantidad" style={labelStyle}>Cantidad de Personas</label>
                            <select
                                id="cantidad"
                                value={cantidad}
                                onChange={(e) => handleInputChange(e, 'cantidad')}
                                style={{
                                    ...selectStyle,
                                    borderColor: errors.cantidad ? 'red' : '#ccc',
                                }}
                            >
                                <option value="">Seleccione...</option>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                            {errors.cantidad && <p style={{ color: 'red', fontSize: 12 }}>Campo obligatorio</p>}
                        </div>
                    </div>

                    {/* Columna 2 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
                        <div style={fieldContainerStyle}>
                            <label htmlFor="fecha" style={labelStyle}>Fecha</label>
                            <input
                                id="fecha"
                                type="date"
                                value={fecha}
                                onChange={(e) => handleInputChange(e, 'fecha')}
                                min={formattedToday}
                                max={formattedMaxDate}
                                style={{
                                    ...selectStyle,
                                    opacity: isFechaHoraEnabled ? 1 : 0.5,
                                    borderColor: errors.fecha ? 'red' : '#ccc',
                                }}
                                disabled={!isFechaHoraEnabled}
                            />
                            {errors.fecha && <p style={{ color: 'red', fontSize: 12 }}>Campo obligatorio</p>}
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
                            {errors.hora && <p style={{ color: 'red', fontSize: 12 }}>Campo obligatorio</p>}
                        </div>
                    </div>


                    {/* Botones */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '6px 16px',
                                backgroundColor: '#90A955',
                                color: 'black',
                                fontFamily: 'Montserrat',
                                fontSize: 14,
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                            }}
                        >
                            Volver
                        </button>

                        <button
                            onClick={handleNext}
                            style={{
                                padding: '6px 16px',
                                backgroundColor: '#ccc',
                                color: 'white',
                                fontFamily: 'Montserrat',
                                fontSize: 14,
                                border: 'none',
                                borderRadius: 8,
                                cursor: 'pointer',
                            }}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Estilos

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

const fieldContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
};

export default Paso1;