import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { FaCircleQuestion, FaCirclePlus } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { MdEditDocument } from "react-icons/md";
import { TbDeviceAnalytics } from "react-icons/tb";
import swal from "sweetalert";

const SegDocRev = () => {
  /* ---------------------ENCABEZADO DE DOCUMENTO ------------------------------------- */
  const [cve_levDig, setCve_levDig] = useState("");
  const [cve_precot, setCve_precot] = useState("");
  const [cve_tecFin, setCve_tecFin] = useState("");
  const [folios, setFolios] = useState([]);
  const [selectedFolio, setSelectedFolio] = useState("");
  const [folioSiguiente, setFolioSiguiente] = useState(1);
  const [cve_clie, setCve_clie] = useState("");
  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [docAnt, setDocAnt] = useState("N/A");
  const [docSig, setDocSig] = useState("");
  const [estatus, setEstatus] = useState("Bloqueado");
  const [precotizacionList, setPrecotizacionList] = useState([]);
  const [levList, setLevList] = useState([]);
  const [revisionList, setRevisionList] = useState([]);
  const [analsisTFList, setAnalsisTFList] = useState([]);
  const [analsisPrecot, setAnalsisPrecot] = useState([]);
  const [cotizacion, setCotizacion] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const getFactoresById = async (id) => {
    const factoresDOC = await getDoc(doc(db, "TECNICOFINANCIERO", id));
    if (factoresDOC.exists()) {
      setCve_tecFin(factoresDOC.data().cve_tecFin);
      console.log("cve_tecFin: ", cve_tecFin);
      setCve_clie(factoresDOC.data().cve_clie);
      setFechaElaboracion(factoresDOC.data().fechaElaboracion);
      setFechaInicio(factoresDOC.data().fechaInicio);
      setFechaFin(factoresDOC.data().fechaFin);
      setDocSig(factoresDOC.data().docSig);
      setDocAnt(factoresDOC.data().docAnt);
      setEstatus(factoresDOC.data().estatus);
    } else {
      console.log("El personals no existe");
    }
  };

  useEffect(() => {
    getFactoresById(id);
  }, [id]);

  const getPreCot = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "TECNICOFINANCIERO"),
          where("cve_tecFin", "==", cve_tecFin)
        )
      );
      const par_levDigList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRevisionList(par_levDigList);
      console.log(revisionList);
    } catch (error) {
      console.error("Error fetching TECNICOFINANCIERO data:", error);
    }
  };

  useEffect(() => {
    getPreCot();
  }, [docSig]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

  /* ----------------------------------------- AGREGAR PARTIDAS -------------------------------- */
  /* ---------------------PARTIDAS DE DOCUMENTO ------------------------------------- */
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [par_levDigital, setPar_levDigital] = useState([]);
  const [par_preCot, setPar_preCot] = useState([]);
  const [par_rev, setPar_rev] = useState([]);
  const [noPartida, setNoPartida] = useState("");
  const partidaAdicional = collection(db, "PAR_LEVDIGITAL");

  const getParLevDigital = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_TECFINANCIERO"),
          where("cve_tecFin", "==", cve_tecFin)
        )
      );

      const par_levDigList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      par_levDigList.sort((a, b) => a.noPartida - b.noPartida);
      //console.log("Lista: ", par_levDigList);
      setPar_rev(par_levDigList);
      const maxPartida = Math.max(
        ...par_levDigList.map((item) => item.noPartida),
        0
      );
      setNoPartida(maxPartida + 1);
    } catch (error) {
      console.error("Error fetching PAR_TECFINANCIERO data:", error);
    }
  };

  useEffect(() => {
    getParLevDigital();
  }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
/*****************************************************PRECOT*****************************************************/
const estatusPC =
precotizacionList.length > 0
  ? precotizacionList[0].estatus
  : "No hay documentos de precotización";
const docAntPC =
precotizacionList.length > 0
  ? precotizacionList[0].docAnt
  : "No hay documentos de precotización";
const docSigPC =
precotizacionList.length > 0
  ? precotizacionList[0].docSig
  : "No hay documentos de precotización";

const getPreCotAnalisis = async () => {
try {
  const data = await getDocs(
    query(
      collection(db, "PRECOTIZACION"),
      where("cve_precot", "==", docAnt)
    )
  );
  const par_levDigList = data.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  setPrecotizacionList(par_levDigList);
} catch (error) {
  console.error("Error fetching PRECOTIZACION data:", error);
}
};

useEffect(() => {
getPreCotAnalisis();
}, [docAnt]);

const mostrarPreCotizacion = () => {
const cvePrecot =
  precotizacionList.length > 0
    ? precotizacionList[0].cve_precot
    : "No hay documentos de precotización";

swal({
  title: "Seguimiento de documento",
  text:
    "Documento consultado: " +
    cvePrecot +
    "\n" +
    "Documento anterior: " +
    docAntPC +
    "\n" +
    "Documento siguiente: " +
    docSigPC +
    "\n" +
    "Estatus: " +
    estatusPC, //AQUI
  icon: "info",
  buttons: "Aceptar",
});
};
/*****************************************************PRECOT*****************************************************/
  /*****************************************************LEV*****************************************************/
  const estatusLev =
  levList.length > 0
    ? levList[0].estatus
    : "No hay documentos de precotización";

const docSigLev =
levList.length > 0
    ? levList[0].docSig
    : "No hay documentos de precotización";

const getLev = async () => {
  try {
    const data = await getDocs(
      query(
        collection(db, "LEVDIGITAL"),
        where("cve_levDig", "==", docAntPC)
      )
    );
    const par_levDigList = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setLevList(par_levDigList);
  } catch (error) {
    console.error("Error fetching LEVDIGITAL data:", error);
  }
};

useEffect(() => {
  getLev();
}, [docAntPC]);

  const mostrarAlerta = () => {
    const cveLev =
    levList.length > 0
        ? levList[0].cve_levDig
        : "No hay documentos de precotización";
    swal({
      title: "Seguimiento de documento",
      text:
        "Documento consultado: " +
        cveLev +
        "\n" +
        "Documento anterior: " +
        "N/A" +
        "\n" +
        "Documento siguiente: " +
        docSigLev +
        "\n" +
        "Estatus: " +
        estatusLev,
      icon: "info",
      buttons: "Aceptar",
    });
  };
  /*****************************************************LEV*****************************************************/
/********************************************************REV*****************************************************/

  const mostrarAnalisTecnico = () => {

    swal({
      title: "Seguimiento de documento",
      text:
        "Documento consultado: " +
        cve_tecFin +
        "\n" +
        "Documento anterior: " +
        docAnt +
        "\n" +
        "Documento siguiente: " +
        docSig +
        "\n" +
        "Estatus: " +
        estatus,
      icon: "info",
      buttons: "Aceptar",
    });
  };

/********************************************************REV*****************************************************/
  const getCotizacion = async () => {
    try {
      const data = await getDocs(
        query(collection(db, "COTIZACION"), where("cve_tecFin", "==", docSig))
      );
      const par_levDigList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      
      setCotizacion(par_levDigList);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };
  useEffect(() => {
    getCotizacion();
  }, [docSig]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

  const cveCot =
    cotizacion.length > 0
      ? cotizacion[0].cve_tecFin
      : "No hay Cotizacion";

    const estatusCot =
    cotizacion.length > 0
      ? cotizacion[0].estatus
      : "No hay Cotizacion";
  const mostrarCotizacion = () => {
    swal({
      title: "Seguimiento de documento",
      text:
        "Documento consultado: " +
        cveCot +
        "\n" +
        "Documento anterior: " +
        cve_tecFin +
        "\n" +
        "Documento siguiente: " +
        "N/A" +
        "\n" +
        "Estatus: " +
        estatusCot,
      icon: "info",
      buttons: "Aceptar",
    });
  };
/********************************************************COTIZACION*****************************************************/
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Documento: {cve_levDig}</h1>
          <div
            className="row"
            style={{ border: "1px solid #000", borderColor: "gray" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "100px",
                }}
                onClick={mostrarAlerta}
              >
                <MdEditDocument
                  className="me-2"
                  style={{
                    fontSize: "80px",
                    color: estatusLev === "Bloqueado" ? "green" : "black",
                  }}
                />
                <span
                  style={{
                    fontSize: "20px",
                    color: estatusLev === "Bloqueado" ? "green" : "black",
                  }}
                >
                  Levantamiento
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    color: estatusLev === "Bloqueado" ? "green" : "black",
                  }}
                >
                  digital
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "100px",
                }}
                onClick={mostrarPreCotizacion}
              >
                <IoDocumentText
                  className="me-2"
                  style={{
                    fontSize: "80px",
                    color: estatusPC === "Bloqueado" ? "green" : "black",
                  }}
                />
                <span
                  style={{
                    fontSize: "20px",
                    color: estatusPC === "Bloqueado" ? "green" : "black",
                  }}
                >
                  Pre
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    color: estatusPC === "Bloqueado" ? "green" : "black",
                  }}
                >
                  Cotización
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "100px",
                }}
                onClick={mostrarAnalisTecnico}
              >
                <TbDeviceAnalytics
                  className="me-2"
                  style={{
                    fontSize: "80px",
                    color: estatus === "Bloqueado" ? "green" : "black",
                  }}
                />
                <span
                  style={{
                    fontSize: "20px",
                    color: estatus === "Bloqueado" ? "green" : "black",
                  }}
                >
                  Análsis ténico
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    color: estatus === "Bloqueado" ? "green" : "black",
                  }}
                >
                  financiero
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginRight: "100px",
                }}
                onClick={mostrarCotizacion}
              >
                <IoDocumentText
                  className="me-2"
                  style={{
                    fontSize: "80px",
                    color: estatusCot === "Bloqueado" ? "green" : "black",
                  }}
                />
                <span
                  style={{
                    fontSize: "20px",
                    color: estatusCot === "Bloqueado" ? "green" : "black",
                  }}
                >
                  Cotización
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    color: estatusCot === "Bloqueado" ? "green" : "black",
                  }}
                >
                  terminada
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 ">
              <label className="form-label">CLIENTE</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="text"
                  className="form-control"
                  value={cve_clie}
                  onChange={(e) => setCve_clie(e.target.value)}
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">FECHA DE ELABORACIÓN</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaElaboracion}
                  onChange={(e) => setFechaElaboracion(e.target.value)}
                  className="form-control"
                  readOnly
                />
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button">
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">FECHA DE INICIO</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">FECHA FIN</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div>
            <br></br>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">No. PARTIDA</th>
                  <th scope="col">DESCRIPCIÓN</th>
                  <th scope="col">observaciones</th>
                </tr>
              </thead>
              <tbody>
                {par_rev.map((item, index) => (
                  <tr key={index}>
                    <td>{item.noPartida}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.observacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegDocRev;
