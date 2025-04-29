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
  and,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { FaCircleQuestion, FaCirclePlus } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";
import swal from "sweetalert2";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useHistory } from "react-router-dom";

const AgregarParLevDiGAdicional = () => {
  /* ---------------------ENCABEZADO DE DOCUMENTO ------------------------------------- */
  const [showAgregar, setShowAgregar] = useState(false);
  const [cve_levDig, setCve_levDig] = useState("");
  const [folios, setFolios] = useState([]);
  const [selectedFolio, setSelectedFolio] = useState("");
  const [folioSiguiente, setFolioSiguiente] = useState(1);
  const [cantidad, setCantidad] = useState("");
  const [cve_clie, setCve_clie] = useState("");
  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [docAnt, setDocAnt] = useState("N/A");
  const [docSig, setDocSig] = useState("");
  const [estatus, setEstatus] = useState("Activo");
  const navigate = useNavigate();
  const [idMonday, setIdMonday] = useState("");

  const handleShowAgregar = () => setShowAgregar(true);
  const handleCloseAgregar = () => {
    setCantidad("");
    setDescripcion("");
    setObservacion("");
    setShowAgregar(false);
  };

  const { id } = useParams();

  const getFactoresById = async (id) => {
    const factoresDOC = await getDoc(doc(db, "LEVDIGITAL", id));
    if (factoresDOC.exists()) {
      setCve_levDig(factoresDOC.data().cve_levDig);
      setCve_clie(factoresDOC.data().cve_clie);
      setFechaElaboracion(factoresDOC.data().fechaElaboracion);
      setFechaInicio(factoresDOC.data().fechaInicio);
      setFechaFin(factoresDOC.data().fechaFin);
      setIdMonday(factoresDOC.data().idMonday);
    } else {
      console.log("El personals no existe");
    }
  };

  useEffect(() => {
    getFactoresById(id);
  }, [id]);
  /* ----------------------------------------- AGREGAR PARTIDAS -------------------------------- */
  /* ---------------------PARTIDAS DE DOCUMENTO ------------------------------------- */
  const [cve_levDig_par, setLevDigital_par] =
    useState("LEV_DIG1"); /* Este es el campo que agregue */
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [list, setList] = useState([]);
  const [par_levDigital, setPar_levDigital] = useState([]);
  const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
  const [editIndex, setEditIndex] = useState(null);
  const [noPartida, setNoPartida] = useState("");
  const [idPartida, setIdPartida] = useState("");
  const partidaAdicional = collection(db, "PAR_LEVDIGITAL");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const infoCliente = () => {
    swal({
      title: "Ayuda del sistema",
      text: " El campo cliente te permite ingresar la razón social del cliente. A medida que escribes, el sistema sugiere opciones basadas en clientes existentes. Este campo no se puede modificar ya que con ello se garantiza el seguimiento del documento. ",
      icon: "info",
      buttons: "Aceptar",
    });
  };
  const infoFechaElaboracion = () => {
    swal({
      title: "Ayuda del sistema",
      text: " La fecha de elaboración es la fecha en la que se creó el documento y por defecto muestra la fecha de hoy. Sin embargo, es posible modificarla según sea necesario. ",
      icon: "info",
      buttons: "Aceptar",
    });
  };
  const infoFechaInicio = () => {
    swal({
      title: "Ayuda del sistema",
      text: " La fecha de inicio representa el día planificado para comenzar el proyecto. Es importante destacar que esta fecha debe ser igual o posterior a la fecha de elaboración del documento. ",
      icon: "info",
      buttons: "Aceptar",
    });
  };
  const infoFechaFin = () => {
    swal({
      title: "Ayuda del sistema",
      text: " La fecha de fin indica el día previsto para concluir el proyecto. Es esencial tener en cuenta que esta fecha debe ser igual o posterior a la fecha de elaboración del documento y también mayor que la fecha de inicio programada.",
      icon: "info",
      buttons: "Aceptar",
    });
  };

  const getParLevDigital = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_LEVDIGITAL"),
          where("cve_levDig", "==", cve_levDig),
          where("estatusPartida", "==", "Activa")
        )
      );

      const par_levDigList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      par_levDigList.sort((a, b) => a.noPartida - b.noPartida);
      setPar_levDigital(par_levDigList);
      const maxPartida = Math.max(
        ...par_levDigList.map((item) => item.noPartida),
        0
      );
      setNoPartida(maxPartida + 1);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    getParLevDigital();
  }, [cve_levDig]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

  /* ------------------------------------ - Editar Documento -------------------------------*/
  const updateContacto = async (e) => {
    e.preventDefault();
    //ID GS
    if (!idMonday || idMonday.length === 0) {
      swal.fire({
        icon: "warning",
        title: "ID Invalido",
        text: "Ingresa un ID GS valido.",
      });
      return; // 🚨 DETIENE la ejecución aquí si faltan datos
    }
    const factoresRef = doc(db, "LEVDIGITAL", id);
    const datos = {
      cve_clie: cve_clie,
      fechaElaboracion: fechaElaboracion,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      idMonday: idMonday,
    };
    await updateDoc(factoresRef, datos);

    navigate("/levantamientoDigital");
  };

  const agregarPartidaAdicional = async (e) => {
    e.preventDefault();
    try {
      const bitacora = collection(db, "BITACORA");
      const today = new Date();
      const ahora = new Date();
      const hora = ahora.getHours();
      const minuto = ahora.getMinutes();
      const segundo = ahora.getSeconds();
      const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
      const horaFormateada = `${hora}:${minuto}:${segundo}`;
      await addDoc(bitacora, {
        cve_Docu: cve_levDig,
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Registro de partida",
        noPartida: noPartida,
      });
      await addDoc(partidaAdicional, {
        cve_levDig: cve_levDig,
        cantidad: cantidad,
        noPartida: noPartida,
        descripcion: descripcion,
        observacion: observacion,
        estatusPartida: "Activa",
      });
      // Cierra el modal y limpia los campos

      setCantidad("");
      setDescripcion("");
      setObservacion("");
      setShowAgregar(false);
      getParLevDigital(); // Actualiza la tabla
    } catch (error) {
      console.error("Error agregando partida:", error);
    }
  };

  const handleDelete = async (noPartida, cve_levDig) => {
    // Realiza una consulta para encontrar el documento que coincida con los identificadores proporcionados
    const q = query(
      collection(db, "PAR_LEVDIGITAL"),
      where("noPartida", "==", noPartida),
      where("cve_levDig", "==", cve_levDig)
    );
    const querySnapshot = await getDocs(q);
    const bitacora = collection(db, "BITACORA");
    const today = new Date();
    const ahora = new Date();
    const hora = ahora.getHours();
    const minuto = ahora.getMinutes();
    const segundo = ahora.getSeconds();
    const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
    const horaFormateada = `${hora}:${minuto}:${segundo}`;
    await addDoc(bitacora, {
      cve_Docu: cve_levDig,
      tiempo: horaFormateada,
      fechaRegistro: formattedDate,
      tipoDocumento: "Baja de partida",
      noPartida: noPartida,
    });
    // Si se encuentra un documento que coincide con los identificadores proporcionados, actualiza su estatus
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0]; // Suponiendo que solo hay un documento que coincide con los criterios de consulta
      const factoresRef = doc(db, "PAR_LEVDIGITAL", docSnap.id);

      // Actualiza el estatus del documento
      const datos = {
        estatusPartida: "Baja",
      };
      await updateDoc(factoresRef, datos);

      // No se recomienda recargar la página; en su lugar, puedes manejar la actualización del estado localmente
      window.location.reload();
    } else {
      console.log(
        "No se encontró ningún documento que coincida con los identificadores proporcionados."
      );
    }
    // }
  };
  const recolectarDatos = async (
    idPartida,
    cve_tecFin,
    cantidad,
    noPartida,
    descripcion,
    observacion
  ) => {
    //alert("CLAVE: " + cve_tecFin + "Y TAMBIEN NO PARTIDA: " + noPartida)
    //alert("ID: " + idPartida);
    setIdPartida(idPartida);
    setCve_levDig(cve_tecFin);
    setCantidad(cantidad);
    setNoPartida(noPartida);
    setDescripcion(descripcion);
    setObservacion(observacion);
    handleShow(); // Muestra el modal
  };
  const guardarEdicion = async () => {
    if (cantidad <= 0) {
          swal.fire({
            icon: "warning",
            title: "Error Cantidad",
            text: "La cantidad no puede ser menor o igual a 0.",
          });
          return;
        }
    if (idPartida) {
      const partidaRef = doc(db, "PAR_LEVDIGITAL", idPartida);
      await updateDoc(partidaRef, {
        cantidad: cantidad,
        descripcion: descripcion,
        observacion: observacion,
      });
      setShow(false); // Cierra el modal
      getParLevDigital(); // Actualiza la tabla
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Levantamiento Digital</h1>
          <div className="row">
            <div className="col-md-4 ">
              <label className="form-label">Cliente</label>
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
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    onClick={infoCliente}
                  >
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">ID GS: </label>
              <div className="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="text"
                  value={idMonday}
                  onChange={(e) => setIdMonday(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4 ">
              <label className="form-label">Fecha de Elaboración</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaElaboracion}
                  onChange={(e) => setFechaElaboracion(e.target.value)}
                  className="form-control"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    onClick={infoFechaElaboracion}
                  >
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <label className="form-label">Fecha de Inicio</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="form-control"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    onClick={infoFechaInicio}
                  >
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 ">
              <label className="form-label">Fecha Fin</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="form-control"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    onClick={infoFechaFin}
                  >
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Aqui iba contenido anterior */}
          <div className="col-md-6 ">
            <button className="btn btn-success" onClick={handleShowAgregar}>
              Agregar Partida
            </button>
          </div>
          <div
            style={{
              maxHeight: "240px", // 🔵 Puedes ajustar la altura como tú quieras
              overflowY: "auto", // 🔵 Scroll vertical cuando se necesite
            }}
          >
            <br></br>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">No. Partida</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Observaciones</th>
                  <th scope="col">Editar</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {par_levDigital.map((item, index) => (
                  <tr key={index}>
                    <td>{item.noPartida}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.observacion}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          recolectarDatos(
                            item.id,
                            item.cve_levDig,
                            item.noPartida,
                            item.cantidad,
                            item.descripcion,
                            item.observacion
                          )
                        }
                      >
                        <FaPencilAlt />{" "}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleDelete(item.noPartida, item.cve_levDig)
                        }
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p></p>
        <button className="btn btn-success" onClick={updateContacto}>
          <HiDocumentPlus /> Guardar
        </button>
      </div>
      {/* Modal para agregar partida */}
      <Modal
        show={showAgregar}
        onHide={handleShowAgregar}
        dialogClassName="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Partida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>No. Partida</label>
            <input
              type="text"
              className="form-control"
              value={noPartida}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label>Cantidad</label>
            <input
              type="number"
              className="form-control"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
            />
          </div>
          <div className="mb-3">
            <label>Descripción</label>
            <textarea
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Observaciones</label>
            <textarea
              className="form-control"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAgregar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={agregarPartidaAdicional}>
            Guardar Partida
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal EDITAR  */}
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Partida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>No. Partida</label>
            <input
              type="text"
              className="form-control"
              value={noPartida}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label>Cantidad</label>
            <input
              type="number"
              className="form-control"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
            />
          </div>
          <div className="mb-3">
            <label>Descripción</label>
            <textarea
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Observaciones</label>
            <textarea
              className="form-control"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarEdicion}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default AgregarParLevDiGAdicional;
