import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Detalle from './pages/Detalle';
import Paso2 from './pages/Paso2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path='/paso2' element={<Paso2 />} />
        <Route path="/detalle" element={<Detalle />} />
      </Routes>
    </Router>
  );
}

export default App;