import React, {useState, useEffect} from "react"
import {useNavigate, useParams, Link} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { FaCircleQuestion, FaCirclePlus  } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";
import swal from "sweetalert";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle,  Modal, Button  } from "react-bootstrap"

const AgregarRevTecFinanciero = () => {
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
    const[estatus, setEstatus] = useState("Activo");

    const [cve_levDig_par, setLevDigital_par] = useState(""); /* Este es el campo que agregue */
    const [descripcion, setDescripcion] = useState("");
    const [observacion, setObservacion] = useState("");
    const [list, setList] = useState([]);
    const [par_levDigital, setPar_levDigital] = useState([])
    const [noPartida, setNoPartida] = useState("");
    const [listPreCot, setListPreCot] = useState([]);
    /* --------------------------- PARTIDAS DE INSUMO -----------*/
    const[cve_precot, setPrecot] = useState("");
    const[factores, setFactores] = useState([]);
    const [par_PreCoti_insu, setPar_PreCoti_insu] = useState([])
    const [contadorDecimal, setContadorDecimal] = useState(.1);
    const[insumo, setInsumo] = useState("");
    //const[no_subPartida, setNoSubPartida] = useState("");
    const[noPartidaPC, setNoPartidaPC] = useState();
    const[proveedor, setProveedor] = useState("");
    const[unidad, setUnidad] = useState("");
    const[docAnteriorPPC, setDocAnteriorPPC] =  useState("");
    const[descripcionInsumo, setDescripcionInsumo] = useState("");
    const[comentariosAdi, setComentariosAdi] = useState("");
    const[costoCotizado, setCostoCotizado] = useState();
    const[cantidad, setCantidad] = useState();
    const total = costoCotizado * cantidad; 

    /* --------------------------------PARTIDAS PARA MANO DE OBRA -----------------*/
    const[manoObra, setManoObra] = useState([]);
    const[selectedTrabajador, setSelectedTrabajador] = useState("")
    const[cantidadTrabajadores, setCantidadTrabajadores] = useState();
    const[diasTrabajados, setDiasTrabajados] = useState("")
    const[noPartidaMO, setNoParatidaMO] = useState(1)
    const[cve_precotMO, setCve_precotMO] = useState("")
    const[personal, setPersonal] = useState("")
    const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
    const [editIndex, setEditIndex] = useState(null);
    const [listMO, setListMO] = useState([]);
    /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */

    const parPrecotizacion = collection(db,"PAR_PRECOTIZACION");
    const precotizacioncoleccion = collection(db,"PRECOTIZACION");
    const parPrecotizacionInsumos = collection(db, "PAR_PRECOTIZACION_INSU")
    const parPrecotizacionMO = collection(db, "PAR_PRECOTIZACION_MO")

    const tecnicoFinanciero = collection(db, "TECNICOFINANCIERO")
    const parTecFin = collection(db, "PAR_TECFINANCIERO")
    const parTecFinInsumos = collection(db, "PAR_TECFIN_INSU")
    const parTecFinMO = collection(db, "PAR_TECFIN_MO")
    const navigate = useNavigate()
    const { id } = useParams();
     /* --------------------   Obtener los folios correspondiente  -------------------------- */
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
        };

    
        obtenerFolios();
      }, []); // Se ejecutará solo una vez al cargar el componente

      useEffect(() => {
        // Actualiza el secuencial cuando se selecciona un nuevo folio
        if (selectedFolio) {
          const folioSeleccionado = folios.find((folio) => folio.folio === selectedFolio);
          if (folioSeleccionado) {
            setFolioSiguiente(folioSeleccionado.folioSiguiente);
          }
        }
      }, [selectedFolio, folios]);

      /* --------------------  fin de Obtener los folios correspondiente  -------------------------- */
      const infoCliente=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El campo cliente te permite ingresar la razón social del cliente. A medida que escribes, el sistema sugiere opciones basadas en clientes existentes. Este campo no se puede modificar ya que con ello se garantiza el seguimiento del documento. ", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infoFechaElaboracion=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " La fecha de elaboración es la fecha en la que se creó el documento y por defecto muestra la fecha de hoy. Sin embargo, es posible modificarla según sea necesario. ", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infoFechaInicio=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " La fecha de inicio representa el día planificado para comenzar el proyecto. Es importante destacar que esta fecha debe ser igual o posterior a la fecha de elaboración del documento. ", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infoFechaFin=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " La fecha de fin indica el día previsto para concluir el proyecto. Es esencial tener en cuenta que esta fecha debe ser igual o posterior a la fecha de elaboración del documento y también mayor que la fecha de inicio programada.",
          icon: "info",
          buttons: "Aceptar"
        })
      }
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
        }else{
            console.log("El personals no existe");
        }
    };

    useEffect(() => {
        getFactoresById(id);
      }, [id]);
      /* --------------------- JALAR INFORMACIÓN DE PARTIDAS ANTERIORES ------------------------------------- */
    const getParLevDigital = async () => {
        try {
            const data = await getDocs(
            query(collection(db, "PAR_PRECOTIZACION"), where("cve_precot", "==", cve_precot)) 
            );

            const par_levDigList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            par_levDigList.sort((a, b) => a.noPartida - b.noPartida);
            setPar_levDigital(par_levDigList);
            const maxPartida = Math.max(...par_levDigList.map((item) => item.noPartida), 0);
            setNoPartida(maxPartida + 1);

        } catch (error) {
            console.error("Error fetching PAR_LEVDIGITAL data:", error);
        }
        };

        useEffect(() => {
        getParLevDigital();
        }, [cve_precot]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

        /* --------------------- AGREGAR PARTIDAS DE PRE COTIZACIÓN ------------------------------------- */
        const agregarPartidaAdicional = async(e) => {
            e.preventDefault();
            const bitacora = collection(db, "BITACORA");
            const today = new Date()
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
              observacion:observacion
          });
            window.location.reload();
        }

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
              console.log(manoObraList)
              setManoObra(manoObraList);
            };
          
            cargarManoObra();
          }, [manoObra]);
    /* ----------------------------------------- OBTENER PARTDIAS DE INSUMOS PARA LA PRECOTIZACIÓN -------------------------*/

  const getParPreCotizacion = async () => {
    try {
      
        const data = await getDocs(
        query(collection(db, "PAR_PRECOTIZACION_INSU"), where("cve_precot", "==", cve_precot)) 
        );

        const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log("Datos de PAR_PRECOTIZACION_INSU:", par_levDigList1);
        par_levDigList1.sort((a, b) => a.noPartidaPC - b.noPartidaPC);
        setPar_PreCoti_insu(par_levDigList1);
        const maxPartida = Math.max(...par_levDigList1.map((item) => item.noPartidaPC), 0);
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
    const handleDelete = async (id) => {
        const parLevDigitalRef = doc(db, "PAR_LEVDIGITAL", id);
        // Ejecutar la operación de eliminación
        await deleteDoc(parLevDigitalRef);

    };
    /* ----------------------------------- ENCONTRAR FACTORES POR PARTIDA -------------------------------------*/
    
    const obtenerFactorPorNombre = async (nombreInsumo) => {
      const querySnapshot = await getDocs(query(collection(db, "FACTORES"), where("nombre", "==", nombreInsumo)));
    
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
    const agregarPartidasInsumos = async(e) => {
      e.preventDefault();
      if(noPartidaPC){
        if(folioSiguiente != 0){
          const nuevoNoPartida = noPartidaPC + contadorDecimal;
          const factorSeleccionado = await obtenerFactorPorNombre(insumo)
          
          const { costoFijo, factoraje, fianzas, utilidad } = factorSeleccionado;
          const bitacora = collection(db, "BITACORA");
            const today = new Date()
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
            descripcionInsumo:descripcionInsumo,
            comentariosAdi: comentariosAdi,
            unidad: unidad,
            costoCotizado:costoCotizado,
            cantidad: cantidad,
            total: costoCotizado * cantidad,
            costoFijo: (costoFijo/100) * (costoCotizado * cantidad),
            factoraje: (factoraje/100) * (costoCotizado * cantidad),
            fianzas: (fianzas/100) * (costoCotizado * cantidad),
            utilidad: (utilidad/100) * (costoCotizado * cantidad),

        });
        setContadorDecimal(contadorDecimal + 1);
        window.location.reload();
        }else {
          alert("Antes debes seleccionar el folio de Pre-cotización")
        }
        
      }else{
        alert("Selecciona el número de partida")
      }
  }
  /* ---------------------------------------------------- JALAR  PARTIDAS MANO DE OBRA ---------------*/
  const obtenerPartidasMO = async () => {
    try {
      
        const data = await getDocs(
        query(collection(db, "PAR_PRECOTIZACION_MO"), where("cve_precot", "==", cve_precot)) 
        );

        const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log("Datos de PAR_PRECOTIZACION_INSU:", par_levDigList1);
        par_levDigList1.sort((a, b) => a.noPartidaMO - b.noPartidaMO);
        setListMO(par_levDigList1);
        const maxPartida = Math.max(...par_levDigList1.map((item) => item.noPartidaMO), 0);
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
    const querySnapshot = await getDocs(query(collection(db, "PERSONAL"), where("personal", "==", nombreMO)));
  
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
    const agregarPartidaMOAdicional = async(e) => {
        e.preventDefault();
        const personalSeleccionado = await obtenerMOPorNombre(selectedTrabajador)
        const { valorHombre, salarioDiario } = personalSeleccionado;
        if(diasTrabajados){
          const bitacora = collection(db, "BITACORA");
          const today = new Date()
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
            diasTrabajados:diasTrabajados,
            valorLider: cantidadTrabajadores* valorHombre * diasTrabajados,
            costoLider: cantidadTrabajadores* salarioDiario * diasTrabajados
        });
        window.location.reload();
        }else{
          alert("Ingresa una cantidad en los días trabajados");
        }
    }
    /*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! - CALCULO DE VALORES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    const sumarValorLider = async (cve_tecFin, noPartida) => {
      const moSnapshot = await getDocs(query(collection(db, 'PAR_PRECOTIZACION_MO'), where('cve_precot', '==', cve_tecFin), where('noPartidaMO', '==', noPartida)));
      
      let sumaValorLider = 0;
      moSnapshot.forEach((moDoc) => {
          const moData = moDoc.data();
          sumaValorLider += moData.valorLider;
      });

      return sumaValorLider;
};
const sumarCalculoInsumo = async (cve_tecFin, noPartida) => {
  const moSnapshot = await getDocs(query(collection(db, 'PAR_PRECOTIZACION_INSU'), where('cve_precot', '==', cve_tecFin), where('noPartidaPC', '==', noPartida)));
  
  let calculoInsumo  = 0;
  moSnapshot.forEach((moDoc) => {
      const moData = moDoc.data();
      calculoInsumo += moData.total +  moData.costoFijo + moData.factoraje  + moData.fianzas + moData.utilidad;
  });

  return calculoInsumo;
};
    /* ----------------------------------------------------------- - AGREGAR NUEVO DOCUMENTO -------------------------------------------------*/
    const addPreCotizacion = async (e) => {
        e.preventDefault();
    // Obtener el documento de la colección FOLIOS con el nombre del folio
    const folioSnapshot = await getDocs(query(collection(db, "FOLIOS"), where("folio", "==", selectedFolio)));
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
    if(folioSiguiente != 0){
      const bitacora = collection(db, "BITACORA");
      const today = new Date()
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
      });
      await addDoc(bitacora, {
        cve_Docu: cve_precot,
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Bloqueo de documento",
        noPartida: "N/A",
        });
      const statusLevDig = "Bloqueado";
      const preCotizacionRef = doc(db,"PRECOTIZACION", id);
      const datos = {
        estatus: statusLevDig,
        docSig: selectedFolio + folioSiguiente.toString()
      }
      await updateDoc(preCotizacionRef, datos);

      par_levDigital.forEach(async (itemLD) =>{
        const bitacora = collection(db, "BITACORA");
        const today = new Date()
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
          observacion: itemLD.observacion
        })
      })
      par_PreCoti_insu.forEach(async (itemInsu) => {
        const bitacora = collection(db, "BITACORA");
        const today = new Date()
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
            costoCotizado: itemInsu.costoCotizado,
            cantidad: itemInsu.cantidad,
            total: itemInsu.total,
            costoFijo: itemInsu.costoFijo,
            factoraje: itemInsu.factoraje,
            fianzas: itemInsu.fianzas,
            utilidad: itemInsu.utilidad,
            
        })
      })

      listMO.forEach(async (itemMO) => {
        const personalSeleccionado = await obtenerMOPorNombre(itemMO.personal)
        const { valorHombre, salarioDiario } = personalSeleccionado;
        const bitacora = collection(db, "BITACORA");
        const today = new Date()
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
          valorLider: itemMO.cantidadTrabajadores * valorHombre * itemMO.diasTrabajados,
          costoLider: itemMO.cantidadTrabajadores *  salarioDiario * itemMO.diasTrabajados
        });
      });

      /**************************************************AGREGAR TOTALES ******************************** */

      /*const cotTotal = collection(db, "COTIZACION_TOTAL")
      par_levDigital.forEach( async (itemTotales) => {
            //const cve_ATF = selectedFolio + folioSiguiente.toString()
            const sumaValorLider = await sumarValorLider(cve_precot, itemTotales.noPartida);
            //const noPartidaEntero = parseInt(item.noPartida, 10);
            const sumarCalculoInsumoV = await sumarCalculoInsumo(cve_precot, itemTotales.noPartida)

            await addDoc(cotTotal, {
                cve_tecFin : selectedFolio + folioSiguiente.toString(),
                noPartidaATF: itemTotales.noPartida,  //DESDE AQUÍ LO RECUPERO
                descripcion: itemTotales.descripcion,
                observacion: itemTotales.observacion,
                totalPartida: sumaValorLider + sumarCalculoInsumoV,
                
            })
        })*/
    navigate("/precotizacion")
    }else{
      alert("Selecciona un folio valido");
    }
        
    }


  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Convertir precotización a análisis técnico financiero </h1>
          <form >
            <div className="row">
            <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">FOLIO</label>
                  <select
                    id="selectFolio"
                    className="form-control"
                    value={selectedFolio}
                    onChange={(e) => setSelectedFolio(e.target.value)}
                    >
                    <option value="" disabled>Folio</option>
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
                    onChange={(e) => setCve_levDig(e.target.value)}
                    readOnly
                    />
                </div>
              </div>
              <div className="col-md-4 ">
                  <label className="form-label">CLIENTE</label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="text"
                      className="form-control"
                      value={cve_clie}
                      onChange={(e) => setCve_clie(e.target.value)}
                      readOnly
                      />
                      <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="button" onClick={infoCliente}><FaCircleQuestion /></button>
                      </div>
                  </div>
              </div>

              <div className="col-md-4 ">
                  <label className="form-label">FECHA DE ELABORACIÓN</label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="date"
                      value={fechaElaboracion}
                      onChange={(e) => setFechaElaboracion(e.target.value)}
                      className="form-control"
                      />
                      <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="button" onClick={infoFechaElaboracion}><FaCircleQuestion /></button>
                      </div>
                  </div>
              </div>

              <div className="col-md-4 ">
                  <label className="form-label">FECHA DE INICIO</label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="form-control"
                      />
                      <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="button" onClick={infoFechaInicio}><FaCircleQuestion /></button>
                      </div>
                  </div>
              </div>

              <div className="col-md-4 ">
                  <label className="form-label">FECHA FIN</label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="form-control"
                      />
                      <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="button" onClick={infoFechaFin}><FaCircleQuestion /></button>
                      </div>
                  </div>
              </div>
            </div>
            <div className="row" style={{ border: '1px solid #000', borderColor: "gray" }}>
                <div className="col-md-2">
                    <label className="form-label">NO. PARTIDA</label>
                    <div class="input-group mb-3">            
                        <input
                        placeholder="" aria-label="" aria-describedby="basic-addon1"        
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
                            placeholder="" aria-label="" aria-describedby="basic-addon1"        
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
                        placeholder="" aria-label="" aria-describedby="basic-addon1"        
                        type="text"
                        value={observacion}
                        onChange={(e) => setObservacion(e.target.value)}
                        className="form-control"
                        />
                        </div>
                </div>
                
                <div className="col-md-6 ">
                     <button className="btn btn-success" onClick={agregarPartidaAdicional}><CiCirclePlus  />Agregar tarea</button>
                </div>
                <div>
                    <br></br>
                    <table class="table">
                        <thead>
                         <tr>
                         <th scope="col">No. Partida</th>
                         <th scope="col">Descripción</th>
                         <th scope="col">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {par_levDigital.map((item, index) => (
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
              <br></br>
              <div className="row" style={{ border: '1px solid #000' }}>
                <label style={{color: "red" }}>PARTIDAD POR INSUMO </label>
                <br></br>
                <div className="col-md-2">
                        <div className="mb-3">
                            <label className="form-label">NO. PARTIDA</label>
                            <select
                                id="selectFolio"
                                className="form-control"
                                value={noPartidaPC}
                                onChange={(e) => setNoPartidaPC(e.target.value)}
                                >
                                <option value="0">Seleccionar...</option>
                                {par_levDigital.map((item, index) => (
                                <option key={item.noPartida} value={item.noPartida} >
                                {item.noPartida}
                                </option>
                                ))}
                                </select>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="mb-3">
                            <label className="form-label">INSUMO</label>
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
                        
                <div className="col-md-8 ">
                    <label className="form-label">PROVEEDOR</label>
                        <div class="input-group mb-3">            
                          <input
                          placeholder="" aria-label="" aria-describedby="basic-addon1"        
                          type="text"
                          value={proveedor}
                          onChange={(e) => setProveedor(e.target.value)}
                          className="form-control"
                          />
                        </div>
                </div>
                <div className="col-md-5 ">
                    <label className="form-label">DESCRIPCIÓN</label>
                        <div class="input-group mb-3">            
                          <textarea
                          placeholder="" aria-label="" aria-describedby="basic-addon1"        
                          type="text"
                          value={descripcionInsumo}
                          onChange={(e) => setDescripcionInsumo(e.target.value)}
                          className="form-control"
                          />
                        </div>
                </div>
                <div className="col-md-5 ">
                    <label className="form-label">COMENTARIOS ADICIONALES</label>
                        <div class="input-group mb-3">            
                          <textarea
                          placeholder="" aria-label="" aria-describedby="basic-addon1"        
                          type="text"
                          value={comentariosAdi}
                          onChange={(e) => setComentariosAdi(e.target.value)}
                          className="form-control"
                          />
                        </div>
                </div>
                <div className="col-md-3 ">
                    <label className="form-label">COSTO COTIZADO</label>
                        <div class="input-group mb-3">            
                          <input
                          placeholder="" aria-label="" aria-describedby="basic-addon1"        
                          type="number"
                          value={costoCotizado}
                          onChange={(e) => setCostoCotizado(e.target.value)}
                          className="form-control"
                          />
                        </div>
                </div>
                <div className="col-md-3 ">
                    <label className="form-label">CANTIDAD</label>
                        <div class="input-group mb-3">            
                          <input
                          placeholder="" aria-label="" aria-describedby="basic-addon1"        
                          type="number"
                          value={cantidad}
                          onChange={(e) => setCantidad(e.target.value)}
                          className="form-control"
                          />
                        </div>
                </div>
                <div className="col-md-3 ">
                    <label className="form-label">UNIDAD</label>
                        <div class="input-group mb-3">            
                          <input
                          placeholder="" aria-label="" aria-describedby="basic-addon1"        
                          type="text"
                          value={unidad}
                          onChange={(e) => setUnidad(e.target.value)}
                          className="form-control"
                          />
                        </div>
                </div>
                <div className="col-md-3 ">
                    <br/>
                        <div class="input-group mb-3">            
                        <button className="btn btn-success" onClick={agregarPartidasInsumos}><CiCirclePlus  /> Agregar insumo</button>
                        </div>
                </div>
                <div>
                <br></br>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">No. Partida</th>
                        <th scope="col">TIPO DE INSUMO</th>
                        <th scope="col">PROVEEDOR</th>
                        <th scope="col">DESCRIPCIÓN</th>
                        <th scope="col">COMENTARIOS ADICIONALES</th>
                        <th scope="col">CANTIDAD</th>
                        <th scope="col">COSTO</th>
                        <th scope="col">TOTAL</th>
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
                        <td>{(itemPC.costoCotizado * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td>{(itemPC.total * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row" style={{ border: '1px solid #000' }}>
                <label style={{color: "red" }}>PARTIDAD POR MANO DE OBRA </label>
                <div className="col-md-2">
                        <div className="mb-3">
                            <label className="form-label">NO. PARTIDA</label>
                            <select
                                id="selectFolio"
                                className="form-control"
                                value={noPartidaPC}
                                onChange={(e) => setNoPartidaPC(e.target.value)}
                                >
                                <option value="0">Seleccionar...</option>
                                {par_levDigital.map((item, index) => (
                                <option key={item.noPartida} value={item.noPartida} >
                                {item.noPartida}
                                </option>
                                ))}
                                </select>
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
                      <option value="" disabled>SELECCIONA UN TRABAJADOR</option>
                      {manoObra.map((trabajador, index) => (
                        <option key={index} value={trabajador}>
                          {trabajador}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3 ">
                      <label className="form-label">CANTIDAD DE PERSONAL</label>
                          <div class="input-group mb-3">            
                            <input
                            placeholder="" aria-label="" aria-describedby="basic-addon1"        
                            type="number"
                            value={cantidadTrabajadores}
                            onChange={(e) => setCantidadTrabajadores(e.target.value)}
                            className="form-control"
                            />
                          </div>
                </div>
                <div className="col-md-3 ">
                      <label className="form-label">DÍAS TRABAJADOS</label>
                          <div class="input-group mb-3">            
                            <input
                            placeholder="" aria-label="" aria-describedby="basic-addon1"        
                            type="number"
                            value={diasTrabajados}
                            onChange={(e) => setDiasTrabajados(e.target.value)}
                            className="form-control"
                            />
                          </div>
                </div>
                <p/>
                <div className="col-md-3 ">
                  <div class="input-group mb-3">            
                    <button className="btn btn-success" onClick={agregarPartidaMOAdicional} ><HiDocumentPlus />Agregar mano de obra</button>
                  </div>
                </div>
                <div>
                <br></br>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">No. Partida</th>
                        <th scope="col">No. trabajadores</th>
                        <th scope="col">Trabajador</th>
                        <th scope="col">Días trabajados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listMO.map((itemMO, indexMO) => (
                      <tr key={indexMO}>
                        <td>{itemMO.noPartidaMO}</td>
                        <td>{itemMO.cantidadTrabajadores}</td>
                        <td>{itemMO.personal}</td>
                        <td>{itemMO.diasTrabajados}</td>
                      </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <br></br>
              <button className="btn btn-success" onClick={addPreCotizacion} ><HiDocumentPlus /> GUARDAR DOCUMENTO</button>
          </form>
        </div>
      </div>
    </div>    
  );
};

export default AgregarRevTecFinanciero;
