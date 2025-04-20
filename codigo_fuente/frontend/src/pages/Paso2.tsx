import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useData } from '../hooks/DataContext';

interface FormData {
  participantes: { nombre: string; dni: string }[];
}

const Paso2 = () => {
  const navigate = useNavigate();
  const { cantidad, setParticipantes } = useData();

  const { handleSubmit, register, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      participantes: Array.from({ length: Number(cantidad) || 0 }, () => ({ nombre: '', dni: '' })),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participantes',
  });

  useEffect(() => {
    const current = fields.length;
    const target = Number(cantidad) || 0;
    if (target > current) {
      for (let i = current; i < target; i++) {
        append({ nombre: '', dni: '' });
      }
    } else if (target < current) {
      for (let i = current; i > target; i--) {
        remove(i - 1);
      }
    } else if (target > 0 && current === 0) {
      for (let i = 0; i < target; i++) {
        append({ nombre: '', dni: '' });
      }
    }
  }, [cantidad, append, remove, fields.length]);

  const handleStepClick = (step: number) => {
    if (step === 1) navigate('/paso1');
  };

  const onSubmit = (data: FormData) => {
    setParticipantes(data.participantes);
    navigate('/detalle');
  };

  // Estilos (manteniendo los que proporcionaste)
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

  const titleStyle = {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 18,
    color: '#90A955',
    textAlign: 'center' as const,
  };

  const participantContainerStyle = {
    marginBottom: 20,
    padding: 15,
    border: '1px solid #eee',
    borderRadius: 8,
  };

  const participantTitleStyle = {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 10,
    color: '#333',
  };

  const rowStyle = {
    display: 'flex',
    gap: 20,
    width: '100%',
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

  const inputStyle = {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontFamily: 'Montserrat',
    fontSize: 16,
    boxSizing: 'border-box' as const,
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

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={stepperContainerStyle}>
        <div style={{ width: 'fit-content' }}>
          <Stepper currentStep={2} onStepClick={handleStepClick} />
        </div>
      </div>
      <main style={mainStyle}>
        <div style={cardStyle}>
          <h2 style={titleStyle}>Ingrese los datos de los participantes</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <div key={field.id} style={participantContainerStyle}>
                <h3 style={participantTitleStyle}>{`Participante ${index + 1}`}</h3>
                <div style={rowStyle}>
                  <div style={fieldContainerStyle}>
                    <label htmlFor={`nombre-${index}`} style={labelStyle}>Nombre</label>
                    <input
                      type="text"
                      {...register(`participantes.${index}.nombre`, { // <--- Las reglas van en un objeto como segundo argumento
                        required: 'El nombre es obligatorio',
                      })}
                      id={`nombre-${index}`}
                      style={{ ...inputStyle, borderColor: errors.participantes?.[index]?.nombre ? 'red' : '#ccc' }}
                    />
                    {errors.participantes?.[index]?.nombre && <p style={errorStyle}>{errors.participantes[index].nombre.message}</p>}
                  </div>

                  <div style={fieldContainerStyle}>
                    <label htmlFor={`dni-${index}`} style={labelStyle}>DNI</label>
                    <input
                      type="text"
                      {...register(`participantes.${index}.dni`, { // <--- Las reglas van en un objeto como segundo argumento
                        required: 'El DNI es obligatorio',
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Solo se permiten números',
                        },
                        minLength: {
                          value: 8,
                          message: 'El DNI debe tener al menos 8 dígitos',
                        },
                      })}
                      id={`dni-${index}`}
                      style={{ ...inputStyle, borderColor: errors.participantes?.[index]?.dni ? 'red' : '#ccc' }}
                    />
                    {errors.participantes?.[index]?.dni && <p style={errorStyle}>{errors.participantes[index].dni.message}</p>}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
              <button onClick={() => navigate(-1)} style={buttonBackStyle}>Volver</button>
              <button type="submit" style={buttonNextStyle}>Siguiente</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Paso2;