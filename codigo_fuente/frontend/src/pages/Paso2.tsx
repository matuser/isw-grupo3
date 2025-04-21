import Navbar from '../components/Navbar';
import Stepper from '../components/Stepper';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { useData } from '../hooks/DataContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/Paso2.module.css';

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
        switch (actividadSeleccionada) {
            case 1: // Tirolesa (ID: 1)
                return (
                    <>
                        <div className={styles.fieldWrapper}>
                            <label htmlFor={`participantes.${index}.tallaArnes`} className={styles.label}>Talla Arnés</label>
                            <select
                                id={`participantes.${index}.tallaArnes`}
                                {...register(`participantes.${index}.tallaArnes`, { required: 'Campo obligatorio' })}
                                className={`${styles.commonInput} ${errors.participantes?.[index]?.tallaArnes ? styles.errorBorder : ''}`}
                            >
                                <option value="">Seleccione...</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                            {errors.participantes?.[index]?.tallaArnes && <p className={styles.error}>{errors.participantes[index].tallaArnes.message}</p>}
                        </div>
                        <div className={styles.fieldWrapper}>
                            <label htmlFor={`participantes.${index}.tallaGuantes`} className={styles.label}>Talla Guantes</label>
                            <select
                                id={`participantes.${index}.tallaGuantes`}
                                {...register(`participantes.${index}.tallaGuantes`, { required: 'Campo obligatorio' })}
                                className={`${styles.commonInput} ${errors.participantes?.[index]?.tallaGuantes ? styles.errorBorder : ''}`}
                            >
                                <option value="">Seleccione...</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                            {errors.participantes?.[index]?.tallaGuantes && <p className={styles.error}>{errors.participantes[index].tallaGuantes.message}</p>}
                        </div>
                    </>
                );
            case 2: // Palestra (ID: 2)
                return (
                    <div className={styles.fieldWrapper}>
                        <label htmlFor={`participantes.${index}.tallaCalzado`} className={styles.label}>Talla Calzado Especial</label>
                        <select
                            id={`participantes.${index}.tallaCalzado`}
                            {...register(`participantes.${index}.tallaCalzado`, { required: 'La talla de calzado es obligatoria' })}
                            className={`${styles.commonInput} ${errors.participantes?.[index]?.tallaCalzado ? styles.errorBorder : ''}`}
                        >
                            <option value="">Seleccione...</option>
                            {Array.from({ length: 10 }, (_, i) => 35 + i).map((talla) => (
                                <option key={talla} value={talla}>{talla}</option>
                            ))}
                        </select>
                        {errors.participantes?.[index]?.tallaCalzado && <p className={styles.error}>{errors.participantes[index].tallaCalzado.message}</p>}
                    </div>
                );
            case 4: // Jardinería (ID: 4)
                return (
                    <div className={styles.fieldWrapper}>
                        <label htmlFor={`participantes.${index}.tallaConjunto`} className={styles.label}>Talla Conjunto Jardinero</label>
                        <select
                            id={`participantes.${index}.tallaConjunto`}
                            {...register(`participantes.${index}.tallaConjunto`, { required: 'Campo obligatorio' })}
                            className={`${styles.commonInput} ${errors.participantes?.[index]?.tallaConjunto ? styles.errorBorder : ''}`}
                        >
                            <option value="">Seleccione...</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                        {errors.participantes?.[index]?.tallaConjunto && <p className={styles.error}>{errors.participantes[index].tallaConjunto.message}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
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
          <div className={styles.stepperContainer}>
            <Stepper currentStep={2} onStepClick={handleStepClick} Step2Color="#90A955" />
          </div>
          <main className={styles.main}>
            <div className={styles.formContainer}>
              <h2 className={styles.mainTitle}>Inscripción de participantes</h2>
              <p className={styles.subTitle}>Complete los siguientes datos para avanzar en su inscripción</p>
              {mensajeEquipamiento && <div className={styles.infoBox}>{mensajeEquipamiento}</div>}
              <form onSubmit={handleSubmit(onSubmit, onErrors)}>
                {fields.map((field, index) => (
                  <div key={field.id} className={styles.participantGroup}>
                    <h3 className={styles.participantTitle}>{`Datos participante ${index + 1}:`}</h3>
                    <div className={styles.row}>
                      <div className={styles.fieldWrapper}>
                        <label htmlFor={`participantes.${index}.nombre`} className={styles.label}>Nombre y apellido</label>
                        <input
                          id={`participantes.${index}.nombre`}
                          type="text"
                          placeholder="Ingrese su nombre"
                          {...register(`participantes.${index}.nombre`, {
                            required: 'El nombre es obligatorio',
                            pattern: { value: /^[A-Za-z\s]+$/i, message: 'Solo se permiten letras' },
                            minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
                          })}
                          className={`${styles.commonInput} ${errors?.participantes?.[index]?.nombre ? styles.errorBorder : ''}`}
                        />
                        {errors?.participantes?.[index]?.nombre?.message && (
                          <p className={styles.error}>{errors.participantes[index].nombre.message}</p>
                        )}
                      </div>
                      <div className={styles.fieldWrapper}>
                        <label htmlFor={`participantes.${index}.dni`} className={styles.label}>Dni</label>
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
                          className={`${styles.commonInput} ${errors?.participantes?.[index]?.dni ? styles.errorBorder : ''}`}
                        />
                        {errors?.participantes?.[index]?.dni?.message && (
                          <p className={styles.error}>{errors.participantes[index].dni.message}</p>
                        )}
                      </div>
                    </div>

                    <div className={styles.row}>
                      <div className={styles.fieldWrapper}>
                        <label htmlFor={`participantes.${index}.fechaNacimiento`} className={styles.label}>Fecha de nacimiento</label>
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
                          className={`${styles.commonInput} ${errors?.participantes?.[index]?.fechaNacimiento ? styles.errorBorder : ''}`}
                        />
                        {errors?.participantes?.[index]?.fechaNacimiento?.message && (
                          <p className={styles.error}>{errors.participantes[index].fechaNacimiento.message}</p>
                        )}
                      </div>
                      {renderTallaInput(index)}
                    </div>
                  </div>
                ))}
                <div className={styles.buttonGroup}>
                  <button onClick={() => navigate('/paso1', { state: { desde: true } })} type="button" className={styles.buttonVolver}>
                    Volver
                  </button>
                  <button
                    type="submit"
                    className={!isValid ? styles.buttonSiguienteDisabled : styles.buttonSiguiente}
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