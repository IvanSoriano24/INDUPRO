import Navbar from '../src/components/Navbar'
import './App.scss';
import Sidebar from '../src/components/Sidebar'
import Home from './pages/Home';
import LevantamientoDigital from './pages/levantamientoDigital';
import precotizacion from './pages/precotizacion';
import revTecnicoFinanciero from './pages/revTecnicoFinanciero';
import cotizacion from './pages/cotizacion';
import clientes from './pages/clientes';
import contactos from './pages/contactos';
import tipo from './pages/tipo';
import usuarios from './pages/usuarios';
import Factores from './pages/factores';
import agregarCliente from './pages/agregarCliente';
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
function App() {
  return (
    <Router >
      
      <div className= "flex">
      <Sidebar/>
      <div className= "content">
        <Routes>
          <Route path="/" exact={true} Component={Home} />
          <Route path="/levantamientoDigital" exact={true} Component={LevantamientoDigital} />
          <Route path="/precotizacion" exact={true} Component={precotizacion} />
          <Route path="/revTecnicoFinanciero" exact={true} Component={revTecnicoFinanciero} />
          <Route path="/cotizacion" exact={true} Component={cotizacion} />
          <Route path="/clientes" exact={true} Component={clientes} />
          <Route path="/contactos" exact={true} Component={contactos} />
          <Route path="/tipo" exact={true} Component={tipo} />
          <Route path="/usuarios" exact={true} Component={usuarios} />
          <Route path="/factores" exact={true} Component={Factores} />
          <Route path="/agregarCliente" exact={true} Component={agregarCliente} />
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
