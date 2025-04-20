import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useForm, useFieldArray } from 'react-hook-form';
import { useData } from '../hooks/DataContext';
import { getActividades } from '../services/actividadService';
import {  getFechasDisponibles, getHorariosDisponiblesPorFecha } from '../services/horarioService';
import { parseISO, format } from 'date-fns';
import { FaUser } from 'react-icons/fa';



const Paso1 = () => {
  const navigate = useNavigate();
  const { setCantidad, setActividad, setFecha, setHora } = useData();

  const [actividad, setActividadLocal] = useState<number | ''>('');
  const [cantidad, setCantidadLocal] = useState<number>(1);
  const [fecha, setFechaLocal] = useState('');
  const [hora, setHoraLocal] = useState('');

  const [actividades, setActividades] = useState<any[]>([]);
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
      setCantidad(cantidad);
      setActividad(actividad);
      setFecha(fecha);
      setHora(hora);
      navigate('/paso2', { state: { cantidad } });
    }
  };

  const isFechaHoraEnabled = actividad && cantidad;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    const { value } = e.target;

    if (field === 'actividad') setActividadLocal(Number(value));
    if (field === 'cantidad') {
      const parsed = Number(value);
      setCantidadLocal(parsed > 0 ? parsed : 1);
    }
    if (field === 'fecha') setFechaLocal(value);
    if (field === 'hora') setHoraLocal(value);

    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actividadesData = await getActividades();
        setActividades(actividadesData);
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

  const formularioValido = actividad && cantidad && fecha && hora && !Object.values(errors).includes(true);

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
          <h2 style={titleStyle}>Completar los siguientes datos para avanzar en su inscripción</h2>

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
            <p style={helperTextStyle}>Seleccione una actividad de las disponibles</p>
            {errors.actividad && <p style={errorStyle}>Campo obligatorio</p>}
          </div>


          <div style={fieldContainerStyle}>
            <label htmlFor="cantidad" style={labelStyle}>Cantidad de visitantes</label>
            <div style={quantityWrapperStyle}>
              <button
                type="button"
                onClick={() => setCantidadLocal((prev) => Math.max(Number(prev) - 1, 1))}
                style={quantityButtonStyle}
              >−</button>
              <div style={quantityInputContainerStyle}>
                <FaUser style={{ marginRight: 8, color: '#aaa' }} />
                <span style={quantityValueStyle}>{cantidad || 1}</span>
              </div>
              <button
                type="button"
                onClick={() => setCantidadLocal((prev) => Math.min(Number(prev) + 1, 10))}
                style={quantityButtonStyle}
              >+</button>
            </div>
            <p style={helperTextStyle}>Seleccione la cantidad de personas a inscribir</p>
            {errors.cantidad && <p style={errorStyle}>Indique cuántas personas participarán</p>}
          </div>
          </div>

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
                <option key={f} value={f}>{format(parseISO(f), 'dd/MM/yyyy')}</option>
              ))}
            </select>
            <p style={helperTextStyle}>Seleccione la fecha de la actividad</p>
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
                <option key={h.id} value={h.hora_inicio}>{h.hora_inicio.slice(0, 5)} hs</option>
              ))}
            </select>
            <p style={helperTextStyle}>Seleccione un horario de las disponibles</p>
            {errors.hora && <p style={errorStyle}>Campo obligatorio</p>}
          </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 0 }}>
            <button onClick={() => navigate('/')} style={buttonBackStyle}>Volver</button>
            <button
              onClick={handleNext}
              style={{
                ...buttonNextStyle,
                backgroundColor: formularioValido ? '#90A955' : '#ccc',
                color: formularioValido ? 'black' : 'white',
                cursor: formularioValido ? 'pointer' : 'default',
              }}
              disabled={!formularioValido}
            >Siguiente</button>
          </div>
        </div>
      </main>
    </div>
  );
};

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
  color: '#90A955', // ✅ color igual al del título
};


const selectStyle = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: '1px solid #ccc',
  fontFamily: 'Montserrat',
  fontSize: 16,
  boxSizing: 'border-box' as const,
  backgroundColor: 'white', // Fondo blanco
  color: 'black',           // Texto negro
};

const titleStyle = {
  fontFamily: 'Montserrat',
  fontWeight: 500,
  fontSize: 24,
  color: '#90A955',
  textAlign: 'center' as const,
};


const errorStyle = {
  color: 'red',
  fontSize: 12,
};

const buttonNextStyle = {
  padding: '12px 24px',
  backgroundColor: '#ccc',
  color: 'white',
  fontFamily: 'Montserrat',
  fontSize: 16,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

const buttonBackStyle = {
  padding: '12px 24px',
  backgroundColor: '#90A955',
  color: 'black',
  fontFamily: 'Montserrat',
  fontSize: 16,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};


const helperTextStyle = {
  fontSize: 12,
  color: '#31572C',
  marginTop: 4,
};


const quantityWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: 8,
};

const quantityButtonStyle = {
  width: 40,
  height: 40,
  borderRadius: 6,
  border: '1px solid #ccc',
  backgroundColor: 'white',
  fontSize: 20,
  fontWeight: 'bold',
  color: '#666',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
};

const quantityInputContainerStyle = {
  flex: 1,
  height: 40,
  border: '1px solid #ccc',
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f9f9f9',
  fontFamily: 'Montserrat',
  fontSize: 16,
};

const quantityValueStyle = {
  fontSize: 16,
  color: '#333',
};

export default Paso1;