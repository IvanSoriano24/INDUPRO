import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";
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
  connectFirestoreEmulator,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { TabContent, TabPane, Nav, NavItem, NavLink, Alert } from "reactstrap";
import { FaCircleQuestion, FaCirclePlus } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";

import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle, Modal, Button } from "react-bootstrap";
import { FaPercent, FaCheckCircle } from "react-icons/fa";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import encabezadoPDF from "../imagenes/GS-ENCABEZADO-2.PNG";
import swal from "sweetalert";
import { Switch, FormControlLabel } from "@mui/material";
import axios from "axios";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const VisualizarPDF = () => {
  const [cve_precot, setPrecot] = useState("");
  const [par_preCot, setPar_preCot] = useState([]);
  const [cve_tecFin, setCve_tecFin] = useState("");
  const [cve_clie, setCve_clie] = useState("");
  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [clientesList, setClientesList] = useState([]);
  //const[nombreComercial, setNombreComercial] = useState("")
  const [totalesDoc, setTotalesDoc] = useState([]);
  const [list, setList] = useState([]);
  const [noPartida, setNoPartida] = useState("");
  /* --------------------------- PARTIDAS DE INSUMO -----------*/
  const [costoCotizado, setCostoCotizado] = useState();
  const [cantidad, setCantidad] = useState();
  const total = costoCotizado * cantidad;
  const [sumaValorProyecto, setSumaValorProyecto] = useState(0);
  const [sumaValorInsumos, setSumaValorInsumos] = useState(0);
  const [par_PreCoti_insu, setPar_PreCoti_insu] = useState([]);
  const [totalMateria, setTotalMateria] = useState();
  const [totalSubContrado, setTotalSubContrado] = useState();
  const [totalViatico, setTotalViatico] = useState();
  const [sumaCostoFactorizadoT, setSumaCostoFactorizadoT] = useState("");
  const [sumaCostoXpartidaT, setSumaCostoXpartidaT] = useState("");
  /* --------------------------------PARTIDAS PARA MANO DE OBRA -----------------*/
  const [manoDeObraTotal, setManoDeObraTotal] = useState();
  const [manoDeObraTotalCostL, setManoDeObraTotalCostL] = useState();
  const [idMonday, setIdMonday] = useState("");
  const [totalMO, setTotalMO] = useState(0); // Total de Mano de Obra
  const [totalInsumo, setTotalInsumo] = useState(0); // Total de Insumos
  const [costoFijoPorcentaje, setCostoFijoPorcentaje] = useState(0); // Porcentaje de Costos Fijos
  const [factorajePorcentaje, setFactorajePorcentaje] = useState(0); // Porcentaje de Factoraje
  const [valorProyecto, setValorProyecto] = useState(0); // Utilidad
  const [valorIndirecto, setValorIndirecto] = useState(0);
  const [valorDidirecto, setValorDidirecto] = useState(0);
  const [utilidadEsperada, setUtilidadEsperada] = useState(0);
  const [factorajeManual, setFactorajeManual] = useState("");
  const [factoraje, setFactoraje] = useState(0);
  const [utilidadNeta, setUtilidadNeta] = useState(0);
  const [valoresArticulo, seValoresArticulo] = useState([]);
  /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
  const navigate = useNavigate();
  const { id } = useParams();

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
  /******************************************** SAE  *****************************************************************/
  const [folioSig, setFolioSig] = useState("");
  /******************************************** SAE  *****************************************************************/
  useEffect(() => {
    getFactoresById(id);
  }, [id]);

  const getCliente = async () => {
    try {
      const data = await getDocs(
        query(collection(db, "CLIENTES"), where("cve_clie", "==", cve_clie))
      );

      const par_levDigList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      par_levDigList.sort((a, b) => a.noPartida - b.noPartida);
      setClientesList(par_levDigList);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    getCliente();
  }, [cve_clie]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

  const razonSocial =
    clientesList.length > 0
      ? clientesList[0].razonSocial
      : "No hay documentos de precotización";
  const cve_int =
    clientesList.length > 0
      ? clientesList[0].cve_int
      : "No hay documentos de precotización";
  const nombreComercial =
    clientesList.length > 0
      ? clientesList[0].nombreComercial
      : "No hay documentos de precotización";
  const calle =
    clientesList.length > 0
      ? clientesList[0].calle
      : "No hay documentos de precotización";
  const numInt =
    clientesList.length > 0
      ? clientesList[0].numInt
      : "No hay documentos de precotización";
  const acuedoComercial =
    clientesList.length > 0
      ? clientesList[0].condicionComercial
      : "No hay documentos de precotización";

  const getTotalMateriales = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_TECFIN_INSU"),
          where("cve_tecFin", "==", cve_tecFin),
          where("insumo", "==", "Material")
        )
      );

      const par_levDigList1 = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Inicializa la variable total
      let totalIns = 0;

      // Calcula el total para cada elemento y agrégalo al total general
      par_levDigList1.forEach((item) => {
        totalIns += item.cantidad * item.costoCotizado;
      });
      // Actualiza el estado con la lista de elementos y el total calculado
      setPar_PreCoti_insu(par_levDigList1);
      setTotalMateria(totalIns);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };
  useEffect(() => {
    getTotalMateriales();
  }, [cve_tecFin]); // Asegúrate de incluir cve_tecFin en las dependencias del useEffect

  const getTotalSubcontrato = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_TECFIN_INSU"),
          where("cve_tecFin", "==", cve_tecFin),
          where("insumo", "==", "Subcontratos")
        )
      );
      const par_levDigList1 = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Inicializa la variable total
      let totalIns = 0;
      // Calcula el total para cada elemento y agrégalo al total general
      par_levDigList1.forEach((item) => {
        totalIns += item.cantidad * item.costoCotizado;
      });
      // Actualiza el estado con la lista de elementos y el total calculado
      setPar_PreCoti_insu(par_levDigList1);
      setTotalSubContrado(totalIns);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };
  useEffect(() => {
    getTotalSubcontrato();
  }, [cve_tecFin]); // Asegúrate de incluir cve_tecFin en las dependencias del useEffect

  const getTotalViaticos = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_TECFIN_INSU"),
          where("cve_tecFin", "==", cve_tecFin),
          where("insumo", "==", "Viáticos")
        )
      );
      const par_levDigList1 = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Inicializa la variable total
      let totalIns = 0;

      // Calcula el total para cada elemento y agrégalo al total general
      par_levDigList1.forEach((item) => {
        totalIns += item.cantidad * item.costoCotizado;
      });
      // Actualiza el estado con la lista de elementos y el total calculado
      setPar_PreCoti_insu(par_levDigList1);
      setTotalViatico(totalIns);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };
  useEffect(() => {
    getTotalViaticos();
  }, [cve_tecFin]); // Asegúrate de incluir cve_tecFin en las dependencias del useEffect

  useEffect(() => {
    const sumarValorTotales = async () => {
      try {
        const moSnapshot = await getDocs(
          query(
            collection(db, "ANALISIS_TOTALES"),
            where("cve_tecFin", "==", cve_tecFin)
          )
        );
        /*getTotalViaticos();
        getTotalMateriales();
        getTotalSubcontrato();*/
        let sumaValorInsumos = 0;
        const { costoFijo, factoraje, utilidad, fianzas } =
          await getPorcentajes();

        const claveArticulos = [];
        moSnapshot.forEach((moDoc) => {
          const moData = moDoc.data();
          claveArticulos.push({
            claveSae: moData.claveSae,
            noPartidaATF: moData.noPartidaATF,
            cve_tecFin: moData.cve_tecFin,
          });

          sumaValorInsumos += moData.totalInsumo; //Factoraje
        });
        seValoresArticulo(claveArticulos);
        setSumaValorInsumos(sumaValorInsumos);
        let valorIndirecto = sumaValorInsumos * (costoFijo / 100);
        setValorIndirecto(valorIndirecto);
        let valorDidirecto = sumaValorInsumos;
        setValorDidirecto(valorDidirecto);
        let sumaValorProyecto =
          (sumaValorInsumos + valorIndirecto) / (1 - utilidad / 100);
        setSumaValorProyecto(sumaValorProyecto);

        let utilidadEsperada =
          sumaValorProyecto - valorDidirecto - valorIndirecto;
        setUtilidadEsperada(utilidadEsperada);

        /*let factor = sumaValorProyecto * (factoraje/100);
        setFactoraje(factor);
        let utilidaNet = utilidadEsperada - factor;
        setUtilidadNeta(utilidaNet);*/

        console.log("Datos Pre-Cotizados");
        console.log(sumaValorInsumos);
        console.log(totalMateria + totalSubContrado + totalViatico);

        console.log("Datos Cotizados");
        console.log(sumaValorProyecto);
        console.log(valorDidirecto);
        console.log(valorIndirecto);
        console.log(utilidadEsperada);
        //addSae
      } catch (error) {
        console.error("Error al sumar valores:", error);
      }
    };

    sumarValorTotales();
  }, [cve_tecFin]);

  const getPorcentajes = async () => {
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

  /*useEffect(() => {
    const sumarValorTotales = async () => {
      try {
        const moSnapshot = await getDocs(
          query(
            collection(db, "ANALISIS_TOTALES"),
            where("cve_tecFin", "==", cve_tecFin)
          )
        );
        let sumaValorLider = 0;
        let sumaCostoFactorizado = 0;
        let sumaCostoXpartida = 0;
        moSnapshot.forEach((moDoc) => {
          const moData = moDoc.data();
          sumaValorLider += moData.precioXpartida; //Factoraje
          sumaCostoFactorizado += moData.costoFactorizado; //Factoraje
          sumaCostoXpartida += moData.costoXpartida;
        });
        console.log(sumaValorLider);
        setSumaValorLider(sumaValorLider);
        setSumaCostoFactorizadoT(sumaCostoFactorizado);
        setSumaCostoXpartidaT(sumaCostoXpartida);
      } catch (error) {
        console.error("Error al sumar valores:", error);
      }
    };

    sumarValorTotales();
  }, [cve_tecFin]);*/

  //----------------------------------------------------------TOTAL DE MANO DE OBRA ------------------------------------------
  const getTotalManoDeObra = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_TECFIN_MO"),
          where("cve_tecFin", "==", cve_tecFin)
        )
      );
      const parTecfinMOList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let totalMOValorHombre = 0;
      let totalMOCostoHombre = 0;
      parTecfinMOList.forEach((item) => {
        totalMOValorHombre += item.valorLider;
        totalMOCostoHombre += item.costoLider;
      });
      setManoDeObraTotal(totalMOValorHombre);
      setManoDeObraTotalCostL(totalMOCostoHombre);
    } catch (error) {
      console.error("Error al obtener datos de PAR_TECFIN_MO:", error);
    }
  };

  useEffect(() => {
    getTotalManoDeObra();
  }, [cve_tecFin]); // Asegúrate de incluir cve_tecFin en las dependencias del useEffect

  /*
const calcularCotizacion = async () => {
  const bitacora = collection(db, "BITACORA");
  const today = new Date()
  const ahora = new Date();
  const hora = ahora.getHours();
  const minuto = ahora.getMinutes();
  const segundo = ahora.getSeconds();
  const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
  const horaFormateada = `${hora}:${minuto}:${segundo}`;
  // Obtener el documento de la colección FOLIOS con el nombre del folio
  const folioSnapshot = await getDocs(query(collection(db, "FOLIOS"), where("folio", "==", "COT")));
  // Tomar el primer documento encontrado (suponiendo que hay uno)
  const folioDoc = folioSnapshot.docs[0];
  // Obtener el id del documento
  const folioId = folioDoc.id;
  // Obtener el valor actual de folioSiguiente
  const folioData = folioDoc.data();
  const folioSiguienteActual = folioData.folioSiguiente;
  const docFolio = folioData.folio;
  // Incrementar el valor de "folioSiguiente"
  const nuevoFolioSiguiente = folioSiguienteActual + 1;
  // Actualizar el documento en la colección FOLIOS
  await updateDoc(doc(db, "FOLIOS", folioId), {
      folioSiguiente: nuevoFolioSiguiente,
  });
  await addDoc(bitacora, {
      cve_Docu: docFolio + nuevoFolioSiguiente.toString(),
      tiempo: horaFormateada,
      fechaRegistro: formattedDate,
      tipoDocumento: "Registro",
      noPartida: "N/A",
      });
  const docCotizacion = collection(db, "COTIZACION")
  await addDoc(docCotizacion, {
      cve_tecFin: docFolio + nuevoFolioSiguiente.toString(),
      cve_clie: cve_clie,
      estatus: "Activo",
      fechaElaboracion: fechaElaboracion,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      subtotal: totalInsumo + manoDeObraTotal,
      IVA: (totalInsumo + manoDeObraTotal) * .16,
      total: ((totalInsumo + manoDeObraTotal) * .16) + (totalInsumo + manoDeObraTotal) 

  })

  const cotTotal = collection(db, "PAR_COTIZACION")
  par_preCot.forEach( async (item) => {
      
      const sumaValorLider = await sumarValorLider(cve_tecFin, item.noPartida);
      //const noPartidaEntero = parseInt(item.noPartida, 10);
      const sumarCalculoInsumoV = await sumarCalculoInsumo(cve_tecFin, item.noPartida)

      await addDoc(cotTotal, {
          cve_tecFin : docFolio + nuevoFolioSiguiente.toString(),
          noPartidaATF: item.noPartida,  //DESDE AQUÍ LO RECUPERO
          descripcion: item.descripcion,
          observacion: item.observacion,
          totalPartida: sumaValorLider + sumarCalculoInsumoV,
          
      })
  })

  await addDoc(bitacora, {
      cve_Docu: cve_tecFin,
      tiempo: horaFormateada,
      fechaRegistro: formattedDate,
      tipoDocumento: "Bloqueo de documento",
      noPartida: "N/A",
      });
    const statusLevDig = "Bloqueado";
    const preCotizacionRef = doc(db,"TECNICOFINANCIERO", id);
    const datos = {
      estatus: statusLevDig,
      docSig: docFolio + nuevoFolioSiguiente.toString()
    }
    await updateDoc(preCotizacionRef, datos);
}

*/
  /****************************************************************************************/
  const [showPercentage, setShowPercentage] = useState(false);

  const handleToggle = () => {
    setShowPercentage(!showPercentage);
  };

  const data = [
    { value: 50, label: "Dato A" },
    { value: 30, label: "Dato B" },
  ];
  /****************************************************************************************/
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

  const addCotizacion = async () => {
    const bitacora = collection(db, "BITACORA");
    const today = new Date();
    const ahora = new Date();
    const hora = ahora.getHours();
    const minuto = ahora.getMinutes();
    const segundo = ahora.getSeconds();
    const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
    const horaFormateada = `${hora}:${minuto}:${segundo}`;
    // Obtener el documento de la colección FOLIOS con el nombre del folio
    const folioSnapshot = await getDocs(
      query(collection(db, "FOLIOS"), where("folio", "==", "COT"))
    );
    // Tomar el primer documento encontrado (suponiendo que hay uno)
    const folioDoc = folioSnapshot.docs[0];
    // Obtener el id del documento
    const folioId = folioDoc.id;
    // Obtener el valor actual de folioSiguiente
    const folioData = folioDoc.data();
    const folioSiguienteActual = folioData.folioSiguiente;
    const docFolio = folioData.folio;
    // Incrementar el valor de "folioSiguiente"
    const nuevoFolioSiguiente = folioSiguienteActual + 1;
    // Actualizar el documento en la colección FOLIOS
    await updateDoc(doc(db, "FOLIOS", folioId), {
      folioSiguiente: nuevoFolioSiguiente,
    });
    await addDoc(bitacora, {
      cve_Docu: docFolio + nuevoFolioSiguiente.toString(),
      tiempo: horaFormateada,
      fechaRegistro: formattedDate,
      tipoDocumento: "Registro cotización",
      noPartida: "N/A",
    });
    const docCotizacion = collection(db, "COTIZACION");
    await addDoc(docCotizacion, {
      cve_tecFin: docFolio + nuevoFolioSiguiente.toString(),
      cve_clie: cve_clie,
      cve_int: cve_int,
      estatus: "Activo",
      fechaElaboracion: fechaElaboracion,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      subtotal: sumaValorProyecto,
      IVA: sumaValorProyecto * 0.16,
      total: sumaValorProyecto * 0.16 + sumaValorProyecto,
      acuedoComercial: nombreComercial,
      idMonday: idMonday,
    });
    const cotTotal = collection(db, "PAR_COTIZACION");
    totalesDoc.forEach(async (item) => {
      await addDoc(cotTotal, {
        cve_tecFin: docFolio + nuevoFolioSiguiente.toString(),
        noPartidaATF: item.noPartidaATF, //DESDE AQUÍ LO RECUPERO
        cantidad: item.cantidad,
        descripcion: item.descripcion,
        observacion: item.observacion,
        totalPartida: item.sumaValorInsumos,
      });
    });
    await addDoc(bitacora, {
      cve_Docu: cve_tecFin,
      tiempo: horaFormateada,
      fechaRegistro: formattedDate,
      tipoDocumento: "Bloqueo de documento",
      noPartida: "N/A",
    });
    const statusLevDig = "Bloqueado";
    const preCotizacionRef = doc(db, "TECNICOFINANCIERO", id);
    const datos = {
      estatus: statusLevDig,
      docSig: docFolio + nuevoFolioSiguiente.toString(),
    };
    await updateDoc(preCotizacionRef, datos);
  };
  /******************************************** SAE  *****************************************************************/
  const addSae = async () => {
    const { folioSiguiente } = (
      await axios.get("http://localhost:5000/api/obtenerFolio")
    ).data;
    setFolioSig(folioSiguiente);
    
    let CVE = folioSig.toString().padStart(10, "0");
    let CVE_DOC = CVE.toString().padStart(20, " ");

    let clave = cve_int.toString(); // sin padStart
    const clie = await axios.get(`http://localhost:5000/api/datosClie/${clave}`);
    
    const datosCliente = clie.data.datosCliente;

    console.log("Cliente:", datosCliente);

    const partidasEncontradas = valoresArticulo.filter(
      (art) => art.cve_tecFin === cve_tecFin
    );

    const articulos = [];
    const results = [];
    for (const partida of partidasEncontradas) {
      const q = query(
        collection(db, "PAR_TECFIN_INSU"),
        where("cve_precot", "==", partida.claveSae)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.claveSae) {
          articulos.push(data.claveSae);
        }
        // Aquí podrías acumular datos en un array si necesitas
      });
    }
    for (const cve_art of articulos) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/datosInsumoe/${cve_art}`
        );
        const datosInsumo = response.data.datosInsumos;
        console.log("Datos del insumo:", datosInsumo);
        results.push(datosInsumo);
      } catch (err) {
        console.error(`Error consultando el insumo ${cve_art}:`, err.message);
      }
    }
    
    const dataPartidas = {
      data: data,
      CVE_DOC: CVE_DOC,
      nuPartida: data.noPartidaATF,
      CVE_ART: data.claveSae,
      CANT: data.cantidad,
      PREC: data.costoCotizado,
      IMPU1: results.IMPUESTO1,
      IMPU2: results.IMPUESTO2,
      IMPU3: results.IMPUESTO3,
      IMPU4: results.IMPUESTO4,
      IMPU5: results.IMPUESTO5,
      IMPU6: results.IMPUESTO6,
      IMPU7: results.IMPUESTO7,
      IMPU8: results.IMPUESTO8,
      IMP1APLICA: results.IMP1APLICA,
      IMP2APLICA: results.IMP2APLICA,
      IMP3APLICA: results.IMP3APLICA,
      IMP4APLICA: results.IMP4APLICA,
      IMP5APLICA: results.IMP5APLICA,
      IMP6APLICA: results.IMP6APLICA,
      IMP7APLICA: results.IMP7APLICA,
      IMP8APLICA: results.IMP8APLICA,
      CVE_ESQ: results.CVE_ESQIMPU,
      TOT_PARTIDA: data.total,
      UNI_VENTA: results.UNI_MED,
    };
    /*const response = await axios.post(
      "http://localhost:5000/api/guardarPartidas",
      dataPartidas
    );
    const partidas = response.data;*/
    console.log(dataPartidas);
    const dataCotizacion = {
      data: data,
      CVE_DOC: CVE_DOC,
      CVE_CLPV: cve_int,
      IMPU4: results.IMPUESTO4,
      TOT_PARTIDA: data.total,
      RFC: datosCliente.RFC,
      folio: folioSig,
      METODOPAGO: datosCliente.METODODEPAGO,
      NUMCTAPAGO: datosCliente.NUMCTAPAGO,
      FORMAPAGOSAT: datosCliente.FORMADEPAGOSAT,
      USO_CFDI: datosCliente.USO_CFDI,
      REG_FISC: datosCliente.REG_FISC,
    };
    console.log(dataCotizacion);
    /*const responseCotizacion = await axios.post(
      "http://localhost:5000/api/cotizacion",
      dataCotizacion
    );*/
  };

  /******************************************** SAE  *****************************************************************/
  const asegurarCotizacion = () => {
    swal({
      title: "Estás seguro de aprobar la cotización?",
      text: "Una vez aprobada, no podrán modificarse los costos del proyecto!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        addCotizacion();
        //addSae();
        //handleOpenPDF()
        swal("¡Felicidades, ahora puedes decargar tu cotización!", {
          icon: "success",
        });
        //navigate("/cotizacion");
      } else {
        swal("¡Ok, seguimos viendo los costos!");
      }
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <br></br>
          <h1 style={{ textAlign: "center" }}>Analisis Técnico Financiero </h1>
          <label> Documento: {cve_tecFin}</label>
          <br />
          <label> id Monday: {idMonday}</label>
          <br />
          <label> Cliente: {razonSocial} </label>
          <br />
          <label> Nombre comercial: {nombreComercial}</label>
          {/*Mostrar Factoraje*/}
          <div className="col">
            <label htmlFor="factoringPercentage">
              Porcentaje de Factoraje:
            </label>
            <input
              id="factoringPercentage"
              type="number"
              placeholder="Ingresa el porcentaje"
              value={factorajeManual}
              onChange={(e) => setFactorajeManual(e.target.value)}
            />
            <br />
            <button onClick={() => setFactorajeManual("")}>
              Valores Originales
            </button>
            <br />
          </div>
          {/*Fin Mostrar Factoraje*/}

          <table className="table table-hover">
            <thead>
              <tr>
                <th></th>
                <th scope="col">Valor de proyecto</th>
                <th scope="col"></th>
                <th scope="col">
                  {sumaValorProyecto.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </th>
                <th scope="col"> 100%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">costos</th>
                <th></th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <th scope="row">Materiales</th>
                <td></td>
                <td>
                  {(totalMateria * 1).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td>
                  {((totalMateria * 100) / sumaValorProyecto).toFixed(2)} %
                </td>
              </tr>
              <tr>
                <td></td>
                <th scope="row">Subcontrato</th>
                <td></td>
                <td>
                  {(totalSubContrado * 1).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td>
                  {((totalSubContrado * 100) / sumaValorProyecto).toFixed(2)} %
                </td>
              </tr>
              <tr>
                <th></th>
                <th scope="row">Viaticos</th>
                <td></td>
                <td>
                  {(totalViatico * 1).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td>
                  {((totalViatico * 100) / sumaValorProyecto).toFixed(2)} %
                </td>
              </tr>
              <tr>
                <th>-</th>
                <th scope="row"></th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th></th>
                <th scope="row">Costo directo</th>
                <td></td>
                <td>
                  {/*CAMBIAR FORMULA*/}
                  {valorDidirecto.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td>
                  {((valorDidirecto * 100) / sumaValorProyecto).toFixed(2)} %
                </td>
              </tr>
              <tr>
                <th>-</th>
                <th scope="row"></th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th></th>
                <th scope="row">Costo indirecto</th>
                <td></td>
                <td>
                  {valorIndirecto.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td>
                  {((valorIndirecto * 100) / sumaValorProyecto).toFixed(2)} %
                </td>
              </tr>
              <tr>
                <th>-</th>
                <th scope="row"></th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="table-success">
                <th></th>
                <th scope="row" style={{ color: "green" }}>
                  Utilidad esperada
                </th>
                <td></td>
                <td style={{ color: "green" }}>
                  {utilidadEsperada.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td style={{ color: "green" }}>
                  {((utilidadEsperada * 100) / sumaValorProyecto).toFixed(2)}%
                </td>
              </tr>
              {/*************************************************************/}
              {factorajeManual && (
                <>
                  <tr>
                    <th></th>
                    <th scope="row">Factoraje</th>
                    <td></td>
                    <td>
                      {(
                        sumaValorProyecto *
                        (factorajeManual / 100)
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>
                      {(
                        (sumaValorProyecto * (factorajeManual / 100) * 100) /
                        sumaValorProyecto
                      ).toFixed(2)}{" "}
                      %
                    </td>
                  </tr>
                  <tr>
                    <th></th>
                    <th scope="row" style={{ color: "green" }}>
                      Utilidad Neta
                    </th>
                    <td></td>
                    <td>
                      {(
                        utilidadEsperada -
                        sumaValorProyecto * (factorajeManual / 100)
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>
                      {(
                        ((utilidadEsperada -
                          sumaValorProyecto * (factorajeManual / 100)) *
                          100) /
                        sumaValorProyecto
                      ).toFixed(2)}{" "}
                      %
                    </td>
                  </tr>
                </>
              )}
              {/*************************************************************/}
            </tbody>
          </table>
          <button className="btn btn-success" onClick={asegurarCotizacion}>
            <FaCheckCircle /> Aprobar cotización
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizarPDF;
