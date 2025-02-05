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
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { FaCircleQuestion, FaCirclePlus } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";
import swal from "sweetalert";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle, Modal, Form, Button } from "react-bootstrap";

import axios from "axios";
import Select from "react-select";

const EditarPreCotizacion = () => {
  const [claveSae, setClaveSae] = useState(""); // Estado para la clave SAE
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  /* ---------------------JALAR INFORMACIÓN DE DOCUMENTO ANTERIOR ------------------------------------- */
  const getFactoresById = async (id) => {
    const factoresDOC = await getDoc(doc(db, "PRECOTIZACION", id));
    if (factoresDOC.exists()) {
      setPrecot(factoresDOC.data().cve_precot);
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
  /*-------------------------------------------------------------------------------------------------------*/
  const obtenerFamilia = async (categoriaSeleccionada) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/categorias/${categoriaSeleccionada}`
      );
      setFamilias(response.data); // Guarda las familias filtradas en el estado
      console.log("Familias filtradas obtenidas:", response.data);
    } catch (error) {
      console.error("Error al obtener las familias:", error);
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
      //getParLevDigital(); // Actualiza la tabla
    }
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
  const handleCategoriaChange = (e) => {
    const categoriaSeleccionada = e.target.value;
    setCategoria(categoriaSeleccionada); // Guarda la categoría seleccionada

    if (categoriaSeleccionada) {
      obtenerFamilia(categoriaSeleccionada); // Llama a la API para obtener las familias
    } else {
      setFamilia([]); // Limpia la familia si no hay categoría seleccionada
    }
  };
  const handleFamiliaChange = (e) => {
    const familiaSeleccionada = e.target.value;
    setFamilia(familiaSeleccionada); // Guarda la familia seleccionada

    if (familiaSeleccionada) {
      obtenerLineas(familiaSeleccionada); // Llama a la API para obtener líneas
    } else {
      setLineas([]); // Limpia las líneas si no hay familia seleccionada
    }
  };
  const handleOpenModal = async (noPartida) => {
    setShowAddModal(true);
    try {
      const partidaSeleccionada = par_levDigital.find(
        (item) => item.noPartida === noPartida
      );
      setSelectedPartida(partidaSeleccionada);

      setCantidad(0);
      setCostoCotizado(0);
      // Llamar a la API para obtener las líneas
      /*const responseLineas = await axios.get("http://localhost:5000/api/lineas");
      setLineas(responseLineas.data); // Guardar las líneas obtenidas en el estado
      console.log("Líneas obtenidas:", responseLineas.data);*/

      // Llamar a la API para obtener las unidades
      const responseUnidades = await axios.get(
        "http://localhost:5000/api/lineasMaster"
      );
      setCategorias(responseUnidades.data); // Guardar las unidades con descripciones
      //console.log("Unidades obtenidas:", responseUnidades.data);

      const responseProvedores = await axios.get(
        "http://localhost:5000/api/proveedores"
      );
      setProveedores(responseProvedores.data);
      //console.log("Proveedores: ", responseProvedores.data);
      // Mostrar el modal después de obtener los datos
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
  const obtenerLineas = async (familiaSeleccionada) => {
    //console.log("Obteniendo líneas para la familia:", familiaSeleccionada); // Verifica la entrada
    try {
      const response = await axios.get(
        `http://localhost:5000/api/lineas/${familiaSeleccionada}`
      );
      setLineas(response.data); // Guardar las líneas en el estado
      //console.log("Líneas filtradas obtenidas:", response.data); // Verifica la respuesta
    } catch (error) {
      console.error("Error al obtener las líneas:", error);
    }
  };
  const guardarPartida = async () => {
    if (!selectedPartida || !insumo || !cantidad || !unidad || !claveSae) {
        alert("Faltan datos para completar la operación.");
        return;
    }

    try {
        // 🟢 Se mantiene la estructura original de la clave del proveedor (varchar(10))
        const proveedorConEspacios = proveedor || ""; // Si proveedor es null, lo dejamos como cadena vacía

        console.log("🔍 Guardando partida con proveedor:", `"${proveedorConEspacios}"`);

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
            // 🟢 Si editIndex tiene un valor, actualizamos el insumo existente en Firestore
            const insumoRef = doc(db, "PAR_PRECOTIZACION_INSU", editIndex);
            await updateDoc(insumoRef, insumoData);
            console.log("✅ Insumo actualizado correctamente en Firestore");
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
    console.log("🟢 Editando partida:", partida);
    console.log("🟢 ID del insumo a editar:", insumoId);

    // 🟢 Obtener el insumo desde Firestore
    const insumoDoc = await getDoc(doc(db, "PAR_PRECOTIZACION_INSU", insumoId));

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

    // 🟢 Cargar Categoría antes de continuar
    console.log("🔄 Cargando categorías...");
    const responseCategorias = await axios.get("http://localhost:5000/api/lineasMaster");
    setCategorias(responseCategorias.data);

    setTimeout(() => {
      setCategoria(insumo.categoria || "");
    }, 200); // Pequeño delay para asegurarnos de que la categoría ya está cargada

    // 🟢 Cargar familia si hay categoría
    if (insumo.categoria) {
      console.log("🔄 Cargando familias para la categoría:", insumo.categoria);
      await obtenerFamilia(insumo.categoria);
      setFamilia(insumo.familia || "");
    }

    // 🟢 Cargar líneas si hay familia
    if (insumo.familia) {
      console.log("🔄 Cargando líneas para la familia:", insumo.familia);
      await obtenerLineas(insumo.familia);
      setLinea(insumo.linea || "");
    }

    // 🟢 Asegurar que los proveedores estén cargados antes de asignar el proveedor
    let listaProveedores = [...proveedores];
    if (proveedores.length === 0) {
      console.log("🔄 Cargando proveedores antes de editar...");
      const responseProvedores = await axios.get("http://localhost:5000/api/proveedores");
      listaProveedores = responseProvedores.data;
      setProveedores(listaProveedores);
    }

    // 🟢 Buscar el proveedor en la lista de proveedores
    const proveedorEncontrado = listaProveedores.find((prov) => prov.CLAVE === insumo.proveedor);
    
    setTimeout(() => {
      setProveedor(proveedorEncontrado ? proveedorEncontrado.CLAVE : "");
    }, 200);

    // 🟢 Guardar el ID del insumo en editIndex para saber que estamos editando
    setEditIndex(insumoId);

    // 🔄 Mostrar el modal de edición
    setShowAddModal(true);
  } catch (error) {
    console.error("⚠️ Error al obtener el insumo:", error);
  }
};
const handleSaveManoObra = async () => {
  if (!noPartidaMO || !selectedTrabajador || !cantidadTrabajadores || !diasTrabajados) {
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
          console.log("✅ Partida de mano de obra actualizada correctamente en Firestore");
      } else {
          // 🟢 Si no hay `editIndex`, agregar una nueva partida en Firestore
          await addDoc(parPrecotizacionMO, manoObraData);
          console.log("✅ Partida de mano de obra agregada correctamente en Firestore");
      }

      // 🟢 Registrar la operación en la bitácora
      const bitacora = collection(db, "BITACORA");
      await addDoc(bitacora, {
          cve_Docu: cve_precot,
          tiempo: horaFormateada,
          fechaRegistro: formattedDate,
          tipoDocumento: editIndex ? "Edición de partida MO" : "Registro de partidas MO",
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
  const getParPreCot = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_PRECOTIZACION"),
          where("cve_precot", "==", cve_precot)
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
  }, [cve_precot]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

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
      setNoParatidaMO(maxPartida + 1);
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

  /* ------------------------------------ OBTENER TABLA DE INSUMOS -------------------------------*/
  const obtenerFactores = async () => {
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
  }, [factores]);

  /* ------------------------------------ OBTENER TABLA DE TRABAJADORES -------------------------------*/
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
      //console.log("max Partida: " + maxPartida)
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    obtenerPartidasMO();
  }, [cve_precot]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
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

  useEffect(() => {
    const cargarManoObra = async () => {
      const manoObraList = await obtenerTrabajadores();
      //console.log(manoObraList);
      setManoObra(manoObraList);
    };

    cargarManoObra();
  }, [manoObra]);

  /* ------------------------------------ - AGREGAR NUEVO DOCUMENTO -------------------------------*/
  const updateEncabezado = async (e) => {
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
    };
    await updateDoc(preCotRef, datos);
    navigate("/precotizacion");
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
  const handleDelete = async (id) => {
    const parLevDigitalRef = doc(db, "PAR_LEVDIGITAL", id);
    // Ejecutar la operación de eliminación
    await deleteDoc(parLevDigitalRef);
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
        const partidaDoc = await getDoc(doc(db, "PAR_PRECOTIZACION_MO", partidaId));
  
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
  const DeletePartidaMO = (index) => {
    const updatedList = [...listMO];
    updatedList.splice(index, 1);
    setList(updatedList);
  };

  const editarPar_Precotizacion = (id, noPartida) => {
    swal({
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
        swal(`You typed: ${value}`);
        // Aquí puedes realizar acciones con el valor ingresado por el usuario
      } else {
        swal("Operación cancelada");
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
                <label className="form-label">FOLIO</label>
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
                  <button class="btn btn-outline-secondary" type="button">
                    <FaCircleQuestion />
                  </button>
                  <button class="btn btn-outline-secondary" type="button">
                    <IoSearchSharp />
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
                />
                <div class="input-group-append">
                  <button class="btn btn-outline-secondary" type="button">
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
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No. Partida</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col">Editar</th>
                    <th scope="col">ELIMINAR</th>
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
            <label style={{ color: "red" }}>PARTIDAD POR INSUMO </label>
            <br></br>
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">SUB PARTIDA</th>
                    <th scope="col">TIPO DE INSUMO</th>
                    <th scope="col">PROVEEDOR</th>
                    <th scope="col">DESCRIPCIÓN</th>
                    <th scope="col">COMENTARIOS ADICIONALES</th>
                    <th scope="col">CANTIDAD</th>
                    <th scope="col">COSTO</th>
                    <th scope="col">TOTAL</th>
                    <th scope="col">EDITAR</th>
                    <th scope="col">ELIMINAR</th>
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
                      <td>
                        {(itemPC.costoCotizado * 1).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                      <td>
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
                            handleDeleteInsumo(itemPC.noPartida, insumo)
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
          <div className="row" style={{ border: "1px solid #000" }}>
            <label style={{ color: "red" }}>PARTIDAS POR MANO DE OBRA </label>
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No Partida</th>
                    <th scope="col">No. de trabajadores</th>
                    <th scope="col">Trabajador</th>
                    <th scope="col">Días trabajados</th>
                    <th scope="col">EDITAR</th>
                    <th scope="col">ELIMINAR</th>
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
                            DeletePartidaMO(indexMO);
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
          <button className="btn btn-success" onClick={updateEncabezado}>
            <HiDocumentPlus /> Editar documento
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
                  <option value="Kg">Kg</option>
                  <option value="Toneladas">Toneladas</option>
                  <option value="Servicios">Servicios</option>
                </select>
              </div>
            </div>
          </div>
          {/* Columna para Línea en la misma fila */}
          <div className="row mb-6">
            {/* Columna para Línea en la misma fila */}
            <div className="col-md-4">
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
                    <option key={index} value={familia.CVE_LIN}>
                      {familia.CVE_LIN} - {familia.DESC_LIN}
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
                  onChange={(e) => setLinea(e.target.value)} // Guarda la línea seleccionada
                  disabled={!familia} // Solo habilita si hay una familia seleccionada
                >
                  <option value="">Seleccionar...</option>
                  {lineas.map((linea, index) => (
                    <option key={index} value={linea.CVE_LIN}>
                      {linea.CVE_LIN} - {linea.DESC_LIN}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Fila 2: Proveedor, Descripcion */}
            <div className="row mb-6">
              <div className="col-md-2">
                <div className="mb-3">
                  <label>Clave SAE</label>
                  <select
                    className="form-control"
                    value={claveSae}
                    onChange={(e) => setClaveSae(e.target.value)}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
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

export default EditarPreCotizacion;
