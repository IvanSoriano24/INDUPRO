import "bootstrap/dist/css/bootstrap.min.css"
import { useState, useEffect } from "react"
import { db } from "../firebaseConfig/firebase";
import { collection, getDocs, query, where } from "@firebase/firestore";
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye  } from "react-icons/fa";
import { FaCircleQuestion, FaFilePdf } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { RxFilePlus } from "react-icons/rx";
import { GrLinkNext, GrDocumentExcel} from "react-icons/gr";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import encabezadoPDF from "../imagenes/GS-ENCABEZADO-2.PNG";
import { FaRegEye } from "react-icons/fa";

const Cotizacion = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [cotizacionLista, setCotizacionLista] = useState([]) 
    const [parCotizacionLista, setParCotizacionLista] = useState([]) 
    const [clienteLista, setClienteLista] = useState([]);


    const cambiarTab = (numeroTab) =>{
        if(activeTab !== numeroTab){
            setActiveTab(numeroTab);
        }
    }

    const [levDigital, setLevDigital] = useState([]);
    const [levDigitalB, setLevDigitalB] = useState([]);
    /* ------------------------------------------------------ ACTIVAS ------------------------------- */
    const getLevDigital = async () => {
        const levDigitalList = [];
        const levDigitalCollection = collection(db, "COTIZACION");
        const levDigital = query(levDigitalCollection, "COTIZACION", where("estatus", "==", "Activo"));
        const levDigitalSnapshot = await getDocs(levDigital);


        for (const levDigitalDoc of levDigitalSnapshot.docs) {
          const levDigitalData = levDigitalDoc.data();
          const cveClie = levDigitalData.cve_clie;
        
          // Obtener información del cliente
          const clientesCollection = collection(db, "CLIENTES");
          const clientesQuery = query(clientesCollection, where("cve_clie", "==", cveClie));
          const clientesSnapshot = await getDocs(clientesQuery);
    
          if (!clientesSnapshot.empty) {
            const clienteData = clientesSnapshot.docs[0].data();
            // Combinar información de LEVDIGITAL y CLIENTES
            const combinedData = { ...levDigitalData, cliente: clienteData };
            levDigitalList.push({ ...combinedData, id: levDigitalDoc.id });
          }
        }
    
        setLevDigital(levDigitalList);
      };

    useEffect(() => {
        getLevDigital(); // Cambiado a "getClientes"
    }, []);

    /* -------------------------------------------------------- BLOQUEADAS ---------------------------------------------------- */
    const getLevDigitalBloqueadas = async () => {
        const levDigitalListB = [];
        const levDigitalCollection = collection(db, "COTIZACION");
        const levDigital = query(levDigitalCollection, "COTIZACION", where("estatus", "==", "Bloqueado"));
        const levDigitalSnapshot = await getDocs(levDigital);

        for (const levDigitalDoc of levDigitalSnapshot.docs) {
          const levDigitalData = levDigitalDoc.data();
          const cveClie = levDigitalData.cve_clie;
        
          // Obtener información del cliente
          const clientesCollection = collection(db, "CLIENTES");
          const clientesQuery = query(clientesCollection, where("cve_clie", "==", cveClie));
          const clientesSnapshot = await getDocs(clientesQuery);
    
          if (!clientesSnapshot.empty) {
            const clienteData = clientesSnapshot.docs[0].data();
            // Combinar información de LEVDIGITAL y CLIENTES
            const combinedData = { ...levDigitalData, cliente: clienteData };
            levDigitalListB.push({ ...combinedData, id: levDigitalDoc.id });
          }
        }
    
        setLevDigitalB(levDigitalListB);
      };

    useEffect(() => {
        getLevDigitalBloqueadas(); // Cambiado a "getClientes"
    }, []);

  
    return (
        <div className="panel">
            <div className="row">
                <div className="col-md-10 ">
                    <div className="mb-3">
                        <input
                        placeholder="BUSCAR POR CLAVE" aria-label="" aria-describedby="basic-addon1"
                        type="text"
                        className="form-control"
                        />
                    </div>
                 </div>
                 <div className="col-md-2 ">
                    <div className="mb-3">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button"><IoSearchSharp /></button>
                        </div>
                    </div>
                 </div>
            </div>
        <Nav tabs>
            
            <NavItem>
                <NavLink 
                onClick={()=>cambiarTab("1")}
                className={(activeTab=="1" ? "activeTab baseTap": "baseTap")}
                >
                    ACTIVAS
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink 
                onClick={()=>cambiarTab("2")}
                className={(activeTab=="2" ? "activeTab baseTap": "baseTap")}
                >
                    CANCELEDAS
                </NavLink>
            </NavItem>
            
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
            <div className="container">
            <div className="row">
                <div className="col">
                    <br/>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ padding: '10px' }}>Folio</th>
                                <th style={{ padding: '10px' }}>Cliente</th>
                                <th style={{ padding: '10px' }}>Estatus</th>
                                <th style={{ padding: '10px' }}>Fecha</th>
                                <th style={{ padding: '10px' }}>Ver cotización</th>
                                <th style={{ padding: '10px' }}>Cancelar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levDigital.map((levDigitalItem) => (
                                <tr key={levDigitalItem.id}>
                                    <td>{levDigitalItem.cve_tecFin}</td>
                                    <td>{levDigitalItem.cliente.razonSocial}</td>
                                    <td>{levDigitalItem.estatus}</td>
                                    <td>{levDigitalItem.fechaElaboracion}</td>
                                    <td><Link to={`/visualizarCotizacion/${levDigitalItem.id}`} className="btn btn-success"><FaRegEye /></Link></td>
                                    <td><Link to={`/cancelarCotizacion/${levDigitalItem.id}`} className="btn btn-danger"><GrDocumentExcel /></Link></td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
            </TabPane>

            <TabPane tabId="2">
            <div className="container">
            <div className="row">
                <div className="col">
                    <br/>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ padding: '10px' }}>FOLIO</th>
                                <th style={{ padding: '10px' }}>CLEINTE</th>
                                <th style={{ padding: '10px' }}>ESTATUS</th>
                                <th style={{ padding: '10px' }}>FECHA</th>
                                <th style={{ padding: '7px' }}>SIG. DOCUMENTO<button><FaCircleQuestion /></button></th>
                                <th style={{ padding: '10px' }}>EDITAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levDigitalB.map((levDigitalItem) => (
                                <tr key={levDigitalItem.id}>
                                    <td>{levDigitalItem.cve_precot}</td>
                                    <td>{levDigitalItem.cliente.razonSocial}</td>
                                    <td>{levDigitalItem.estatus}</td>
                                    <td>{levDigitalItem.fechaElaboracion}</td>
                                    <td><Link to={`/agregarRevTecFinanciero/${levDigitalItem.id}`} className="btn btn-light"><GrLinkNext /></Link></td>
                                    <td><Link to={`/agregarParLevDigAdicional/${levDigitalItem.id}`} className="btn btn-light"><FaPencilAlt /></Link></td>
                                    
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
            </TabPane>
            
        </TabContent>
    </div>
    )
}

export default Cotizacion