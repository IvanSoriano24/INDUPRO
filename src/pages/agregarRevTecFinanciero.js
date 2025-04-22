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
import swal from "sweetalert2";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle, Modal, Button } from "react-bootstrap";

import axios from "axios";
import Select from "react-select";
import encabezadoPDF from "../imagenes/GS-ENCABEZADO-2.PNG";
import pdfMake from "pdfmake/build/pdfmake";
import { VscFilePdf } from "react-icons/vsc";

const AgregarRevTecFinanciero = () => {
  const [showAddModalMO, setShowAddModalMO] = useState(false);
  const [selectedPartida, setSelectedPartida] = useState(null);
  const [claveSae, setClaveSae] = useState(""); // Estado para la clave SAE
  const [clavesSAE, setClavesSAE] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [familia, setFamilia] = useState("");
  const [familias, setFamilias] = useState([]);
  const [subLinea, setSubLinea] = useState("");
  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [listPartidas, setListPartidas] = useState([]);
  const [listMano, setListMano] = useState([]);
  const [lineas, setLineas] = useState([]); // Lista de líneas disponibles
  const [linea, setLinea] = useState(""); // Estado para la línea seleccionada
  const [showAddModal, setShowAddModal] = useState(false);
  const handleClose = () => {
    setShow(false);
    setSelectedPartida(null);
    setCantidad("");
    setDescripcion("");
    setObservacion("");
  };
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [idPartida, setIdPartida] = useState("");
  /*-----------------------------------------------------------*/
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

  const [cve_levDig_par, setLevDigital_par] =
    useState(""); /* Este es el campo que agregue */
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [list, setList] = useState([]);
  const [par_levDigital, setPar_levDigital] = useState([]);
  const [noPartida, setNoPartida] = useState("");
  const [listPreCot, setListPreCot] = useState([]);
  /* --------------------------- PARTIDAS DE INSUMO -----------*/
  const [cve_precot, setPrecot] = useState("");
  const [factores, setFactores] = useState([]);
  const [par_PreCoti_insu, setPar_PreCoti_insu] = useState([]);
  const [contadorDecimal, setContadorDecimal] = useState(0.1);
  const [insumo, setInsumo] = useState("");
  //const[no_subPartida, setNoSubPartida] = useState("");
  const [noPartidaPC, setNoPartidaPC] = useState();
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
  const [cantidadTrabajadores, setCantidadTrabajadores] = useState();
  const [diasTrabajados, setDiasTrabajados] = useState("");
  const [noPartidaMO, setNoParatidaMO] = useState(1);
  const [cve_precotMO, setCve_precotMO] = useState("");
  const [personal, setPersonal] = useState("");
  const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
  const [editIndex, setEditIndex] = useState(null);
  const [listMO, setListMO] = useState([]);
  const [modoModal, setModoModal] = useState("Crear");
  /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */

  const parPrecotizacion = collection(db, "PAR_PRECOTIZACION");
  const precotizacioncoleccion = collection(db, "PRECOTIZACION");
  const parPrecotizacionInsumos = collection(db, "PAR_PRECOTIZACION_INSU");
  const parPrecotizacionMO = collection(db, "PAR_PRECOTIZACION_MO");

  const tecnicoFinanciero = collection(db, "TECNICOFINANCIERO");
  const parTecFin = collection(db, "PAR_TECFINANCIERO");
  const parTecFinInsumos = collection(db, "PAR_TECFIN_INSU");
  const parTecFinMO = collection(db, "PAR_TECFIN_MO");
  const navigate = useNavigate();
  const { id } = useParams();
  const [idMonday, setIdMonday] = useState("");

  /*******************************************************************/
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [clienteLista, setClienteLista] = useState([]);
  /*******************************************************************/
  /* --------------------   Obtener los folios correspondiente  -------------------------- */
  /*useEffect(() => {
    const obtenerFolios = async () => {
      const foliosCollection = collection(db, "FOLIOS");
      const q = query(foliosCollection, where("documento", "==", "ATF"));
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
    };

    obtenerFolios();
  }, []); // Se ejecutará solo una vez al cargar el componente

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
  }, [selectedFolio, folios]);*/
  /*AQUI*/
  /*const obtenerFolios = (setFolios) => {
    console.log("🛠️ Suscribiéndose a cambios en FOLIOS...");

    const foliosCollection = collection(db, "FOLIOS");
    const q = query(foliosCollection, where("documento", "==", "ATF"));

    const unsubscribe = onSnapshot(q, (foliosSnapshot) => {
      const listaFolios = foliosSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          folio: data.folio,
          folioSiguiente: data.folioSiguiente,
        };
      });

      setFolios(listaFolios);
      console.log("📌 Datos de FOLIOS actualizados:", listaFolios);
    });

    // Cleanup: Nos desuscribimos si el componente se desmonta
    return unsubscribe;
  };*/

  useEffect(() => {
    const obtenerFolios = async () => {
      const foliosCollection = collection(db, "FOLIOS");
      const q = query(foliosCollection, where("documento", "==", "ATF"));
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
  }, [selectedFolio]); // 🔹 Se ejecuta solo una vez al cargar el componente

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
  }, [selectedFolio, folios]); // 🔹 Se ejecuta cuando cambia selectedFolio o folios

  /* --------------------  fin de Obtener los folios correspondiente  -------------------------- */
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
  /* ------------------------------------------------------------------------*/
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
  /*AQUI*/
  /* --------------------- JALAR INFORMACIÓN DE PARTIDAS ANTERIORES ------------------------------------- */
  /*const getParLevDigital = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_PRECOTIZACION"),
          where("cve_precot", "==", cve_precot)
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
  }, [cve_precot]);*/ // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  const getParLevDigital = (cve_precot, setPar_levDigital, setNoPartida) => {
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
      const par_levDigList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      console.log(
        "📌 Datos de PAR_PRECOTIZACION actualizados:",
        par_levDigList
      );

      // Ordenar por número de partida
      par_levDigList.sort((a, b) => a.noPartida - b.noPartida);
      setPar_levDigital(par_levDigList);

      // Obtener el número máximo de partida
      const maxPartida = Math.max(
        ...par_levDigList.map((item) => item.noPartida),
        0
      );
      setNoPartida(maxPartida + 1);

      console.log("📌 Número máximo de partida actualizado:", maxPartida + 1);
    });

    // Cleanup: Nos desuscribimos si cve_precot cambia o el componente se desmonta
    return unsubscribe;
  };

  useEffect(() => {
    if (!cve_precot) return;

    console.log(`🛠️ useEffect ejecutado con cve_precot: ${cve_precot}`);
    const unsubscribe = getParLevDigital(
      cve_precot,
      setPar_levDigital,
      setNoPartida
    );

    return () => {
      console.log(
        "❌ Desuscribiendo de Firestore para cve_precot:",
        cve_precot
      );
      unsubscribe && unsubscribe();
    };
  }, [cve_precot]);
  /*AQUI*/

  const getCliente = async () => {
    try {
      const data = await getDocs(
        query(collection(db, "CLIENTES"), where("cve_clie", "==", cve_clie))
      );
      //par_preCotList
      const par_preCotList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setClienteLista(par_preCotList);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    getCliente();
  }, [cve_clie]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  /* --------------------- AGREGAR PARTIDAS DE PRE COTIZACIÓN ------------------------------------- */
  const agregarPartidaAdicional = async (e) => {
    e.preventDefault();
    const bitacora = collection(db, "BITACORA");
    const today = new Date();
    const ahora = new Date();
    const hora = ahora.getHours();
    const minuto = ahora.getMinutes();
    const segundo = ahora.getSeconds();
    const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
    const horaFormateada = `${hora}:${minuto}:${segundo}`;
    await addDoc(bitacora, {
      cve_Docu: selectedFolio + folioSiguiente.toString(),
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
    });
    window.location.reload();
  };

  /* ------------------------------------ OBTENER TABLA DE INSUMOS -------------------------------*/
  /*const obtenerFactores = async () => {
    try {
      const data = await getDocs(collection(db, "FACTORES"));
      const factoresList = data.docs.map((doc) => doc.data().nombre);
      return factoresList;
    } catch (error) {
      console.error("Error al obtener datos de FACTORES:", error);
      return [];
    }
  };
  useEffect(() => {
    const cargarFactores = async () => {
      const factoresList = await obtenerFactores();
      setFactores(factoresList);
    };

    cargarFactores();
  }, [factores]);*/
  const obtenerFactores = (setFactores) => {
    console.log("🛠️ Suscribiéndose a cambios en FACTORES...");

    const unsubscribe = onSnapshot(collection(db, "FACTORES"), (snapshot) => {
      const factoresList = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("📌 Documento recuperado:", data); // Verifica qué datos trae Firestore
        return data.nombre !== undefined ? data.nombre : "Sin nombre"; // Evita valores undefined
      });

      setFactores(factoresList);
      console.log("📌 Datos de FACTORES actualizados:", factoresList);
    });

    // Cleanup: Nos desuscribimos si el componente se desmonta
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
  /*AQUI*/
  /* ------------------------------------ OBTENER TABLA DE TRABAJADORES -------------------------------*/
  const obtenerTrabajadores = (setManoObra) => {
    console.log("🛠️ Suscribiéndose a cambios en PERSONAL...");

    const unsubscribe = onSnapshot(collection(db, "PERSONAL"), (snapshot) => {
      const manoObraList = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("📌 Documento recuperado:", data); // Verifica qué datos trae Firestore
        return data.personal !== undefined ? data.personal : "Sin personal"; // Evita valores undefined
      });

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
  }, []); // 🔹 Eliminamos `manoObra` de las dependencias para evitar bucles innecesarios
  /*AQUI*/
  /* ----------------------------------------- OBTENER PARTDIAS DE INSUMOS PARA LA PRECOTIZACIÓN -------------------------*/

  const getParPreCotizacion = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_PRECOTIZACION_INSU"),
          where("cve_precot", "==", cve_precot)
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
  }, [cve_precot]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  //console.log("Prueba" + par_PreCoti_insu);

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

      // 🔄 **Recargar la página para reflejar los cambios**
      swal
        .fire({
          title: "Eliminación Exitosa",
          text: "La partida y sus dependencias han sido eliminadas.",
          icon: "success",
          confirmButtonText: "Aceptar",
        })
        .then(() => {
          window.location.reload(); // 🔄 Recarga la página después de cerrar la alerta
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
      if (folioSiguiente != 0) {
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
          cve_Docu: selectedFolio + folioSiguiente.toString(),
          tiempo: horaFormateada,
          fechaRegistro: formattedDate,
          tipoDocumento: "Registro de partidas",
          noPartida: noPartidaPC,
        });
        await addDoc(parPrecotizacionInsumos, {
          cve_precot: cve_precot,
          noPartidaPC: noPartidaPC,
          docAnteriorPPC: cve_levDig,
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
        });
        setContadorDecimal(contadorDecimal + 1);
        window.location.reload();
      } else {
        alert("Antes debes seleccionar el folio de Pre-cotización");
      }
    } else {
      alert("Selecciona el número de partida");
    }
  };
  /* ---------------------------------------------------- JALAR  PARTIDAS MANO DE OBRA ---------------*/
  const obtenerPartidasMO = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_PRECOTIZACION_MO"),
          where("cve_precot", "==", cve_precot)
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
      //(maxPartida + 1);
      //console.log("max Partida: " + maxPartida)
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    obtenerPartidasMO();
  }, [cve_precot]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
  //console.log("Prueba" + par_PreCoti_insu);

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
  /* ---------------------------------------------------- AGREGAR PARTIDAS MANO DE OBRA ---------------*/
  const agregarPartidaMOAdicional = async (e) => {
    e.preventDefault();
    const personalSeleccionado = await obtenerMOPorNombre(selectedTrabajador);
    const { valorHombre, salarioDiario } = personalSeleccionado;
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
        cve_Docu: selectedFolio + folioSiguiente.toString(),
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Registro de partidas",
        noPartida: noPartidaMO,
      });
      await addDoc(parPrecotizacionMO, {
        cve_precot: cve_precot,
        noPartidaMO: noPartidaMO,
        cantidadTrabajadores: cantidadTrabajadores,
        personal: selectedTrabajador,
        diasTrabajados: diasTrabajados,
        valorLider: cantidadTrabajadores * valorHombre * diasTrabajados,
        costoLider: cantidadTrabajadores * salarioDiario * diasTrabajados,
      });
      window.location.reload();
    } else {
      alert("Ingresa una cantidad en los días trabajados");
    }
  };
  /*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! - CALCULO DE VALORES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
  const sumarValorLider = async (cve_tecFin, noPartida) => {
    const moSnapshot = await getDocs(
      query(
        collection(db, "PAR_PRECOTIZACION_MO"),
        where("cve_precot", "==", cve_tecFin),
        where("noPartidaMO", "==", noPartida)
      )
    );

    let sumaValorLider = 0;
    moSnapshot.forEach((moDoc) => {
      const moData = moDoc.data();
      sumaValorLider += moData.valorLider;
    });

    return sumaValorLider;
  };
  const sumarCalculoInsumo = async (cve_tecFin, noPartida) => {
    const moSnapshot = await getDocs(
      query(
        collection(db, "PAR_PRECOTIZACION_INSU"),
        where("cve_precot", "==", cve_tecFin),
        where("noPartidaPC", "==", Number(noPartida))
      )
    );
    //console.log("moSnapshot: ", moSnapshot);
    if (moSnapshot.empty) {
      console.warn("⚠️ No se encontraron insumos para:", cve_tecFin, noPartida);
      return 0;
    }
    let calculoInsumo = 0;
    moSnapshot.forEach((moDoc) => {
      const moData = moDoc.data();
      calculoInsumo += moData.total;
    });
    return calculoInsumo;
  };

  const obtenerPorcentajes = async () => {
    try {
      // Obtener el documento de la colección "PORCENTAJES"
      const porcentajesDocRef = doc(db, "PORCENTAJES", "NTtgoYURKvkxbuq2ospC"); // Reemplaza 'ID_DEL_DOCUMENTO' con el ID real del documento
      const porcentajesDocSnapshot = await getDoc(porcentajesDocRef);

      // Verificar si el documento existe
      if (porcentajesDocSnapshot.exists()) {
        // Extraer los valores de los campos costoFijo, factoraje, utilidad y fianzas
        const datosPorcentajes = porcentajesDocSnapshot.data();
        const { costoFijo, factoraje, utilidad, fianzas } = datosPorcentajes;

        // Devolver los valores extraídos
        return { costoFijo, factoraje, utilidad, fianzas };
      } else {
        console.log("El documento PORCENTAJES no existe.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener los datos de PORCENTAJES:", error);
      return null;
    }
  };
  /* ----------------------------------------------------------- - AGREGAR NUEVO DOCUMENTO -------------------------------------------------*/
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
    if (!par_PreCoti_insu || par_PreCoti_insu.length === 0) {
      swal.fire({
        icon: "warning",
        title: "Faltan Datos",
        text: "Debes seleccionar datos de insumos y/o mano de obra para continuar.",
      });
      return; // 🚨 DETIENE la ejecución aquí si faltan datos
    }

    const partidasSinInsumos = par_levDigital.filter((partida) => {
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

    // Obtener el documento de la colección FOLIOS con el nombre del folio
    const folioSnapshot = await getDocs(
      query(collection(db, "FOLIOS"), where("folio", "==", selectedFolio))
    );
    if (!folioSnapshot.empty) {
      // Tomar el primer documento encontrado (suponiendo que hay uno)
      const folioDoc = folioSnapshot.docs[0];
      // Obtener el id del documento
      const folioId = folioDoc.id;
      // Obtener el valor actual de folioSiguiente
      const folioData = folioDoc.data();
      const folioSiguienteActual = folioData.folioSiguiente;
      // Incrementar el valor de "folioSiguiente"
      const nuevoFolioSiguiente = folioSiguienteActual + 1;
      // Actualizar el documento en la colección FOLIOS
      await updateDoc(doc(db, "FOLIOS", folioId), {
        folioSiguiente: nuevoFolioSiguiente,
      });
    } else {
      console.log("No se encontró el documento en la colección FOLIOS.");
    }
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
        cve_Docu: selectedFolio + folioSiguiente.toString(),
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Registro",
        noPartida: "N/A",
      });
      await addDoc(tecnicoFinanciero, {
        cve_tecFin: selectedFolio + folioSiguiente.toString(),
        cve_clie: cve_clie,
        estatus: estatus,
        docAnt: cve_precot,
        docSig: "",
        fechaElaboracion: fechaElaboracion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        idMonday: idMonday,
      });
      await addDoc(bitacora, {
        cve_Docu: cve_precot,
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Bloqueo de documento",
        noPartida: "N/A",
      });
      const statusLevDig = "Bloqueado";
      const preCotizacionRef = doc(db, "PRECOTIZACION", id);
      const datos = {
        estatus: statusLevDig,
        docSig: selectedFolio + folioSiguiente.toString(),
      };
      await updateDoc(preCotizacionRef, datos);

      par_levDigital.forEach(async (itemLD) => {
        const bitacora = collection(db, "BITACORA");
        const today = new Date();
        const ahora = new Date();
        const hora = ahora.getHours();
        const minuto = ahora.getMinutes();
        const segundo = ahora.getSeconds();
        const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
        const horaFormateada = `${hora}:${minuto}:${segundo}`;
        await addDoc(bitacora, {
          cve_Docu: selectedFolio + folioSiguiente.toString(),
          tiempo: horaFormateada,
          fechaRegistro: formattedDate,
          tipoDocumento: "Registro de partidas",
          noPartida: itemLD.noPartida,
        });
        await addDoc(parTecFin, {
          cve_tecFin: selectedFolio + folioSiguiente.toString(),
          noPartida: itemLD.noPartida,
          descripcion: itemLD.descripcion,
          observacion: itemLD.observacion,
        });
      });
      par_PreCoti_insu.forEach(async (itemInsu) => {
        const bitacora = collection(db, "BITACORA");
        const today = new Date();
        const ahora = new Date();
        const hora = ahora.getHours();
        const minuto = ahora.getMinutes();
        const segundo = ahora.getSeconds();
        const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
        const horaFormateada = `${hora}:${minuto}:${segundo}`;
        await addDoc(bitacora, {
          cve_Docu: selectedFolio + folioSiguiente.toString(),
          tiempo: horaFormateada,
          fechaRegistro: formattedDate,
          tipoDocumento: "Registro de partidas",
          noPartida: itemInsu.noPartidaPC,
        });
        await addDoc(parTecFinInsumos, {
          cve_tecFin: selectedFolio + folioSiguiente.toString(),
          noPartidaATF: itemInsu.noPartidaPC,
          docAnterior: cve_precot,
          insumo: itemInsu.insumo,
          proveedor: itemInsu.proveedor,
          descripcionInsumo: itemInsu.descripcionInsumo,
          comentariosAdi: itemInsu.comentariosAdi,
          unidad: itemInsu.unidad,
          claveSae: itemInsu.claveSae,
          costoCotizado: itemInsu.costoCotizado,
          cantidad: itemInsu.cantidad,
          total: itemInsu.total,
        });
      });

      listMO.forEach(async (itemMO) => {
        const personalSeleccionado = await obtenerMOPorNombre(itemMO.personal);
        const { valorHombre, salarioDiario } = personalSeleccionado;
        const bitacora = collection(db, "BITACORA");
        const today = new Date();
        const ahora = new Date();
        const hora = ahora.getHours();
        const minuto = ahora.getMinutes();
        const segundo = ahora.getSeconds();
        const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
        const horaFormateada = `${hora}:${minuto}:${segundo}`;
        await addDoc(bitacora, {
          cve_Docu: selectedFolio + folioSiguiente.toString(),
          tiempo: horaFormateada,
          fechaRegistro: formattedDate,
          tipoDocumento: "Registro de partidas",
          noPartida: itemMO.noPartidaMO,
        });
        await addDoc(parTecFinMO, {
          cve_tecFin: selectedFolio + folioSiguiente.toString(),
          noPartidaMO: itemMO.noPartidaMO,
          personal: itemMO.personal,
          cantidadTrabajadores: itemMO.cantidadTrabajadores,
          diasTrabajados: itemMO.diasTrabajados,
          valorLider:
            itemMO.cantidadTrabajadores * valorHombre * itemMO.diasTrabajados,
          costoLider:
            itemMO.cantidadTrabajadores * salarioDiario * itemMO.diasTrabajados,
        });
      });

      /**************************************************AGREGAR TOTALES ******************************** */

      const { costoFijo, factoraje, utilidad, fianzas } =
        await obtenerPorcentajes();
      if (
        costoFijo !== undefined &&
        factoraje !== undefined &&
        utilidad !== undefined &&
        fianzas !== undefined
      ) {
        const cotTotal = collection(db, "ANALISIS_TOTALES");
        par_levDigital.forEach(async (itemTotales) => {
          //const cve_ATF = selectedFolio + folioSiguiente.toString()
          const sumaValorLider = await sumarValorLider(
            cve_precot,
            itemTotales.noPartida
          );
          //const noPartidaEntero = parseInt(item.noPartida, 10);
          const sumarCalculoInsumoV = await sumarCalculoInsumo(
            cve_precot,
            itemTotales.noPartida
          );
          //console.log("Suma: ", sumarCalculoInsumoV);
          await addDoc(cotTotal, {
            cve_tecFin: selectedFolio + folioSiguiente.toString(),
            noPartidaATF: itemTotales.noPartida, //DESDE AQUÍ LO RECUPERO
            descripcion: itemTotales.descripcion,
            observacion: itemTotales.observacion,
            cantidad: parseInt(itemTotales.cantidad),
            totalInsumo: sumarCalculoInsumoV,
            totalMO: sumaValorLider,
            totalPartida: sumaValorLider + sumarCalculoInsumoV,
            costoFijoPorcentaje: costoFijo,
            factorajePorcentaje: factoraje,
            utilidadPorcentaje: utilidad,
            fianzasPorcentaje: fianzas,
            factorIndirectoPorcentaje: costoFijo + factoraje,
            factorIndirectoNum: (costoFijo + factoraje) / 100,
            valorInsumos: parseInt(itemTotales.cantidad) * sumarCalculoInsumoV,
            claveSae: claveSae,
            costoXpartida:
              parseInt(itemTotales.cantidad) *
              (sumaValorLider + sumarCalculoInsumoV),
            costoUnitario:
              (sumaValorLider + sumarCalculoInsumoV) *
              ((costoFijo + factoraje) / 100 + 1),
            costoFactorizado:
              (sumaValorLider + sumarCalculoInsumoV) *
              ((costoFijo + factoraje) / 100 + 1) *
              parseInt(itemTotales.cantidad),
            precioXpartida:
              ((sumaValorLider + sumarCalculoInsumoV) *
                ((costoFijo + factoraje) / 100 + 1) *
                parseInt(itemTotales.cantidad)) /
              (1 - utilidad / 100),
            utilidaEsperada:
              ((sumaValorLider + sumarCalculoInsumoV) *
                ((costoFijo + factoraje) / 100 + 1) *
                parseInt(itemTotales.cantidad)) /
                (1 - utilidad / 100) -
              (sumaValorLider + sumarCalculoInsumoV) *
                ((costoFijo + factoraje) / 100 + 1) *
                parseInt(itemTotales.cantidad),
          });
        });
      }
      navigate("/revTecnicoFinanciero");
    } else {
      alert("Selecciona un folio valido");
    }
  };
  /*------------------------------------------------------------------------*/
  const EditPartidaMO = async (partidaId) => {
    if (!partidaId) {
      console.error("❌ Error: ID de la partida es inválido.");
      return;
    }

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

      // 🟢 Guardar el ID de la partida en `editIndex` para saber que estamos editando
      setEditIndex(partidaId);

      // 🔄 Mostrar el modal de edición
      setShowAddModalMO(true);
    } catch (error) {
      console.error("⚠️ Error al obtener la partida de mano de obra:", error);
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
  const obtenerFamilia = async (categoriaSeleccionada) => {
    try {
      console.log("Categoria:", categoriaSeleccionada);
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

      // 🎉 **Mostrar mensaje de éxito y recargar la página**
      swal
        .fire({
          title: "Eliminación Exitosa",
          text: "El insumo ha sido eliminado.",
          icon: "success",
          confirmButtonText: "Aceptar",
        })
        .then(() => {
          window.location.reload(); // 🔄 Recargar la página después de cerrar la alerta
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
  const handleSaveManoObra = async () => {
    if (
      !noPartidaMO ||
      !selectedTrabajador ||
      !cantidadTrabajadores ||
      !diasTrabajados
    ) {
      alert("⚠️ Faltan datos para completar la operación.");
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
        cve_Docu: selectedFolio + folioSiguiente.toString(),
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Registro de partidas",
        noPartida: parseInt(selectedPartida.noPartida, 10),
      });
      // 🟢 Construye el objeto con los datos a guardar
      const insumoData = {
        cve_precot: cve_precot, // Asegurar que el folio de la precotización se guarde
        noPartidaPC: parseInt(selectedPartida.noPartida, 10), // Convertir a número
        insumo,
        proveedor: proveedorConEspacios, // Guardar con espacios
        descripcionInsumo,
        comentariosAdi,
        unidad,
        costoCotizado: parseFloat(costoCotizado),
        cantidad: parseFloat(cantidad),
        total: costoCotizado * cantidad,
        claveSae,
        estatus: "Activo",
        fechaRegistro: new Date().toLocaleDateString(),
        fechaModificacion: new Date().toLocaleDateString(),
        costoFijo: (costoFijo / 100) * (costoCotizado * cantidad),
        factoraje: (factoraje / 100) * (costoCotizado * cantidad),
        fianzas: (fianzas / 100) * (costoCotizado * cantidad),
        utilidad: (utilidad / 100) * (costoCotizado * cantidad),
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
  const handleCloseModal = () => {
    setShowAddModal(false);
    setProveedor("");
    setDescripcionInsumo("");
    setComentariosAdi("");
    setCostoCotizado("");
    setCantidad("");
    setUnidad("servicio");
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
  const guardarEdicion = async () => {
    if (idPartida) {
      const partidaRef = doc(db, "PAR_PRECOTIZACION", idPartida);
      await updateDoc(partidaRef, {
        cantidad: cantidad,
        descripcion: descripcion,
        observacion: observacion,
      });
      setShow(false); // Cierra el modal
      //getParLevDigital(); // Actualiza la tabla
    }
  };
  const handleEditInsumo = async (partida, insumoId) => {
    try {
      limpiarCampos();
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

      // 🟢 Asegurar que los insumo estén cargados antes de asignar el insumo
      let listaInsumos = [...clavesSAE];

      if (clavesSAE.length === 0) {
        console.log("🔄 Cargando claves SAE antes de editar...");
        const responseInsumos = await axios.get(
          "http://localhost:5000/api/clave-sae"
          //"/api/clave-sae"
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
  const recolectarDatos = (
    id,
    cve_levDig,
    noPartida,
    cantidad,
    descripcion,
    observacion
  ) => {
    setSelectedPartida({ id, noPartida, cve_levDig }); // Asegura que el número de partida está definido
    setCantidad(cantidad);
    setDescripcion(descripcion);
    setObservacion(observacion);
    setIdPartida(id);

    setShow(true); // Abrir el modal
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
      const partidaSeleccionada = par_levDigital.find(
        (item) => item.noPartida === noPartida
      );
      setSelectedPartida(partidaSeleccionada);

      setCantidad(0);
      setCostoCotizado(0);
      // Llamar a la API para obtener las unidades
      let listaInsumos = [...clavesSAE];

      //if (clavesSAE.length === 0) {
      console.log("🔄 Cargando claves SAE antes de editar...");
      const responseInsumos = await axios.get(
        "http://localhost:5000/api/clave-sae"
        //"/api/clave-sae"
      );

      // ✅ Transformamos la respuesta para tener claves limpias y legibles
      listaInsumos = responseInsumos.data.map((item) => ({
        clave: item.CVE_ART.trim(), // quitamos espacios
        descripcion: item.DESCR?.trim(), // opcionalmente también aquí
      }));

      setClavesSAE(listaInsumos);

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
  /*PDF*/
  const handleOpenPDF = () => {
    try {
      // Crear un elemento de imagen
      const img = new Image();

      // Establecer la URL de la imagen
      img.src = encabezadoPDF;

      // Manejar la carga de la imagen
      img.onload = () => {
        // Crear un lienzo HTML5
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Establecer las dimensiones del lienzo para que coincidan con las de la imagen
        canvas.width = img.width;
        canvas.height = img.height;
        // Dibujar la imagen en el lienzo
        ctx.drawImage(img, 0, 0);
        // Obtener la representación base64 de la imagen desde el lienzo
        const base64Image = canvas.toDataURL("image/png");
        const fechaElaboracionFormateada = new Date(
          fechaElaboracion
        ).toLocaleDateString("es-ES");
        // Construir datos para la tabla dinámica

        const tableBody10 = par_levDigital.map((items) => [
          items.noPartida ?? "",
          items.cantidad ?? "",
          items.descripcion ?? "",
          items.observacion ?? "",
        ]);
        const tableBody30 = listMO.map((itemMO) => [
          itemMO.noPartidaMO ?? "",
          itemMO.cantidadTrabajadores ?? "",
          itemMO.personal ?? "",
          itemMO.diasTrabajados ?? "",
        ]);
        const tableBody20 = par_PreCoti_insu.map((item) => [
          item.noPartidaPC ?? "",
          item.insumo ?? "",
          item.unidad ?? "",
          item.claveSae ?? "",
          item.proveedor ?? "",
          item.cantidad ?? "",
          item.costoCotizado.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
          item.total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }),
        ]);

        // Define el contenido del documento PDF
        const documentDefinition = {
          pageMargins: [40, 160, 40, 40],
          header: {
            margin: [0, 0, 0, 0],
            image: base64Image,
            width: 600,
            height: 150,
          },
          content: [
            {
              margin: [0, 10, 0, 0],
              columns: [
                {
                  width: "50%",
                  stack: [
                    {
                      text: "Información del cliente:",
                      fontSize: 12,
                      bold: true,
                      margin: [0, 0, 0, 4],
                    },
                    {
                      text: `${clienteLista[0].razonSocial} (${clienteLista[0].cve_clie})\nCalle: ${clienteLista[0].calle} Int: ${clienteLista[0].numInt}, Col: ${clienteLista[0].colonia}\n${clienteLista[0].municipio}, CP: ${clienteLista[0].codigoPostal}, Estado: ${clienteLista[0].estado}, RFC: ${clienteLista[0].rfc}`,
                      fontSize: 8,
                    },
                  ],
                },
                {
                  width: "50%",
                  stack: [
                    {
                      text: "No: " + cve_precot,
                      fontSize: 12,
                      bold: true,
                      alignment: "right",
                      margin: [0, 0, 0, 4],
                    },
                  ],
                },
              ],
            },
            {
              text: "PARTIDAS",
              style: "sectionTitle",
              margin: [0, 20, 0, 8],
            },
            {
              margin: [0, 20, 0, 8],
              alignment: "center", // 👈 Esto es clave: a nivel del objeto exterior
              table: {
                widths: ["auto", "auto", "auto", "auto"],
                body: [
                  [
                    { text: "No. Partida", style: "tableHeader" },
                    { text: "Cantidad", style: "tableHeader" },
                    { text: "Descripciones", style: "tableHeader" },
                    { text: "Observaciones", style: "tableHeader" },
                  ],
                  ...tableBody10,
                ],
              },
              layout: {
                fillColor: (rowIndex) => (rowIndex === 0 ? "#eeeeee" : null),
              },
            },
            {
              text: "INSUMOS", // 🔵 TÍTULO para la segunda tabla
              style: "sectionTitle",
              margin: [0, 30, 0, 8],
            },
            {
              table: {
                headerRows: 1,
                widths: ["auto", "auto", "auto", "auto", "*", "auto", "*", "*"],
                body: [
                  [
                    { text: "No. Partida", style: "tableHeader" },
                    { text: "Insumo", style: "tableHeader" },
                    { text: "Unidad", style: "tableHeader" },
                    { text: "Clave Producto", style: "tableHeader" },
                    { text: "Proveedor", style: "tableHeader" },
                    { text: "Cantidad", style: "tableHeader" },
                    { text: "Costo Cotizado", style: "tableHeader" },
                    { text: "Total", style: "tableHeader" },
                  ],
                  ...tableBody20,
                ],
              },
              layout: {
                fillColor: (rowIndex) => (rowIndex === 0 ? "#eeeeee" : null),
              },
            },
            {
              text: "Mano de Obra", // 🔵 TÍTULO para la segunda tabla
              style: "sectionTitle",
              margin: [0, 30, 0, 8],
            },
            {
              table: {
                headerRows: 1,
                widths: ["auto", "auto", "auto", "auto"],
                body: [
                  [
                    { text: "No. Partida", style: "tableHeader" },
                    { text: "No. Trabajadores", style: "tableHeader" },
                    { text: "Trabajador", style: "tableHeader" },
                    { text: "Dias Trabajados", style: "tableHeader" },
                  ],
                  ...tableBody30,
                ],
              },
              layout: {
                fillColor: (rowIndex) => (rowIndex === 0 ? "#eeeeee" : null),
              },
            },
          ],
          styles: {
            tableHeader: {
              bold: true,
              fontSize: 9,
              color: "black",
              alignment: "center",
            },
            sectionTitle: {
              bold: true,
              fontSize: 14,
              alignment: "center",
              color: "#2E86C1",
              decoration: "underline",
            },
          },
        };
        // Genera el PDF y muestra una vista preliminar
        pdfMake.createPdf(documentDefinition).open();
      };

      // Manejar errores durante la carga de la imagen
      img.onerror = (error) => {
        console.error("Error al cargar la imagen:", error);
      };
    } catch (error) {
      console.error("Error al abrir el PDF:", error);
    }
  };

  /*------------------------------------------------------------------------*/
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Convertir Precotización a Análisis Técnico Financiero </h1>
          <form>
            <div className="row">
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Folio</label>
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
                  <label className="form-label">Folio Siguiente</label>
                  <input
                    className="form-control"
                    id="inputFolioSecuencial"
                    type="text"
                    value={`${selectedFolio}${folioSiguiente}`}
                    onChange={(e) => setCve_levDig(e.target.value)}
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
            <div
              className="row"
              style={{ border: "1px solid #000", borderColor: "gray" }}
            >
              <div className="col-md-2">
                <label className="form-label">No. Partida</label>
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
                      <th scope="col">Eliminar</th>
                      <th scope="col">Agregar Insumos</th>
                      <th scope="col">Agregar Mano</th>
                    </tr>
                  </thead>
                  <tbody>
                    {par_levDigital.map((item, index) => (
                      <tr key={index}>
                        <td>{item.noPartida}</td>
                        <td>{item.descripcion}</td>
                        <td>{item.observacion}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.preventDefault(); // 🚫 Previene el reload
                              recolectarDatos(
                                item.id,
                                item.cve_levDig,
                                item.noPartida,
                                item.cantidad,
                                item.descripcion,
                                item.observacion
                              );
                            }}
                          >
                            <FaPencilAlt />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(item.id, item.noPartida);
                            }}
                          >
                            <MdDelete />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenModal(item.noPartida);
                            }}
                          >
                            <CiCirclePlus />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenModalMO(item.noPartida);
                            }}
                          >
                            <CiCirclePlus />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <br></br>
            {/*<button className="btn btn-primary mt-2" onClick={processExcelFile}>
            Procesar Archivo
          </button>*/}
            {/*<button
            className="btn btn-success mt-2 ms-2"
            onClick={handleAddFromExcel}
          >
            Agregar Partidas
          </button>*/}
            <div className="col-md-6 ">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleOpenPDF}
              >
                <VscFilePdf /> Ver Partidas
              </button>
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
              <label style={{ color: "red" }}>Partidas por Insumo </label>
              <br></br>
              <div>
                <br></br>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">No. Partida</th>
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
                            type="button"
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEditInsumo(itemPC.noPartidaPC, itemPC.id);
                            }}
                          >
                            <FaPencilAlt />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteInsumo(itemPC.noPartidaPC, itemPC.id);
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
            <div
              className="row"
              style={{
                border: "1px solid #000",
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              <label style={{ color: "red" }}>PARTIDAD POR MANO DE OBRA </label>
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
                            type="button"
                            onClick={() => EditPartidaMO(itemMO.id)} // ⚠️ Solo pasar el ID de Firestore
                          >
                            <FaPencilAlt />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={(e) => {
                              e.preventDefault();
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
            <button className="btn btn-success" onClick={addPreCotizacion}>
              <HiDocumentPlus /> GUARDAR DOCUMENTO
            </button>
          </form>
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
              value={selectedPartida?.noPartida || ""}
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
                    min="0"
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
                    min="0"
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

export default AgregarRevTecFinanciero;
