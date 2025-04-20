import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/DataContext'; // Hook para acceder a datos compartidos de la inscripción
import { FiList, FiUser } from 'react-icons/fi'; // Iconos
import * as QRCodeReact from 'qrcode.react'; // Biblioteca para generar códigos QR
import Navbar from '../components/Navbar'; // Componente de barra de navegación
// Servicios para interactuar con la API (asegúrate que las rutas sean correctas)
import { createInscripcion } from '../services/inscripcionService';
import { createParticipante } from '../services/participanteService';

// --- Constantes ---
const QR_CODE_SIZE = 128; // Tamaño del código QR en píxeles
const QR_CODE_LEVEL = 'H'; // Nivel de corrección de errores del QR ('L', 'M', 'Q', 'H')
const DNI_LOCALE = 'es-AR'; // Configuración regional para formatear DNI (Argentina)
const TICKET_ICON_TICK = "M20.285 33.626L28.39 41.73L43.714 26.407"; // Path SVG para la tilde

// --- Funciones Helper (Utilidades) ---

/**
 * Calcula la edad en años a partir de una fecha de nacimiento en formato string.
 * @param fechaNacimientoStr - La fecha de nacimiento como string (esperado: 'YYYY-MM-DD').
 * @returns La edad calculada en años. Devuelve 0 si la fecha es inválida o nula.
 */
const calcularEdad = (fechaNacimientoStr: string | null | undefined): number => {
  if (!fechaNacimientoStr) {
    console.warn("calcularEdad: Fecha de nacimiento no proporcionada.");
    return 0;
  }
  try {
    const hoy = new Date();
    // Se añade T00:00:00 para asegurar que la comparación se haga al inicio del día
    // y evitar problemas por diferencias de zona horaria o la hora actual.
    const fechaNacimiento = new Date(`${fechaNacimientoStr}T00:00:00`);

    // Validar que la fecha parseada sea una fecha real
    if (isNaN(fechaNacimiento.getTime())) {
      console.error("calcularEdad: Fecha de nacimiento inválida:", fechaNacimientoStr);
      return 0;
    }

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    const mesNacimiento = fechaNacimiento.getMonth();
    const diaNacimiento = fechaNacimiento.getDate();

    // Si el mes actual es menor que el mes de nacimiento, O
    // si es el mismo mes pero el día actual es menor que el día de nacimiento,
    // significa que el cumpleaños de este año aún no ha ocurrido. Restamos un año.
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }

    // Asegura que la edad no sea negativa (podría ocurrir con fechas futuras inválidas)
    return Math.max(0, edad);
  } catch (error) {
    console.error("Error calculando la edad para:", fechaNacimientoStr, error);
    return 0; // Retorna 0 en caso de cualquier error inesperado.
  }
};

/**
 * Formatea un número de DNI (string) añadiendo separadores de miles.
 * @param dni - El número de DNI como string (debería contener solo dígitos).
 * @returns El DNI formateado como string (ej: "12.345.678") o el DNI original si no es válido.
 */
const formatDNI = (dni: string | null | undefined): string => {
  if (!dni) {
    return ''; // No hay DNI para formatear.
  }
  try {
    // Convertir a número para usar toLocaleString. Asume que dni son solo dígitos.
    const numeroDNI = parseInt(dni, 10);
    // Si no se pudo convertir a número (ej: contiene letras), devolver original.
    if (isNaN(numeroDNI)) {
      console.warn("formatDNI: DNI no es un número válido:", dni);
      return dni;
    }
    // Usar la configuración regional para obtener el formato con puntos.
    return numeroDNI.toLocaleString(DNI_LOCALE);
  } catch (error) {
    console.error("Error al formatear DNI:", dni, error);
    return dni; // Devolver original en caso de error.
  }
};

/**
 * Componente que muestra la pantalla de confirmación final de la inscripción.
 * Se encarga de:
 * 1. Enviar la inscripción y los datos de los participantes a la API.
 * 2. Mostrar un resumen de la inscripción.
 * 3. Generar y mostrar un código QR con la información de la inscripción.
 */
const InscripcionFinalizada = () => {
  // --- Hooks ---
  const navigate = useNavigate(); // Hook para la navegación programática.
  // Obtiene los datos de la inscripción (seleccionados en pasos anteriores) del contexto global.
  const { cantidad, actividad, fecha, hora, participantes, findActividadNombre } = useData();

  // --- Estados del Componente ---
  // Almacena el ID de la inscripción una vez creada en la API. null inicialmente.
  const [inscripcionId, setInscripcionId] = useState<number | null>(null);
  // Almacena mensajes de error si ocurren durante las llamadas a la API.
  const [error, setError] = useState<string | null>(null);
  // Indica si se están procesando las llamadas a la API (true) o si ya terminaron (false).
  const [isProcessing, setIsProcessing] = useState<boolean>(true);

  // --- Datos Derivados y Formateados ---
  // Obtiene el nombre legible de la actividad usando el ID almacenado en 'actividad'.
  const actividadNombre = findActividadNombre(actividad);
  // Formatea la fecha de la actividad para mostrarla en la UI (puede ser diferente al formato API).
  const fechaFormateadaUI = fecha ? new Date(fecha).toLocaleDateString() : 'No especificada';
  // Construye la URL que se codificará en el QR. Se genera solo cuando inscripcionId tiene valor.
  // IMPORTANTE: Verificar si esta URL debe apuntar a la API directamente o a una ruta del frontend
  // que luego muestre los detalles (ej: `/ver-inscripcion/${inscripcionId}`).
  const backendInscripcionUrl = inscripcionId ? `/api/v1/inscripciones/${inscripcionId}` : '';

  // --- Efecto Principal: Guardar Inscripción y Participantes ---
  useEffect(() => {
    // Bandera para prevenir actualizaciones de estado si el componente se desmonta
    // mientras las operaciones asíncronas están en progreso (evita warnings en React StrictMode).
    let didCancel = false;

    // Función asíncrona que encapsula la lógica de llamadas a la API.
    const guardarDatos = async () => {
      if (didCancel) return; // No hacer nada si el componente ya se desmontó.

      setIsProcessing(true); // Indicar que el procesamiento ha comenzado.
      setError(null);       // Limpiar errores previos.

      // --- Preparación de Datos para la API ---
      const hoy = new Date();
      const year = hoy.getFullYear();
      const month = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Mes 0-indexado
      const day = hoy.getDate().toString().padStart(2, '0');
      // Fecha actual en formato YYYY-MM-DD para enviar a la API.
      const fechaActualFormateadaAPI = `${year}-${month}-${day}`;

      // --- Validación de Datos Esenciales ---
      // Verifica que tengamos los datos mínimos necesarios antes de llamar a la API.
      if (!actividad || !cantidad) {
        console.error("GuardarDatos: Faltan datos esenciales (actividad o cantidad).");
        if (!didCancel) {
          setError("Faltan datos para crear la inscripción.");
          setIsProcessing(false);
        }
        return;
      }

      // --- Llamadas a la API ---
      try {
        // PASO 1: Crear la Inscripción Principal
        const datosInscripcion = {
          id_horario: Number(actividad), // Asume que 'actividad' es el ID numérico del horario.
          cantidad_personas: Number(cantidad),
          fecha_inscripcion: fechaActualFormateadaAPI,
        };
        console.log('Enviando inscripción:', datosInscripcion);
        const inscripcionCreada = await createInscripcion(datosInscripcion);

        // Si el componente se desmontó mientras esperábamos la respuesta, salir.
        if (didCancel) return;

        console.log('Respuesta de inscripción:', inscripcionCreada);

        // Validar la respuesta de la API de inscripción
        if (!inscripcionCreada || typeof inscripcionCreada.id !== 'number') {
          throw new Error('La API de inscripción no devolvió un ID válido.');
        }

        // Guardar el ID obtenido en el estado.
        const newInscripcionId = inscripcionCreada.id;
        setInscripcionId(newInscripcionId);

        // PASO 2: Crear los Participantes (si existen)
        if (participantes && participantes.length > 0) {
          console.log(`Creando ${participantes.length} participantes para Inscripción ID: ${newInscripcionId}`);

          // Mapear cada participante a una promesa que llama a createParticipante.
          const promesasParticipantes = participantes.map(participante => {
            // Calcular edad y obtener talle para este participante.
            const edadCalculada = calcularEdad(participante.fechaNacimiento);
            // El backend espera 'talla_vestimenta', asegurarse que coincida.
            const talleParticipante = participante.talle || undefined;

            console.log(`Datos para API participante ${participante.nombre}: DNI=${participante.dni}, Edad=${edadCalculada}, Talle=${talleParticipante}`);

            // Validar datos mínimos del participante antes de llamar a la API.
            if (!participante.dni || !participante.nombre) {
               console.warn(`Saltando participante ${index + 1} por falta de DNI o nombre.`);
               // Devolvemos una promesa resuelta con un estado especial para identificarla luego.
               // Esto permite que Promise.allSettled continúe con los demás.
               return Promise.resolve({ status: 'skipped', reason: 'Datos incompletos' });
            }

            // Llamar al servicio para crear el participante.
            return createParticipante({
              dni: participante.dni,
              id_inscripcion: newInscripcionId,
              nombre: participante.nombre,
              edad: edadCalculada,
              talla_vestimenta: talleParticipante,
            });
          });

          // Ejecutar todas las promesas de creación de participantes en paralelo.
          // Promise.allSettled espera a que todas terminen, sin importar si fallan o no.
          const resultadosParticipantes = await Promise.allSettled(promesasParticipantes);

          // Si el componente se desmontó, no continuar.
          if (didCancel) return;

          // Opcional: Procesar los resultados para logging o manejo de errores individuales.
          resultadosParticipantes.forEach((result, index) => {
            const nombreParticipante = participantes[index]?.nombre || `Participante ${index + 1}`;
            if (result.status === 'rejected') {
              // Si una promesa falló, loguear el error.
              console.error(`Error creando ${nombreParticipante}:`, result.reason);
              // NOTA: Podrías acumular estos errores en un estado si necesitas mostrarlos al usuario.
            } else if (result.status === 'fulfilled') {
              // Si se completó, verificar si fue 'skipped' o creada exitosamente.
              const value = result.value as any; // Type assertion para chequear status interno
              if (value?.status === 'skipped') {
                console.log(`${nombreParticipante} saltado: ${value.reason}`);
              } else {
                console.log(`${nombreParticipante} creado/procesado exitosamente.`);
              }
            }
          });
        }
        // Si llegamos aquí sin errores mayores, la inscripción (y participantes intentados) se procesaron.

      } catch (err: any) {
        // Manejar errores que ocurran durante las llamadas API (inscripción o validación).
        if (!didCancel) {
          console.error("Error en el proceso de guardado:", err);
          // Intentar obtener un mensaje de error significativo de la respuesta de la API o del error mismo.
          const message = err.response?.data?.message || err.message || 'Ocurrió un error al guardar los datos.';
          setError(message); // Guardar el mensaje de error en el estado para posible visualización.
          // No reseteamos inscripcionId si ya se obtuvo, el error podría ser solo de un participante.
        }
      } finally {
        // Este bloque se ejecuta siempre, haya habido éxito o error.
        if (!didCancel) {
          setIsProcessing(false); // Marcar que el procesamiento ha finalizado.
        }
      }
    };

    // Ejecutar la función principal de guardado al montar el componente o si cambian las dependencias.
    guardarDatos();

    // --- Función de Limpieza del Efecto ---
    // Se ejecuta cuando el componente se desmonta.
    return () => {
      didCancel = true; // Marcar que el efecto fue cancelado.
      console.log("Efecto de InscripcionFinalizada limpiado.");
    };
    // Dependencias del useEffect: El efecto se re-ejecutará si alguna de estas cambia.
    // Incluir todas las variables/funciones externas usadas dentro del efecto.
  }, [actividad, cantidad, fecha, participantes, findActividadNombre, navigate, createInscripcion, createParticipante]);

  // --- Renderizado del Componente ---
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white', alignItems: 'center' }}>
      <Navbar />

      {/* Sección superior (fuera del main) para el mensaje de éxito */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 0' }}>
        {/* Podría ir aquí un loader global si isProcessing es true y aún no hay contenido */}
      </div>
      <div style={{ width: '100%', padding: 5, background: 'white', overflow: 'hidden', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, display: 'inline-flex' }}>
        {/* Icono de Tilde Verde */}
        <svg width="64" height="40" viewBox="0 0 64 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="31.5" r="31" fill="#12BA12" />
          <path d={TICKET_ICON_TICK} stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* Mensaje de Éxito */}
        <div style={{ textAlign: 'center', color: '#31572C', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '50', lineHeight: 'normal', wordWrap: 'break-word' }}>
          Inscripción finalizada con éxito!
        </div>
        {/* Mensaje de Error Condicional */}
        {error && !isProcessing && (
          <div style={{ color: 'red', fontSize: 14, marginTop: 10, padding: '5px 10px', border: '1px solid red', borderRadius: '4px', background: '#ffeeee' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, textAlign: 'center', width: '100%' }}>
        {/* Card Blanca con Sombra */}
        <div style={{ width: 'clamp(300px, 80vw, 768px)', padding: 20, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>

          {/* Título del Detalle */}
          <div style={{ paddingBottom: 15, borderBottom: '1px solid #eee', width: '100%', marginBottom: 20 }}>
            <div style={{ color: 'black', fontSize: 24, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>
              Detalle de inscripción
            </div>
          </div>

          {/* Sección de Detalles Generales (Actividad, Fecha, Visitantes, Hora) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiList size={20} color="black" />
                <span style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400' }}>Actividad:</span>
              </div>
              <span style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '500' }}>{actividadNombre}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400' }}>Fecha:</span>
              </div>
              <span style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '500' }}>{fechaFormateadaUI}</span>
            </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiUser size={20} color="black" />
                <span style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400' }}>Visitantes:</span>
              </div>
              <span style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '500' }}>{cantidad}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400' }}>Hora:</span>
              </div>
              <span style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '500' }}>{hora || 'No especificada'}</span>
            </div>
          </div>

          {/* Sección de Lista de Participantes */}
          <div style={{ width: '100%', paddingTop: 15, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', width: '100%', justifyContent: 'center', marginBottom: 10 }}>
              <FiUser size={18} color="black" />
              <div style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '600' }}>
                Participantes Registrados:
              </div>
            </div>
            {/* Lista de participantes */}
            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: '0', width: 'fit-content', maxWidth: '90%', textAlign: 'center' }}>
              {participantes && participantes.length > 0 ? (
                participantes.map((participante, index) => (
                  <li key={index} style={{ color: 'black', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word', marginBottom: '5px' }}>
                    {participante.nombre}
                    {/* Muestra el DNI formateado si existe */}
                    {participante.dni && (
                      <span style={{ color: 'gray', marginLeft: 10, fontSize: '0.9em' }}>
                        {formatDNI(participante.dni)}
                      </span>
                    )}
                    {/* Puedes descomentar esto para mostrar edad y talle si es necesario */}
                    {/*
                    {participante.fechaNacimiento && <span style={{ color: 'darkblue', marginLeft: 10, fontSize: '0.9em' }}> (Edad: {calcularEdad(participante.fechaNacimiento)})</span>}
                    {participante.talle && <span style={{ color: 'green', marginLeft: 10, fontSize: '0.9em' }}> (Talle: {participante.talle.toUpperCase()})</span>}
                    */}
                  </li>
                ))
              ) : (
                // Mensaje si no se cargaron participantes pero se indicó una cantidad > 0
                Number(cantidad) > 0 && (
                  <li style={{ color: 'gray', marginTop: 10, fontStyle: 'italic' }}>
                    No se ingresaron detalles individuales de los visitantes.
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Sección Código de Inscripción y QR */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee', width: '100%' }}>
            {/* Muestra el ID de inscripción obtenido de la API */}
            <div style={{ color: '#31572C', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400' }}>
              Código de inscripción: <span style={{ fontWeight: '600' }}>{inscripcionId ?? '---'}</span>
            </div>
            <div style={{ color: '#31572C', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400' }}>
              Presente este QR al inicio de la actividad:
            </div>
            {/* Contenedor del QR Code */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, height: `${QR_CODE_SIZE}px`, width: `${QR_CODE_SIZE}px` }}>
              {/* Renderiza el QR solo si tenemos un ID y la URL está generada */}
              {inscripcionId && backendInscripcionUrl ? (
                <QRCodeReact.QRCodeSVG
                  value={backendInscripcionUrl} // La URL a codificar
                  size={QR_CODE_SIZE}            // Tamaño definido en constantes
                  level={QR_CODE_LEVEL}          // Nivel de corrección definido
                  includeMargin={false}          // Sin margen blanco adicional
                />
              ) : (
                // Muestra un placeholder mientras se genera o si hubo error
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', border: '1px dashed #ccc', background: '#f9f9f9' }}>
                  <p style={{ margin: 0, color: 'gray', fontSize: '14px' }}>
                    {isProcessing ? 'Generando QR...' : 'QR no disponible'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botón para Volver al Inicio del Flujo */}
          <button
            onClick={() => navigate('/paso1')}
            style={{
              padding: '10px 20px', // Aumentado padding para mejor click
              background: '#90A955',
              borderRadius: 12,
              color: 'white',
              fontSize: 16,
              fontFamily: 'Montserrat',
              fontWeight: '500', // Ligeramente más bold
              border: 'none',
              cursor: 'pointer',
              marginTop: 40, // Más espacio arriba
              transition: 'background-color 0.2s ease', // Efecto hover suave
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7a8e48'} // Oscurecer en hover
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#90A955'}  // Restaurar color original
          >
            Inscribirse a otra actividad
          </button>

        </div>
      </main>
    </div>
  );
};

export default InscripcionFinalizada;