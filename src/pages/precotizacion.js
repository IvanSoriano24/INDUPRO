import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig/firebase";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { IoSearchSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { RxFilePlus } from "react-icons/rx";
import { GrLinkNext, GrDocumentExcel } from "react-icons/gr";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

const Precotizacion = () => {
  const [activeTab, setActiveTab] = useState("1");

  const cambiarTab = (numeroTab) => {
    if (activeTab !== numeroTab) {
      setActiveTab(numeroTab);
    }
  };

  const [levDigital, setLevDigital] = useState([]);
  const [levDigitalB, setLevDigitalB] = useState([]);
  const [levDigitalC, setLevDigitalC] = useState([]);
  /* ------------------------------------------------------ ACTIVAS ------------------------------- */
  const getLevDigital = async () => {
    const levDigitalList = [];
    const levDigitalCollection = collection(db, "PRECOTIZACION");
    const levDigital = query(
      levDigitalCollection,
      "PRECOTIZACION",
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
        levDigitalList.sort((a, b) => a.cve_precot - b.cve_precot);
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
    const levDigitalCollection = collection(db, "PRECOTIZACION");
    const levDigital = query(
      levDigitalCollection,
      "PRECOTIZACION",
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
        levDigitalListB.sort((a, b) => a.cve_precot - b.cve_precot);
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
    const levDigitalCollection = collection(db, "PRECOTIZACION");
    const levDigital = query(
      levDigitalCollection,
      "PRECOTIZACION",
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
        levDigitalListC.sort((a, b) => a.cve_precot - b.cve_precot);
      }
    }

    setLevDigitalC(levDigitalListC);
  };

  useEffect(() => {
    getLevDigitalCanceladas(); // Cambiado a "getClientes"
  }, []);

  return (
    <div className="panel">
      {/*<div className="row">
        <div className="col-md-10 ">
          <div className="mb-3">
            <input
              placeholder="Buscar por Clave"
              aria-label=""
              aria-describedby="basic-addon1"
              type="text"
              className="form-control"
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
      </div>*/}
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
                      <th style={{ padding: "7px" }}>
                        Sig. Documento
                        <button>
                          <FaCircleQuestion />
                        </button>
                      </th>
                      <th style={{ padding: "10px" }}>Editar</th>
                      <th style={{ padding: "10px" }}>Cancelar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levDigital.map((levDigitalItem) => (
                      <tr key={levDigitalItem.id}>
                        <td>{levDigitalItem.cve_precot}</td>
                        <td>{levDigitalItem.idMonday}</td>
                        <td>{levDigitalItem.cliente.razonSocial}</td>
                        <td>{levDigitalItem.estatus}</td>
                        <td>{levDigitalItem.fechaElaboracion}</td>
                        <td>
                          <Link
                            to={`/agregarRevTecFinanciero/${levDigitalItem.id}`}
                            className="btn btn-light"
                          >
                            <GrLinkNext />
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/editarPreCotizacion/${levDigitalItem.id}`}
                            className="btn btn-light"
                          >
                            <FaPencilAlt />
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/cancelarPreCotizacion/${levDigitalItem.id}`}
                            className="btn btn-light"
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
                    {levDigitalB.map((levDigitalItem) => (
                      <tr key={levDigitalItem.id}>
                        <td>{levDigitalItem.cve_precot}</td>
                        <td>{levDigitalItem.idMonday}</td>
                        <td>{levDigitalItem.cliente.razonSocial}</td>
                        <td>{levDigitalItem.estatus}</td>
                        <td>{levDigitalItem.fechaElaboracion}</td>
                        <td>
                          <Link
                            to={`/segDocPreCotizacion/${levDigitalItem.id}`}
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
                    {levDigitalC.map((levDigitalItem) => (
                      <tr key={levDigitalItem.id}>
                        <td>{levDigitalItem.cve_precot}</td>
                        <td>{levDigitalItem.idMonday}</td>
                        <td>{levDigitalItem.cliente.razonSocial}</td>
                        <td>{levDigitalItem.estatus}</td>
                        <td>{levDigitalItem.fechaElaboracion}</td>
                        <td>
                          <Link
                            to={`/segDocPreCotizacion/${levDigitalItem.id}`}
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

export default Precotizacion;
