import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Paso1 from './pages/Paso1';
import Paso2 from './pages/Paso2';
import Detalle from './pages/Detalle';
import { DataProvider } from './hooks/DataContext';
import InscripcionFinalizada from './pages/InscripcionFinalizada';

function App() {
  return (
    <DataProvider> {/* Envuelve tus rutas con el DataProvider */}
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Inicio />} />
          <Route path="/paso1" element={<Paso1 />} />
          <Route path="/paso2" element={<Paso2 />} />
          <Route path="/detalle" element={<Detalle />} />
          <Route path="/inscripcion-finalizada" element={<InscripcionFinalizada />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;