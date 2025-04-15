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
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { FaCircleQuestion, FaCirclePlus } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";

import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle, Modal, Button } from "react-bootstrap";
import { FaPercent } from "react-icons/fa";
import "../Modal.css";

const EditarRecTecFinanciero = () => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };
  const [cve_precot, setPrecot] = useState("");
  const [par_preCot, setPar_preCot] = useState([]);
  const [cve_tecFin, setCve_tecFin] = useState("");
  const [cve_clie, setCve_clie] = useState("");
  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [list, setList] = useState([]);
  const [noPartida, setNoPartida] = useState("");

  /* ----------------------------------------------------- */
  const [show, setShow] = useState(false);
  const [tot, setTot] = useState(false);
  const handleClose = () => {
    setShow(false);
    setSelectedPartida(null);
    setCantidad("");
    setDescripcion("");
    setObservacion("");
  };

  const closeTot = () => {
    setTot(false);
    setSelectedPartida(null);
    setCantidadTotalesEdit("");
    setCostoFijoEdit("");
    setUtilidadEdit("");
  };

  const [selectedPartida, setSelectedPartida] = useState(null);
  const guardarEdicion = async () => {
    if (idPartida) {
      const partidaRef = doc(db, "ANALISIS_TOTALES", idPartida);
      await updateDoc(partidaRef, {
        descripcion: descripcion,
        observacion: observacion,
      });
      setShow(false); // Cierra el modal
      //getParLevDigital(); // Actualiza la tabla
    }
  };
  const [idPartida, setIdPartida] = useState("");
  /* ----------------------------------------------------- */
  const [idPartidaEdit, setIdPartidaEdit] = useState("");
  const [noPartidaEdit, setNoPartidaEdit] = useState("");
  const [cve_ATFEdit, setCve_ATFEdit] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  /* --------------------------- PARTIDAS DE INSUMO -----------*/
  const [par_PreCoti_insu, setPar_PreCoti_insu] = useState([]);
  const [costoCotizado, setCostoCotizado] = useState();
  const [cantidad, setCantidad] = useState();

  const [idTotalesEdit, setIdTotalesEdit] = useState("");
  const [utilidadEdit, setUtilidadEdit] = useState("");
  const [cantidadTotalesEdit, setCantidadTotalesEdit] = useState("");
  const [insumosEdit, setInsumosEdit] = useState("");
  const [manoObraEdit, setManoObraEdit] = useState("");
  const [factorajeEdit, setFactorajeEdit] = useState("");
  const [costoFijoEdit, setCostoFijoEdit] = useState("");
  const [totalesDoc, setTotalesDoc] = useState([]);
  /* --------------------------------PARTIDAS PARA MANO DE OBRA -----------------*/
  const [manoObra, setManoObra] = useState([]);
  const [noPartidaMO, setNoParatidaMO] = useState(1);
  const [listMO, setListMO] = useState([]);
  /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
  const navigate = useNavigate();
  const { id } = useParams();
const [idMonday, setIdMonday] = useState("");
  /* ---------------------JALAR INFORMACIÓN DE DOCUMENTO ANTERIOR ------------------------------------- */
  const getFactoresById = async (id) => {
    const factoresDOC = await getDoc(doc(db, "TECNICOFINANCIERO", id));
    if (factoresDOC.exists()) {
      setCve_tecFin(factoresDOC.data().cve_tecFin);
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
  /*AQUI*/

  /* --------------------- JALAR INFORMACIÓN DE PARTIDAS ANTERIORES ------------------------------------- */
  const getParPreCot = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_TECFINANCIERO"),
          where("cve_tecFin", "==", cve_tecFin)
        )
      );
      //par_preCotList
      const par_preCotList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      par_preCotList.sort((a, b) => a.noPartida - b.noPartida);
      setPar_preCot(par_preCotList);
      const maxPartida = Math.max(
        ...par_preCotList.map((item) => item.noPartida),
        0
      );
      setNoPartida(maxPartida + 1);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    getParPreCot();
  }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

  /* ----------------------------------------- OBTENER PARTDIAS DE INSUMOS PARA LA PRECOTIZACIÓN -------------------------*/

  const getParPreCotizacion = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_TECFIN_INSU"),
          where("cve_tecFin", "==", cve_tecFin)
        )
      );

      const par_levDigList1 = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log("Datos de PAR_PRECOTIZACION_INSU:", par_levDigList1);
      par_levDigList1.sort((a, b) => a.noPartidaPC - b.noPartidaPC);
      setPar_PreCoti_insu(par_levDigList1);
      const maxPartida = Math.max(
        ...par_levDigList1.map((item) => item.noPartidaPC),
        0
      );
      setNoParatidaMO(maxPartida + 1);
      //(maxPartida + 1);
      //console.log("max Partida: " + maxPartida)
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    getParPreCotizacion();
  }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  //console.log("Prueba" + par_PreCoti_insu);

  /* ------------------------------------ OBTENER TABLA DE TOTALES-------------------------------*/
  const obtenerPartidasTotales = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "ANALISIS_TOTALES"),
          where("cve_tecFin", "==", cve_tecFin)
        )
      );
      const par_levDigList1 = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTotalesDoc(par_levDigList1);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    obtenerPartidasTotales();
  }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  //console.log("Prueba" + par_PreCoti_insu);
  /* ------------------------------------ OBTENER TABLA DE TRABAJADORES -------------------------------*/
  const obtenerPartidasMO = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_TECFIN_MO"),
          where("cve_tecFin", "==", cve_tecFin)
        )
      );

      const par_levDigList1 = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log("Datos de PAR_PRECOTIZACION_INSU:", par_levDigList1);
      par_levDigList1.sort((a, b) => a.noPartidaMO - b.noPartidaMO);
      setListMO(par_levDigList1);
      const maxPartida = Math.max(
        ...par_levDigList1.map((item) => item.noPartidaMO),
        0
      );
      //console.log("max Partida: " + maxPartida)
      setNoParatidaMO(maxPartida + 1);
      //console.log("max Partida: " + maxPartida)
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    obtenerPartidasMO();
  }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  //console.log("Prueba" + par_PreCoti_insu);

  const obtenerTrabajadores = async () => {
    try {
      const data = await getDocs(collection(db, "PERSONAL"));
      const manoObraList = data.docs.map((doc) => doc.data().personal);

      return manoObraList;
    } catch (error) {
      console.error("Error al obtener datos de PERSONAL:", error);
      return [];
    }
  };

  /*useEffect(() => {
    const cargarManoObra = async () => {
      const manoObraList = await obtenerTrabajadores();
      //console.log(manoObraList)
      setManoObra(manoObraList);
    };

    cargarManoObra();
  }, [manoObra]);*/
  useEffect(() => {
    const cargarManoObra = async () => {
      const manoObraList = await obtenerTrabajadores();
      //console.log(manoObraList)
      setManoObra(manoObraList);
    };

    cargarManoObra();
  }, []);
  /* ------------------------------------ - AGREGAR NUEVO DOCUMENTO -------------------------------*/
  const updateEncabezado = async (e) => {
    e.preventDefault();
    const preCotRef = doc(db, "PRECOTIZACION", id);
    const datos = {
      cve_precot: cve_precot,
      cve_clie: cve_clie,
      fechaElaboracion: fechaElaboracion,
      fechaFin: fechaFin,
      fechaInicio,
    };
    await updateDoc(preCotRef, datos);
    navigate("/precotizacion");
  };

  /* -------------------------------------- Eliminar partidas de levantamiento dígital en precotización ----------------------------  */
  /* ----------------------------------- ENCONTRAR FACTORES POR PARTIDA -------------------------------------*/
  /*   ---------------------------------- AGREGAR PARTIDAS DE INSUMOS ----------------------------- */
  /* ----------------------------------------------------AQUÍ ME QUEDE ---------------*/

  const recolectarDatos = (
    id,
    noPartida,
    descripcion,
    observacion
  ) => {
    setSelectedPartida({ id, noPartida}); // Asegura que el número de partida está definido
    setCantidad(cantidad);
    setDescripcion(descripcion);
    setObservacion(observacion);

    setShow(true); // Abrir el modal
  };

  const editarPartida = async () => {
    alert(idPartidaEdit);
    const preCotizacionRef = doc(db, "ANALISIS_TOTALES", idPartidaEdit);
    const datos = {
      descripcion: descripcion,
      observacion: observacion,
    };
    await updateDoc(preCotizacionRef, datos);
    window.location.reload();
  };

  const recolectarDatosTotales = async (idTotales) => {
    const parInsumoDOC = await getDoc(doc(db, "ANALISIS_TOTALES", idTotales));
    if (parInsumoDOC.exists()) {
      setIdPartidaEdit(idTotales);
      setCantidadTotalesEdit(parInsumoDOC.data().cantidad);
      setInsumosEdit(parInsumoDOC.data().totalInsumo);
      setManoObraEdit(parInsumoDOC.data().totalMO);
      setFactorajeEdit(parInsumoDOC.data().factorajePorcentaje);
      setCostoFijoEdit(parInsumoDOC.data().costoFijoPorcentaje);
      setUtilidadEdit(parInsumoDOC.data().utilidadPorcentaje);
    } else {
      console.log("El cliente no existe");
    }
    /*
    setFactorajeEdit(factoraje)
    setCostoFijoEdit(costoFijo)
    setUtilidadEdit(utilidad)*/
  };
  const limpiarCampos = () =>{
    setTot(false);
    setSelectedPartida(null);
    setCantidadTotalesEdit("");
    setCostoFijoEdit("");
    setUtilidadEdit("");
  }
const openModal = async (noPartida) => {
  limpiarCampos();
  try {
    console.log("🔄 Abriendo modal para Insumos. No. Partida:", noPartida);

    // 🟢 Establecer el número de partida correctamente
    //setSelectedPartida({ noPartida });

    setTot(true);
  } catch (error) {
    console.error("⚠️ Error al obtener los datos necesarios:", error);
  }
};
  const editarPartidaTotales = async () => {
    const preCotizacionRef = doc(db, "ANALISIS_TOTALES", idPartidaEdit);
    const subtotalPartida = insumosEdit + manoObraEdit;
    const factorIndirectoPor =
      parseInt(factorajeEdit) + parseInt(costoFijoEdit);
    const factorIndirectoNum = factorIndirectoPor / 100;
    const valorInsumos = parseInt(cantidadTotalesEdit) * insumosEdit;
    const costoUnitarioC = subtotalPartida * (factorIndirectoNum + 1);
    const costoFactorizadoC = parseInt(cantidadTotalesEdit) * costoUnitarioC;
    const precioXpartidaC =
      costoFactorizadoC / (1 - parseInt(utilidadEdit) / 100);
    const utilidaEsperada = precioXpartidaC - costoFactorizadoC;

    const datos = {
      cantidad: parseInt(cantidadTotalesEdit),
      valorInsumos: valorInsumos,
      costoXpartida: parseInt(cantidadTotalesEdit) * subtotalPartida,
      factorajePorcentaje: factorajeEdit,
      costoFijoPorcentaje: costoFijoEdit,
      factorIndirectoPorcentaje: factorIndirectoPor,
      costoUnitario: costoUnitarioC,
      costoFactorizado: costoFactorizadoC,
      utilidadPorcentaje: parseInt(utilidadEdit),
      precioXpartida: precioXpartidaC,
      utilidaEsperada: utilidaEsperada,
    };
    await updateDoc(preCotizacionRef, datos);
    //window.location.href = window.location.href;
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Editar revisión técnico financiero</h1>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">FOLIO</label>
                <input
                  className="form-control"
                  id="inputFolioSecuencial"
                  type="text"
                  value={cve_tecFin}
                  onChange={(e) => setPrecot(e.target.value)}
                  readOnly
                />
              </div>
            </div>
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

            <div className="col-md-2">
              <label className="form-label">Folio Monday: </label>
              <div className="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={idMonday}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Validar: solo números positivos y máximo 10 dígitos
                    if (/^\d{0,10}$/.test(value)) {
                      setIdMonday(value);
                    }
                  }}
                  className="form-control"
                  readOnly
                  min="0"
                  max="9999999999"
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
          <div
            className="row"
            style={{ border: "1px solid #000", borderColor: "gray" }}
          >
            <div className="col-md-2">
              <label className="form-label">NO. PARTIDA</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="text"
                  value={noPartidaEdit}
                  onChange={(e) => setNoPartidaEdit(e.target.value)}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-5 ">
              <label className="form-label">DESCRIPCIÓN</label>
              <div class="input-group mb-3">
                <textarea
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-5 ">
              <label className="form-label">OBSERVACIONES</label>
              <div class="input-group mb-3">
                <textarea
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="text"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6 ">
              <button className="btn btn-success" onClick={editarPartida}>
                <CiCirclePlus />
                Editar partidas
              </button>
            </div>
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No. Partida</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col">Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {totalesDoc.map((item, index) => (
                    <tr key={index}>
                      <td>{item.noPartidaATF}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.observacion}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            recolectarDatos(
                              item.id,
                              item.noPartidaATF,
                              item.descripcion,
                              item.observacion
                            )
                          }
                        >
                          <FaPencilAlt />{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <br></br>
          <div className="row" style={{ border: "1px solid #000" }}>
            <label style={{ color: "red" }}>TOTALES </label>
            {/*<div className="col-md-3 ">
              <label className="form-label">Cantidad</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={cantidadTotalesEdit}
                  onChange={(e) => setCantidadTotalesEdit(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3 ">
              <label className="form-label">Factoraje (%)</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={factorajeEdit}
                  onChange={(e) => setFactorajeEdit(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3 ">
              <label className="form-label">Costo fijo (%)</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={costoFijoEdit}
                  onChange={(e) => setCostoFijoEdit(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3 ">
              <label className="form-label">Utilidad (%)</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={utilidadEdit}
                  onChange={(e) => setUtilidadEdit(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>*/}
            <div className="col-md-6 ">
              <button
                className="btn btn-success"
                onClick={openModal}
              >
                <CiCirclePlus />
                Totales
              </button>
            </div>
            <br></br>
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No. Partida</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Insumo</th>
                    <th scope="col">Mano de obra</th>
                    <th scope="col">Valor de insumos</th>
                    <th scope="col">Costo por partida</th>
                    <th scope="col">Factoraje</th>
                    <th scope="col">Fijos</th>
                    <th scope="col">Factor indirecto</th>
                    <th scope="col">Costo unitario</th>
                    <th scope="col">Costo factorizado</th>
                    <th scope="col">Factor utilidad</th>
                    <th scope="col">Precio por partida</th>
                    <th scope="col">Utilidad esperada</th>
                    <th scope="col">Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {totalesDoc.map((itemTotal, indexPC) => (
                    <tr key={indexPC}>
                      <td>{itemTotal.noPartidaATF}</td>
                      <td>{itemTotal.cantidad}</td>
                      <td>
                        {(itemTotal.totalInsumo * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>
                        {(itemTotal.totalMO * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>
                        {(itemTotal.valorInsumos * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>
                        {(itemTotal.costoXpartida * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>{itemTotal.factorajePorcentaje}%</td>
                      <td>{itemTotal.costoFijoPorcentaje}%</td>
                      <td>{itemTotal.factorIndirectoPorcentaje}%</td>
                      <td>
                        {(itemTotal.costoUnitario * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>
                        {(itemTotal.costoFactorizado * 1).toLocaleString(
                          "en-US",
                          { style: "currency", currency: "USD" }
                        )}
                      </td>
                      <td>{itemTotal.utilidadPorcentaje}%</td>
                      <td>
                        {(itemTotal.precioXpartida * 1).toLocaleString(
                          "en-US",
                          { style: "currency", currency: "USD" }
                        )}
                      </td>
                      <td>
                        {(itemTotal.utilidaEsperada * 1).toLocaleString(
                          "en-US",
                          { style: "currency", currency: "USD" }
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => recolectarDatosTotales(itemTotal.id)}
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <br></br>
          <div className="row" style={{ border: "1px solid #000" }}>
            <label style={{ color: "red" }}>PARTIDAS POR INSUMO </label>
            <br></br>
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No. Partida</th>
                    <th scope="col">Tipo de insumo</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Costo</th>
                    <th scope="col">Total sin factores</th>
                  </tr>
                </thead>
                <tbody>
                  {par_PreCoti_insu.map((itemPC, indexPC) => (
                    <tr key={indexPC}>
                      <td>{itemPC.noPartidaATF}</td>
                      <td>{itemPC.insumo}</td>
                      <td>{itemPC.cantidad + " " + itemPC.unidad}</td>
                      <td>
                        {(itemPC.costoCotizado * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>
                        {(
                          itemPC.cantidad * itemPC.costoCotizado
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row" style={{ border: "1px solid #000" }}>
            <label style={{ color: "red" }}>PARTIDAS POR MANO DE OBRA </label>
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No Partida</th>
                    <th scope="col">No. Personal</th>
                    <th scope="col">Trabajador</th>
                    <th scope="col">Días trabajados</th>
                    <th scope="col">Costo lider</th>
                    <th scope="col">Valor lider</th>
                  </tr>
                </thead>
                <tbody>
                  {listMO.map((itemMO, indexMO) => (
                    <tr key={indexMO}>
                      <td>{itemMO.noPartidaMO}</td>
                      <td>{itemMO.cantidadTrabajadores}</td>
                      <td>{itemMO.personal}</td>
                      <td>{itemMO.diasTrabajados}</td>
                      <td>
                        {(itemMO.costoLider * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>
                        {(itemMO.valorLider * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/*---------------------------------------------------------------------------------------------------*/}
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
              value={selectedPartida?.noPartida || ""}
              readOnly
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
      <Modal
        show={tot}
        onHide={closeTot}
        dialogClassName="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Totales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Cantidad</label>
            <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={cantidadTotalesEdit}
                  onChange={(e) => setCantidadTotalesEdit(e.target.value)}
                  className="form-control"
                />
          </div>
          <div className="mb-3">
            <label>Costo Fijo</label>
            <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={costoFijoEdit}
                  onChange={(e) => setCostoFijoEdit(e.target.value)}
                  className="form-control"
                />
          </div>
          <div className="mb-3">
            <label>Utilidad </label>
            <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={utilidadEdit}
                  onChange={(e) => setUtilidadEdit(e.target.value)}
                  className="form-control"
                />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTot}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={editarPartidaTotales}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditarRecTecFinanciero;
