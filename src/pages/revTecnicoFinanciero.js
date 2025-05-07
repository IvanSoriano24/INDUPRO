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
import { Gi3DGlasses } from "react-icons/gi";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

const RevTecnicoFinanciero = () => {
  const [activeTab, setActiveTab] = useState("1");

  const cambiarTab = (numeroTab) => {
    if (activeTab !== numeroTab) {
      setActiveTab(numeroTab);
    }
  };

  const [levDigital, setLevDigital] = useState([]);
  const [levDigitalB, setLevDigitalB] = useState([]);
  const [levDigitalC, setLevDigitalC] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  /* ------------------------------------------------------ ACTIVAS ------------------------------- */
  const getLevDigital = async () => {
    const levDigitalList = [];
    const levDigitalCollection = collection(db, "TECNICOFINANCIERO");
    const levDigital = query(
      levDigitalCollection,
      "TECNICOFINANCIERO",
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
    const levDigitalCollection = collection(db, "TECNICOFINANCIERO");
    const levDigital = query(
      levDigitalCollection,
      "TECNICOFINANCIERO",
      where("estatus", "==", "Bloqueado")
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
  /* -------------------------------------------------------- CANCELADAS ---------------------------------------------------- */
  const getLevDigitalCanceladas = async () => {
    const levDigitalListC = [];
    const levDigitalCollection = collection(db, "TECNICOFINANCIERO");
    const levDigital = query(
      levDigitalCollection,
      "TECNICOFINANCIERO",
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
        levDigitalListC.push({ ...combinedData, id: levDigitalDoc.id });
        levDigitalListC.sort((a, b) => a.cve_tecFin - b.cve_tecFin);
      }
    }

    setLevDigitalC(levDigitalListC);
  };

  useEffect(() => {
    getLevDigitalCanceladas(); // Cambiado a "getClientes"
  }, []);

  const levDigitalFiltrado = levDigital.filter(item =>
    item.cve_tecFin.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idMonday?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const levDigitalBFiltrado = levDigitalB.filter(item =>
    item.cve_tecFin.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idMonday?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const levDigitalCFiltrado = levDigitalC.filter(item =>
    item.cve_tecFin.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.idMonday?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
            Bloqueadas
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => cambiarTab("3")}
            className={activeTab == "3" ? "activeTab baseTap" : "baseTap"}
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
                      <th style={{ padding: "7px" }}>Vista Preeliminar</th>
                      <th style={{ padding: "10px" }}>Editar</th>
                      <th style={{ padding: "10px" }}>Cancelar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levDigitalFiltrado.map((levDigitalItem) => (
                      <tr key={levDigitalItem.id}>
                        <td>{levDigitalItem.cve_tecFin}</td>
                        <td>{levDigitalItem.idMonday}</td>
                        <td>{levDigitalItem.cliente.razonSocial}</td>
                        <td>{levDigitalItem.estatus}</td>
                        <td>{levDigitalItem.fechaElaboracion}</td>
                        <td>
                          <Link
                            to={`/visualizarPDF/${levDigitalItem.id}`}
                            className="btn btn-success"
                          >
                            <Gi3DGlasses />
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/editarRevTecFinanciero/${levDigitalItem.id}`}
                            className="btn btn-primary"
                          >
                            <FaPencilAlt />
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/cancelarATF/${levDigitalItem.id}`}
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
                    {levDigitalBFiltrado.map((levDigitalItem) => (
                      <tr key={levDigitalItem.id}>
                        <td>{levDigitalItem.cve_tecFin}</td>
                        <td>{levDigitalItem.idMonday}</td>
                        <td>{levDigitalItem.cliente.razonSocial}</td>
                        <td>{levDigitalItem.estatus}</td>
                        <td>{levDigitalItem.fechaElaboracion}</td>
                        <td>
                          <Link
                            to={`/segDocRev/${levDigitalItem.id}`}
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

        <TabPane tabId="3">
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
                    {levDigitalCFiltrado.map((levDigitalItem) => (
                      <tr key={levDigitalItem.id}>
                        <td>{levDigitalItem.cve_tecFin}</td>
                        <td>{levDigitalItem.idMonday}</td>
                        <td>{levDigitalItem.cliente.razonSocial}</td>
                        <td>{levDigitalItem.estatus}</td>
                        <td>{levDigitalItem.fechaElaboracion}</td>
                        <td>
                          <Link
                            to={`/segDocRev/${levDigitalItem.id}`}
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

export default RevTecnicoFinanciero;
