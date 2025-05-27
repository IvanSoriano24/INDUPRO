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
import { Navigate } from 'react-router-dom';
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
import { BrowserRouter as Router, Route, Routes, useHistory } from 'react-router-dom';
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
import SegDocPreCotizacion from './pages/segDocPreCotizacion';
import SegDocRev from './pages/segDocRev';
import SegDocCot from './pages/segDocCot';
import AgregarRevTecFinanciero from './pages/agregarRevTecFinanciero';
import EditarRecTecFinanciero from './pages/editarRevTecFinanciero';
import EditarPartidasInsumosATF from './pages/editarPartidasInsumosATF';
import VisualizarPDF from './pages/visualizarPDF';
import CancelarATF from './pages/cancelarATF';
import VisualizarCotizacion from './pages/visualizarCotizacion';
import { useEffect, useState } from 'react';
import CancelarCotizacion from './pages/cancelarCotizacion';
import CancelarLevDigital from './pages/cancelarLevDigital';

function App() {
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('isAuthenticated') // Carga el estado inicial desde localStorage
  );

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false); // Reset state if not authenticated
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');  // Asegúrate de guardar el estado en localStorage
  };

  const handleLogout = () => {
    // Para cerrar sesión
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
  };

  //Este mensaje debe de desaparecer despues de desacer todos los cambios
  return (
    <Router >
      <div className="flex">
        {isAuthenticated && <Sidebar onLogout={handleLogout} />}
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <div className="flex">
                    <div className="content">
                      <Home />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/levantamientoDigital" exact={true} element={ <ProtectedRoute isAuthenticated={isAuthenticated}><LevantamientoDigital /></ProtectedRoute>} />
            <Route path="/precotizacion" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><Precotizacion /></ProtectedRoute>} />
            <Route path="/revTecnicoFinanciero" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><RevTecnicoFinanciero /></ProtectedRoute>} />
            <Route path="/cotizacion" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><Cotizacion /></ProtectedRoute>} />
            <Route path="/clientes" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><Clientes /></ProtectedRoute>} />
            <Route path="/contactos" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><Contactos /></ProtectedRoute>} />
            <Route path="/tipo" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><Tipo /></ProtectedRoute>} />
            <Route path="/usuarios" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><Usuarios /></ProtectedRoute>} />
            <Route path="/factores/:id" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><Factores /></ProtectedRoute>} />
            <Route path="/agregarCliente" exact={true} element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarCliente /></ProtectedRoute>} />
            <Route path="/editarCliente/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarCliente /></ProtectedRoute>} />
            <Route path="/visualizarCliente/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VisualizarCliente /></ProtectedRoute>} />
            <Route path="/agregarContacto/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarContacto /></ProtectedRoute>} />
            <Route path="/agregarTipo" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarTipo /></ProtectedRoute>} />
            <Route path="/editarContacto/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarContacto /></ProtectedRoute>} />
            <Route path="/personalProyectos" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PersonalProyectos /></ProtectedRoute>} />
            <Route path="/agregarPersonal" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarPersonal /></ProtectedRoute>} />
            <Route path="/editarPersonalProyecto/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarPersonalProyecto /></ProtectedRoute>} />
            <Route path="/visualizarContacto/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VisualizarContacto /></ProtectedRoute>} />
            <Route path="/editarTipo/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarTipo /></ProtectedRoute>} />
            <Route path="/visualizarTipo/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VisualizarTipo /></ProtectedRoute>} />
            <Route path="/visualizarPersonal/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VisualizarPersonal /></ProtectedRoute>} />
            <Route path="/agregarFactores" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarFactores /></ProtectedRoute>} />
            <Route path="/editarFactores/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarFactores /></ProtectedRoute>} />
            <Route path="/visualizarFactor/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VisualizarFactor /></ProtectedRoute>} />
            <Route path="/agregarLevDigital" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarLevDigital /></ProtectedRoute>} />
            <Route path="/agregarPartidasLevDig" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarPartidasLevDig /></ProtectedRoute>} />
            <Route path="/editarLevDigital/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarLevDigital /></ProtectedRoute>} />
            <Route path="/editarParLevDig/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarParLevDig /></ProtectedRoute>} />
            <Route path="/agregarParLevDigAdicional/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarParLevDigAdicional /></ProtectedRoute>} />
            <Route path="/agregarPreCotizacion/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarPreCotizacion /></ProtectedRoute>} />
            <Route path="/editarPreCotizacion/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarPreCotizacion /></ProtectedRoute>} />
            <Route path="/cancelarPreCotizacion/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CancelarPreCotizacion /></ProtectedRoute>} />
            <Route path="/editarParPrecot/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarParPrecot /></ProtectedRoute>} />
            <Route path="/editarPartidasInsumoPC/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarPartidasInsumosPC /></ProtectedRoute>} />
            <Route path="/editarPartidasMO/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarPartidasMO /></ProtectedRoute>} />
            <Route path="/segDocLevDig/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SegDocLevDig /></ProtectedRoute>} />
            <Route path="/segDocPreCotizacion/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SegDocPreCotizacion /></ProtectedRoute>} />
            <Route path="/segDocRev/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SegDocRev /></ProtectedRoute>} />
            <Route path="/segDocCot/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SegDocCot /></ProtectedRoute>} />
            <Route path="/agregarRevTecFinanciero/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AgregarRevTecFinanciero /></ProtectedRoute>} />
            <Route path="/editarRevTecFinanciero/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarRecTecFinanciero /></ProtectedRoute>} />
            <Route path="/editarPartidasInsumosATF/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditarPartidasInsumosATF /></ProtectedRoute>} />
            <Route path="/prueba2" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Prueba2 /></ProtectedRoute>} />
            <Route path="/visualizarPDF/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VisualizarPDF /></ProtectedRoute>} />
            <Route path="/cancelarATF/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CancelarATF /></ProtectedRoute>} />
            <Route path="/cancelarCotizacion/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CancelarCotizacion /></ProtectedRoute>} />
            <Route path="/cancelarLevDigital/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CancelarLevDigital /></ProtectedRoute>} />
            <Route path="/visualizarCotizacion/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><VisualizarCotizacion /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;