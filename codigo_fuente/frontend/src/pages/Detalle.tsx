import React, { useState } from 'react';
import Stepper from '../components/Stepper';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { FiList, FiUser } from 'react-icons/fi';
import { useData } from '../hooks/DataContext';
import styles from '../styles/Detalle.module.css';

const Detalle = () => {
  const navigate = useNavigate();
  const { cantidad, actividad, fecha, hora, participantes, findActividadNombre } = useData();

  const actividadNombre = findActividadNombre(actividad);

  const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);
  const [isModalCancelarOpen, setIsModalCancelarOpen] = useState(false);
  const [terminosAceptados, setTerminosAceptados] = useState(false);

  const handleStepClick = (step: number) => {
    if (step === 1) {
      navigate('/paso1', { state: { desde: true } });
    }
  
    if (step === 2) {
      // Recuperar los datos guardados en el contexto y volver al paso 2
      navigate('/paso2', { state: { desde: true } });
    }
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
    <div className={styles.container}>
      <Navbar />
      <div className={styles.stepperContainer}>
        <div className={styles.stepperWrapper}>
          <Stepper currentStep={3} onStepClick={handleStepClick} />
        </div>
      </div>
      <main className={styles.main}>
        <div className={styles.detailCard}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>Detalle de inscripción</div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <FiList size={20} color="black" />
              <div className={styles.infoText}>Actividad: {actividadNombre}</div>
            </div>
            <div className={styles.infoItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div className={styles.infoText}>Fecha: {fecha ? new Date(fecha + 'T12:00:00').toLocaleDateString() : 'No especificada'}</div>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <FiUser size={20} color="black" />
              <div className={styles.infoText}>Visitantes: {cantidad}</div>
            </div>
            <div className={styles.infoItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div className={styles.infoText}>Hora: {hora || 'No especificada'}</div>
            </div>
          </div>

          {/* Datos de los visitantes */}
          <div className={styles.participantsSection}>
            <div className={styles.participantsTitle}>
              <FiUser size={18} color="black" />
              <div className={styles.participantsText}>Participantes:</div>
            </div>

            <ul className="list-disc pl-5 my-2 w-fit">
              {participantes.map((participante, index) => (
                <li key={index} className="text-black text-base font-normal font-montserrat break-words mb-4">
                  {participante.nombre && (
                    <span className="text-black-500 mb-1" style={{ marginRight: '10px' }}>
                      <strong>Nombre:</strong> {participante.nombre}
                    </span>
                  )}
                  {participante.dni && (
                    <span className="text-black-500 mb-1" style={{ marginRight: '10px' }}>
                      <strong>DNI:</strong> {participante.dni}
                    </span>
                  )}

                  {actividad === 1 && (
                    <>
                      {participante?.tallaArnes && (
                        <span className="text-black-500 mb-1" style={{ marginRight: '10px' }}>
                          <strong>Arnés:</strong> {participante.tallaArnes}
                        </span>
                      )}
                      {participante?.tallaGuantes && (
                        <span className="text-black-500 mb-1" style={{ marginRight: '10px' }}>
                          <strong>Guantes:</strong> {participante.tallaGuantes}
                        </span>
                      )}
                    </>
                  )}

                  {actividad === 2 && participante.tallaCalzado && (
                    <span className="text-black-500 mb-1" style={{ marginRight: '10px' }}>
                      <strong>Calzado:</strong> {participante.tallaCalzado}
                    </span>
                  )}

                  {actividad === 4 && participante.tallaConjunto && (
                    <span className="text-black-500 block mb-1">
                      <strong>Conjunto:</strong> {participante.tallaConjunto}
                    </span>
                  )}
                </li>
              ))}

              {participantes.length === 0 && Number(cantidad) > 0 && (
                <li className="text-black-500 mt-2 list-none ml-0">
                  No se ingresaron detalles de los visitantes.
                </li>
              )}
            </ul>
          </div>

          {/* Checkbox de Términos y Condiciones */}
          <div className={styles.termsAndConditions}>
            <input
              type="checkbox"
              id="terminos"
              checked={terminosAceptados}
              onChange={handleTerminosChange}
              className={styles.termsCheckbox}
            />
            <label htmlFor="terminos" className={styles.termsLabel}>
              Acepto los <a href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>términos y condiciones</a>
            </label>
          </div>

          <div className={styles.buttonContainer}>
            <button onClick={openModalCancelar} className={styles.cancelButton}>
              Cancelar
            </button>
            <button
              onClick={openModalFinalizar}
              disabled={!terminosAceptados}
              className={terminosAceptados ? styles.finalizeButton : styles.finalizeButtonDisabled}
            >
              Finalizar Inscripción
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Finalizar */}
      {isModalFinalizarOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#D91600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.modalIcon}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div className={styles.modalTitle}>¿Está seguro que desea finalizar la inscripción?</div>
            <div className={styles.modalSubtitle}>No se podrán efectuar mas cambios</div>
            <div className={styles.modalButtons}>
              <button onClick={closeModalFinalizar} className={styles.modalCancelButton}>
                Cancelar
              </button>
              <button onClick={handleConfirmFinalizar} className={styles.modalAcceptButton}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelar */}
      {isModalCancelarOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#D91600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.modalIcon}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div className={styles.modalTitle}>¿Está seguro que desea cancelar la inscripción?</div>
            <div className={styles.modalSubtitle}>No se guardarán los cambios</div>
            <div className={styles.modalButtons}>
              <button onClick={closeModalCancelar} className={styles.modalCancelButton}>
                Cancelar
              </button>
              <button onClick={handleConfirmCancelar} className={styles.modalAcceptButton}>
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