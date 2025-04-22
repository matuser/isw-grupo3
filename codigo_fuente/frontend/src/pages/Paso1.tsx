import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/DataContext';
import { getActividades } from '../services/actividadService';
import { getFechasDisponibles, getHorariosDisponiblesPorFecha } from '../services/horarioService';
import { parseISO, format } from 'date-fns';
import { FaUser } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import styles from '../styles/Paso1.module.css';

const Paso1 = () => {
  const navigate = useNavigate();
  const {
    cantidad: cantidadCtx,
    actividad: actividadCtx,
    fecha: fechaCtx,
    hora: horaCtx,
    idHorario,
    setCantidad,
    setActividad,
    setFecha,
    setHora,
    setIdHorario
  } = useData();

  const [actividad, setActividadLocal] = useState<number | ''>(actividadCtx || '');
  const [cantidad, setCantidadLocal] = useState<number>(cantidadCtx || 1);
  const [fecha, setFechaLocal] = useState(fechaCtx || '');
  const [hora, setHoraLocal] = useState(horaCtx || '');
  const [idHorarioLocal, setIdHorarioLocal] = useState<number | ''>(idHorario || '');

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
    if (step === 1) navigate('/paso1', { state: { desde: true } });
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
    if (field === 'hora') {
      const id = Number(value);
      setIdHorarioLocal(id);
      setIdHorario(id); // contexto
      const horarioSeleccionado = horariosFiltrados.find((h) => h.id === id);
      setHoraLocal(horarioSeleccionado?.hora_inicio || '');
    }
    
  
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  useEffect(() => {
    setActividadLocal(actividadCtx || '');
    setCantidadLocal(cantidadCtx || 1);
    setFechaLocal(fechaCtx || '');
    setHoraLocal(horaCtx || '');
  }, [actividadCtx, cantidadCtx, fechaCtx, horaCtx]);

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
          const fechasOrdenadas = fechas.sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());
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

  const location = useLocation();

  useEffect(() => {
    if (!location.state?.desde) {
      setActividad('');
      setCantidad(1);
      setFecha('');
      setHora('');
    }
  }, [location.state]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.stepperContainer}>
        <div className={styles.stepperWrapper}>
          <Stepper currentStep={1} onStepClick={handleStepClick} />
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.card}>
          <h2 className={styles.title}>Completar los siguientes datos para avanzar en su inscripción</h2>

          <div className={styles.row}>
            <div className={styles.fieldContainer}>
              <label htmlFor="actividad" className={styles.label}>Actividad</label>
              <select
                id="actividad"
                value={actividad}
                onChange={(e) => handleInputChange(e, 'actividad')}
                className={`${styles.select} ${errors.actividad ? styles.errorBorder : ''}`}
              >
                <option value="">Seleccione...</option>
                {actividades.map((act) => (
                  <option key={act.id} value={act.id}>{act.nombre}</option>
                ))}
              </select>
              <p className={styles.helperText}>Seleccione una actividad de las disponibles</p>
              {errors.actividad && <p className={styles.error}>Campo obligatorio</p>}
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor="cantidad" className={styles.label}>Cantidad de visitantes</label>
              <div className={styles.quantityWrapper}>
                <button
                  type="button"
                  onClick={() => setCantidadLocal((prev) => Math.max(Number(prev) - 1, 1))}
                  className={styles.quantityButton}
                >−</button>
                <div className={styles.quantityInputContainer}>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={cantidad === 0 ? '' : cantidad.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;

                      if (/^\d{0,2}$/.test(value)) {
                        if (value === '') {
                          setCantidadLocal(0);
                        } else {
                          const parsed = Number(value);
                          if (parsed >= 1 && parsed <= 10) {
                            setCantidadLocal(parsed);
                            setErrors((prev) => ({ ...prev, cantidad: false }));
                          }
                        }
                      }
                    }}
                    onBlur={() => {
                      if (cantidad < 1) {
                        setCantidadLocal(1);
                      }
                    }}
                    className={styles.quantityValue}
                  />
                  <FaUser className={styles.userIcon} />
                </div>
                <button
                  type="button"
                  onClick={() => setCantidadLocal((prev) => Math.min(Number(prev) + 1, 10))}
                  className={styles.quantityButton}
                >+</button>
              </div>
              <p className={styles.helperText}>Seleccione la cantidad de personas a inscribir</p>
              {errors.cantidad && <p className={styles.error}>Indique cuántas personas participarán</p>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.fieldContainer}>
              <label htmlFor="fecha" className={styles.label}>Fecha</label>
              <select
                id="fecha"
                value={fecha}
                onChange={(e) => handleInputChange(e, 'fecha')}
                className={`${styles.select} ${errors.fecha ? styles.errorBorder : ''}`}
                disabled={!isFechaHoraEnabled}
                style={{ opacity: isFechaHoraEnabled ? 1 : 0.5 }}
              >
                <option value="">Seleccione...</option>
                {fechasDisponibles.map((f) => (
                  <option key={f} value={f}>{format(parseISO(f), 'dd/MM/yyyy')}</option>
                ))}
              </select>
              <p className={styles.helperText}>Seleccione la fecha de la actividad</p>
              {errors.fecha && <p className={styles.error}>Campo obligatorio</p>}
            </div>

            <div className={styles.fieldContainer}>
              <label htmlFor="hora" className={styles.label}>Hora</label>
              <select
                id="hora"
                value={idHorarioLocal}
                onChange={(e) => handleInputChange(e, 'hora')}
                className={`${styles.select} ${errors.hora ? styles.errorBorder : ''}`}
                disabled={!isFechaHoraEnabled}
                style={{ opacity: isFechaHoraEnabled ? 1 : 0.5 }}
              >
                <option value="">Seleccione...</option>
                {horariosFiltrados.map((h) => (
                <option key={h.id} value={h.id}>{h.hora_inicio.slice(0, 5)} hs</option>
                ))}
              </select>
              <p className={styles.helperText}>Seleccione un horario de las disponibles</p>
              {errors.hora && <p className={styles.error}>Campo obligatorio</p>}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={() => navigate('/')} className={styles.buttonBack}>Volver</button>
            <button
              onClick={handleNext}
              className={formularioValido ? styles.buttonNextEnabled : styles.buttonNextDisabled}
              disabled={!formularioValido}
            >Siguiente</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Paso1;