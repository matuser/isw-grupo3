import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Detalle from './pages/Detalle';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/detalle" element={<Detalle />} />
      </Routes>
    </Router>
  );
}

export default App;