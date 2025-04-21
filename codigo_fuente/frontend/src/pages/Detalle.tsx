import React, { useState } from 'react';
import Stepper from '../components/Stepper';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { FiList, FiUser } from 'react-icons/fi';
import { useData } from '../hooks/DataContext';

const Detalle = () => {
  const navigate = useNavigate();
  const { cantidad, actividad, fecha, hora, participantes, findActividadNombre } = useData();

  const actividadNombre = findActividadNombre(actividad);

  const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);
  const [isModalCancelarOpen, setIsModalCancelarOpen] = useState(false);
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const handleStepClick = (step: number) => {
    if (step === 1) navigate('/paso1');
    if (step === 2) navigate('/paso2');
  };

  const openModalFinalizar = () => {
    if (terminosAceptados) {
      setIsModalFinalizarOpen(true);
    } else {
      alert('Debes aceptar los términos y condiciones para finalizar la inscripción.');
    }
  };

  const closeModalFinalizar = () => {
    setIsModalFinalizarOpen(false);
  };

  const handleConfirmFinalizar = () => {
    closeModalFinalizar();
    console.log('Datos a guardar:', {
      cantidad,
      actividad,
      fecha,
      hora,
      participantes,
    });
    navigate('/inscripcion-finalizada');
  };

  const openModalCancelar = () => {
    setIsModalCancelarOpen(true);
  };

  const closeModalCancelar = () => {
    setIsModalCancelarOpen(false);
  };

  const handleConfirmCancelar = () => {
    closeModalCancelar();
    navigate('/');
  };

  const handleTerminosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerminosAceptados(event.target.checked);
  };

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
          <Stepper currentStep={3} onStepClick={handleStepClick} />
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
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <div style={{ paddingBottom: 15 }}>
            <div style={{ color: 'black', fontSize: 24, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>Detalle de inscripción</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiList size={20} color="black" />
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>Actividad: {actividadNombre}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>Fecha: {fecha ? new Date(fecha + 'T12:00:00').toLocaleDateString() : 'No especificada'
              }</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiUser size={20} color="black" />
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>Visitantes: {cantidad}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>Hora: {hora || 'No especificada'}</div>
            </div>
          </div>

          {/* Datos de los visitantes */}
          <div style={{ width: '100%', paddingTop: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', width: '100%', justifyContent: 'center' }}>
              <FiUser size={18} color="black" />
              <div style={{ color: 'black', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>Participantes:</div>
            </div>
            <ul className="list-disc pl-5 my-2 w-fit">
              {participantes.map((participante, index) => (
                <li
                  key={index}
                  className="text-black text-base font-normal font-montserrat break-words"
                >
                  {participante.nombre}
                  {participante.dni && (
                    <span className="text-gray-500 ml-2">{participante.dni}</span>
                  )}

                  {/* Mostrar información del talle según actividad */}
                  {actividad === 1 && (
                    <>
                      {participante?.tallaArnes && (
                        <span className="text-gray-500 ml-2">
                          Arnés: {participante.tallaArnes}
                        </span>
                      )}
                      {participante?.tallaGuantes && (
                        <span className="text-gray-500 ml-2">
                          Guantes: {participante.tallaGuantes}
                        </span>
                      )}
                    </>
                  )}

                  {actividad === 2 && participante.tallaCalzado && (
                    <span className="text-gray-500 ml-2">
                      Calzado: {participante.tallaCalzado}
                    </span>
                  )}

                  {actividad === 4 && participante.tallaConjunto && (
                    <span className="text-gray-500 ml-2">
                      Conjunto: {participante.tallaConjunto}
                    </span>
                  )}
                </li>
              ))}

              {participantes.length === 0 && Number(cantidad) > 0 && (
                <li className="text-gray-500 mt-2 list-none ml-0">
                  No se ingresaron detalles de los visitantes.
                </li>
              )}
            </ul>
          </div>

          {/* Checkbox de Términos y Condiciones */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 50, marginBottom: 70 }}>
            <input
              type="checkbox"
              id="terminos"
              checked={terminosAceptados}
              onChange={handleTerminosChange}
              style={{ marginRight: 8, cursor: 'pointer' }}
            />
            <label htmlFor="terminos" style={{ color: 'black', fontSize: 14, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word', cursor: 'pointer' }}>
              Acepto los <a href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>términos y condiciones</a>
            </label>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: 10,
          }}>
            <button onClick={openModalCancelar} style={{ // Abre el modal de cancelar
              position: 'absolute',
              bottom: 0,
              left: 0,
              padding: '8px 16px',
              background: '#D91600',
              overflow: 'hidden',
              borderRadius: 12,
              color: 'white',
              fontSize: 16,
              fontFamily: 'Montserrat',
              fontWeight: '400',
              wordWrap: 'break-word',
              border: 'none',
              cursor: 'pointer',
            }}>
              Cancelar
            </button>
            <button
              onClick={openModalFinalizar}
              disabled={!terminosAceptados}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                padding: '8px 16px',
                background: terminosAceptados ? '#90A955' : '#ccc',
                overflow: 'hidden',
                borderRadius: 12,
                color: 'white',
                fontSize: 16,
                fontFamily: 'Montserrat',
                fontWeight: '400',
                wordWrap: 'break-word',
                border: 'none',
                cursor: terminosAceptados ? 'pointer' : 'not-allowed',
              }}
            >
              Finalizar Inscripción
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Finalizar */}
      {isModalFinalizarOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 15,
            textAlign: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#D91600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div style={{ color: '#007bff', fontSize: 18, fontWeight: 'bold' }}>¿Está seguro que desea finalizar la inscripción?</div>
            <div style={{ color: '#007bff', fontSize: 16 }}>No se podrán efectuar mas cambios</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}> {/* Alinear botones a la derecha */}
              <button onClick={closeModalFinalizar} style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}>
                Cancelar
              </button>
              <button onClick={handleConfirmFinalizar} style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelar */}
      {isModalCancelarOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 15,
            textAlign: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#D91600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div style={{ color: '#007bff', fontSize: 18, fontWeight: 'bold' }}>¿Está seguro que desea cancelar la inscripción?</div>
            <div style={{ color: '#007bff', fontSize: 16 }}>No se guardarán los cambios</div>
            <div style={{ display: 'flex', gap: 10 }}> {/* Alinear botones a la izquierda */}
              <button onClick={closeModalCancelar} style={{
                backgroundColor: '#D91600',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}>
                Cancelar
              </button>
              <button onClick={handleConfirmCancelar} style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                marginLeft: 'auto', // Empuja el botón a la derecha
              }}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detalle;