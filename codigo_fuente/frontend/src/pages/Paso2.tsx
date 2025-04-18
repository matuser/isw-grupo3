import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Stepper from '../components/Stepper';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';

type Participante = {
  nombre: string;
  dni: string;
  fechaNacimiento: string;
  talle: 's' | 'm' | 'l' | 'xl' | 'xxl';
};

type FormData = {
  participantes: Participante[];
};

const Paso2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cantidad: number = location.state?.cantidad || 1;

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      participantes: Array.from({ length: cantidad }, () => ({
        nombre: '',
        dni: '',
        fechaNacimiento: '',
        talle: 's',
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participantes',
  });

  useEffect(() => {
    const current = fields.length;
    if (cantidad > current) {
      for (let i = current; i < cantidad; i++) {
        append({ nombre: '', dni: '', fechaNacimiento: '', talle: 's' });
      }
    } else if (cantidad < current) {
      for (let i = current; i > cantidad; i--) {
        remove(i - 1);
      }
    }
  }, [cantidad, append, remove, fields.length]);

  const onSubmit = (data: FormData) => {
    console.log('Datos enviados:', data);
    navigate('/detalle', { state: { participantes: data.participantes } });
  };

  const handleStepClick = (step: number) => {
    if (step === 1) navigate('/');
    if (step === 3) navigate('/detalle');
  };

  const commonInputStyle = {
    width: '100%',
    padding: 8,
    borderRadius: 8,
    border: '1px solid gray',
    boxSizing: 'border-box' as const,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
      }}
    >
      <Navbar />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '24px 0',
        }}
      >
        <Stepper currentStep={2} onStepClick={handleStepClick} />
      </div>
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 24,
          width: '100%',
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: 'clamp(300px, 80vw, 768px)',
            padding: 20,
            background: 'white',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <h2
            style={{
              fontFamily: 'Montserrat',
              fontSize: 24,
              textAlign: 'center',
            }}
          >
            Inscripción de participantes
          </h2>
          <p style={{ textAlign: 'center' }}>
            Complete los siguientes datos para avanzar en su inscripción
          </p>

          {fields.map((field, index) => (
            <div
              key={field.id}
              style={{
                padding: 16,
                border: '1px solid #ccc',
                borderRadius: 8,
                marginTop: 16,
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Montserrat',
                  marginBottom: 12,
                }}
              >
                Datos participante {index + 1}:
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '16px',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label style={{ marginBottom: 4 }}>Nombre y apellido</label>
                  <input
                    type="text"
                    placeholder="Ingrese su nombre"
                    {...register(`participantes.${index}.nombre`, {
                      required: 'Campo obligatorio',
                    })}
                    style={commonInputStyle}
                  />
                  {errors.participantes?.[index]?.nombre && (
                    <p style={{ color: 'red', marginTop: 4 }}>
                      {errors.participantes[index]?.nombre?.message}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label style={{ marginBottom: 4 }}>DNI</label>
                  <input
                    type="text"
                    placeholder="Ingrese su DNI"
                    {...register(`participantes.${index}.dni`, {
                      required: 'Campo obligatorio',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Solo se permiten números',
                      },
                      minLength: {
                        value: 8,
                        message: 'El DNI debe tener al menos 8 dígitos',
                      },
                    })}
                    style={commonInputStyle}
                  />
                  {errors.participantes?.[index]?.dni && (
                    <p style={{ color: 'red', marginTop: 4 }}>
                      {errors.participantes[index]?.dni?.message}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label style={{ marginBottom: 4 }}>Fecha de nacimiento</label>
                  <input
                    type="date"
                    {...register(`participantes.${index}.fechaNacimiento`, {
                      required: 'Campo obligatorio',
                      validate: (value) => {
                        const fechaIngresada = new Date(value);
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);
                        return fechaIngresada <= hoy || 'La fecha no puede ser futura';
                      },
                    })}
                    style={commonInputStyle}
                  />
                  {errors.participantes?.[index]?.fechaNacimiento && (
                    <p style={{ color: 'red', marginTop: 4 }}>
                      {errors.participantes[index]?.fechaNacimiento?.message}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <label style={{ marginBottom: 4 }}>Talle de vestimenta</label>
                  <select
                    {...register(`participantes.${index}.talle`, {
                      required: 'Campo obligatorio',
                    })}
                    style={commonInputStyle}
                  >
                    <option value="">Seleccionar talle</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                    <option value="xxl">XXL</option>
                  </select>
                  {errors.participantes?.[index]?.talle && (
                    <p style={{ color: 'red', marginTop: 4 }}>
                      {errors.participantes[index]?.talle?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Botones Volver y Siguiente */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => navigate('/paso1')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ccc',
                color: '#333',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'Montserrat',
              }}
            >
              Volver
            </button>

            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#009ADA',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'Montserrat',
              }}
            >
              Siguiente
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Paso2;