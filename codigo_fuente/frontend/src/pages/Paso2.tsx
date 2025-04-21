import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, FieldErrors, useWatch } from 'react-hook-form';
import { useData } from '../hooks/DataContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Participante {
    nombre: string;
    dni: string;
    fechaNacimiento: string;
    tallaArnes?: string;
    tallaGuantes?: string;
    tallaCalzado?: string;
    tallaConjunto?: string;
  }

interface FormData {
    participantes: Participante[];
}

const Paso2 = () => {
    const navigate = useNavigate();
    const { cantidad, actividad, setParticipantes } = useData();
    const cantidadParticipantes = Number(cantidad) || 0;
    const actividadSeleccionada = Number(actividad);
    const [actividadNombre, setActividadNombre] = useState('');
    const [mensajeEquipamiento, setMensajeEquipamiento] = useState('');

    console.log("Actividad seleccionada en Paso 2:", actividadSeleccionada); // ➡️ Para depuración


    const generateParticipantes = (cantidad: number, actividadId: number) => {
        const baseData = {
            nombre: '',
            dni: '',
            fechaNacimiento: '',
        };
    
        switch (actividadId) {
            case 1:
                Object.assign(baseData, { tallaArnes: '', tallaGuantes: '' });
                break;
            case 2:
                Object.assign(baseData, { tallaCalzado: '' });
                break;
            case 4:
                Object.assign(baseData, { tallaConjunto: '' });
                break;
            default:
                break;
        }
    
        return Array.from({ length: cantidad }, () => ({ ...baseData }));
    };
    

    const {
        handleSubmit,
        register,
        control,
        formState: { errors, isValid },
    } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            participantes: generateParticipantes(cantidadParticipantes, actividadSeleccionada),
        },
    
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'participantes',
    });


    useEffect(() => {
        const current = fields.length;
        const target = cantidadParticipantes;
    
        if (target > current) {
            for (let i = current; i < target; i++) {
                const baseData: any = {
                    nombre: '',
                    dni: '',
                    fechaNacimiento: '',
                };
    
                if (actividadSeleccionada === 1) {
                    Object.assign(baseData, { tallaArnes: '', tallaGuantes: '' });
                }
                if (actividadSeleccionada === 2) {
                    Object.assign(baseData, { tallaCalzado: '' });
                }
                if (actividadSeleccionada === 4) {
                    Object.assign(baseData, { tallaConjunto: '' });
                }
    
                append(baseData);
            }
        } else if (target < current) {
            for (let i = current; i > target; i--) {
                remove(i - 1);
            }
        }
    }, [cantidadParticipantes, append, remove, fields.length, actividadSeleccionada]);
    

    useEffect(() => {
      switch (actividadSeleccionada) {
          case 1:
              setActividadNombre('Tirolesa');
              setMensajeEquipamiento('Esta actividad requiere Arnés y guantes. Por favor, indique la talla adecuada para cada participante.');
              break;
          case 2:
              setActividadNombre('Palestra');
              setMensajeEquipamiento('Esta actividad requiere calzado de escalada. Por favor, indique la talla adecuada para cada participante.');
              break;
          case 3:
              setActividadNombre('Safari');
              setMensajeEquipamiento('Para esta actividad se recomienda vestimenta cómoda y calzado cerrado.');
              break;
          case 4:
              setActividadNombre('Jardinería');
              setMensajeEquipamiento('Para esta actividad se recomienda vestimenta cómoda que pueda ensuciarse y calzado cerrado.');
              break;
          default:
              setActividadNombre('');
              setMensajeEquipamiento('');
              break;
      }
  }, [actividadSeleccionada]);
    const handleStepClick = (step: number) => {
        if (step === 1) navigate('/paso1');
    };

    const onSubmit = (data: FormData) => {
        setParticipantes(data.participantes);
        navigate('/detalle');
    };

    const onErrors = (errors: FieldErrors<FormData>) => {
        console.log("Errores de validación:", errors);
        toast.error("Debe completar todos los datos de los participantes!");
    };

    const renderTallaInput = (index: number) => {
        console.log(`Renderizando input de talla para participante ${index + 1}, actividad:`, actividadSeleccionada); // ➡️ Para depuración
        switch (actividadSeleccionada) {
            case 1: // Tirolesa (ID: 1)
                return (
                    <>
                        <div style={fieldWrapperStyle}>
                            <label htmlFor={`participantes.${index}.tallaArnes`} style={labelStyle}>Talla Arnés</label>
                            <select
                                id={`participantes.${index}.tallaArnes`}
                                {...register(`participantes.${index}.tallaArnes`, { required: 'Campo obligatorio' })}
                                style={{ ...commonInputStyle, borderColor: errors.participantes?.[index]?.tallaArnes ? 'red' : '#ccc' }}
                            >
                                <option value="">Seleccione...</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                            {errors.participantes?.[index]?.tallaArnes && <p style={errorStyle}>{errors.participantes[index].tallaArnes.message}</p>}
                        </div>
                        <div style={fieldWrapperStyle}>
                            <label htmlFor={`participantes.${index}.tallaGuantes`} style={labelStyle}>Talla Guantes</label>
                            <select
                                id={`participantes.${index}.tallaGuantes`}
                                {...register(`participantes.${index}.tallaGuantes`, { required: 'Campo obligatorio' })}
                                style={{ ...commonInputStyle, borderColor: errors.participantes?.[index]?.tallaGuantes ? 'red' : '#ccc' }}
                            >
                                <option value="">Seleccione...</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                            {errors.participantes?.[index]?.tallaGuantes && <p style={errorStyle}>{errors.participantes[index].tallaGuantes.message}</p>}
                        </div>
                    </>
                );
            case 2: // Palestra (ID: 2)
                return (
                    <div style={fieldWrapperStyle}>
                        <label htmlFor={`participantes.${index}.tallaCalzado`} style={labelStyle}>Talla Calzado Especial</label>
                        <select
                            id={`participantes.${index}.tallaCalzado`}
                            {...register(`participantes.${index}.tallaCalzado`, { required: 'La talla de calzado es obligatoria' })}
                            style={{ ...commonInputStyle, borderColor: errors.participantes?.[index]?.tallaCalzado ? 'red' : '#ccc' }}
                        >
                            <option value="">Seleccione...</option>
                            {Array.from({ length: 10 }, (_, i) => 35 + i).map((talla) => (
                                <option key={talla} value={talla}>{talla}</option>
                            ))}
                        </select>
                        {errors.participantes?.[index]?.tallaCalzado && <p style={errorStyle}>{errors.participantes[index].tallaCalzado.message}</p>}
                    </div>
                );
            case 4: // Jardinería (ID: 4)
                return (
                    <div style={fieldWrapperStyle}>
                        <label htmlFor={`participantes.${index}.tallaConjunto`} style={labelStyle}>Talla Conjunto Jardinero</label>
                        <select
                            id={`participantes.${index}.tallaConjunto`}
                            {...register(`participantes.${index}.tallaConjunto`, { required: 'Campo obligatorio' })}
                            style={{ ...commonInputStyle, borderColor: errors.participantes?.[index]?.tallaConjunto ? 'red' : '#ccc' }}
                        >
                            <option value="">Seleccione...</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                        {errors.participantes?.[index]?.tallaConjunto && <p style={errorStyle}>{errors.participantes[index].tallaConjunto.message}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    // --- ESTILOS ---
    const commonInputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: 5,
        border: '1px solid #ccc',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 14,
        boxSizing: 'border-box' as const,
        height: 'auto',
        backgroundColor: 'white',
        color: '#333',
    };

    const infoBoxStyle = {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '10px 15px',
      borderRadius: 5,
      marginBottom: 5,
      border: '1px solid #c3e6cb',
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 14,
      textAlign: 'center',
  };

    const labelStyle = {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 14,
        marginBottom: 5,
        textAlign: 'left' as const,
        display: 'block',
        color: '#555',
        fontWeight: 'normal',
    };

    const errorStyle = {
        color: 'red',
        fontSize: 12,
        marginTop: '2px',
    };

    const fieldWrapperStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        flexBasis: 'calc(50% - 10px)',
        flexGrow: 1,
    };

    const rowStyle = {
        display: 'flex',
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: '20px',
        marginBottom: '10px',
    };

    const participantGroupStyle = {
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    };

    const participantTitleStyle = {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
        textAlign: 'left' as const,
    };

    const mainContainerStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 4,
        width: '100%',
        backgroundColor: '#fff',
    };

    const formContainerStyle = {
        width: 'clamp(300px, 80vw, 768px)',
        padding: 20,
        background: 'white',
        boxShadow: '0px 2px 4px rgb(255, 255, 255)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 15,
    };

    const mainTitleStyle = {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '400',
        fontSize: 24,
        color: '#3d405b',
        textAlign: 'center',
        marginBottom: 5,
    };

    const subTitleStyle = {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '400',
        fontSize: 16,
        color: '#90A955',
        textAlign: 'center',
        marginBottom: 10,
    };

    const buttonBaseStyle = {
        padding: '8px 15px',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 14,
        fontWeight: 'bold',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer',
        transition: 'opacity 0.3s ease',
    };

    const buttonVolverStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#90A955',
        color: 'white',
    };

    const buttonSiguienteStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#31572C',
        color: 'white',
    };

    const buttonSiguienteDisabledStyle = {
        ...buttonSiguienteStyle,
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
        opacity: 0.6,
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', alignItems: 'center' }}>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Navbar />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '15px 0' }}>
            <Stepper currentStep={2} onStepClick={handleStepClick} Step2Color="#90A955" />
          </div>
          <main style={mainContainerStyle as React.CSSProperties}>
            <div style={formContainerStyle as React.CSSProperties}>
              <h2 style={mainTitleStyle as React.CSSProperties}>Inscripción de participantes</h2>
              <p style={subTitleStyle as React.CSSProperties}>Complete los siguientes datos para avanzar en su inscripción</p>
              {mensajeEquipamiento && <div style={infoBoxStyle as React.CSSProperties}>{mensajeEquipamiento}</div>}
              <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                {fields.map((field, index) => (
                  <div key={field.id} style={participantGroupStyle}>
                    <h3 style={participantTitleStyle}>{`Datos participante ${index + 1}:`}</h3>
                    <div style={rowStyle}>
                      <div style={fieldWrapperStyle}>
                        <label htmlFor={`participantes.${index}.nombre`} style={labelStyle}>Nombre y apellido</label>
                        <input
                          id={`participantes.${index}.nombre`}
                          type="text"
                          placeholder="Ingrese su nombre"
                          {...register(`participantes.${index}.nombre`, {
                            required: 'El nombre es obligatorio',
                            pattern: { value: /^[A-Za-z\s]+$/i, message: 'Solo se permiten letras' },
                            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
                          })}
                          style={{
                            ...commonInputStyle,
                            borderColor: errors?.participantes?.[index]?.nombre ? 'red' : '#ccc',
                          }}
                        />
                        {errors?.participantes?.[index]?.nombre?.message && (
                          <p style={errorStyle}>{errors.participantes[index].nombre.message}</p>
                        )}
                      </div>
                      <div style={fieldWrapperStyle}>
                        <label htmlFor={`participantes.${index}.dni`} style={labelStyle}>Dni</label>
                        <input
                          id={`participantes.${index}.dni`}
                          type="text"
                          placeholder="Ingrese su dni (sin puntos)"
                          {...register(`participantes.${index}.dni`, {
                            required: 'El DNI es obligatorio',
                            pattern: { value: /^[0-9]+$/, message: 'Solo se permiten números' },
                            minLength: { value: 8, message: 'El DNI debe tener al menos 8 dígitos' },
                            validate: (value) => {
                              const dnis = control._formValues.participantes?.map((p: Participante) => p.dni);
                              const duplicados = dnis.filter((dni: string) => dni === value);
                              return duplicados.length <= 1 || 'Este DNI ya fue ingresado para otro participante';
                            },
                          })}
                          style={{ ...commonInputStyle, borderColor: errors?.participantes?.[index]?.dni ? 'red' : '#ccc' }}
                        />
                        {errors?.participantes?.[index]?.dni?.message && (
                          <p style={errorStyle}>{errors.participantes[index].dni.message}</p>
                        )}
                      </div>
                    </div>
      
                    <div style={rowStyle}>
                      <div style={fieldWrapperStyle}>
                        <label htmlFor={`participantes.${index}.fechaNacimiento`} style={labelStyle}>Fecha de nacimiento</label>
                        <input
                          id={`participantes.${index}.fechaNacimiento`}
                          type="date"
                          {...register(`participantes.${index}.fechaNacimiento`, {
                            required: 'Campo obligatorio',
                            validate: (value) => {
                              const fecha = new Date(value);
                              const edad = new Date().getFullYear() - fecha.getFullYear();
                              return edad >= 5 || 'El participante debe ser tener al menos 5 años de edad';
                            },
                          })}
                          style={{ ...commonInputStyle, borderColor: errors?.participantes?.[index]?.fechaNacimiento ? 'red' : '#ccc' }}
                        />
                        {errors?.participantes?.[index]?.fechaNacimiento?.message && (
                          <p style={errorStyle}>{errors.participantes[index].fechaNacimiento.message}</p>
                        )}
                      </div>
                      {renderTallaInput(index)}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                  <button onClick={() => navigate('/paso1', { state: { desde: true } })} type="button" style={buttonVolverStyle}>
                    Volver
                  </button>
                  <button
                    type="submit"
                    style={!isValid ? buttonSiguienteDisabledStyle : buttonSiguienteStyle}
                    disabled={!isValid}
                  >
                    Siguiente
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      );
}

export default Paso2;