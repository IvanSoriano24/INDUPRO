import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig/firebase";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { FaCircleQuestion, FaFilePdf } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { RxFilePlus } from "react-icons/rx";
import { GrLinkNext, GrDocumentExcel } from "react-icons/gr";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import encabezadoPDF from "../imagenes/GS-ENCABEZADO-2.PNG";
import { FaRegEye } from "react-icons/fa";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

const Cotizacion = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [cotizacionLista, setCotizacionLista] = useState([]);
  const [parCotizacionLista, setParCotizacionLista] = useState([]);
  const [clienteLista, setClienteLista] = useState([]);

  const cambiarTab = (numeroTab) => {
    if (activeTab !== numeroTab) {
      setActiveTab(numeroTab);
    }
  };

  const [levDigital, setLevDigital] = useState([]);
  const [levDigitalB, setLevDigitalB] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  /* ------------------------------------------------------ ACTIVAS ------------------------------- */
  const getLevDigital = async () => {
    const levDigitalList = [];
    const levDigitalCollection = collection(db, "COTIZACION");
    const levDigital = query(
      levDigitalCollection,
      "COTIZACION",
      where("estatus", "==", "Activo")
    );
    const levDigitalSnapshot = await getDocs(levDigital);

    for (const levDigitalDoc of levDigitalSnapshot.docs) {
      const levDigitalData = levDigitalDoc.data();
      const cveClie = levDigitalData.cve_clie;

      // Obtener información del cliente
      const clientesCollection = collection(db, "CLIENTES");
      const clientesQuery = query(
        clientesCollection,
        where("cve_clie", "==", cveClie)
      );
      const clientesSnapshot = await getDocs(clientesQuery);

      if (!clientesSnapshot.empty) {
        const clienteData = clientesSnapshot.docs[0].data();
        // Combinar información de LEVDIGITAL y CLIENTES
        const combinedData = { ...levDigitalData, cliente: clienteData };
        levDigitalList.push({ ...combinedData, id: levDigitalDoc.id });
        levDigitalList.sort((a, b) => a.cve_tecFin - b.cve_tecFin);
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
    const levDigital = query(
      levDigitalCollection,
      "COTIZACION",
      where("estatus", "==", "Cancelado")
    );
    const levDigitalSnapshot = await getDocs(levDigital);

    for (const levDigitalDoc of levDigitalSnapshot.docs) {
      const levDigitalData = levDigitalDoc.data();
      const cveClie = levDigitalData.cve_clie;

      // Obtener información del cliente
      const clientesCollection = collection(db, "CLIENTES");
      const clientesQuery = query(
        clientesCollection,
        where("cve_clie", "==", cveClie)
      );
      const clientesSnapshot = await getDocs(clientesQuery);

      if (!clientesSnapshot.empty) {
        const clienteData = clientesSnapshot.docs[0].data();
        // Combinar información de LEVDIGITAL y CLIENTES
        const combinedData = { ...levDigitalData, cliente: clienteData };
        levDigitalListB.push({ ...combinedData, id: levDigitalDoc.id });
        levDigitalListB.sort((a, b) => a.cve_tecFin - b.cve_tecFin);
      }
    }

    setLevDigitalB(levDigitalListB);
  };

  useEffect(() => {
    getLevDigitalBloqueadas(); // Cambiado a "getClientes"
  }, []);


  /*const levDigitalFiltrado = levDigital.filter(item =>
    item.cve_levDig.toString().includes(searchTerm)
  );
  const levDigitalBFiltrado = levDigitalB.filter(item =>
    item.cve_levDig.toString().includes(searchTerm)
  );*/

  return (
    <div className="panel">
      <div className="row">
        <div className="col-md-10 ">
          <div className="mb-3">
            <input
              placeholder="Buscar por clave"
              type="text"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-2 ">
          <div className="mb-3">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button">
                <IoSearchSharp />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Nav tabs>
        <NavItem>
          <NavLink
            onClick={() => cambiarTab("1")}
            className={activeTab == "1" ? "activeTab baseTap" : "baseTap"}
          >
            Activas
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => cambiarTab("2")}
            className={activeTab == "2" ? "activeTab baseTap" : "baseTap"}
          >
            Canceladas
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <div className="container">
            <div className="row">
              <div className="col">
                <br />
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ padding: "10px" }}>Folio</th>
                      <th style={{ padding: "10px" }}>ID GS</th>
                      <th style={{ padding: "10px" }}>Cliente</th>
                      <th style={{ padding: "10px" }}>Estatus</th>
                      <th style={{ padding: "10px" }}>Fecha</th>
                      <th style={{ padding: "10px" }}>Ver Cotización</th>
                      <th style={{ padding: "10px" }}>Cancelar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*{levDigitalFiltrado.map((levDigitalItem) => (*/}
                    {levDigital.map((levDigitalItem) => (
                      <tr key={levDigitalItem.id}>
                        <td>{levDigitalItem.cve_tecFin}</td>
                        <td>{levDigitalItem.idMonday}</td>
                        <td>{levDigitalItem.cliente.razonSocial}</td>
                        <td>{levDigitalItem.estatus}</td>
                        <td>{levDigitalItem.fechaElaboracion}</td>
                        <td>
                          <Link
                            to={`/visualizarCotizacion/${levDigitalItem.id}`}
                            className="btn btn-success"
                          >
                            <FaRegEye />
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/cancelarCotizacion/${levDigitalItem.id}`}
                            className="btn btn-danger"
                          >
                            <GrDocumentExcel />
                          </Link>
                        </td>
                      </tr>
                    ))}
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
                <br />
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ padding: "10px" }}>Folio</th>
                      <th style={{ padding: "10px" }}>ID GS</th>
                      <th style={{ padding: "10px" }}>Cliente</th>
                      <th style={{ padding: "10px" }}>Estatus</th>
                      <th style={{ padding: "10px" }}>Fecha</th>
                      <th style={{ padding: "7px" }}>
                        Seguimiento de Documento
                        <button>
                          <FaCircleQuestion />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*{levDigitalBFiltrado.map((levDigitalItem) => (*/}
                    {levDigital.map((levDigitalItem) => (
                      <tr key={levDigitalItem.id}>
                        <td>{levDigitalItem.cve_tecFin}</td>
                        <td>{levDigitalItem.idMonday}</td>
                        <td>{levDigitalItem.cliente.razonSocial}</td>
                        <td>{levDigitalItem.estatus}</td>
                        <td>{levDigitalItem.fechaElaboracion}</td>
                        <td>
                          <Link
                            to={`/segDocCot/${levDigitalItem.id}`}
                            className="btn btn-light"
                            style={{ textAlign: "center" }}
                          >
                            <HiDocumentMagnifyingGlass />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabPane>
      </TabContent>
    </div>
  );
};

export default Cotizacion;
