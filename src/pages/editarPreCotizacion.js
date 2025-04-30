import React, { useState, useEffect, useRef } from "react";
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
import swal from "sweetalert2";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle, Modal, Form, Button } from "react-bootstrap";

import axios from "axios";
import Select from "react-select";
import * as XLSX from "xlsx";

const EditarPreCotizacion = () => {
  const [claveSae, setClaveSae] = useState(""); // Estado para la clave SAE
  const [clavesSAE, setClavesSAE] = useState([]);
  const [idPartida, setIdPartida] = useState("");
  const [showAddModalMO, setShowAddModalMO] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPartida, setSelectedPartida] = useState(null);
  const [lineas, setLineas] = useState([]); // Lista de líneas disponibles
  const [linea, setLinea] = useState(""); // Estado para la línea seleccionada
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [familia, setFamilia] = useState("");
  const [familias, setFamilias] = useState([]);
  const [subLinea, setSubLinea] = useState("");
  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  const [proveedores, setProveedores] = useState([]);

  const [listPartidas, setListPartidas] = useState([]);
  const [listMano, setListMano] = useState([]);

  const [cve_precot, setPrecot] = useState("");
  const [par_preCot, setPar_preCot] = useState([]);

  const [cve_levDig, setCve_levDig] = useState("");
  const [folios, setFolios] = useState([]);
  const [selectedFolio, setSelectedFolio] = useState("");
  const [folioSiguiente, setFolioSiguiente] = useState(1);
  const [cve_clie, setCve_clie] = useState("");
  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [docAnt, setDocAnt] = useState("N/A");
  const [docSig, setDocSig] = useState("");
  const [estatus, setEstatus] = useState("Activo");

  const [cve_levDig_par, setLevDigital_par] =
    useState(""); /* Este es el campo que agregue */
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [list, setList] = useState([]);
  const [par_levDigital, setPar_levDigital] = useState([]);
  const [noPartida, setNoPartida] = useState("");
  const [listPreCot, setListPreCot] = useState([]);
  /* --------------------------- PARTIDAS DE INSUMO -----------*/

  const [factores, setFactores] = useState([]);
  const [par_PreCoti_insu, setPar_PreCoti_insu] = useState([]);
  const [contadorDecimal, setContadorDecimal] = useState(0.1);
  const [insumo, setInsumo] = useState("");
  const [no_subPartida, setNoSubPartida] = useState("");
  const [noPartidaPC, setNoPartidaPC] = useState();
  const [noPartidaP, setNoPartidaP] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [unidad, setUnidad] = useState("");
  const [docAnteriorPPC, setDocAnteriorPPC] = useState("");
  const [descripcionInsumo, setDescripcionInsumo] = useState("");
  const [comentariosAdi, setComentariosAdi] = useState("");
  const [costoCotizado, setCostoCotizado] = useState();
  const [cantidad, setCantidad] = useState();
  const total = costoCotizado * cantidad;

  /* --------------------------------PARTIDAS PARA MANO DE OBRA -----------------*/
  const [manoObra, setManoObra] = useState([]);
  const [selectedTrabajador, setSelectedTrabajador] = useState("");
  const [diasTrabajados, setDiasTrabajados] = useState("");
  const [noPartidaMO, setNoParatidaMO] = useState(1);
  const [cve_precotMO, setCve_precotMO] = useState("");
  const [personal, setPersonal] = useState("");
  const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
  const [editIndex, setEditIndex] = useState(null);
  const [listMO, setListMO] = useState([]);
  const [cantidadTrabajadores, setCantidadTrabajadores] = useState();

  /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
  const partida_levDig = collection(db, "PAR_LEVDIGITAL");
  const parPrecotizacion = collection(db, "PAR_PRECOTIZACION");
  const precotizacioncoleccion = collection(db, "PRECOTIZACION");
  const parPrecotizacionInsumos = collection(db, "PAR_PRECOTIZACION_INSU");
  const parPrecotizacionMO = collection(db, "PAR_PRECOTIZACION_MO");
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(false);

  /*******************************************************************/
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modoModal, setModoModal] = useState("Crear");
  const inputFileRef = useRef(null); // 👈 Creamos referencia
  /*******************************************************************/

  const handleClose = () => {
    setShow(false);
    setSelectedPartida(null);
    setCantidad("");
    setDescripcion("");
    setObservacion("");
  };
  const handleShow = () => setShow(true);

  const [idMonday, setIdMonday] = useState("");
  /* ---------------------JALAR INFORMACIÓN DE DOCUMENTO ANTERIOR ------------------------------------- */
  const getFactoresById = async (id) => {
    const factoresDOC = await getDoc(doc(db, "PRECOTIZACION", id));
    if (factoresDOC.exists()) {
      setPrecot(factoresDOC.data().cve_precot);
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
  /*const getFactoresById = (setFactores) => {
    console.log("🛠️ Suscribiéndose a cambios en FACTORES...");
  
    const unsubscribe = onSnapshot(collection(db, "PRECOTIZACION"), (snapshot) => {
      const factoresList = snapshot.docs.map((doc) => doc.data().nombre);
      setFactores(factoresList);
  
      console.log("📌 Datos de FACTORES actualizados:", factoresList);
    });
  
    // Cleanup: nos desuscribimos si el componente se desmonta
    return unsubscribe;
  };
  
  useEffect(() => {
    console.log("🛠️ useEffect ejecutado para FACTORES");
    const unsubscribe = getFactoresById(setFactores);
  
    return () => {
      console.log("❌ Desuscribiendo de FACTORES");
      unsubscribe && unsubscribe();
    };
  }, []); // 🔹 Eliminamos `factores` de las dependencias*/

  /*-------------------------------------------------------------------------------------------------------*/
  const limpiarPartida = () => {
    setDescripcion("");
    setCantidad(0);
    setObservacion("");
    setIdPartida("");
    setNoPartidaP(0);
  };
  const recolectarDatos = (
    id,
    cve_levDig,
    noPartida,
    cantidad,
    descripcion,
    observacion
  ) => {
    limpiarPartida();
    console.log("Recolectando partida:", noPartida);

    setNoPartidaP(noPartida ? String(noPartida).trim() : "N/A");

    setCantidad(cantidad || "");
    setDescripcion(descripcion || "");
    setObservacion(observacion || "");
    setIdPartida(id);
    //console.log("PartidaP: ", noPartidaP);
    setShow(true);
    console.log("PartidaP: ", noPartidaP);
  };
  const guardarEdicion = async () => {
    swal.fire({
      title: "Procesando Solicitud...",
      text: "Por favor espera mientras se valida el contenido.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        swal.showLoading();
      },
    });

    if (cantidad <= 0) {
      swal.close();
      swal.fire({
        icon: "warning",
        title: "Error Cantidad",
        text: "La cantidad no puede ser menor o igual a 0.",
      });
      return;
    }
    if (idPartida) {
      const partidaRef = doc(db, "PAR_PRECOTIZACION", idPartida);
      await updateDoc(partidaRef, {
        cantidad: cantidad,
        descripcion: descripcion,
        observacion: observacion,
      });
      swal.close();

      swal
        .fire({
          icon: "success",
          title: "Guardado",
          text: "Partida Guardada.",
        })
        .then(() => {
          setShow(false); // Cierra el modal
          //getParLevDigital(); // Actualiza la tabla
        });
    } else {
      alert("Fallo");
    }
  };
  const handleDeleteInsumo = async (noPartida, insumoId) => {
    try {
      console.log(
        "🔍 Eliminando insumo ID:",
        insumoId,
        " de la partida:",
        noPartida
      );

      // 🛑 **Mostrar alerta de confirmación con `Swal`**
      const confirmDelete = await swal.fire({
        title: "Eliminar Insumo",
        text: "¿Seguro que deseas eliminar este insumo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!confirmDelete.isConfirmed) return;

      // 🗑️ **Eliminar insumo en Firestore**
      const insumoRef = doc(db, "PAR_PRECOTIZACION_INSU", insumoId);
      await deleteDoc(insumoRef);
      console.log("✅ Insumo eliminado correctamente.");

      // 🔄 **Actualizar el estado en React**
      setListPartidas((prev) =>
        prev.map((partida) => {
          if (partida.noPartida === noPartida) {
            return {
              ...partida,
              insumos: partida.insumos.filter(
                (insumo) => insumo.id !== insumoId
              ),
            };
          }
          return partida;
        })
      );

      // 🎉 **Mostrar mensaje de éxito**
      swal.fire({
        title: "Eliminación Exitosa",
        text: "El insumo ha sido eliminado.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("⚠️ Error al eliminar el insumo:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar el insumo. Intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };
  const DeletePartidaMO = async (noPartidaMO, partidaMOId) => {
    try {
      console.log(
        "🔍 Eliminando partida de Mano de Obra ID:",
        partidaMOId,
        " de la partida:",
        noPartidaMO
      );

      // 🛑 **Mostrar alerta de confirmación con `Swal`**
      const confirmDelete = await swal.fire({
        title: "Eliminar Mano de Obra",
        text: "¿Seguro que deseas eliminar esta partida de mano de obra?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!confirmDelete.isConfirmed) return;

      // 🗑️ **Eliminar la partida de mano de obra en Firestore**
      const partidaMORef = doc(db, "PAR_PRECOTIZACION_MO", partidaMOId);
      await deleteDoc(partidaMORef);
      console.log("✅ Partida de mano de obra eliminada correctamente.");

      // 🔄 **Actualizar el estado en React**
      setListMO((prev) => prev.filter((mo) => mo.id !== partidaMOId));

      // 🎉 **Mostrar mensaje de éxito**
      swal.fire({
        title: "Eliminación Exitosa",
        text: "La partida de mano de obra ha sido eliminada.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("⚠️ Error al eliminar la partida de mano de obra:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar la partida de mano de obra. Intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };
  const limpiarCampos = () => {
    setInsumo("");
    setCantidad(0);
    setUnidad("");
    setCategoria("");
    setFamilia("");
    setLinea("");
    setClaveSae("");
    setCostoCotizado(0);
    setComentariosAdi("");
    setDescripcionInsumo("");
  };
  const limpiarCamposMO = () => {
    setSelectedTrabajador("");
    setCantidadTrabajadores(0);
    setDiasTrabajados(0);
  };
  const handleOpenModal = async (noPartida) => {
    limpiarCampos();
    setModoModal("Crear");
    try {
      console.log("🔄 Abriendo modal para Insumos. No. Partida:", noPartida);

      // 🟢 Establecer el número de partida correctamente
      setSelectedPartida({ noPartida });

      // 🟢 Reiniciar valores del formulario
      setCantidad(0);
      setCostoCotizado(0);
      let listaInsumos = [...clavesSAE];

      //if (clavesSAE.length === 0) {
      console.log("🔄 Cargando claves SAE antes de editar...");
      const responseInsumos = await axios.get(
        //"http://localhost:5000/api/clave-sae"
        "/api/clave-sae"
      );

      // ✅ Transformamos la respuesta para tener claves limpias y legibles
      listaInsumos = responseInsumos.data.map((item) => ({
        clave: item.CVE_ART.trim(), // quitamos espacios
        descripcion: item.DESCR?.trim(), // opcionalmente también aquí
      }));

      setClavesSAE(listaInsumos);
      //console.log("📦 clavesSAE cargadas:", listaInsumos);
      //}

      // 🟢 Buscar la clave SAE actual del insumo que se está editando
      /*const insumoEncontrado = listaInsumos.find(
        (item) => item.clave === insumo.claveSae?.trim() // importante hacer trim
      );
  
      // ✅ Establecer la clave seleccionada con delay para que el select esté listo
      setTimeout(() => {
        setClaveSae(insumoEncontrado ? insumoEncontrado.clave : "");
      }, 100); // puedes ajustar el delay si lo necesitas*/

      setShowAddModal(true);
    } catch (error) {
      console.error("⚠️ Error al obtener los datos necesarios:", error);
    }
  };
  const handleOpenModalMO = (noPartida) => {
    limpiarCamposMO();
    setNoParatidaMO(noPartida); // Establece el noPartida seleccionado
    setShowAddModalMO(true); // Muestra el modal de Mano de Obra
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setProveedor("");
    setDescripcionInsumo("");
    setComentariosAdi("");
    setCostoCotizado("");
    setCantidad("");
    setUnidad("");
    setCategoria("");
    setFamilia("");
    setLinea("");
    setClaveSae("");
  };
  const guardarPartida = async () => {
    if (!selectedPartida || !insumo || !cantidad || !unidad || !claveSae) {
      swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Faltan datos para completar la operación.",
      });
      return;
    }
    if (cantidad <= 0) {
      swal.fire({
        icon: "warning",
        title: "Error Cantidad",
        text: "La cantidad no puede ser menor o igual a 0.",
      });
      return;
    }
    if (costoCotizado <= 0) {
      swal.fire({
        icon: "warning",
        title: "Error Costo",
        text: "El costo no puede ser menor o igual a 0.",
      });
      return;
    }

    try {
      // 🟢 Se mantiene la estructura original de la clave del proveedor (varchar(10))
      const proveedorConEspacios = proveedor || ""; // Si proveedor es null, lo dejamos como cadena vacía

      console.log(
        "🔍 Guardando partida con proveedor:",
        `"${proveedorConEspacios}"`
      );

      // 🟢 Construye el objeto con los datos a guardar
      const insumoData = {
        cve_precot: cve_precot, // Asegurar que el folio de la precotización se guarde
        noPartidaPC: parseInt(selectedPartida.noPartida, 10), // Convertir a número
        insumo,
        proveedor: proveedorConEspacios, // Guardar con espacios
        descripcionInsumo,
        comentariosAdi,
        unidad,
        costoCotizado,
        cantidad,
        total: costoCotizado * cantidad,
        categoria,
        familia,
        linea,
        claveSae,
        estatus: "Activo",
        fechaRegistro: new Date().toLocaleDateString(),
        fechaModificacion: new Date().toLocaleDateString(),
      };

      if (editIndex) {
        // 🟢 Obtener referencia al documento en Firestore
        const insumoRef = doc(db, "PAR_PRECOTIZACION_INSU", editIndex);
        const insumoDoc = await getDoc(insumoRef);

        if (insumoDoc.exists()) {
          // 🟢 Si el documento existe, actualizarlo
          await updateDoc(insumoRef, insumoData);
          console.log("✅ Insumo actualizado correctamente en Firestore");
        } else {
          console.warn("⚠️ El documento no existe, se creará uno nuevo.");
          await addDoc(parPrecotizacionInsumos, insumoData);
          console.log("✅ Insumo agregado correctamente en Firestore");
        }
      } else {
        // 🟢 Si no hay editIndex, significa que estamos creando un nuevo insumo
        await addDoc(parPrecotizacionInsumos, insumoData);
        console.log("✅ Insumo agregado correctamente en Firestore");
      }

      // 🔄 Resetear los valores después de guardar
      setEditIndex(null);
      setShowAddModal(false);
      window.location.reload(); // Recargar para reflejar cambios
    } catch (error) {
      console.error("⚠️ Error al guardar la partida:", error);
    }
  };
  const handleEditInsumo = async (partida, insumoId) => {
    try {
      setModoModal("Editar");

      // 🟢 Obtener el insumo desde Firestore
      const insumoDoc = await getDoc(
        doc(db, "PAR_PRECOTIZACION_INSU", insumoId)
      );

      if (!insumoDoc.exists()) {
        console.error("⚠️ Error: No se encontró el insumo en Firestore.");
        return;
      }

      const insumo = insumoDoc.data();
      console.log("🟢 Insumo obtenido desde Firestore:", insumo);

      // 🔄 Asignar valores al estado para mostrar en el modal
      setSelectedPartida({ noPartida: insumo.noPartidaPC });
      setInsumo(insumo.insumo);
      setCantidad(insumo.cantidad);
      setUnidad(insumo.unidad);
      setClaveSae(insumo.claveSae);
      setCostoCotizado(insumo.costoCotizado);
      setComentariosAdi(insumo.comentariosAdi);
      setDescripcionInsumo(insumo.descripcionInsumo);
      setProveedor(insumo.proveedor);
      console.log("Insumos: ", factores);

      // 🟢 Asegurar que los insumo estén cargados antes de asignar el insumo
      let listaInsumos = [...clavesSAE];

      if (clavesSAE.length === 0) {
        console.log("🔄 Cargando claves SAE antes de editar...");
        const responseInsumos = await axios.get(
          //"http://localhost:5000/api/clave-sae"
          "/api/clave-sae"
        );

        // ✅ Transformamos la respuesta para tener claves limpias y legibles
        listaInsumos = responseInsumos.data.map((item) => ({
          clave: item.CVE_ART.trim(), // quitamos espacios
          descripcion: item.DESCR?.trim(), // opcionalmente también aquí
        }));

        setClavesSAE(listaInsumos);
        //console.log("📦 clavesSAE cargadas:", listaInsumos);
      }

      // 🟢 Buscar la clave SAE actual del insumo que se está editando
      const insumoEncontrado = listaInsumos.find(
        (item) => item.clave === insumo.claveSae?.trim() // importante hacer trim
      );

      // ✅ Establecer la clave seleccionada con delay para que el select esté listo
      setTimeout(() => {
        setClaveSae(insumoEncontrado ? insumoEncontrado.clave : "");
      }, 100); // puedes ajustar el delay si lo necesitas

      console.log("📌 Clave SAE seleccionada:", insumo.claveSae);

      // 🟢 Guardar el ID del insumo en editIndex para saber que estamos editando
      setEditIndex(insumoId);

      // 🔄 Mostrar el modal de edición
      setShowAddModal(true);
    } catch (error) {
      console.error("⚠️ Error al obtener el insumo:", error);
    }
  };
  const handleSaveManoObra = async () => {
    if (
      !noPartidaMO ||
      !selectedTrabajador ||
      !cantidadTrabajadores ||
      !diasTrabajados
    ) {
      swal.fire({
        icon: "warning",
        title: "Falntan datos",
        text: "⚠️ Faltan datos para completar la operación.",
      });
      return;
    }
    if (cantidadTrabajadores <= 0) {
      swal.fire({
        icon: "warning",
        title: "Error Cantidad",
        text: "La cantidad de trabajadores no puede ser menor o igual a 0.",
      });
      return;
    }
    if (diasTrabajados <= 0) {
      swal.fire({
        icon: "warning",
        title: "Error Cantidad",
        text: "Los dias trabajados no pueden ser menor o igual a 0.",
      });
      return;
    }

    try {
      const today = new Date();
      const ahora = new Date();
      const hora = ahora.getHours();
      const minuto = ahora.getMinutes();
      const segundo = ahora.getSeconds();
      const formattedDate = today.toLocaleDateString(); // Formatea la fecha
      const horaFormateada = `${hora}:${minuto}:${segundo}`;

      // 🟢 Crear objeto con los datos de la partida de mano de obra
      const manoObraData = {
        cve_precot: cve_precot,
        noPartidaMO: noPartidaMO,
        personal:
          typeof selectedTrabajador === "object"
            ? selectedTrabajador.nombre
            : selectedTrabajador,
        cantidadTrabajadores: parseInt(cantidadTrabajadores, 10),
        diasTrabajados: parseInt(diasTrabajados, 10),
        estatus: "Activa",
        fechaRegistro: formattedDate,
        fechaModificacion: formattedDate,
      };

      if (editIndex) {
        // 🟢 Si estamos en modo edición, actualizar la partida en Firestore
        const partidaRef = doc(db, "PAR_PRECOTIZACION_MO", editIndex);
        await updateDoc(partidaRef, manoObraData);
        console.log(
          "✅ Partida de mano de obra actualizada correctamente en Firestore"
        );
      } else {
        // 🟢 Si no hay `editIndex`, agregar una nueva partida en Firestore
        await addDoc(parPrecotizacionMO, manoObraData);
        console.log(
          "✅ Partida de mano de obra agregada correctamente en Firestore"
        );
      }

      // 🟢 Registrar la operación en la bitácora
      const bitacora = collection(db, "BITACORA");
      await addDoc(bitacora, {
        cve_Docu: cve_precot,
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: editIndex
          ? "Edición de partida MO"
          : "Registro de partidas MO",
        noPartida: noPartidaMO,
      });

      // 🔄 Resetear los valores después de guardar
      setEditIndex(null);
      setShowAddModalMO(false);
      window.location.reload(); // Recargar para reflejar cambios
    } catch (error) {
      console.error("⚠️ Error al guardar la partida de mano de obra:", error);
    }
  };
  /* --------------------- JALAR INFORMACIÓN DE PARTIDAS ANTERIORES ------------------------------------- */
  const getParPreCot = (cve_precot, setPar_preCot, setNoPartida) => {
    if (!cve_precot) return; // Evita ejecutar la consulta si cve_precot es null o undefined

    console.log(
      `🛠️ Suscribiéndose a cambios en PAR_PRECOTIZACION con cve_precot: ${cve_precot}`
    );

    const q = query(
      collection(db, "PAR_PRECOTIZACION"),
      where("cve_precot", "==", cve_precot)
    );

    // Usamos `onSnapshot` para recibir actualizaciones en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const par_preCotList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Ordenar por número de partida
      par_preCotList.sort((a, b) => a.noPartida - b.noPartida);
      setPar_preCot(par_preCotList);

      // Obtener el número máximo de partida
      const maxPartida = Math.max(
        ...par_preCotList.map((item) => item.noPartida),
        0
      );
      setNoPartidaPC(maxPartida + 1);

      console.log(
        "📌 Datos de PAR_PRECOTIZACION actualizados:",
        par_preCotList
      );
    });

    // Cleanup: Nos desuscribimos si cve_precot cambia o el componente se desmonta
    return unsubscribe;
  };

  useEffect(() => {
    if (!cve_precot) return;

    console.log(`🛠️ useEffect ejecutado con cve_precot: ${cve_precot}`);
    const unsubscribe = getParPreCot(cve_precot, setPar_preCot, setNoPartida);

    return () => {
      console.log(
        "❌ Desuscribiendo de Firestore para cve_precot:",
        cve_precot
      );
      unsubscribe && unsubscribe();
    };
  }, [cve_precot]);

  /*EXCEL*/
  const limpiarArchivo = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = ""; // 👈 Limpiar el valor
    }
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      //reader.onload = (e) => {
      reader.onload = async (e) => {
        swal.fire({
          title: "Procesando archivo...",
          text: "Por favor espera mientras se valida el contenido.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            swal.showLoading();
          },
        });

        setSelectedFile(file); // Guardar el archivo en el estado

        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const headers = jsonData[0];
        const filteredData = [];
        let prevPartida = 0;
        let partidasConError = [];
        let isValid = true;

        for (let index = 0; index < jsonData.slice(1).length; index++) {
          const row = jsonData.slice(1)[index];
          const noPartida = String(row[0] || 0).trim();
          const insumoOriginal = String(row[1] || "").trim();
          const unidad = String(row[2] || "").trim();
          const claveSae = String(row[3] || "").trim();
          const proveedor = String(row[4] || "").trim();
          const descripcionInsumo = String(row[5] || "").trim();
          const comentariosAdi = String(row[6] || "").trim();
          const cantidad = String(row[7] || 0).trim();
          const costoCotizado = String(row[8] || 0).trim();

          const filaExcel = index + 2; // Recuerda que empieza en fila 2

          if (!validarNoPartida(noPartida, par_preCot)) {
            isValid = false;
            partidasConError.push(
              `Error en la fila ${filaExcel}: No. de partida no existe (${noPartida})`
            );
          }
          // 🔵 Validar cada campo y agregar mensajes específicos
          if (!validarInsumo(insumoOriginal)) {
            isValid = false;
            partidasConError.push(
              `Error en la fila ${filaExcel}: Insumo no válido (${insumoOriginal})`
            );
          }

          if (!validarUnidad(unidad)) {
            isValid = false;
            partidasConError.push(
              `Error en la fila ${filaExcel}: Unidad no válida (${unidad})`
            );
          }

          if (!validarCantidad(cantidad)) {
            isValid = false;
            partidasConError.push(
              `Error en la fila ${filaExcel}: La cantidad debe ser mayor o igual a 0`
            );
          }
          if (!validarCosto(costoCotizado)) {
            isValid = false;
            partidasConError.push(
              `Error en la fila ${filaExcel}: El costo debe ser mayor a 0`
            );
          }

          const claveValida = await validarClaveSae(claveSae);
          if (!claveValida) {
            isValid = false;
            partidasConError.push(
              `Error en la fila ${filaExcel}: CLAVE SAE no válida (${claveSae})`
            );
          }

          const nombreInsumo = await insumoNombre(insumoOriginal);

          //console.log(nombreInsumo);
          prevPartida = parseInt(noPartida);

          filteredData.push({
            noPartidaPC: noPartida,
            insumo: nombreInsumo,
            unidad,
            claveSae,
            proveedor,
            descripcionInsumo,
            comentariosAdi,
            cantidad,
            costoCotizado,
            cve_precot,
            total: costoCotizado * cantidad,
            estatus: "Activo",
            fechaRegistro: new Date().toLocaleDateString(),
            fechaModificacion: new Date().toLocaleDateString(),
          });
          //await addDoc(parPrecotizacionInsumos, filteredData);
        }

        swal.close();
        // 🔵 Mostrar los errores
        if (!isValid) {
          swal.fire({
            title: "Errores detectados en el archivo",
            html: partidasConError.join("<br>"),
            icon: "error",
          });
          return;
        }

        swal.fire({
          title: "Éxito",
          text: "Los datos del archivo Excel son válidos y se han procesado correctamente.",
          icon: "success",
        });

        setExcelData(filteredData);

        const transformado = filteredData.map((item) => ({
          noPartida: item.noPartidaPC,
          insumos: [item],
        }));
        transformado.sort((a, b) => a.noPartidaPC - b.noPartidaPC);
        setListPartidas(transformado);
        setList([...list, ...filteredData]);
        setExcelData([]);
        // 🔵 Guardar cada insumo individualmente
        // 🔵 Aquí guarda los datos CORRECTAMENTE en Firestore
        for (const insumoData of filteredData) {
          await addDoc(parPrecotizacionInsumos, insumoData);
        }
        console.log("✅ Insumo agregado correctamente en Firestore");
      };

      //reader.readAsArrayBuffer(selectedFile);
      reader.readAsArrayBuffer(file);
    } else {
      alert("Por favor, selecciona un archivo.");
    }
  };
  const validarNoPartida = (noPartida, par_preCot) => {
    if (!noPartida) {
      return false; // No hay número de partida
    }

    const existePartida = par_preCot.some(
      (partida) => String(partida.noPartida).trim() === String(noPartida).trim()
    );

    return existePartida;
  };
  const validarInsumo = (Insumo) => {
    if (
      Insumo == "Subcontratos" ||
      Insumo == "Viáticos" ||
      Insumo == "Material" ||
      Insumo == "S" ||
      Insumo == "V" ||
      Insumo == "M" ||
      Insumo == "s" ||
      Insumo == "v" ||
      Insumo == "m"
    ) {
      return true;
    }
    console.log(Insumo);
    return false;
    //return Number.isInteger(Number(cantidad)) && cantidad !== "";
  };
  const validarUnidad = (Unidad) => {
    if (
      Unidad == "Pza" ||
      Unidad == "Kit" ||
      Unidad == "L" ||
      Unidad == "m" ||
      Unidad == "kg" ||
      Unidad == "Serv"
    ) {
      return true;
    }
    return false;
    //return Number.isInteger(Number(cantidad)) && cantidad !== "";
  };
  const validarCantidad = (Cantidad) => {
    if (Cantidad <= 0) {
      return false;
    }
    return true;
    //return Number.isInteger(Number(cantidad)) && cantidad !== "";
  };
  const validarCosto = (Costo) => {
    if (Costo <= 0) {
      return false;
    }
    return true;
    //return Number.isInteger(Number(cantidad)) && cantidad !== "";
  };
  const insumoNombre = async (insumo) => {
    try {
      if (insumo === "S" || insumo === "s") {
        return "Subcontratos";
      }
      if (insumo === "M" || insumo === "m") {
        return "Material";
      }
      if (insumo === "V" || insumo === "v") {
        return "Viáticos";
      }
    } catch (error) {
      return false;
    }
  };
  const validarClaveSae = async (claveSae) => {
    try {
      const response = await axios.get(
        //`http://localhost:5000/api/claveValidacion/${claveSae}`
        `/api/claveValidacion/${claveSae}`
      );
      const data = response.data;
      console.log(data);
      if (Array.isArray(data) && data.length > 0) {
        console.log("1");
        return true;
      } else {
        console.log("2");
        return false;
      }
    } catch (error) {
      return false;
      //console.error("Error al validar clave SAE:", error.message);
      console.log("0");
    }
  };
  /* ----------------------------------------- OBTENER PARTDIAS DE INSUMOS PARA LA PRECOTIZACIÓN -------------------------*/

  const getParPreCotizacion = (
    cve_precot,
    setPar_PreCoti_insu,
    setNoParatidaMO
  ) => {
    if (!cve_precot) return; // Evita ejecutar la consulta si cve_precot es null o undefined

    console.log(
      `🛠️ Suscribiéndose a cambios en PAR_PRECOTIZACION_INSU con cve_precot: ${cve_precot}`
    );

    const q = query(
      collection(db, "PAR_PRECOTIZACION_INSU"),
      where("cve_precot", "==", cve_precot)
    );

    // Usamos `onSnapshot` para recibir actualizaciones en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const par_levDigList1 = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      console.log(
        "📌 Datos de PAR_PRECOTIZACION_INSU actualizados:",
        par_levDigList1
      );

      // Ordenar por número de partida
      par_levDigList1.sort((a, b) => a.noPartidaPC - b.noPartidaPC);
      setPar_PreCoti_insu(par_levDigList1);

      // Obtener el número máximo de partida
      const maxPartida = Math.max(
        ...par_levDigList1.map((item) => item.noPartidaPC),
        0
      );
      setNoParatidaMO(maxPartida + 1);

      console.log("📌 Número máximo de partida actualizado:", maxPartida + 1);
    });

    // Cleanup: Nos desuscribimos si cve_precot cambia o el componente se desmonta
    return unsubscribe;
  };

  useEffect(() => {
    if (!cve_precot) return;

    console.log(`🛠️ useEffect ejecutado con cve_precot: ${cve_precot}`);
    const unsubscribe = getParPreCotizacion(
      cve_precot,
      setPar_PreCoti_insu,
      setNoParatidaMO
    );

    return () => {
      console.log(
        "❌ Desuscribiendo de Firestore para cve_precot:",
        cve_precot
      );
      unsubscribe && unsubscribe();
    };
  }, [cve_precot]);

  /* ------------------------------------ OBTENER TABLA DE INSUMOS -------------------------------*/
  const obtenerFactores = (setFactores) => {
    console.log("🛠️ Suscribiéndose a cambios en FACTORES...");

    const unsubscribe = onSnapshot(collection(db, "FACTORES"), (snapshot) => {
      const factoresList = snapshot.docs.map((doc) => doc.data().nombre);
      setFactores(factoresList);

      console.log("📌 Datos de FACTORES actualizados:", factoresList);
    });

    // Cleanup: nos desuscribimos si el componente se desmonta
    return unsubscribe;
  };
  useEffect(() => {
    console.log("🛠️ useEffect ejecutado para FACTORES");
    const unsubscribe = obtenerFactores(setFactores);

    return () => {
      console.log("❌ Desuscribiendo de FACTORES");
      unsubscribe && unsubscribe();
    };
  }, []);
  /* ------------------------------------ OBTENER TABLA DE TRABAJADORES -------------------------------*/
  const obtenerPartidasMO = (cve_precot, setListMO, setNoParatidaMO) => {
    if (!cve_precot) return; // Evita ejecutar la consulta si cve_precot es null o undefined

    console.log(
      `🛠️ Suscribiéndose a cambios en PAR_PRECOTIZACION_MO con cve_precot: ${cve_precot}`
    );

    const q = query(
      collection(db, "PAR_PRECOTIZACION_MO"),
      where("cve_precot", "==", cve_precot)
    );

    // Usamos `onSnapshot` para recibir actualizaciones en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const par_levDigList1 = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      console.log(
        "📌 Datos de PAR_PRECOTIZACION_MO actualizados:",
        par_levDigList1
      );

      // Ordenar por número de partida
      par_levDigList1.sort((a, b) => a.noPartidaMO - b.noPartidaMO);
      setListMO(par_levDigList1);

      // Obtener el número máximo de partida
      const maxPartida = Math.max(
        ...par_levDigList1.map((item) => item.noPartidaMO),
        0
      );
      setNoParatidaMO(maxPartida + 1);

      console.log("📌 Número máximo de partida actualizado:", maxPartida + 1);
    });

    // Cleanup: Nos desuscribimos si cve_precot cambia o el componente se desmonta
    return unsubscribe;
  };

  useEffect(() => {
    if (!cve_precot) return;

    console.log(`🛠️ useEffect ejecutado con cve_precot: ${cve_precot}`);
    const unsubscribe = obtenerPartidasMO(
      cve_precot,
      setListMO,
      setNoParatidaMO
    );

    return () => {
      console.log(
        "❌ Desuscribiendo de Firestore para cve_precot:",
        cve_precot
      );
      unsubscribe && unsubscribe();
    };
  }, [cve_precot]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  //console.log("Prueba" + par_PreCoti_insu);

  const obtenerTrabajadores = (setManoObra) => {
    console.log("🛠️ Suscribiéndose a cambios en PERSONAL...");

    const unsubscribe = onSnapshot(collection(db, "PERSONAL"), (snapshot) => {
      const manoObraList = snapshot.docs.map((doc) => doc.data().personal);
      setManoObra(manoObraList);

      console.log("📌 Datos de PERSONAL actualizados:", manoObraList);
    });

    // Cleanup: Nos desuscribimos si el componente se desmonta
    return unsubscribe;
  };

  useEffect(() => {
    console.log("🛠️ useEffect ejecutado para PERSONAL");
    const unsubscribe = obtenerTrabajadores(setManoObra);

    return () => {
      console.log("❌ Desuscribiendo de PERSONAL");
      unsubscribe && unsubscribe();
    };
  }, []); // 🔹 Eliminamos `manoObra` de las dependencias

  /* ------------------------------------ - AGREGAR NUEVO DOCUMENTO -------------------------------*/

  const updateEncabezado = async (e) => {
    e.preventDefault();
    const partidasSinInsumos = par_preCot.filter((partida) => {
      const tieneInsumos = par_PreCoti_insu.some(
        (insumo) => Number(insumo.noPartidaPC) === Number(partida.noPartida)
      );
      return !tieneInsumos;
    });

    if (partidasSinInsumos.length > 0) {
      swal.fire({
        icon: "warning",
        title: "Faltan Datos",
        text: "Hay Partidas sin Insumos:",
      });
      return;
    }
    swal.fire({
      title: "Procesando Solicitud...",
      text: "Por favor espera mientras se valida el contenido.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        swal.showLoading();
      },
    });
    const bitacora = collection(db, "BITACORA");
    const today = new Date();
    const ahora = new Date();
    const hora = ahora.getHours();
    const minuto = ahora.getMinutes();
    const segundo = ahora.getSeconds();
    const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
    const horaFormateada = `${hora}:${minuto}:${segundo}`;
    await addDoc(bitacora, {
      cve_Docu: cve_precot,
      tiempo: horaFormateada,
      fechaRegistro: formattedDate,
      tipoDocumento: "Edición de documentos",
      noPartida: noPartida,
    });
    const preCotRef = doc(db, "PRECOTIZACION", id);
    const datos = {
      cve_precot: cve_precot,
      cve_clie: cve_clie,
      fechaElaboracion: fechaElaboracion,
      fechaFin: fechaFin,
      fechaInicio,
      idMonday: idMonday,
    };
    await updateDoc(preCotRef, datos);
    swal.close();

    swal
      .fire({
        icon: "success",
        title: "Guardado",
        text: "Precotizacion Guardado.",
        timer: 1500, // Espera 1.5 segundos
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
      .then(() => {
        navigate("/precotizacion");
      });
  };

  const agregarPartidaAdicional = async (e) => {
    e.preventDefault();
    if (descripcion) {
      const bitacora = collection(db, "BITACORA");
      const today = new Date();
      const ahora = new Date();
      const hora = ahora.getHours();
      const minuto = ahora.getMinutes();
      const segundo = ahora.getSeconds();
      const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
      const horaFormateada = `${hora}:${minuto}:${segundo}`;
      await addDoc(bitacora, {
        cve_Docu: cve_precot,
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Registro de partidas",
        noPartida: noPartida,
      });
      await addDoc(parPrecotizacion, {
        cve_precot: cve_precot,
        noPartida: noPartida,
        descripcion: descripcion,
        observacion: observacion,
        estatus: "Activa",
      });
      window.location.reload();
    } else {
      alert("La descripción es obligatorio");
    }
  };
  const agregarPartidaMOAdicional = async (e) => {
    e.preventDefault();
    if (diasTrabajados) {
      const bitacora = collection(db, "BITACORA");
      const today = new Date();
      const ahora = new Date();
      const hora = ahora.getHours();
      const minuto = ahora.getMinutes();
      const segundo = ahora.getSeconds();
      const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
      const horaFormateada = `${hora}:${minuto}:${segundo}`;
      await addDoc(bitacora, {
        cve_Docu: cve_precot,
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Registro de partidas",
        noPartida: noPartida,
      });
      await addDoc(parPrecotizacionMO, {
        cve_precot: cve_precot,
        noPartidaMO: noPartidaMO,
        cantidadTrabajadores: cantidadTrabajadores,
        personal: selectedTrabajador,
        diasTrabajados: diasTrabajados,
        estatus: "Activa",
      });
      window.location.reload();
    } else {
      alert("Ingresa una cantidad en los días trabajados");
    }
  };
  /* -------------------------------------- Eliminar partidas de levantamiento dígital en precotización ----------------------------  */
  const handleDelete = async (id, noPartida) => {
    if (!id || !noPartida) {
      console.error("❌ Error: ID o número de partida no válido.");
      return;
    }

    try {
      console.log("🔍 Buscando dependencias para la partida:", noPartida);

      // 🔍 **Buscar si la partida tiene insumos o mano de obra asociada**
      const insumosQuery = query(
        collection(db, "PAR_PRECOTIZACION_INSU"),
        where("noPartidaPC", "==", noPartida)
      );
      const manoObraQuery = query(
        collection(db, "PAR_PRECOTIZACION_MO"),
        where("noPartidaMO", "==", noPartida)
      );

      const [insumosSnapshot, manoObraSnapshot] = await Promise.all([
        getDocs(insumosQuery),
        getDocs(manoObraQuery),
      ]);

      const tieneInsumos = !insumosSnapshot.empty;
      const tieneManoObra = !manoObraSnapshot.empty;

      let mensajeHTML = `<p style="font-size: 18px; font-weight: bold;">¿Seguro que deseas eliminar esta partida?</p>`;

      if (tieneInsumos || tieneManoObra) {
        mensajeHTML += `<p style="font-size: 14px; font-weight: normal;">
                ⚠️ <strong>Ten en cuenta que esta partida cuenta con:</strong><br>`;

        if (tieneInsumos) mensajeHTML += `🛠️ Insumo(s) <br>`;
        if (tieneManoObra) mensajeHTML += `👷 Mano de obra <br>`;

        mensajeHTML += `<br>Si la eliminas, también se eliminarán sus dependencias.</p>`;
      }

      // 🛑 **Mostrar alerta de confirmación con `Swal`**
      const confirmDelete = await swal.fire({
        title: "Confirmar Eliminación",
        html: mensajeHTML,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!confirmDelete.isConfirmed) return;

      // 🗑️ **Eliminar insumos asociados**
      if (tieneInsumos) {
        await Promise.all(
          insumosSnapshot.docs.map((doc) => deleteDoc(doc.ref))
        );
        console.log("✅ Insumos eliminados.");
      }

      // 🗑️ **Eliminar mano de obra asociada**
      if (tieneManoObra) {
        await Promise.all(
          manoObraSnapshot.docs.map((doc) => deleteDoc(doc.ref))
        );
        console.log("✅ Mano de obra eliminada.");
      }

      // 🗑️ **Eliminar la partida principal**
      console.log(id);
      const parLevDigitalRef = doc(db, "PAR_PRECOTIZACION", id);
      await deleteDoc(parLevDigitalRef);
      console.log("✅ Partida eliminada correctamente.");

      // 🔄 **Actualizar el estado sin recargar la página**
      setPar_preCot((prev) => prev.filter((item) => item.id !== id));

      // 🎉 **Mostrar mensaje de éxito**
      swal.fire({
        title: "Eliminación Exitosa",
        text: "La partida y sus dependencias han sido eliminadas.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("⚠️ Error al eliminar la partida:", error);
      swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar la partida. Intenta de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };
  /* ----------------------------------- ENCONTRAR FACTORES POR PARTIDA -------------------------------------*/

  const obtenerFactorPorNombre = async (nombreInsumo) => {
    const querySnapshot = await getDocs(
      query(collection(db, "FACTORES"), where("nombre", "==", nombreInsumo))
    );

    if (!querySnapshot.empty) {
      // Si hay resultados, devolver el primer documento encontrado
      const factor = querySnapshot.docs[0].data();
      return factor;
    } else {
      // Si no hay resultados, puedes manejarlo de alguna manera (devolver null, lanzar un error, etc.)
      return null;
    }
  };
  /*   ---------------------------------- AGREGAR PARTIDAS DE INSUMOS ----------------------------- */
  const agregarPartidasInsumos = async (e) => {
    e.preventDefault();
    if (noPartidaPC) {
      const nuevoNoPartida = noPartidaPC + contadorDecimal;
      const factorSeleccionado = await obtenerFactorPorNombre(insumo);

      const { costoFijo, factoraje, fianzas, utilidad } = factorSeleccionado;
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
        tipoDocumento: "Registro de partidas",
        noPartida: noPartida,
      });
      await addDoc(parPrecotizacionInsumos, {
        cve_precot: cve_precot,
        noPartidaPC: parseInt(noPartidaPC),
        no_subPartida: nuevoNoPartida,
        docAnteriorPPC: "Agregado directamente",
        insumo: insumo,
        proveedor: proveedor,
        descripcionInsumo: descripcionInsumo,
        comentariosAdi: comentariosAdi,
        unidad: unidad,
        costoCotizado: costoCotizado,
        cantidad: cantidad,
        total: costoCotizado * cantidad,
        costoFijo: (costoFijo / 100) * (costoCotizado * cantidad),
        factoraje: (factoraje / 100) * (costoCotizado * cantidad),
        fianzas: (fianzas / 100) * (costoCotizado * cantidad),
        utilidad: (utilidad / 100) * (costoCotizado * cantidad),
        estatus: "Activa",
        categoria: insumo.categoria,
        familia: insumo.familia,
        linea: insumo.linea,
        claveSae: insumo.claveSae,
      });
      setContadorDecimal(contadorDecimal + 1);
      window.location.reload();
    } else {
      alert("Selecciona el número de partida");
    }
  };
  /* ----------------------------------------------------AQUÍ ME QUEDE ---------------*/
  const addPartidasMO = (e) => {
    e.preventDefault();
    const newItem = {
      cve_precot: selectedFolio + folioSiguiente.toString(),
      personal: selectedTrabajador,
      diasTrabajados: diasTrabajados,
      noPartidaMO: noPartidaMO,
    };
    if (diasTrabajados) {
      if (editIndex !== null) {
        const updatedList = [...listMO];
        updatedList[editIndex] = newItem;
        setListMO(updatedList);
        setNoParatidaMO(idCounter);
        setEditIndex(null);
        setPersonal("");
        setDiasTrabajados("");
      } else {
        setListMO([...listMO, newItem]);
        setNoParatidaMO(idCounter + 1);
        setPersonal("");
        setDiasTrabajados("");
        setIdCounter(idCounter + 1); // Aumentamos el contador
      }
    } else {
      alert("Debes ingresar los días trabajados");
    }
  };
  const EditPartidaMO = async (partidaId) => {
    console.log("🟢 Editando partida de mano de obra, ID:", partidaId);

    try {
      // 🔄 Obtener la partida desde Firestore
      const partidaDoc = await getDoc(
        doc(db, "PAR_PRECOTIZACION_MO", partidaId)
      );

      if (!partidaDoc.exists()) {
        console.error("❌ Error: No se encontró la partida en Firestore.");
        return;
      }

      const partida = partidaDoc.data();
      console.log("✅ Partida obtenida desde Firestore:", partida);

      // 🟢 Asignar valores a los estados para mostrar en el modal
      setNoParatidaMO(partida.noPartidaMO || "");
      setSelectedTrabajador(partida.personal || "");
      setCantidadTrabajadores(partida.cantidadTrabajadores || 0);
      setDiasTrabajados(partida.diasTrabajados || 0);
      setNoPartida(partida.noPartidaMO || "");
      setDescripcion(partida.personal || "");
      setObservacion(partida.diasTrabajados || "");

      // 🟢 Guardar el ID de la partida en `editIndex` para saber que estamos editando
      setEditIndex(partidaId);

      // 🔄 Mostrar el modal de edición
      setShowAddModalMO(true);
    } catch (error) {
      console.error("⚠️ Error al obtener la partida de mano de obra:", error);
    }
  };
  const handleCloseModalMO = () => {
    setNoParatidaMO(""); // Limpia el número de partida
    setSelectedTrabajador(""); // Limpia el trabajador seleccionado
    setCantidadTrabajadores(""); // Limpia la cantidad de trabajadores
    setDiasTrabajados(""); // Limpia los días trabajados
    setEditIndex(null); // Reinicia el índice de edición
    setShowAddModalMO(false); // Cierra el modal
  };

  const editarPar_Precotizacion = (id, noPartida) => {
    swal.fire({
      title: "Editar partida:",
      text: `Número de partida: ${noPartida}\nID: ${id}`,
      content: {
        element: "input",
        attributes: {
          placeholder: "Ingrese la descripción y observaciones",
          type: "text",
        },
      },
      buttons: {
        confirm: "Aceptar",
        cancel: "Cancelar",
      },
    }).then((value) => {
      if (value) {
        swal.fire(`You typed: ${value}`);
        // Aquí puedes realizar acciones con el valor ingresado por el usuario
      } else {
        swal.fire("Operación cancelada");
      }
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Editar pre cotizacion</h1>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Folio</label>
                <input
                  className="form-control"
                  id="inputFolioSecuencial"
                  type="text"
                  value={cve_precot}
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
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button">
                    <FaCircleQuestion />
                  </button>
                  <button class="btn btn-outline-secondary" type="button">
                    <IoSearchSharp />
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
                />
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button">
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
                  <button class="btn btn-outline-secondary" type="button">
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
                  <button class="btn btn-outline-secondary" type="button">
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="row"
            style={{ border: "1px solid #000", borderColor: "gray" }}
          >
            <div className="col-md-1">
              <label className="form-label">No. Partida</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="text"
                  value={noPartidaPC}
                  onChange={(e) => setNoPartidaPC(e.target.value)}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 ">
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
            <div className="col-md-3 ">
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
            </div>
            <br></br>
            <br></br>
            <div className="col-md-3 ">
              <button
                className="btn btn-success"
                onClick={agregarPartidaAdicional}
              >
                <CiCirclePlus />
                Agregar Tarea
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
                    <th scope="col">Descripción</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                    <th scope="col">Agregar Insumos</th>
                    <th scope="col">Agregar Mano</th>
                  </tr>
                </thead>
                <tbody>
                  {par_preCot.map((item, index) => (
                    <tr key={index}>
                      <td>{item.noPartida}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.observacion}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            if (item.noPartida) {
                              recolectarDatos(
                                item.id,
                                item.cve_levDig,
                                item.noPartida,
                                item.cantidad,
                                item.descripcion,
                                item.observacion
                              );
                            } else {
                              alert("Esta partida no tiene número asignado."); // O muestra un error bonito
                            }
                          }}
                        >
                          <FaPencilAlt />{" "}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.id, item.noPartida)}
                        >
                          {/*, item.cve_levDig*/}
                          <MdDelete />
                        </button>{" "}
                      </td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleOpenModal(item.noPartida)}
                        >
                          <CiCirclePlus />{" "}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleOpenModalMO(item.noPartida)}
                        >
                          <CiCirclePlus />{" "}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <br></br>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="form-control"
            ref={inputFileRef} // 👈 Aquí conectas el input a la referencia
          />
          <button
            type="button"
            className="btn btn-danger mt-2"
            onClick={limpiarArchivo}
          >
            Limpiar
          </button>
          <br></br>
          <br></br>
          <div
            className="row"
            style={{
              border: "1px solid #000",
              maxHeight: "240px", // 🔵 Puedes ajustar la altura como tú quieras
              overflowY: "auto",
            }}
          ></div>
          <div
            className="row"
            style={{
              border: "1px solid #000",
              maxHeight: "240px",
              overflowY: "auto",
            }}
          >
            <label style={{ color: "red" }}>Partidas por Insumo </label>
            <br></br>
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Sub Partida</th>
                    <th scope="col">Tipo de Insumo</th>
                    <th scope="col">Proveedor</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Comentarios Adicionales</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Costo</th>
                    <th scope="col">Total</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {par_PreCoti_insu.map((itemPC, indexPC) => (
                    <tr key={indexPC}>
                      <td>{itemPC.noPartidaPC}</td>
                      <td>{itemPC.insumo}</td>
                      <td>{itemPC.proveedor}</td>
                      <td>{itemPC.descripcionInsumo}</td>
                      <td>{itemPC.comentariosAdi}</td>
                      <td>{itemPC.cantidad}</td>
                      <td style={{ textAlign: "right" }}>
                        {(itemPC.costoCotizado * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {(itemPC.total * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleEditInsumo(itemPC.noPartidaPC, itemPC.id)
                          }
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDeleteInsumo(itemPC.noPartida, itemPC.id)
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
          <br></br>
          <div
            className="row"
            style={{
              border: "1px solid #000",
              maxHeight: "240px",
              overflowY: "auto",
            }}
          >
            <label style={{ color: "red" }}>Partidas por Mano de Obra </label>
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No Partida</th>
                    <th scope="col">No. de Trabajadores</th>
                    <th scope="col">Trabajador</th>
                    <th scope="col">Días Trabajados</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
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
                        <button
                          className="btn btn-primary"
                          onClick={() => EditPartidaMO(itemMO.id)}
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            DeletePartidaMO(itemMO.noPartidaMO, itemMO.id);
                          }}
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

          <br></br>

          <div className="buttons-container">
            <button className="btn btn-success" onClick={updateEncabezado}>
              <HiDocumentPlus /> Editar Documento
            </button>
            <Link to="/precotizacion">
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
              value={String(noPartidaP || "")}
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
      {/*---------------------------------------------------------------------------------------------------*/}
      <Modal
        show={showAddModal}
        onHide={handleCloseModal}
        dialogClassName="lg"
        centered
        scrollable
        size="xl" // O usa "xl" si necesitas más espacio
        className="d-flex align-items-center justify-content-center" // Asegura el centrado
        style={{ maxWidth: "100%", width: "200%" }} // Ajusta el ancho máximo y asegura que no ocupe todo el ancho
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modoModal === "Crear" ? "Crear Partida" : "Editar Partida"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Fila 1: No.Partida, Insumo, Unidad, Línea, Clave SAE */}
          <div className="row mb-6">
            <div className="col-md-2">
              <div className="mb-3">
                <label>No. Partida</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedPartida?.noPartida || ""}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label>Insumo</label>
                <select
                  value={insumo}
                  onChange={(e) => setInsumo(e.target.value)}
                  className="form-control"
                >
                  <option value="">Seleccionar...</option>
                  {factores.map((factor, index) => (
                    <option key={index} value={factor}>
                      {factor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label>Unidad</label>
                <select
                  className="form-control"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Pza">Pieza</option>
                  <option value="Kit">Kit</option>
                  <option value="L">Litro</option>
                  <option value="m">Metro</option>
                  <option value="kg">Kilo</option>
                  <option value="Serv">Servicio</option>
                </select>
              </div>
            </div>
          </div>
          {/* Columna para Línea en la misma fila */}
          <div className="row mb-6">
            {/* Fila 2: Proveedor, Descripcion */}
            <div className="row mb-6">
              <div className="col-md-6">
                <div className="mb-4">
                  <label>Clave SAE</label>
                  <Select
                    options={clavesSAE.map((prov) => ({
                      value: prov.clave,
                      label: prov.descripcion,
                    }))}
                    value={
                      claveSae
                        ? {
                            value: claveSae,
                            label:
                              clavesSAE.find((prov) => prov.clave === claveSae)
                                ?.descripcion || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      console.log(
                        "🔹 Nuevo insumo seleccionado:",
                        selectedOption
                      );
                      setClaveSae(selectedOption.value);
                    }}
                    placeholder="Buscar proveedor..."
                    menuPortalTarget={document.body} // Renderiza fuera del modal
                    menuPlacement="auto" // Ajusta la posición automáticamente
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Proveedor</label>
                  <input
                    type="text"
                    className="form-control"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/*Fila 3*/}
            <div className="row mb-9">
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    value={descripcionInsumo}
                    onChange={(e) => setDescripcionInsumo(e.target.value)}
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Comentarios Adicionales</label>
                  <textarea
                    className="form-control"
                    value={comentariosAdi}
                    onChange={(e) => setComentariosAdi(e.target.value)}
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-9">
              <div className="col-md-2">
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
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label>Costo Cotizado</label>
                  <input
                    type="number"
                    className="form-control"
                    value={costoCotizado}
                    onChange={(e) => setCostoCotizado(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarPartida}>
            Guardar Insumo
          </Button>
        </Modal.Footer>
      </Modal>
      {/*---------------------------------------------------------*/}
      <Modal
        show={showAddModalMO}
        onHide={handleCloseModalMO} // Ahora limpia al cerrar
        centered
        scrollable
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Mano de Obra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-2">
                <div className="mb-3">
                  <label>No. Partida</label>
                  <input
                    type="text"
                    className="form-control"
                    value={noPartidaMO || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-5">
                <div className="mb-3">
                  <label className="form-label">Trabajador</label>
                  <select
                    id="selectTrabajador"
                    className="form-control"
                    value={selectedTrabajador}
                    onChange={(e) => setSelectedTrabajador(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecciona un Trabajador
                    </option>
                    {manoObra.map((trabajador, index) => (
                      <option key={index} value={trabajador}>
                        {trabajador}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Cantidad de Personal</label>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    value={cantidadTrabajadores}
                    onChange={(e) => setCantidadTrabajadores(e.target.value)}
                    className="form-control"
                    placeholder="Cantidad"
                    min="1"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label">Días Trabajados</label>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    value={diasTrabajados}
                    onChange={(e) => setDiasTrabajados(e.target.value)}
                    className="form-control"
                    placeholder="Días"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalMO}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveManoObra}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditarPreCotizacion;
