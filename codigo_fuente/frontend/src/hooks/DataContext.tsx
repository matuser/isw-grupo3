import React, { createContext, useState, ReactNode, useContext } from 'react';

interface Actividad {
  id: number;
  nombre: string;
}

// Define la estructura de los datos del participante incluyendo el talle
interface Participante {
  nombre: string;
  dni?: string;
  talle?: 's' | 'm' | 'l' | 'xl' | 'xxl' | ''; // Agrega la propiedad talle y permite cadena vacía
}

// Define la estructura de los datos que vas a compartir
interface DataContextProps {
  cantidad: number;
  actividad: number | '';
  fecha: string;
  hora: string;
  participantes: Participante[]; // Usa la interfaz Participante actualizada
  actividades: Actividad[];
  setCantidad: (cantidad: number) => void;
  setActividad: (actividad: number | '') => void;
  setFecha: (fecha: string) => void;
  setHora: (hora: string) => void;
  setParticipantes: (participantes: Participante[]) => void; // Usa la interfaz Participante actualizada
  setActividades: (actividades: Actividad[]) => void;
  findActividadNombre: (id: number | '') => string; // Agregamos la función para obtener el nombre
}

// Crea el Context con un valor por defecto (puede ser null o un objeto inicial)
const DataContext = createContext<DataContextProps | undefined>(undefined);

// Crea un Provider para envolver tu aplicación y proporcionar los datos
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cantidad, setCantidad] = useState<number>(1); // Cambiado a number con valor inicial
  const [actividad, setActividad] = useState<number | ''>('');
  const [fecha, setFecha] = useState<string>('');
  const [hora, setHora] = useState<string>('');
  const [participantes, setParticipantes] = useState<Participante[]>([]); // Usa la interfaz Participante actualizada
  const [actividades, setActividades] = useState<Actividad[]>([ // Inicializamos con algunas actividades
    { id: 1, nombre: 'Tirolesa' },
    { id: 2, nombre: 'Palestra' },
    { id: 3, nombre: 'Safari' },
    { id: 4, nombre: 'Jardineria' },
  ]);

  // Función para encontrar el nombre de la actividad por su ID
  const findActividadNombre = (id: number | ''): string => {
    if (id === '') {
      return 'No especificada';
    }
    const actividadEncontrada = actividades.find((act) => act.id === id);
    return actividadEncontrada?.nombre || 'No especificada';
  };

  return (
    <DataContext.Provider value={{
      cantidad,
      setCantidad,
      actividad,
      setActividad,
      fecha,
      setFecha,
      hora,
      setHora,
      participantes,
      setParticipantes,
      actividades,
      setActividades,
      findActividadNombre, // Proporcionamos la función al contexto
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Crea un hook personalizado para acceder fácilmente al contexto
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
};