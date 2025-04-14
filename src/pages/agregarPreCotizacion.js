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
import { TabContent, TabPane, Nav, NavItem, NavLink, Alert } from "reactstrap";
import { FaCircleQuestion, FaCirclePlus } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";
import swal from "sweetalert2";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle, Modal, Button } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import * as XLSX from "xlsx";

const AgregarPreCotizacion = () => {
  const [partida_levDi, setPartida_levDig] = useState("");
  const [showAgregar, setShowAgregar] = useState(false);
  const [cve_levDig, setCve_levDig] = useState("");
  const [folios, setFolios] = useState([]);
  const [selectedFolio, setSelectedFolio] = useState("");
  const [folioSiguiente, setFolioSiguiente] = useState(0);
  const [cve_clie, setCve_clie] = useState("");
  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [docAnt, setDocAnt] = useState("N/A");
  const [docSig, setDocSig] = useState("");
  const [estatus, setEstatus] = useState("Activo");
  const [cantidadPartida, setCantidadPartida] = useState("");

  const [cve_levDig_par, setLevDigital_par] =
    useState(""); /* Este es el campo que agregue */
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [list, setList] = useState([]);
  const [par_levDigital, setPar_levDigital] = useState([]);
  const [noPartida, setNoPartida] = useState("");
  const [listPreCot, setListPreCot] = useState([]);
  const [listPartidas, setListPartidas] = useState([]);
  const [listMano, setListMano] = useState([]);
  const [selectedPartida, setSelectedPartida] = useState(null);
  // Dentro de tu componente:
  const [linea, setLinea] = useState(""); // Estado para la línea seleccionada
  const [claveSae, setClaveSae] = useState(""); // Estado para la clave SAE
  const [clavesSAE, setClavesSAE] = useState([]);
  //const [proveedores, setProveedores] = useState([]); // Lista de proveedores
  const [lineas, setLineas] = useState([]); // Lista de líneas disponibles
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [familia, setFamilia] = useState("");
  const [familias, setFamilias] = useState([]);
  const [subLinea, setSubLinea] = useState("");

  const [idPartida, setIdPartida] = useState("");

  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  /* --------------------------- PARTIDAS DE INSUMO -----------*/
  const [cve_precot, setPrecot] = useState("");
  const [factores, setFactores] = useState([]);
  const [par_PreCoti_insu, setPar_PreCoti_insu] = useState([]);
  const [listoInsumos, setListInsumo] = useState([]);
  const [contadorDecimal, setContadorDecimal] = useState(0.1);
  const [insumo, setInsumo] = useState("");
  const [no_subPartida, setNoSubPartida] = useState("");
  const [noPartidaPC, setNoPartidaPC] = useState();
  const [proveedor, setProveedor] = useState("");
  const [unidad, setUnidad] = useState(""); // Unidad seleccionada
  const [unidades, setUnidades] = useState([]); // Lista de unidades únicas
  const [proveedores, setProveedores] = useState([]); // Lista de unidades únicas
  const [docAnteriorPPC, setDocAnteriorPPC] = useState("");
  const [descripcionInsumo, setDescripcionInsumo] = useState("");
  const [comentariosAdi, setComentariosAdi] = useState("");
  const [costoCotizado, setCostoCotizado] = useState();
  const [cantidad, setCantidad] = useState();
  const total = costoCotizado * cantidad;
  const [listInsumos, setListInsumos] = useState([]);
  const [insumos, setInsumos] = useState([]); // Estado para los insumos
  const [noPartidaMO, setNoParatidaMO] = useState("");
  const [selectedTrabajador, setSelectedTrabajador] = useState("");
  const [cantidadTrabajadores, setCantidadTrabajadores] = useState(0);
  const [diasTrabajados, setDiasTrabajados] = useState(0);
  const [showAddModalMO, setShowAddModalMO] = useState(false);

  /* --------------------------------PARTIDAS PARA MANO DE OBRA -----------------*/
  const [manoObra, setManoObra] = useState([]);
  const [cve_precotMO, setCve_precotMO] = useState("");
  const [personal, setPersonal] = useState("");
  const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
  const [editIndex, setEditIndex] = useState(null);
  const [listMO, setListMO] = useState([]);
  const [fechaRegistro, setFechaRegistro] = useState("");
  /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
  const partida_levDig = collection(db, "PAR_LEVDIGITAL");
  const parPrecotizacion = collection(db, "PAR_PRECOTIZACION");
  const precotizacioncoleccion = collection(db, "PRECOTIZACION");
  const parPrecotizacionInsumos = collection(db, "PAR_PRECOTIZACION_INSU");
  const parPrecotizacionMO = collection(db, "PAR_PRECOTIZACION_MO");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleShowAgregar = () => setShowAgregar(true);
  const handleCloseAgregar = () => {
    setCantidad("");
    setDescripcion("");
    setObservacion("");
    setShowAgregar(false);
  };

  //const proveedores = ["Proveedor 1", "Proveedor 2", "Proveedor 3", "Proveedor 4"];
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  /*----------------------------------------------------------*/
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Guardar el archivo en el estado
    } else {
      alert("Por favor, selecciona un archivo.");
    }
  };
  const validarCantidad = (cantidad) => {
    // Aquí puedes meter tu lógica más adelante
    return Number.isInteger(Number(cantidad)) && cantidad !== "";
  };
  const processExcelFile = () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const headers = jsonData[0];
      let isValid = true;
      let prevPartida = 0;
      let partidasConError = [];

      const filteredData = jsonData.slice(1).map((row, index) => {
        const noPartida = String(row[0] || "").trim();
        const cantidad = String(row[1] || "").trim();
        const descripcion = String(row[2] || "").trim();
        const observaciones = String(row[3] || "").trim();

        // Validación de secuencialidad
        if (parseInt(noPartida) !== prevPartida + 1) {
          isValid = false;
          partidasConError.push(noPartida || `Fila ${index + 2}`);
        }

        // Validación personalizada de cantidad
        if (!validarCantidad(cantidad)) {
          isValid = false;
          partidasConError.push(noPartida || `Fila ${index + 2}`);
        }

        prevPartida = parseInt(noPartida);

        return {
          noPartida,
          cantidad,
          descripcion,
          observaciones,
        };
      });

      if (!isValid) {
        swal.fire({
          title: "Error en validación",
          text: `Las siguientes partidas tienen errores: ${partidasConError.join(
            ", "
          )}`,
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
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleAddFromExcel = () => {
    if (excelData.length === 0) {
      alert("No hay datos procesados del archivo.");
      return;
    }

    // Agregar las filas procesadas del archivo a la lista
    setList([...list, ...excelData]);
    setExcelData([]); // Limpiar los datos procesados una vez que se han agregado
  };
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  /*----------------------------------------------------------*/
  /* --------------------   Obtener los folios correspondiente  -------------------------- */
  useEffect(() => {
    const obtenerFolios = async () => {
      const foliosCollection = collection(db, "FOLIOS");
      const q = query(foliosCollection, where("documento", "==", "PC"));
      const foliosSnapshot = await getDocs(q);

      const listaFolios = foliosSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          folio: data.folio,
          folioSiguiente: data.folioSiguiente,
        };
      });

      setFolios(listaFolios);

      // Si hay folios y no se ha seleccionado ninguno, tomar el primero por defecto
      if (listaFolios.length > 0 && !selectedFolio) {
        setSelectedFolio(listaFolios[0].folio);
      }
    };

    obtenerFolios();
  }, [selectedFolio]); // Se ejecutará solo una vez al cargar el componente

  useEffect(() => {
    // Actualiza el secuencial cuando se selecciona un nuevo folio
    if (selectedFolio) {
      const folioSeleccionado = folios.find(
        (folio) => folio.folio === selectedFolio
      );
      if (folioSeleccionado) {
        setFolioSiguiente(folioSeleccionado.folioSiguiente);
      }
    }
  }, [selectedFolio, folios]);

  /* --------------------  fin de Obtener los folios correspondiente  -------------------------- */
  /* MENSAJES DEL SISTEMA */
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
  /* ---------------------JALAR INFORMACIÓN DE DOCUMENTO ANTERIOR ------------------------------------- */
  const getFactoresById = async (id) => {
    const factoresDOC = await getDoc(doc(db, "LEVDIGITAL", id));
    if (factoresDOC.exists()) {
      setCve_levDig(factoresDOC.data().cve_levDig);
      setCve_clie(factoresDOC.data().cve_clie);
      setFechaElaboracion(factoresDOC.data().fechaElaboracion);
      setFechaInicio(factoresDOC.data().fechaInicio);
      setFechaFin(factoresDOC.data().fechaFin);
    } else {
      console.log("El personals no existe");
    }
  };

  useEffect(() => {
    getFactoresById(id);
  }, [id]);
  /* --------------------- JALAR INFORMACIÓN DE PARTIDAS ANTERIORES ------------------------------------- */
  const getParLevDigital = (cve_levDig, setPar_levDigital, setNoPartida) => {
    if (!cve_levDig) return; // Evita llamadas innecesarias si cve_levDig es null o undefined

    console.log(
      `🛠️ Suscribiéndose a cambios en PAR_LEVDIGITAL con cve_levDig: ${cve_levDig}`
    );

    const q = query(
      collection(db, "PAR_LEVDIGITAL"),
      where("cve_levDig", "==", cve_levDig),
      where("estatusPartida", "==", "Activa")
    );

    // Usamos onSnapshot para actualizaciones en tiempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const par_levDigList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Ordenar por número de partida
      par_levDigList.sort((a, b) => a.noPartida - b.noPartida);
      setPar_levDigital(par_levDigList);

      // Obtener el número máximo de partida
      const maxPartida = Math.max(
        ...par_levDigList.map((item) => item.noPartida),
        0
      );
      setNoPartida(maxPartida + 1);

      console.log("📌 Datos de PAR_LEVDIGITAL actualizados:", par_levDigList);
    });

    // Cleanup: Nos desuscribimos si cve_levDig cambia o el componente se desmonta
    return unsubscribe;
  };

  useEffect(() => {
    if (!cve_levDig) return;

    console.log(`🛠️ useEffect ejecutado con cve_levDig: ${cve_levDig}`);
    const unsubscribe = getParLevDigital(
      cve_levDig,
      setPar_levDigital,
      setNoPartida
    );

    return () => {
      console.log(
        "❌ Desuscribiendo de Firestore para cve_levDig:",
        cve_levDig
      );
      unsubscribe && unsubscribe();
    };
  }, [cve_levDig]);
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
  }, []); // 🔹 Eliminamos `factores` de las dependencias

  /* ------------------------------------ OBTENER TABLA DE TRABAJADORES -------------------------------*/
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
      setManoObra(manoObraList);
    };
    cargarManoObra();
  }, []); // Eliminamos manoObra de las dependencias para evitar recargas innecesarias

  /* ------------------------------------ - ENCONTRAR MANO DE OBRA POR PARTIDA -------------------------------*/

  const obtenerMOPorNombre = async (nombreMO) => {
    const querySnapshot = await getDocs(
      query(collection(db, "PERSONAL"), where("personal", "==", nombreMO))
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
  /* -------------------------------------------------------------------------------------------------------------------------------- */
  /*const agregarPartidaAdicional = async (e) => {
    e.preventDefault();
    if (folioSiguiente != 0) {
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
      await addDoc(partida_levDig, {
        cve_levDig: cve_levDig,
        noPartida: noPartida,
        cantidad: cantidadPartida,
        descripcion: descripcion,
        observacion: observacion,
        estatusPartida: "Activa",
      });
      window.location.reload();
    } else {
      alert("Antes debes seleccionar el folio de Pre-cotización ");
    }
  };*/
  const agregarPartidaAdicional = async (e) => {
    e.preventDefault();
    if (folioSiguiente !== 0) {
      try {
        const bitacora = collection(db, "BITACORA");
        const today = new Date();
        const ahora = new Date();
        const hora = ahora.getHours();
        const minuto = ahora.getMinutes();
        const segundo = ahora.getSeconds();
        const formattedDate = today.toLocaleDateString(); // Formatear fecha
        const horaFormateada = `${hora}:${minuto}:${segundo}`;

        // 🟢 Registrar en la bitácora
        await addDoc(bitacora, {
          cve_Docu: cve_levDig,
          tiempo: horaFormateada,
          fechaRegistro: formattedDate,
          tipoDocumento: "Registro de partidas",
          noPartida: noPartida,
        });

        // 🟢 Agregar la nueva partida a Firestore
        const nuevaPartida = {
          cve_levDig: cve_levDig,
          noPartida: noPartida,
          cantidad: cantidadPartida,
          descripcion: descripcion,
          observacion: observacion,
          estatusPartida: "Activa",
        };

        const docRef = await addDoc(partida_levDig, nuevaPartida);
        console.log("✅ Nueva partida agregada con ID:", docRef.id);

        // 🔄 Actualizar el estado local sin recargar la página
        setPartida_levDig((prevPartidas) => [
          ...prevPartidas,
          { id: docRef.id, ...nuevaPartida },
        ]);

        // 🟢 Resetear los valores del formulario
        setCantidadPartida("");
        setDescripcion("");
        setObservacion("");
      } catch (error) {
        console.error("⚠️ Error al agregar la partida:", error);
      }
    } else {
      alert("Antes debes seleccionar el folio de Pre-cotización");
    }
  };

  /* ----------------------------------------- OBTENER PARTDIAS DE INSUMOS PARA LA PRECOTIZACIÓN -------------------------*/

  const getParPreCotizacion = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_PRECOTIZACION_INSU"),
          where("docAnteriorPPC", "==", cve_levDig)
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
      //console.log("max Partida: " + maxPartida)
      //(maxPartida + 1);
      //console.log("max Partida: " + maxPartida)
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    getParPreCotizacion();
  }, [cve_levDig]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  //console.log("Prueba" + par_PreCoti_insu);

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
  const agregarPartidasInsumos = (e) => {
    e.preventDefault();
    if (noPartidaPC) {
      if (folioSiguiente !== 0) {
        if (cantidad) {
          const nuevoInsumo = {
            cve_precot: selectedFolio + folioSiguiente.toString(),
            noPartidaPC: noPartidaPC,
            docAnteriorPPC: cve_levDig,
            insumo: insumo,
            proveedor: proveedor,
            descripcionInsumo: descripcionInsumo,
            comentariosAdi: comentariosAdi,
            unidad: unidad,
            costoCotizado: costoCotizado,
            cantidad: cantidad,
          };

          if (editIndex !== null) {
            // Si editIndex no es null, significa que estamos editando una partida existente
            const updatedList = [...listInsumos];
            updatedList[editIndex] = nuevoInsumo;
            setListInsumos(updatedList);
          } else {
            // Si editIndex es null, estamos agregando una nueva partida
            setListInsumos([...listInsumos, nuevoInsumo]);
          }

          // Limpiar los campos después de agregar o editar
          limpiarCampos();
        } else {
          alert("Debes ingresar la cantidad");
        }
      } else {
        alert("Antes debes seleccionar el folio de Pre-cotización");
      }
    } else {
      alert("Selecciona el número de partida");
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
  const editarPartida = (index) => {
    // Establecer los valores de los campos de acuerdo a la partida seleccionada para editar
    const partida = listInsumos[index];
    setNoPartidaPC(partida.noPartidaPC);
    setInsumo(partida.insumo);
    setProveedor(partida.proveedor);
    setDescripcionInsumo(partida.descripcionInsumo);
    setComentariosAdi(partida.comentariosAdi);
    setUnidad(partida.unidad);
    setCostoCotizado(partida.costoCotizado);
    setCantidad(partida.cantidad);

    // Establecer el índice de edición
    setEditIndex(index);
  };
  const eliminarPartidaInsu = (index) => {
    const updatedList = [...listInsumos];
    updatedList.splice(index, 1); // Elimina el elemento en el índice especificado
    setListInsumos(updatedList); // Actualiza la lista
  };
  /* ----------------------------------------------------AQUÍ ME QUEDE ---------------*/

  /*const addPartidasMO = (e) => {
    e.preventDefault();
    const newItem = {
      cve_precotMO: selectedFolio + folioSiguiente.toString(),
      personal: selectedTrabajador,
      diasTrabajados: diasTrabajados,
      cantidadTrabajadores: cantidadTrabajadores,
      noPartidaMO: noPartidaMO
    };
    if (diasTrabajados) {
      if (editIndex !== null) {
        const updatedList = [...listMO];
        updatedList[editIndex] = newItem;
        setListMO(updatedList);
        setNoParatidaMO("");
        setEditIndex(null);
        setPersonal("");
        setDiasTrabajados("")
        setCantidadTrabajadores("");
      } else {
        setListMO([...listMO, newItem]);
        setNoParatidaMO("");
        setPersonal("");
        setDiasTrabajados("")
        setCantidadTrabajadores("");
        setIdCounter(idCounter + 1); // Aumentamos el contador
      }
    } else {
      alert("Debes ingresar los días trabajados")
    }
  };*/
  const EditPartidaMO = (indexMO) => {
    const partidaEditada = listMano[indexMO];

    setNoParatidaMO(partidaEditada.noPartidaMO);
    setSelectedTrabajador(partidaEditada.personal);
    setCantidadTrabajadores(partidaEditada.cantidadTrabajadores);
    setDiasTrabajados(partidaEditada.diasTrabajados);
    setEditIndex(indexMO); // Establece el índice de edición
    setShowAddModalMO(true); // Abre el modal de edición
  };
  const DeletePartidaMO = (indexMO) => {
    // Verifica si el índice es correcto
    //console.log("Índice a eliminar:", indexMO);

    // Filtra la lista para excluir el índice especificado
    const updatedList = listMano.filter((_, index) => index !== indexMO);

    // Depuración: Verifica el contenido de la lista después de filtrar
    //console.log("Lista después de eliminar:", updatedList);

    // Actualiza el estado con la lista filtrada
    setListMano(updatedList);
  };
  const handleOpenModal = async (noPartida) => {
    limpiarCampos();
    try {
      const partidaSeleccionada = par_levDigital.find(
        (item) => item.noPartida === noPartida
      );
      setSelectedPartida(partidaSeleccionada);

      setCantidad(0);
      setCostoCotizado(0);
      // Llamar a la API para obtener las unidades
      /*const responseUnidades = await axios.get(
        //"/api/lineasMaster"
        "http://localhost:5000/api/lineasMaster"
      );
      setCategorias(responseUnidades.data); // Guardar las unidades con descripciones
      console.log("Unidades obtenidas:", responseUnidades.data);
      const responseProvedores = await axios.get(
        "http://localhost:5000/api/proveedores"
        //"/api/proveedores"
      );
      setProveedores(responseProvedores.data);*/

      setShowAddModal(true);
    } catch (error) {
      console.error("Error al obtener los datos necesarios:", error);
      if (error.response) {
        console.error("Error del servidor:", error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta:", error.request);
      } else {
        console.error("Error al configurar la petición:", error.message);
      }
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
    setUnidad("servicio");
  };
  const handleEditInsumo = (partida, insumo) => {
    console.log("🟢 Editando partida:", partida);
    console.log("🟢 Editando insumo:", insumo);
    console.log("Proveedor recibido:", `"${insumo.proveedor}"`); // ✅ Verifica los espacios

    setInsumo(insumo.insumo);
    setCantidad(insumo.cantidad);
    setUnidad(insumo.unidad);
    setCategoria(insumo.categoria);
    setFamilia(insumo.familia);
    setLinea(insumo.linea);
    setClaveSae(insumo.claveSae);
    setCostoCotizado(insumo.costoCotizado);
    setComentariosAdi(insumo.comentariosAdi);
    setDescripcionInsumo(insumo.descripcionInsumo);

    // 🟢 Buscar proveedor eliminando espacios en blanco de ambos lados
    const proveedorEncontrado = proveedores.find(
      (prov) => prov.CLAVE.trim() === insumo.proveedor.trim()
    );

    console.log("🟢 Proveedor encontrado:", proveedorEncontrado);

    setProveedor(proveedorEncontrado ? proveedorEncontrado.CLAVE : "");

    // 🟢 Cargar familia si hay categoría
    /*if (insumo.categoria) {
      obtenerFamilia(insumo.categoria);
    }

    // 🟢 Cargar línea si hay familia
    if (insumo.familia) {
      obtenerLineas(insumo.familia);
    }*/

    setSelectedPartida({ noPartida: partida });
    setShowAddModal(true);
  };
  const handleSaveManoObra = () => {
    const nuevoRegistro = {
      noPartidaMO: noPartidaMO,
      personal:
        typeof selectedTrabajador === "object"
          ? selectedTrabajador.nombre
          : selectedTrabajador,
      cantidadTrabajadores: parseInt(cantidadTrabajadores, 10),
      diasTrabajados: parseInt(diasTrabajados, 10),
    };

    let updatedListMano;

    if (editIndex !== null) {
      // Modo edición: Actualiza el registro existente
      updatedListMano = listMano.map((item, index) =>
        index === editIndex ? { ...item, ...nuevoRegistro } : item
      );
    } else {
      // Modo creación: Agrega un nuevo registro
      updatedListMano = [...listMano, nuevoRegistro];
    }

    // Actualiza el estado
    setListMano(updatedListMano);
    setEditIndex(null); // Resetea el índice de edición
    setShowAddModalMO(false); // Cierra el modal
  };
  const guardarPartida = () => {
    if (!selectedPartida || !insumo || !cantidad || !unidad || !claveSae) {
      alert("Faltan datos para completar la operación.");
      return;
    }

    // 🟢 Normaliza el proveedor eliminando espacios en blanco
    const proveedorNormalizado = proveedor ? proveedor.trim() : "";
    const proveedorClave =
      proveedores.find((prov) => prov.CLAVE.trim() === proveedorNormalizado)
        ?.CLAVE || "";

    console.log("🔍 Guardando partida con proveedor:", proveedorClave);

    const updatedList = listPartidas.map((item) => {
      if (item.noPartida === selectedPartida.noPartida) {
        const insumosActualizados = item.insumos.map((existingInsumo) => {
          if (existingInsumo.insumo === insumo) {
            return {
              ...existingInsumo,
              cantidad,
              unidad,
              claveSae,
              descripcionInsumo,
              comentariosAdi,
              costoCotizado,
              proveedor: proveedorClave, // 🟢 Guarda sin espacios
              categoria,
              familia,
              linea,
            };
          }
          return existingInsumo;
        });

        const insumoYaExiste = item.insumos.some(
          (existingInsumo) => existingInsumo.insumo === insumo
        );

        return {
          ...item,
          insumos: insumoYaExiste
            ? insumosActualizados
            : [
                ...item.insumos,
                {
                  insumo,
                  cantidad,
                  unidad,
                  claveSae,
                  descripcionInsumo,
                  comentariosAdi,
                  costoCotizado,
                  proveedor: proveedorClave, // 🟢 Guarda sin espacios
                  categoria,
                  familia,
                  linea,
                },
              ],
        };
      }
      return item;
    });

    if (
      !updatedList.some((item) => item.noPartida === selectedPartida.noPartida)
    ) {
      updatedList.push({
        noPartida: selectedPartida.noPartida,
        insumos: [
          {
            insumo,
            cantidad,
            unidad,
            claveSae,
            descripcionInsumo,
            comentariosAdi,
            costoCotizado,
            proveedor: proveedorClave, // 🟢 Guarda sin espacios
            categoria,
            familia,
            linea,
          },
        ],
      });
    }

    console.log("Lista de partidas actualizada:", updatedList);
    setListPartidas(updatedList);
    handleCloseModal();
  };

  useEffect(() => {
    // Filtrar las claves cuando la línea cambie
    filtrarClavesPorLinea(linea);
  }, [linea]);

  useEffect(() => {
    // Filtrar proveedores cuando la línea cambie
    const proveedoresFiltrados = filtrarProveedoresPorLinea(linea);
    // Asignar el primer proveedor al seleccionar la clave
    if (proveedoresFiltrados.length > 0 && !proveedor) {
      setProveedor(proveedoresFiltrados[0]);
    }
  }, [linea]);
  /*useEffect(() => {
    // Verifica si los campos esenciales están llenos
    if (insumo && unidad && linea) {
      // Solo hacer la consulta cuando los campos están completos
      axios
        .get("https://us-central1-gscotiza-cd748.cloudfunctions.net/api/claves")
        .then((response) => {
          setClavesSAE(response.data); // Guardar las claves obtenidas en el estado
        })
        .catch((error) => {
          console.error("Error al obtener las claves:", error);
        });
    }
  }, [insumo, unidad, linea]); // Dependencias: se ejecuta cuando estos campos cambian*/

  const filtrarClavesPorLinea = (linea) => {
    return clavesSAE.filter((clave) => clave.LINEA === linea); // Ajusta a tu estructura
  };

  const filtrarProveedoresPorLinea = (linea) => {
    // Filtra los proveedores según la línea
    return proveedores.filter((proveedor) => proveedor.LINEA === linea);
  };

  // Filtrar las líneas según el tipo (si tipoLinea es "Producto", muestra solo esas)
  //const tiposPermitidos = ["Producto", "Servicio", "Pieza"];

  /*const lineasFiltradas = lineas.filter(linea =>
    linea.tipoLinea === unidad // Compara el tipoLinea con el tipoUnidad seleccionado
  );*/
  const obtenerFamilia = async (categoriaSeleccionada) => {
    try {
      const response = await axios.get(
        `/api/categorias/${categoriaSeleccionada}`
        //`http://localhost:5000/api/categorias/${categoriaSeleccionada}`
      );
      setFamilias(response.data); // Guarda las familias filtradas en el estado
      console.log("Familias filtradas obtenidas:", response.data);
    } catch (error) {
      console.error("Error al obtener las familias:", error);
    }
  };
  const handleLineaChange = async (e) => {
    const lineaSeleccionada = e.target.value;
    setLinea(lineaSeleccionada); // Guarda la línea seleccionada

    if (lineaSeleccionada) {
      const clavesSae = await obtenerClaveSae(lineaSeleccionada);
      setClavesSAE(Array.isArray(clavesSae) ? clavesSae : []);
    } else {
      setClavesSAE([]); // 🔹 Limpia las claves si no hay línea seleccionada
    }
  };
  const obtenerClaveSae = async (cveLin) => {
    try {
      console.log("🔎 Buscando Clave SAE para la línea (CVE_LIN):", cveLin); // 🔍 Verifica qué valor se envía

      const response = await axios.get(
        //`http://localhost:5000/api/clave-sae/${cveLin}`
        `/api/clave-sae/${cveLin}`
      );

      console.log("🔹 Claves SAE obtenidas desde SQL:", response.data);

      if (response.data.length === 0) {
        console.warn("⚠️ No se encontraron claves SAE.");
        return [];
      }

      return response.data.map((item) => ({
        clave: item.CVE_ART || "Clave no encontrada",
        descripcion: item.DESCR || "Descripción no encontrada",
      }));
    } catch (error) {
      console.error("❌ Error al obtener Clave SAE desde SQL:", error);
      return [];
    }
  };
  const handleCategoriaChange = async (e) => {
    const categoriaSeleccionada = e.target.value;
    setCategoria(categoriaSeleccionada); // Guarda la categoría seleccionada

    if (categoriaSeleccionada) {
      obtenerFamilia(categoriaSeleccionada); // Llama a la API para obtener las familias
    } else {
      setFamilia([]); // Limpia la familia si no hay categoría seleccionada
    }
  };
  const handleFamiliaChange = async (e) => {
    const familiaSeleccionada = e.target.value;
    setFamilia(familiaSeleccionada); // Guarda la familia seleccionada

    if (familiaSeleccionada) {
      obtenerLineas(familiaSeleccionada); // Llama a la API para obtener líneas
    } else {
      setLineas([]); // Limpia las líneas si no hay familia seleccionada
    }
  };
  const obtenerLineas = async (familiaSeleccionada) => {
    console.log("Obteniendo líneas para la familia:", familiaSeleccionada); // Verifica la entrada
    try {
      //console.log(familiaSeleccionada);
      const response = await axios.get(
        `/api/lineas/${familiaSeleccionada}`
        //`http://localhost:5000/api/lineas/${familiaSeleccionada}`
      );
      setLineas(response.data); // Guardar las líneas en el estado
      console.log("Líneas filtradas obtenidas:", response.data); // Verifica la respuesta
    } catch (error) {
      console.error("Error al obtener las líneas:", error);
    }
  };
  /* Modales */
  const handleDelete = async (noPartida, cve_levDig) => {
    try {
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

        console.log("Estatus actualizado exitosamente.");

        // No se recomienda recargar la página; en su lugar, puedes manejar la actualización del estado localmente
        window.location.reload();
      } else {
        console.log(
          "No se encontró ningún documento que coincida con los identificadores proporcionados."
        );
      }
    } catch (error) {
      console.error("Error al actualizar el estatus:", error);
    }
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
  const handleAddInsumo = (noPartida, insumo, cantidad, unidad, claveSae) => {
    // Buscar la partida seleccionada
    const updatedInsumos = [...insumos];

    const existingInsumo = updatedInsumos.find(
      (item) => item.noPartida === noPartida
    );

    if (existingInsumo) {
      existingInsumo.insumos.push({ insumo, cantidad, unidad, claveSae });
    } else {
      updatedInsumos.push({
        noPartida,
        insumos: [{ insumo, cantidad, unidad, claveSae }],
      });
    }

    setInsumos(updatedInsumos); // Actualiza el estado
  };
  const handleDeleteInsumo = (noPartida, insumoToDelete) => {
    // Filtra el insumo dentro de la partida seleccionada
    const updatedList = listPartidas.map((item) => {
      if (item.noPartida === noPartida) {
        return {
          ...item,
          insumos: item.insumos.filter(
            (insumo) => insumo.insumo !== insumoToDelete.insumo
          ), // Filtra el insumo a eliminar
        };
      }
      return item; // Mantén las demás partidas sin cambios
    });

    // Filtrar las partidas sin insumos
    const finalList = updatedList.filter((item) => item.insumos.length > 0);

    setListPartidas(finalList); // Actualiza el estado eliminando el insumo
  };
  /* --------------------------------------------------- - AGREGAR NUEVO DOCUMENTO --------------------------------------------------*/
  const addPreCotizacion = async (e) => {
    e.preventDefault();

    // Validación de fechas antes de continuar
    if (!fechaInicio || !fechaFin) {
      swal.fire({
        icon: "warning",
        title: "Fechas incompletas",
        text: "Debes seleccionar tanto la fecha de inicio como la fecha de fin antes de continuar.",
      });
      return;
    }
    // Si listPartidas o listMano están vacíos, mostrar alerta y detener ejecución
    if (
      !listPartidas ||
      listPartidas.length === 0 ||
      !listMano ||
      listMano.length === 0
    ) {
      swal.fire({
        icon: "warning",
        title: "Faltan Datos",
        text: "Debes seleccionar datos de insumos y/o mano de obra para continuar.",
      });
      return; // 🚨 DETIENE la ejecución aquí si faltan datos
    }
    // Obtener el documento de la colección FOLIOS con el nombre del folio
    const folioSnapshot = await getDocs(
      query(collection(db, "FOLIOS"), where("folio", "==", selectedFolio))
    );

    if (!folioSnapshot.empty) {
      const folioDoc = folioSnapshot.docs[0];
      const folioId = folioDoc.id;
      const folioData = folioDoc.data();
      const folioSiguienteActual = folioData.folioSiguiente;
      const nuevoFolioSiguiente = folioSiguienteActual + 1;

      await updateDoc(doc(db, "FOLIOS", folioId), {
        folioSiguiente: nuevoFolioSiguiente,
      });
    } else {
      console.log("No se encontró el documento en la colección FOLIOS.");
      return;
    }

    if (folioSiguiente !== 0) {
      const bitacora = collection(db, "BITACORA");
      const today = new Date();
      const ahora = new Date();
      const hora = ahora.getHours();
      const minuto = ahora.getMinutes();
      const segundo = ahora.getSeconds();
      const formattedDate = today.toLocaleDateString();
      const horaFormateada = `${hora}:${minuto}:${segundo}`;

      await addDoc(bitacora, {
        cve_Docu: selectedFolio + folioSiguiente.toString(),
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Registro",
        noPartida: "N/A",
      });

      // Guardar PRE-COTIZACIÓN
      await addDoc(precotizacioncoleccion, {
        cve_precot: selectedFolio + folioSiguiente.toString(),
        cve_clie: cve_clie,
        estatus: estatus,
        docAnt: cve_levDig,
        docSig: "",
        fechaElaboracion: fechaElaboracion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        fechaRegistro: formattedDate,
        fechaModificacion: formattedDate,
      });

      // Bloqueo del documento en LEVANTAMIENTO DIGITAL
      await addDoc(bitacora, {
        cve_Docu: cve_levDig,
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Bloqueo de documento",
        noPartida: "N/A",
      });

      const statusLevDig = "Bloqueado";
      const preCotizacionRef = doc(db, "LEVDIGITAL", id);
      await updateDoc(preCotizacionRef, {
        estatus: statusLevDig,
        docSig: selectedFolio + folioSiguiente.toString(),
        fechaModificacion: formattedDate,
      });

      // 📌 **Guardar PARTIDAS de Levantamiento Digital**
      for (const itemLD of par_levDigital) {
        await addDoc(parPrecotizacion, {
          cve_precot: selectedFolio + folioSiguiente.toString(),
          noPartida: itemLD.noPartida,
          cantidad: itemLD.cantidad,
          descripcion: itemLD.descripcion,
          observacion: itemLD.observacion,
          fechaRegistro: formattedDate,
          estatus: "Activo",
          fechaModificacion: formattedDate,
        });
      }

      // 📌 **Guardar PARTIDAS de INSUMOS (listPartidas)**
      for (const item of listPartidas) {
        for (const insumo of item.insumos) {
          await addDoc(bitacora, {
            cve_Docu: selectedFolio + folioSiguiente.toString(),
            tiempo: horaFormateada,
            fechaRegistro: formattedDate,
            tipoDocumento: "Registro de partida",
            noPartida: "N/A",
          });

          await addDoc(parPrecotizacionInsumos, {
            cve_precot: selectedFolio + folioSiguiente.toString(),
            noPartidaPC: parseInt(item.noPartida),
            docAnteriorPPC: cve_levDig,
            insumo: insumo.insumo,
            proveedor: insumo.proveedor, // Ahora guarda la CLAVE con espacios
            descripcionInsumo: insumo.descripcionInsumo,
            comentariosAdi: insumo.comentariosAdi,
            unidad: insumo.unidad,
            costoCotizado: insumo.costoCotizado,
            cantidad: insumo.cantidad,
            total: insumo.costoCotizado * insumo.cantidad,
            estatus: "Activo",
            categoria: insumo.categoria,
            familia: insumo.familia,
            linea: insumo.linea,
            claveSae: insumo.claveSae,
          });
        }
      }

      // 📌 **Guardar PARTIDAS de MANO DE OBRA (listMano)**
      for (const item of listMano) {
        const personalSeleccionado = await obtenerMOPorNombre(item.personal);
        const { valorHombre, salarioDiario } = personalSeleccionado;

        await addDoc(bitacora, {
          cve_Docu: selectedFolio + folioSiguiente.toString(),
          tiempo: horaFormateada,
          fechaRegistro: formattedDate,
          tipoDocumento: "Registro de partida",
          noPartida: item.noPartidaMO,
        });

        await addDoc(parPrecotizacionMO, {
          cve_precot: selectedFolio + folioSiguiente.toString(),
          noPartidaMO: parseInt(item.noPartidaMO),
          personal: item.personal,
          cantidadTrabajadores: parseInt(item.cantidadTrabajadores),
          diasTrabajados: item.diasTrabajados,
          valorLider:
            parseInt(item.cantidadTrabajadores) *
            valorHombre *
            parseInt(item.diasTrabajados),
          costoLider:
            parseInt(item.cantidadTrabajadores) *
            salarioDiario *
            parseInt(item.diasTrabajados),
          salarioDiario: parseFloat(salarioDiario),
          fechaRegistro: formattedDate,
          fechaModificacion: formattedDate,
          estatus: "Activo",
        });
      }

      navigate("/levantamientoDigital");
    } else {
      alert("Selecciona un folio válido");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Convertir levantamiento digital a precotizacion</h1>
          <div className="row">
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">FOLIO</label>
                <select
                  id="selectFolio"
                  className="form-control"
                  value={selectedFolio || ""}
                  disabled
                  onChange={(e) => setSelectedFolio(e.target.value)}
                >
                  <option value="" disabled>
                    Folio
                  </option>
                  {folios.map((folio) => (
                    <option key={folio.id} value={folio.folio}>
                      {folio.folio}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">FOLIO SIGUIENTE</label>
                <input
                  className="form-control"
                  id="inputFolioSecuencial"
                  type="text"
                  value={`${selectedFolio}${folioSiguiente}`}
                  disabled
                  onChange={(e) => setCve_levDig(e.target.value)}
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
                  value={noPartida}
                  onChange={(e) => setNoPartida(e.target.value)}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-3 ">
              <label className="form-label">CANTIDAD</label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={cantidadPartida}
                  onChange={(e) => setCantidadPartida(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <p></p>
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
              <button
                className="btn btn-success"
                onClick={agregarPartidaAdicional}
              >
                <CiCirclePlus />
                Agregar tarea
              </button>
            </div>
            <div>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No. Partida</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">observaciones</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                    <th scope="col">Agregar Insumos</th>
                    <th scope="col">Agregar Mano</th>
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
          <div className="row" style={{ border: "1px solid #000" }}>
            <label style={{ color: "red" }}>PARTIDAS POR INSUMO </label>
            <br></br>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">No. Partida</th>
                  <th scope="col">Insumo</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Unidad</th>
                  <th scope="col">Clave SAE</th>
                  <th scope="col">Editar</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {listPartidas.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.insumos.map((insumo, subIndex) => {
                      // 🔄 Buscar la unidad en la lista de unidades
                      const unidadEncontrada = unidades.find(
                        (u) =>
                          String(u.unidad || "")
                            .trim()
                            .toLowerCase() ===
                          String(insumo.unidad || "")
                            .trim()
                            .toLowerCase()
                      );

                      return (
                        <tr key={`${index}-${subIndex}`}>
                          {subIndex === 0 && (
                            <td rowSpan={item.insumos.length}>
                              {item.noPartida}
                            </td>
                          )}
                          <td>{insumo.insumo}</td>
                          <td>{insumo.cantidad}</td>
                          {/* 🔄 Muestra el nombre de la unidad o "Sin definir" si no existe */}
                          <td>
                            {unidadEncontrada
                              ? unidadEncontrada.descripcion
                              : insumo.unidad || "Sin definir"}
                          </td>
                          <td>{insumo.claveSae}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                handleEditInsumo(item.noPartida, insumo)
                              }
                            >
                              <FaPencilAlt />
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                handleDeleteInsumo(item.noPartida, insumo)
                              }
                            >
                              <MdDelete />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <br></br>
          <div className="row" style={{ border: "1px solid #000" }}>
            <label style={{ color: "red" }}>PARTIDAS POR MANO DE OBRA </label>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">No Partida</th>
                  <th scope="col">No. de trabajadores</th>
                  <th scope="col">Trabajador</th>
                  <th scope="col">Días trabajados</th>
                  <th scope="col">Editar</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {listMano.length > 0 ? (
                  listMano.map((itemMO, indexMO) => (
                    <tr key={indexMO}>
                      <td>{itemMO.noPartidaMO || "-"}</td>
                      <td>{itemMO.cantidadTrabajadores || "-"}</td>
                      <td>{itemMO.personal || "-"}</td>
                      <td>{itemMO.diasTrabajados || "-"}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => EditPartidaMO(indexMO)}
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            DeletePartidaMO(indexMO);
                          }}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <br></br>
          <button className="btn btn-success" onClick={addPreCotizacion}>
            <HiDocumentPlus /> GUARDAR DOCUMENTO
          </button>
        </div>
      </div>
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
            {selectedPartida ? "Editar Insumo" : "Añadir Insumo"}
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
            {/* Columna para Línea en la misma fila */}
            {/*<div className="col-md-4">
              <div className="mb-3">
                <label>Categoría</label>
                <select
                  className="form-control"
                  value={categoria}
                  onChange={handleCategoriaChange} // Llama a la función cuando cambie
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((categoria, index) => (
                    <option key={index} value={categoria.cuenta}>
                      {categoria.cuenta} - {categoria.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label>Familia</label>
                <select
                  className="form-control"
                  value={familia}
                  onChange={handleFamiliaChange} // Llama a la función cuando cambie
                  disabled={!categoria} // Solo habilita si hay categoría seleccionada
                >
                  <option value="">Seleccionar...</option>
                  {familias.map((familia, index) => (
                    <option key={index} value={familia.CUENTA_COI}>
                      {familia.CUENTA_COI} - {familia.DESC_LIN}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label>Línea</label>
                <select
                  className="form-control"
                  value={linea}
                  //onChange={(e) => setLinea(e.target.value)} // Guarda la línea seleccionada
                  onChange={handleLineaChange}
                  disabled={!familia || !categoria} // Solo habilita si hay una familia seleccionada
                >
                  <option value="">Seleccionar...</option>
                  {lineas.map((linea, index) => (
                    <option key={index} value={linea.CVE_LIN}>
                      {linea.CUENTA_COI} - {linea.DESC_LIN}
                    </option>
                  ))}
                </select>
              </div>
            </div>*/}
            <div className="col-md-10">
              <div className="mb-3">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="form-control"
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={processExcelFile}
                >
                  Procesar Archivo
                </button>
                <button
                  className="btn btn-success mt-2 ms-2"
                  onClick={handleAddFromExcel}
                >
                  Agregar Partidas
                </button>
              </div>
            </div>
            {/* Fila 2: Proveedor, Descripcion */}
            <div className="row mb-6">
              <div className="col-md-6">
                <div className="mb-4">
                  <label>Clave SAE</label>
                  <select
                    className="form-control"
                    value={claveSae}
                    onChange={(e) => setClaveSae(e.target.value)}
                    disabled={!linea} // Deshabilita si no hay claves disponibles
                  >
                    <option value="">Seleccionar...</option>
                    {Array.isArray(clavesSAE) && clavesSAE.length > 0 ? (
                      clavesSAE.map((item, index) => (
                        <option key={index} value={item.clave}>
                          {item.descripcion}
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay claves disponibles</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label>Proveedor</label>
                  <Select
                    options={proveedores.map((prov) => ({
                      value: prov.CLAVE,
                      label: prov.NOMBRE,
                    }))}
                    value={
                      proveedor
                        ? {
                            value: proveedor,
                            label:
                              proveedores.find(
                                (prov) => prov.CLAVE === proveedor
                              )?.NOMBRE || "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      console.log(
                        "🔹 Nuevo proveedor seleccionado:",
                        selectedOption
                      );
                      setProveedor(selectedOption.value);
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
        onHide={() => setShowAddModalMO(false)}
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
                    value={noPartidaMO || ""} // Aquí el valor se establece automáticamente
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-5">
                <div className="mb-3">
                  <label className="form-label">TRABAJADOR</label>
                  <select
                    id="selectTrabajador"
                    className="form-control"
                    value={selectedTrabajador}
                    onChange={(e) => setSelectedTrabajador(e.target.value)}
                  >
                    <option value="" disabled>
                      SELECCIONA UN TRABAJADOR
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
                <label className="form-label">CANTIDAD DE PERSONAL</label>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    value={cantidadTrabajadores}
                    onChange={(e) => setCantidadTrabajadores(e.target.value)}
                    className="form-control"
                    placeholder="Cantidad"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label">DÍAS TRABAJADOS</label>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    value={diasTrabajados}
                    onChange={(e) => setDiasTrabajados(e.target.value)}
                    className="form-control"
                    placeholder="Días"
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModalMO(false)}>
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

export default AgregarPreCotizacion;
