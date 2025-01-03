// src/pages/MaintenancePage.js
/*
import React from 'react';
function MaintenancePage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f1f1' }}>
      <h1 style={{ color: '#333', fontFamily: 'Arial, sans-serif' }}>El sitio está en mantenimiento. Vuelve más tarde.</h1>
    </div>
  );
}
  <Route path="/" exact={true} Component={Home} />
  {isAuthenticated && <Sidebar />}

export default MaintenancePage;
*/

import Navbar from '../src/components/Navbar'
import './App.scss';
import Login from './pages/login';
import ProtectedRoute from './components/protectedRoute';
import Sidebar from '../src/components/Sidebar';
import Home from './pages/Home';
import LevantamientoDigital from './pages/levantamientoDigital';
import Precotizacion from './pages/precotizacion';
import RevTecnicoFinanciero from './pages/revTecnicoFinanciero';
import Cotizacion from './pages/cotizacion';
import Clientes from './pages/clientes';
import Contactos from './pages/contactos';
import Tipo from './pages/tipo';
import Usuarios from './pages/usuarios';
import Factores from './pages/factores';
import AgregarCliente from './pages/agregarCliente';
import EditarCliente from './pages/editarCliente';
import EditarContacto from './pages/editarContacto';
import VisualizarCliente from './pages/visualizarCliente';
import AgregarContacto from './pages/agregarContacto';
import PersonalProyectos from './pages/personalProyectos';
import AgregarPersonal from './pages/agregarPersonal';
import EditarPersonalProyecto from './pages/editarPersonalProyecto';
import VisualizarContacto from './pages/visualizarContacto';
import EditarTipo from './pages/editarTipo';
import VisualizarTipo from './pages/visualizarTipo';
import { BrowserRouter as Router, Route, Routes, useHistory} from 'react-router-dom';
import AgregarTipo from './pages/agregarTipo';
import VisualizarPersonal from './pages/visualizarPersonal';
import AgregarFactores from './pages/agregarFactores';
import EditarFactores from './pages/editarFactores';
import VisualizarFactor from './pages/visualizarFactor';
import AgregarLevDigital from './pages/agregarLevDigital';
import AgregarPartidasLevDig from './pages/agregarPartidasLevDig';
import EditarLevDigital from './pages/editarLevDigital';
import Prueba2 from './pages/prueba2';
import EditarParLevDig from './pages/editarParLevDig';
import AgregarParLevDigAdicional from './pages/agregarParLevDigAdicional';
import AgregarPreCotizacion from './pages/agregarPreCotizacion';
import EditarPreCotizacion from './pages/editarPreCotizacion';
import CancelarPreCotizacion from './pages/cancelarPreCotizacion';
import EditarParPrecot from './pages/editarParPrecot';
import EditarPartidasInsumosPC from './pages/editarPartidasInsumoPC';
import EditarPartidasMO from './pages/editarPartidasMO';
import SegDocLevDig from './pages/segDocLevDig';
import AgregarRevTecFinanciero from './pages/agregarRevTecFinanciero';
import EditarRecTecFinanciero from './pages/editarRevTecFinanciero';
import EditarPartidasInsumosATF from './pages/editarPartidasInsumosATF';
import VisualizarPDF from './pages/visualizarPDF';
import CancelarATF from './pages/cancelarATF';
import VisualizarCotizacion from './pages/visualizarCotizacion';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('isAuthenticated') // Carga el estado inicial desde localStorage
  );

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true); // Actualiza el estado
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole'); // Si tienes más datos relacionados
    setIsAuthenticated(false); // Actualiza el estado
  };

//Este mensaje debe de desaparecer despues de desacer todos los cambios
  return (
    <Router >
      <div className= "flex">
      {isAuthenticated && <Sidebar />}
      <div className= "content">
        <Routes>
        <Route path="/login" element={<Login />} />
          <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className= "flex">
                    <div className='content'>
                    <Home />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          
          <Route path="/levantamientoDigital" exact={true} element={<LevantamientoDigital />} />
          <Route path="/precotizacion" exact={true} element={<Precotizacion />} />
          <Route path="/revTecnicoFinanciero" exact={true} element={<RevTecnicoFinanciero />} />
          <Route path="/cotizacion" exact={true} element={<Cotizacion />} />
          <Route path="/clientes" exact={true} element={<Clientes />} />
          <Route path="/contactos" exact={true} element={<Contactos />} />
          <Route path="/tipo" exact={true} element={<Tipo />} />
          <Route path="/usuarios" exact={true} element={<Usuarios />} />
          <Route path="/factores/:id" exact={true} element={<Factores />} />
          <Route path="/agregarCliente" exact={true} element={<AgregarCliente />} />
          <Route path="/editarCliente/:id" element={<EditarCliente />} />
          <Route path="/visualizarCliente/:id" element={<VisualizarCliente />} />
          <Route path="/agregarContacto/:id" element={<AgregarContacto />} />
          <Route path="/agregarTipo" element={<AgregarTipo />} />
          <Route path="/editarContacto/:id" element={<EditarContacto />} />
          <Route path="/personalProyectos" element={<PersonalProyectos />} />
          <Route path="/agregarPersonal" element={<AgregarPersonal />} />
          <Route path="/editarPersonalProyecto/:id" element={<EditarPersonalProyecto />} />
          <Route path="/visualizarContacto/:id" element={<VisualizarContacto />} />
          <Route path="/editarTipo/:id" element={<EditarTipo />} />
          <Route path="/visualizarTipo/:id" element={<VisualizarTipo />} />
          <Route path="/visualizarPersonal/:id" element={<VisualizarPersonal />} />
          <Route path="/agregarFactores" element={<AgregarFactores />} />
          <Route path="/editarFactores/:id" element={<EditarFactores />} />
          <Route path="/visualizarFactor/:id" element={<VisualizarFactor />} />
          <Route path="/agregarLevDigital" element={<AgregarLevDigital />} />
          <Route path="/agregarPartidasLevDig" element={<AgregarPartidasLevDig />} />
          <Route path="/editarLevDigital/:id" element={<EditarLevDigital />} />
          <Route path="/editarParLevDig/:id" element={<EditarParLevDig />} />
          <Route path="/agregarParLevDigAdicional/:id" element={<AgregarParLevDigAdicional />} />
          <Route path="/agregarPreCotizacion/:id" element={<AgregarPreCotizacion />} />
          <Route path="/editarPreCotizacion/:id" element={<EditarPreCotizacion />} />
          <Route path="/cancelarPreCotizacion/:id" element={<CancelarPreCotizacion />} />
          <Route path="/editarParPrecot/:id" element={<EditarParPrecot />} />
          <Route path="/editarPartidasInsumoPC/:id" element={<EditarPartidasInsumosPC />} />
          <Route path="/editarPartidasMO/:id" element={<EditarPartidasMO />} />
          <Route path="/segDocLevDig/:id" element={<SegDocLevDig />} />
          <Route path="/agregarRevTecFinanciero/:id" element={<AgregarRevTecFinanciero />} />
          <Route path="/editarRevTecFinanciero/:id" element={<EditarRecTecFinanciero />} />
          <Route path="/editarPartidasInsumosATF/:id" element={<EditarPartidasInsumosATF />} />
          <Route path="/prueba2" element={<Prueba2 />} />
          <Route path="/visualizarPDF/:id" element={<VisualizarPDF />} />
          <Route path="/cancelarATF/:id" element={<CancelarATF />} />
          <Route path="/visualizarCotizacion/:id" element={<VisualizarCotizacion />} />
          
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;