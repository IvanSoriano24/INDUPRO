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
      console.log(partidaRef);
      await updateDoc(partidaRef, {
        descripcion: descripcion,
        observacion: observacion,
      });
      setShow(false); // Cierra el modal
      // getParLevDigital(); // Actualiza la tabla
      window.location.reload();
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
  const [totalInsumosEdit, setTotalInsumosEdit] = useState("");
  const [valorInsumosEdit, setValorInsumosEdit] = useState("");
  const [cantidadEdit, setCantidadEdit] = useState("");
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
      console.log("Datos de PAR_TECFIN_INSU:", par_levDigList1);
      par_levDigList1.sort((a, b) => a.noPartidaATF - b.noPartidaATF);
      setPar_PreCoti_insu(par_levDigList1);
      const maxPartida = Math.max(
        ...par_levDigList1.map((item) => item.noPartidaATF),
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

      const docs = data.docs.map((docSnap) => {
        const docData = { ...docSnap.data(), id: docSnap.id };
        return docData;
      });

      for (const item of docs) {
        const cantidad = parseFloat(item.cantidad || 0);
        const totalInsumos = parseFloat(item.totalInsumo || 0);
        const costoFijo = parseFloat(item.costoFijoPorcentaje || 0);
        const utilidad = parseFloat(item.utilidadPorcentaje || 0);

        const costoDirecto = totalInsumos * cantidad;
        const costoIntegrado = costoDirecto * (1 + costoFijo / 100);
        const precioPorPartida = costoIntegrado * (1 + utilidad / 100);
        const precioUnitario = precioPorPartida / cantidad;
        const utilidadMonetaria = precioPorPartida - costoIntegrado;

        // Si los datos están desactualizados, actualízalos
        const diferencia = Math.abs(
          (item.precioXpartida || 0) - precioPorPartida
        );
        if (diferencia > 1) {
          // Solo si hay una diferencia significativa
          const partidaRef = doc(db, "ANALISIS_TOTALES", item.id);
          await updateDoc(partidaRef, {
            costoIntegrado: costoIntegrado,
            precioXpartida: precioPorPartida,
            precioUnitario: precioUnitario,
            utilidadEsperada: utilidadMonetaria,
          });
        }
      }

      // Ahora sí actualiza el estado local
      docs.sort((a, b) => a.noPartidaATF - b.noPartidaATF);
      setTotalesDoc(docs);
    } catch (error) {
      console.error("Error al obtener y actualizar ANALISIS_TOTALES:", error);
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

  const recolectarDatos = (id, noPartida, descripcion, observacion) => {
    setSelectedPartida({ id, noPartida }); // Asegura que el número de partida está definido
    setCantidad(cantidad);
    setDescripcion(descripcion);
    setObservacion(observacion);
    setIdPartida(id);
    setShow(true); // Abrir el modal
  };

  const editarPartida = async () => {
    //const preCotizacionRef = doc(db, "ANALISIS_TOTALES", idPartidaEdit);
    const datos = {
      descripcion: descripcion,
      observacion: observacion,
    };
    console.log(datos);
    /*await updateDoc(preCotizacionRef, datos);
    window.location.reload();*/
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
  const limpiarCampos = () => {
    setTot(false);
    setSelectedPartida(null);
    setCantidadTotalesEdit("");
    setCostoFijoEdit("");
    setUtilidadEdit("");
  };
  const openModal = async (noPartida, item) => {
    console.log(item);
    limpiarCampos();
    try {
      setCostoFijoEdit(item.costoFijoPorcentaje);
      setUtilidadEdit(item.utilidadPorcentaje);
      setIdPartidaEdit(item.id);
      setTotalInsumosEdit(item.totalInsumo);
      setCantidadEdit(item.cantidad);
      setValorInsumosEdit(item.valorInsumos);
      

      // 🟢 Establecer el número de partida correctamente
      //setSelectedPartida({ noPartida });

      setTot(true);
    } catch (error) {
      console.error("⚠️ Error al obtener los datos necesarios:", error);
    }
  };
  const editarPartidaTotales = async () => {
    const preCotizacionRef = doc(db, "ANALISIS_TOTALES", idPartidaEdit);

    const cantidad = parseFloat(cantidadEdit || 0);
    const totalInsumos = parseFloat(totalInsumosEdit || 0);
    const costoFijo = parseFloat(costoFijoEdit || 0);
    const utilidad = parseFloat(utilidadEdit || 0);
    const valorInsumos = parseFloat(valorInsumosEdit || 0);
    

    // Paso 1: Costo directo
    const costoDirecto = totalInsumos * cantidad;

    // Paso 2: Costo integrado con costo fijo
    const costoIntegrado = costoDirecto * (1 + costoFijo / 100);

    // Paso 3: Aplicar utilidad sobre el costo integrado
    const precioPorPartida = valorInsumos * (1 + utilidad / 100);

    // Paso 4: Precio unitario
    const precioUnitario = precioPorPartida / cantidad;

    // Utilidad monetaria (solo si necesitas almacenarla aparte)
    const utilidadMonetaria = precioPorPartida - costoIntegrado;

    const datos = {
      costoFijoPorcentaje: costoFijo,
      utilidadPorcentaje: utilidad,
      costoIntegrado: costoIntegrado,
      precioXpartida: precioPorPartida,
      precioUnitario: precioUnitario,
      utilidadEsperada: utilidadMonetaria,
    };

    await updateDoc(preCotizacionRef, datos);
    await obtenerPartidasTotales(); // Recarga datos
    closeTot(); // Cierra modal
  };
const calcularTotales = (item) => {
  const insumo = Number(item.totalInsumo ?? 0);
  const cantidad = Number(item.cantidad ?? 0);
  const costoFijo = Number(item.costoFijoPorcentaje ?? 0);
  const utilidad = Number(item.utilidadPorcentaje ?? 0);

  const valorInsumos = insumo * cantidad;
  const costoIntegrado = valorInsumos * (1 + costoFijo / 100);
  const precioXpartida = costoIntegrado / (1 - utilidad / 100 || 1);
  const precioUnitario = precioXpartida / (cantidad || 1);

  return {
    valorInsumos,
    costoIntegrado,
    precioXpartida,
    precioUnitario
  };
};

/* 
<tbody>
  {totalesDoc.map((itemTotal, indexPC) => {
    const {
      valorInsumos,
      costoIntegrado,
      precioXpartida,
      precioUnitario
    } = calcularTotales(itemTotal);

    return (
      <tr key={indexPC}>
        <td>{itemTotal.noPartidaATF ?? "-"}</td>
        <td>{itemTotal.cantidad ?? 0}</td>
        <td style={{ textAlign: "right" }}>
          {(itemTotal.totalInsumo ?? 0).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </td>
        <td style={{ textAlign: "right" }}>
          {valorInsumos.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </td>
        <td style={{ textAlign: "center" }}>
          {itemTotal.costoFijoPorcentaje ?? 0}%
        </td>
        <td style={{ textAlign: "right" }}>
          {costoIntegrado.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </td>
        <td style={{ textAlign: "center" }}>
          {itemTotal.utilidadPorcentaje ?? 0}%
        </td>
        <td style={{ textAlign: "right" }}>
          {precioXpartida.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </td>
        <td style={{ textAlign: "right" }}>
          {precioUnitario.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </td>
        <td style={{ textAlign: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => openModal(itemTotal.id, itemTotal)}
          >
            <FaPencilAlt />
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
*/

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Editar Revisión Técnico Financiero</h1>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Folio</label>
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
                  readOnly
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
                  readOnly
                />
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
                  readOnly
                />
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
                  readOnly
                />
              </div>
            </div>
          </div>
          <div
            className="row"
            style={{ border: "1px solid #000", borderColor: "gray" }}
          >
            {/*<div className="col-md-2">
              <label className="form-label">No. Partida</label>
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
              <label className="form-label">Descripción</label>
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
              <label className="form-label">Observaciones</label>
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
            </div>*/}
            {/*<div className="col-md-6 ">
              <button className="btn btn-success" onClick={editarPartida}>
                <CiCirclePlus />
                Editar Partidas
              </button>
            </div>*/}
            <div
              style={{
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
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
            <label style={{ color: "red" }}>Totales </label>
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
            {/*<div className="col-md-6 ">
              <button className="btn btn-success" onClick={openModal}>
                <CiCirclePlus />
                Totales
              </button>
            </div>*/}
            <br></br>
            <br></br>
            <div
              style={{
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              {/*CALCULOS - VISTA*/}
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No. Partida</th> {/*1*/}
                    <th scope="col">Cantidad</th> {/*2*/}
                    <th scope="col">Insumo</th> {/*3*/}
                    <th scope="col">Valor de insumos</th> {/*4*/}
                    <th scope="col">Indirecto</th> {/*5*/}
                    <th scope="col">Costo Integrado</th> {/*6*/} {/*AQUI*/}
                    <th scope="col">Factor utilidad</th> {/*9*/}
                    <th scope="col">Precio por Partida</th> {/*10*/}
                    <th scope="col">Precio Unitario</th>
                    <th scope="col">Editar Factores</th>
                  </tr>
                </thead>
                <tbody>
                  {totalesDoc.map((itemTotal, indexPC) => (
                    <tr key={indexPC}>
                      <td>{itemTotal.noPartidaATF ?? "-"}</td>
                      <td>{itemTotal.cantidad ?? 0}</td>
                      <td style={{ textAlign: "right" }}>
                        {(itemTotal.totalInsumo ?? 0).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {(
                          (itemTotal.totalInsumo ?? 0) *
                          (itemTotal.cantidad ?? 0)
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {itemTotal.costoFijoPorcentaje ?? 0}%
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {(itemTotal.costoIntegrado ?? 0).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </td>
                      
                      <td style={{ textAlign: "center" }}>
                        {itemTotal.utilidadPorcentaje ?? 0}%
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {(itemTotal.valorInsumos ?? 0).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {(itemTotal.precioUnitario ?? 0).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => openModal(itemTotal.id, itemTotal)}
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
            <label style={{ color: "red" }}>Partidas por Insumo </label>
            <br></br>
            <div
              style={{
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: "center" }}>
                      No. Partida
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      Tipo de insumo
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      Cantidad
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      Costo
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      Total sin Factores
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {par_PreCoti_insu.map((itemPC, indexPC) => (
                    <tr key={indexPC}>
                      <td style={{ textAlign: "center" }}>
                        {itemPC.noPartidaATF}
                      </td>
                      <td style={{ textAlign: "center" }}>{itemPC.insumo}</td>
                      <td style={{ textAlign: "center" }}>
                        {itemPC.cantidad + " " + itemPC.unidad}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {(itemPC.costoCotizado * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td style={{ textAlign: "right" }}>
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
          <br></br>
          <br></br>
          <div className="row" style={{ border: "1px solid #000" }}>
            <label style={{ color: "red" }}>Partidas por Mano de Obra </label>
            <div
              style={{
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No Partida</th>
                    <th scope="col">No. Personal</th>
                    <th scope="col">Trabajador</th>
                    <th scope="col">Días trabajados</th>
                    {/*<th scope="col">Costo lider</th>
                    <th scope="col">Valor lider</th>*/}
                  </tr>
                </thead>
                <tbody>
                  {listMO.map((itemMO, indexMO) => (
                    <tr key={indexMO}>
                      <td>{itemMO.noPartidaMO}</td>
                      <td>{itemMO.cantidadTrabajadores}</td>
                      <td>{itemMO.personal}</td>
                      <td>{itemMO.diasTrabajados}</td>
                      {/*<td>
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
                      </td>*/}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <br></br>
          <div className="buttons-container">
            <Link to="/revTecnicoFinanciero">
              <button className="btn btn-danger">Regresar</button>
            </Link>
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
      {/*---------------------------------------------------------------------------------------------------*/}
      <Modal show={tot} onHide={closeTot} dialogClassName="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Totales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Costo Indirecto (%)</label>
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
            <label>Utilidad (%)</label>
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
