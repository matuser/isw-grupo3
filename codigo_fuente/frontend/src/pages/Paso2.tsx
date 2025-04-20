import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useData } from '../hooks/DataContext';

interface Participante {
  nombre: string;
  dni: string;
  fechaNacimiento: string;
  talle: 's' | 'm' | 'l' | 'xl' | 'xxl';
}

interface FormData {
  participantes: Participante[];
}

const Paso2 = () => {
  const navigate = useNavigate();
  const { cantidad, setParticipantes } = useData();

  const { handleSubmit, register, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      participantes: Array.from({ length: Number(cantidad) || 0 }, () => ({ nombre: '', dni: '', fechaNacimiento: '', talle: 's' })),
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
        append({ nombre: '', dni: '', fechaNacimiento: '', talle: 's' });
      }
    } else if (target < current) {
      for (let i = current; i > target; i--) {
        remove(i - 1);
      }
    } else if (target > 0 && current === 0) {
      for (let i = 0; i < target; i++) {
        append({ nombre: '', dni: '', fechaNacimiento: '', talle: 's' });
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

  const commonInputStyle = {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontFamily: 'Montserrat',
    fontSize: 16,
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    fontFamily: 'Montserrat',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'left' as const,
  };

  const errorStyle = {
    color: 'red',
    fontSize: 12,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white', alignItems: 'center' }}>
      <Navbar />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
        <Stepper currentStep={2} onStepClick={handleStepClick} />
      </div>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, width: '100%' }}>
        <div style={{ width: 'clamp(300px, 80vw, 768px)', padding: 20, background: 'white', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 400, fontSize: 18, color: '#90A955', textAlign: 'center' }}>Ingrese los datos de los participantes</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <div key={field.id} style={{ marginBottom: 20, padding: 15, border: '1px solid #eee', borderRadius: 8 }}>
                <h3 style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 500, marginBottom: 10, color: '#333' }}>{`Participante ${index + 1}`}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={labelStyle}>Nombre</label>
                    <input
                      type="text"
                      {...register(`participantes.${index}.nombre`, { required: 'El nombre es obligatorio' })}
                      style={{ ...commonInputStyle, borderColor: errors.participantes?.[index]?.nombre ? 'red' : '#ccc' }}
                    />
                    {errors.participantes?.[index]?.nombre && <p style={errorStyle}>{errors.participantes[index].nombre.message}</p>}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={labelStyle}>DNI</label>
                    <input
                      type="text"
                      {...register(`participantes.${index}.dni`, {
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
                      style={{ ...commonInputStyle, borderColor: errors.participantes?.[index]?.dni ? 'red' : '#ccc' }}
                    />
                    {errors.participantes?.[index]?.dni && <p style={errorStyle}>{errors.participantes[index].dni.message}</p>}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={labelStyle}>Fecha de nacimiento</label>
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
                      style={{ ...commonInputStyle, borderColor: errors.participantes?.[index]?.fechaNacimiento ? 'red' : '#ccc' }}
                    />
                    {errors.participantes?.[index]?.fechaNacimiento && <p style={errorStyle}>{errors.participantes[index].fechaNacimiento.message}</p>}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={labelStyle}>Talle</label>
                    <select
                      {...register(`participantes.${index}.talle`, { required: 'Campo obligatorio' })}
                      style={{ ...commonInputStyle, borderColor: errors.participantes?.[index]?.talle ? 'red' : '#ccc' }}
                    >
                      <option value="">Seleccionar talle</option>
                      <option value="s">S</option>
                      <option value="m">M</option>
                      <option value="l">L</option>
                      <option value="xl">XL</option>
                      <option value="xxl">XXL</option>
                    </select>
                    {errors.participantes?.[index]?.talle && <p style={errorStyle}>{errors.participantes[index].talle.message}</p>}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
              <button onClick={() => navigate(-1)} type="button" style={{ padding: '6px 16px', backgroundColor: '#90A955', color: 'black', fontFamily: 'Montserrat', fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Volver</button>
              <button type="submit" style={{ padding: '6px 16px', backgroundColor: '#ccc', color: 'white', fontFamily: 'Montserrat', fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Siguiente</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Paso2;