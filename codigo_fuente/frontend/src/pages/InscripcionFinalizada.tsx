import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/DataContext';
import { FiList, FiUser } from 'react-icons/fi';
import * as QRCodeReact from 'qrcode.react';
import Navbar from '../components/Navbar';
import { createInscripcion } from '../services/inscripcionService';
import { createParticipante } from '../services/participanteService';
import styles from '../styles/InscripcionFinalizada.module.css';
import Stepper from '../components/Stepper';


const QR_CODE_SIZE = 128;
const QR_CODE_LEVEL = 'H';
const DNI_LOCALE = 'es-AR';
const TICKET_ICON_TICK = "M20.285 33.626L28.39 41.73L43.714 26.407";


const calcularEdad = (fechaNacimientoStr: string | null | undefined): number => {
  if (!fechaNacimientoStr) {
    console.warn("calcularEdad: Fecha de nacimiento no proporcionada.");
    return 0;
  }
  try {
    const hoy = new Date();
    const fechaNacimiento = new Date(`${fechaNacimientoStr}T00:00:00`);
    if (isNaN(fechaNacimiento.getTime())) {
      console.error("calcularEdad: Fecha de nacimiento inválida:", fechaNacimientoStr);
      return 0;
    }
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaNacimiento = fechaNacimiento.getDate();
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }
    return Math.max(0, edad);
  } catch (error) {
    console.error("Error calculando la edad para:", fechaNacimientoStr, error);
    return 0;
  }
};

const formatDNI = (dni: string | null | undefined): string => {
  if (!dni) {
    return '';
  }
  try {
    const numeroDNI = parseInt(dni, 10);
    if (isNaN(numeroDNI)) {
      console.warn("formatDNI: DNI no es un número válido:", dni);
      return dni;
    }
    return numeroDNI.toLocaleString(DNI_LOCALE);
  } catch (error) {
    console.error("Error al formatear DNI:", dni, error);
    return dni;
  }
};

const InscripcionFinalizada = () => {
  const navigate = useNavigate();
  const { cantidad, actividad, fecha, hora, idHorario, participantes, findActividadNombre } = useData();
  const [inscripcionId, setInscripcionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);

  const actividadNombre = findActividadNombre(actividad);
  const fechaFormateadaUI = fecha ? new Date(fecha + 'T12:00:00').toLocaleDateString() : 'No especificada';
  const backendInscripcionUrl = inscripcionId ? `localhost:3000/api/v1/inscripciones/${inscripcionId}` : '';

  const handleStepClick = (step: number) => {
    if (step === 1) navigate('/paso1', { state: { desde: true } });
    if (step === 2) navigate('/paso2', { state: { desde: true } });
    if (step === 3) navigate('/detalle', { state: { desde: true } });
  };

  useEffect(() => {
    let didCancel = false;

    const guardarDatos = async () => {
      if (didCancel) return;

      setIsProcessing(true);
      setError(null);

      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = (hoy.getMonth() + 1).toString().padStart(2, '0');
      const day = hoy.getDate().toString().padStart(2, '0');
      const fechaActualFormateadaAPI = `${year}-${month}-${day}`;

      if (!actividad || !cantidad) {
        console.error("GuardarDatos: Faltan datos esenciales (actividad o cantidad).");
        if (!didCancel) {
          setError("Faltan datos para crear la inscripción.");
          setIsProcessing(false);
        }
        return;
      }

      try {
        const datosInscripcion = {
          id_horario: Number(idHorario), // ACA ESTA EL PROBLEMA, SOLUCIONENLO QUE Marcos Pomenichiii <3 u.u SE ME PONE MAL
          cantidad_personas: Number(cantidad),
          fecha_inscripcion: fechaActualFormateadaAPI,
        };
        console.log('Enviando inscripción:', datosInscripcion);
        const inscripcionCreada = await createInscripcion(datosInscripcion);

        if (didCancel) return;

        console.log('Respuesta de inscripción:', inscripcionCreada);

        if (!inscripcionCreada || typeof inscripcionCreada.id !== 'number') {
          throw new Error('La API de inscripción no devolvió un ID válido.');
        }

        const newInscripcionId = inscripcionCreada.id;
        setInscripcionId(newInscripcionId);

        if (participantes && participantes.length > 0) {
          console.log(`Creando ${participantes.length} participantes para Inscripción ID: ${newInscripcionId}`);

          const promesasParticipantes = participantes.map(participante => {
            const edadCalculada = calcularEdad(participante.fechaNacimiento);
            const talleParticipante = participante.tallaArnes || undefined;

            console.log(`Datos para API participante ${participante.nombre}: DNI=${participante.dni}, Edad=${edadCalculada}, Talle=${talleParticipante}`);

            if (!participante.dni || !participante.nombre) {
               return Promise.resolve({ status: 'skipped', reason: 'Datos incompletos' });
            }

            return createParticipante({
              dni: participante.dni,
              id_inscripcion: newInscripcionId,
              nombre: participante.nombre,
              edad: edadCalculada,
              talla_vestimenta: talleParticipante,
            });
          });

          const resultadosParticipantes = await Promise.allSettled(promesasParticipantes);

          if (didCancel) return;

          resultadosParticipantes.forEach((result, index) => {
            const nombreParticipante = participantes[index]?.nombre || `Participante ${index + 1}`;
            if (result.status === 'rejected') {
              console.error(`Error creando ${nombreParticipante}:`, result.reason);
            } else if (result.status === 'fulfilled') {
              const value = result.value as any;
              if (value?.status === 'skipped') {
                console.log(`${nombreParticipante} saltado: ${value.reason}`);
              } else {
                console.log(`${nombreParticipante} creado/procesado exitosamente.`);
              }
            }
          });
        }

      } catch (err: any) {
        if (!didCancel) {
          console.error("Error en el proceso de guardado:", err);
          const message = err.response?.data?.message || err.message || 'Ocurrió un error al guardar los datos.';
          setError(message);
        }
      } finally {
        if (!didCancel) {
          setIsProcessing(false);
        }
      }
    };

    guardarDatos();

    return () => {
      didCancel = true;
      console.log("Efecto de InscripcionFinalizada limpiado.");
    };
  }, [actividad, cantidad, fecha, participantes, findActividadNombre, navigate, createInscripcion, createParticipante]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.stepperContainer}>
        <Stepper currentStep={3} onStepClick={handleStepClick} />
      </div>
      <div className={styles.successContainer}>
        <svg width="64" height="40" viewBox="0 0 64 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="31.5" r="31" fill="#12BA12" />
          <path d={TICKET_ICON_TICK} stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className={styles.successText}>
          Inscripción finalizada con éxito!
        </div>
        {error && !isProcessing && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <main className={styles.main}>
        <div className={styles.detailCard}>
          <div className={styles.detailTitleContainer}>
            <div className={styles.detailTitle}>
              Detalle de inscripción
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <FiList size={20} color="black" />
                <span className={styles.infoLabel}>Actividad:</span>
              </div>
              <span className={styles.infoValue}>{actividadNombre}</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span className={styles.infoLabel}>Fecha:</span>
              </div>
              <span className={styles.infoValue}>{fechaFormateadaUI}</span>
            </div>
             <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <FiUser size={20} color="black" />
                <span className={styles.infoLabel}>Visitantes:</span>
              </div>
              <span className={styles.infoValue}>{cantidad}</span>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span className={styles.infoLabel}>Hora:</span>
              </div>
              <span className={styles.infoValue}>{hora || 'No especificada'}</span>
            </div>
          </div>

          <div className={styles.participantsSection}>
            <div className={styles.participantsTitle}>
              <FiUser size={18} color="black" />
              <div className={styles.participantsLabel}>
                Participantes Registrados:
              </div>
            </div>
            <ul className={styles.participantsList}>
              {participantes && participantes.length > 0 ? (
                participantes.map((participante, index) => (
                  <li key={index} className={styles.participantItem}>
                    {participante.nombre}
                    {participante.dni && (
                      <span className={styles.participantDni}>
                        {formatDNI(participante.dni)}
                      </span>
                    )}
                  </li>
                ))
              ) : (
                Number(cantidad) > 0 && (
                  <li className={styles.noParticipants}>
                    No se ingresaron detalles individuales de los visitantes.
                  </li>
                )
              )}
            </ul>
          </div>

          <div className={styles.qrSection}>
            <div className={styles.inscriptionCode}>
              Código de inscripción: <span className={styles.codeValue}>{inscripcionId ?? '---'}</span>
            </div>
            <div className={styles.qrMessage}>
              Presente este QR al inicio de la actividad:
            </div>
            <div className={styles.qrContainer} style={{ height: `${QR_CODE_SIZE}px`, width: `${QR_CODE_SIZE}px` }}>
              {inscripcionId && backendInscripcionUrl ? (
                <QRCodeReact.QRCodeSVG
                  value={backendInscripcionUrl}
                  size={QR_CODE_SIZE}
                  level={QR_CODE_LEVEL}
                  includeMargin={false}
                />
              ) : (
                <div className={styles.qrPlaceholder}>
                  <p className={styles.qrPlaceholderText}>
                    {isProcessing ? 'Generando QR...' : 'QR no disponible'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/paso1')}
            className={styles.returnButton}
          >
            Inscribirse a otra actividad
          </button>

        </div>
      </main>
    </div>
  );
};

export default InscripcionFinalizada;