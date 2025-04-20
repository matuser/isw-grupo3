import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/DataContext';
import { FiList, FiUser } from 'react-icons/fi';
import * as QRCodeReact from 'qrcode.react';
import Navbar from '../components/Navbar';

const InscripcionFinalizada = () => {
  const navigate = useNavigate();
  const { cantidad, actividad, fecha, hora, participantes, findActividadNombre } = useData(); // Obtenemos la función

  const actividadNombre = findActividadNombre(actividad); // Usamos la función para obtener el nombre

  const [inscripcionId, setInscripcionId] = useState<string | null>(null);

  useEffect(() => {
    // ... (tu lógica para guardar la inscripción y obtener el ID) ...
  }, [actividad, cantidad, fecha, hora, participantes]);

  const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString() : 'No especificada';
  const backendInscripcionUrl = inscripcionId ? `/api/v1/inscripciones/${inscripcionId}` : '';

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
      </div>
      <div style={{width: '100%', padding: 5, background: 'white', overflow: 'hidden', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, display: 'inline-flex'}}>
        {/* Tilde verde */}
        <svg width="64" height="40" viewBox="0 0 64 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="31.5" r="31" fill="#12BA12"/>
            <path d="M20.285 33.626L28.39 41.73L43.714 26.407" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ textAlign: 'center', color: '#31572C', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '50', lineHeight: 'normal', wordWrap: 'break-word'}}>Inscripción finalizada con éxito!</div>
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
              <div style={{ color: 'black', fontSize: 20, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>Fecha: {fechaFormateada}</div>
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
            <ul style={{ listStyleType: 'disc', paddingLeft: 20, margin: '10px 0', width: 'fit-content' }}>
              {participantes.map((participante, index) => (
                <li key={index} style={{ color: 'black', fontSize: 16, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>
                  {participante.nombre}
                  {participante.dni && <span style={{ color: 'gray-500', marginLeft: 10 }}>{participante.dni}</span>}
                </li>
              ))}
              {participantes.length === 0 && Number(cantidad) > 0 && (
                <li style={{ color: 'gray-500', marginTop: 10, listStyleType: 'none', marginLeft: 0 }}>No se ingresaron detalles de los visitantes.</li>
              )}
            </ul>
          </div>

          {/* Código de inscripción y QR */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, marginTop: 20 }}>
            <div style={{ color: '#31572C', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>
              Código de inscripción: <span style={{ fontWeight: '600' }}>358947</span> {/* Aquí podrías mostrar el código real */}
            </div>
            <div style={{ color: '#31572C', fontSize: 18, fontFamily: 'Montserrat', fontWeight: '400', wordWrap: 'break-word' }}>
              Presente este QR al inicio de la actividad:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              {inscripcionId ? (
                <QRCodeReact.QRCodeSVG value={backendInscripcionUrl} size={128} level="H" />
              ) : (
                <p>Generando código QR...</p>
              )}
            </div>
          </div>

          {/* Botón para inscribirse a otra actividad */}
          <button onClick={() => navigate('/paso1')} style={{
            padding: '8px 16px',
            background: '#90A955',
            overflow: 'hidden',
            borderRadius: 12,
            color: 'white',
            fontSize: 16,
            fontFamily: 'Montserrat',
            fontWeight: '400',
            wordWrap: 'break-word',
            border: 'none',
            cursor: 'pointer',
            marginTop: 30,
          }}>
            Inscribirse a otra actividad
          </button>
        </div>
      </main>
    </div>
  );
};

export default InscripcionFinalizada;