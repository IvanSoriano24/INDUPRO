import React, {useState, useEffect} from "react"
import {useNavigate, useParams, Link, useSearchParams} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink, Alert  } from "reactstrap"
import { FaCircleQuestion, FaCirclePlus  } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";

import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle,  Modal, Button  } from "react-bootstrap"
import { FaPercent, FaCheckCircle  } from "react-icons/fa";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import encabezadoPDF from "../imagenes/GS-ENCABEZADO-2.PNG";
import swal from 'sweetalert';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const VisualizarPDF = () => {

    const[cve_precot, setPrecot] = useState(""); 
    const[par_preCot, setPar_preCot] = useState([]);
    const[cve_tecFin, setCve_tecFin] = useState("");
    const[cve_clie, setCve_clie] = useState("");
    const[fechaElaboracion, setFechaElaboracion] = useState("");
    const[fechaInicio, setFechaInicio] = useState("");
    const[fechaFin, setFechaFin] = useState("");
    const[list, setList] = useState([]);
    const[noPartida, setNoPartida] = useState("");
    /* --------------------------- PARTIDAS DE INSUMO -----------*/
    const[par_PreCoti_insu, setPar_PreCoti_insu] = useState([])
    const[par_PreCoti_insu2, setPar_PreCoti_insu2] = useState([])
    const[clientesList, setClientesList] = useState([])
    const[costoCotizado, setCostoCotizado] = useState();
    const[cantidad, setCantidad] = useState();
    const total = costoCotizado * cantidad; 
    const[totalInsumo, setTotalInsumo] = useState()
    const[totalMateria, setTotalMateria] = useState()
    const[totalSubContrado, setTotalSubContrado] = useState()
    const[totalViatico, setTotalViatico] = useState()
    const [manoDeObraTotal, setManoDeObraTotal] = useState();
    const [manoDeObraTotalCostL, setManoDeObraTotalCostL] = useState();
    const[totalFianzas, setTotalFianzas] = useState()
    const[totalFactoraje, setTotalFactoraje] = useState()
    const[totalCostoFIjo, setTotalCostoFIjo] = useState()
    const[totalUtilidad, setTotalUtilidad ] = useState();
    const[factores, setFactores] = useState([])
    /* --------------------------------PARTIDAS PARA MANO DE OBRA -----------------*/
    const[manoObra, setManoObra] = useState([]);
    const[noPartidaMO, setNoParatidaMO] = useState(1)
    const [listMO, setListMO] = useState([]);
    const [par_Cot, setPar_Cot] = useState([]);
    const[listaTemporal, setListTemporal] = useState([])
    /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
    const navigate = useNavigate()
    const { id } = useParams();
    const imageDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAkElEQVQ4je2SsQ3CMAyEJ9B8MOQZlE7N7xM8Eol0fAgVi9AGy0CZtWp0De8mK/eeS0EGH7zO5s3lfeGwZbLFgS7cMjZFx8sNZNMtTmeDO8lsIYZ62V2AcZ91CKwwixXZ/SPkYnEeEj72IpjzoREkH3AuAf8gsD8jMCw/wFwBKF8XQC0JewAAAABJRU5ErkJggg==";

    const imageUrl = process.env.PUBLIC_URL + '/imagenes/GS-ENCABEZADO.PNG';


    /* ---------------------JALAR INFORMACIÓN DE DOCUMENTO ANTERIOR ------------------------------------- */
    const getFactoresById = async (id) => {
        const factoresDOC = await getDoc(doc(db, "TECNICOFINANCIERO", id));
        if (factoresDOC.exists()) {
            setCve_tecFin(factoresDOC.data().cve_tecFin);
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

      const getCliente = async () => {
        try {
            const data = await getDocs(
            query(collection(db, "CLIENTES"), where("cve_clie", "==", cve_clie)) 
            );

            const par_levDigList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            par_levDigList.sort((a, b) => a.noPartida - b.noPartida);
            setClientesList(par_levDigList);

        } catch (error) {
            console.error("Error fetching PAR_LEVDIGITAL data:", error);
        }
        };

        useEffect(() => {
        getCliente();
        }, [cve_clie]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
        const razonSocial = clientesList.length > 0 ? clientesList[0].razonSocial : "No hay documentos de precotización";
        const nombreComercial = clientesList.length > 0 ? clientesList[0].nombreComercial : "No hay documentos de precotización";
        const calle = clientesList.length > 0 ? clientesList[0].calle : "No hay documentos de precotización";
        const numInt = clientesList.length > 0 ? clientesList[0].numInt : "No hay documentos de precotización";
        const acuedoComercial = clientesList.length > 0 ? clientesList[0].condicionComercial : "No hay documentos de precotización";
        /* ----------------------------------------- OBTENER PARTDIAS DE INSUMOS PARA LA PRECOTIZACIÓN -------------------------*/

        const getTotalCompleto = async () => {
            try {
                const data = await getDocs(
                    query(collection(db, "PAR_TECFIN_INSU"), where("cve_tecFin", "==", cve_tecFin))
                );
        
                const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        
                // Inicializa la variable total
                let totalIns = 0;
                let totalIns2 = 0; 
                let totalFianzas = 0;
                let totalFactoraje = 0;
                let totalCostoFijo = 0; 
                // Calcula el total para cada elemento y agrégalo al total general
                par_levDigList1.forEach((item) => {
                    const subtotal = (item.cantidad * item.costoCotizado);
                    totalIns += subtotal + item.costoFijo + item.factoraje + item.fianzas + item.utilidad;
                    totalIns2 += item.utilidad ;
                    totalFianzas +=  item.fianzas;
                    totalFactoraje +=  item.factoraje;
                    totalCostoFijo +=  item.costoFijo;
                });
                // Actualiza el estado con la lista de elementos y el total calculado
                setPar_PreCoti_insu(par_levDigList1);
                setTotalInsumo(totalIns);
                setTotalFianzas(totalFianzas);
                setTotalFactoraje(totalFactoraje);
                setTotalCostoFIjo(totalCostoFijo);
                setTotalUtilidad(totalIns2);
            } catch (error) {
                console.error("Error fetching PAR_LEVDIGITAL data:", error);
            }
        };
        
        useEffect(() => {
            getTotalCompleto();
        }, [cve_tecFin]); // Asegúrate de incluir cve_tecFin en las dependencias del useEffect
        
        //----------------------------------------------------------TOTAL DE MANO DE OBRA ------------------------------------------
        const getTotalManoDeObra = async () => {
            try {
                const data = await getDocs(
                    query(collection(db, "PAR_TECFIN_MO"), where("cve_tecFin", "==", cve_tecFin))
                );
                const parTecfinMOList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                let totalMOValorHombre = 0;
                let totalMOCostoHombre = 0;
                parTecfinMOList.forEach((item) => {
                    totalMOValorHombre +=  item.valorLider;
                    totalMOCostoHombre +=  item.costoLider;
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

        
    
/* --------------------------------------------------OBTENER TOTALES POR MATERIAL ---------------------------- */

const getTotalMateriales = async () => {
    try {
        const data = await getDocs(
            query(collection(db, "PAR_TECFIN_INSU"), where("cve_tecFin", "==", cve_tecFin), where("insumo", "==", "Material"))
        );

        const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        // Inicializa la variable total
        let totalIns = 0;

        // Calcula el total para cada elemento y agrégalo al total general
        par_levDigList1.forEach((item) => {
            totalIns += (item.cantidad * item.costoCotizado);
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
/* --------------------------------------------------OBTENER TOTALES POR MATERIAL ---------------------------- */

const getTotalSubcontrato = async () => {
    try {
        const data = await getDocs(
            query(collection(db, "PAR_TECFIN_INSU"), where("cve_tecFin", "==", cve_tecFin), where("insumo", "==", "Subcontratos"))
        );
        const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        // Inicializa la variable total
        let totalIns = 0;
        // Calcula el total para cada elemento y agrégalo al total general
        par_levDigList1.forEach((item) => {
            totalIns += (item.cantidad * item.costoCotizado);
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
            query(collection(db, "PAR_TECFIN_INSU"), where("cve_tecFin", "==", cve_tecFin), where("insumo", "==", "Subcontratos"))
        );
        const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        // Inicializa la variable total
        let totalIns = 0;

        // Calcula el total para cada elemento y agrégalo al total general
        par_levDigList1.forEach((item) => {
            totalIns += (item.cantidad * item.costoCotizado);
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

  // ----------------------------------------------------------------------------------------
  const getParPreCotizacion = async () => {
    try {
      
        const data = await getDocs(
        query(collection(db, "PAR_TECFIN_INSU"), where("cve_tecFin", "==", cve_tecFin)) 
        );

        const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log("Datos de PAR_PRECOTIZACION_INSU:", par_levDigList1);
        par_levDigList1.sort((a, b) => a.noPartidaPC - b.noPartidaPC);
        setPar_PreCoti_insu2(par_levDigList1);
        const maxPartida = Math.max(...par_levDigList1.map((item) => item.noPartidaPC), 0);
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
  //-------------------------------------------------------------------------------------------
   /* ------------------------------------ OBTENER TABLA DE TRABAJADORES -------------------------------*/
   const obtenerPartidasMO = async () => {
    try {
      
        const data = await getDocs(
        query(collection(db, "PAR_TECFIN_MO"), where("cve_tecFin", "==", cve_tecFin)) 
        );

        const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log("Datos de PAR_PRECOTIZACION_INSU:", par_levDigList1);
        par_levDigList1.sort((a, b) => a.noPartidaMO - b.noPartidaMO);
        setListMO(par_levDigList1);
        const maxPartida = Math.max(...par_levDigList1.map((item) => item.noPartidaMO), 0);
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

  //-----------------------------------------------------------------------------------------------
  const getParPreCot = async () => {
    try {
        const data = await getDocs(
        query(collection(db, "PAR_TECFINANCIERO"), where("cve_tecFin", "==", cve_tecFin)) 
        );
        //par_preCotList
        const par_preCotList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPar_preCot(par_preCotList);

    } catch (error) {
        console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
    };

    useEffect(() => {
      getParPreCot();
    }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
    //------------------------------------------------------------------------------------------------
    const primeraPartida = par_preCot.length > 0 ? par_preCot[0].noPartida : "No hay partidas"

    const sumarValorLider = async (cve_tecFin, noPartida) => {
            const moSnapshot = await getDocs(query(collection(db, 'PAR_TECFIN_MO'), where('cve_tecFin', '==', cve_tecFin), where('noPartidaMO', '==', noPartida)));
            
            let sumaValorLider = 0;
            moSnapshot.forEach((moDoc) => {
                const moData = moDoc.data();
                sumaValorLider += moData.valorLider;
            });
    
            return sumaValorLider;
    };
    const sumarCalculoInsumo = async (cve_tecFin, noPartida) => {
        const moSnapshot = await getDocs(query(collection(db, 'PAR_TECFIN_INSU'), where('cve_tecFin', '==', cve_tecFin), where('noPartidaATF', '==', noPartida)));
        
        let calculoInsumo  = 0;
        moSnapshot.forEach((moDoc) => {
            const moData = moDoc.data();
            calculoInsumo += moData.total +  moData.costoFijo + moData.factoraje  + moData.fianzas + moData.utilidad;
        });

        return calculoInsumo;
};
    
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

    
    const getTotalCotizacion = async () => {
        try {
            const data = await getDocs(
            query(collection(db, "PAR_COTIZACION"), where("cve_tecFin", "==", cve_tecFin)) 
            );
            //par_preCotList
            const par_preCotList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setPar_Cot(par_preCotList);
    
        } catch (error) {
            console.error("Error fetching PAR_LEVDIGITAL data:", error);
        }
        };
    
        useEffect(() => {
            getTotalCotizacion();
        }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

  //---------------------------------------------------------------------------------------------------------
  let encabezadoImage;

const handleOpenPDF = () => {
    try {
        // Crear un elemento de imagen
        const img = new Image();

        // Establecer la URL de la imagen
        img.src = encabezadoPDF;

        // Manejar la carga de la imagen
        img.onload = () => {
            // Crear un lienzo HTML5
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Establecer las dimensiones del lienzo para que coincidan con las de la imagen
            canvas.width = img.width;
            canvas.height = img.height;

            // Dibujar la imagen en el lienzo
            ctx.drawImage(img, 0, 0);

            // Obtener la representación base64 de la imagen desde el lienzo
            const base64Image = canvas.toDataURL('image/png');
            const fechaElaboracionFormateada = new Date(fechaElaboracion).toLocaleDateString('es-ES');
            // Construir datos para la tabla dinámica
            const tableBody = par_PreCoti_insu2.map(item => [
                item.noPartidaATF,
                item.insumo,
                item.descripcionInsumo,
                item.unidad,
                item.costoCotizado.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), // Formatea costoCotizado,
                ((item.cantidad * item.costoCotizado) + item.fianzas + item.costoFijo + item.utilidad + item.factoraje).toLocaleString('en-US', { style: 'currency', currency: 'USD' }), // Formatea costoCotizado,
            ]);
            const tableBodyMO = listMO.map(item2 => [
                item2.noPartidaMO,
                item2.cantidadTrabajadores,
                item2.personal,
                item2.valorLider.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), // Formatea costoCotizado,,
            ]);

            const tableBody20 = par_Cot.map(itemTotales => [
                itemTotales.cve_tecFin,
                itemTotales.noPartidaATF,
                itemTotales.descripcion,
                itemTotales.observacion,
                itemTotales.totalPartida.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), // Formatea costoCotizado,,
            ])
            
            // Define el contenido del documento PDF
            const documentDefinition = {
                header: {
                    margin: [0, 0, 0, 0], // Margen superior, derecho, inferior e izquierdo del encabezado de la página
                    image: base64Image,
                    width: 600,
                    height:150
                },
                content: [
                    {
                        columns: [
                            {
                                width: '50%', 
                                stack: [
                                    {
                                        text: 'Información del cliente: ',
                                        fontSize: 12,
                                        bold: true,
                                    },
                                    {
                                        text: `${razonSocial} (${cve_clie})\nCalle: ${calle} Int: ${numInt}, Col: ${clientesList[0].colonia}\n${clientesList[0].municipio}, cp: ${clientesList[0].codigoPostal}, estado: ${clientesList[0].estado}, RFC: ${clientesList[0].rfc}`,
                                        fontSize: 8,
                                        bold: false,
                                        
                                    },
                                ]
                            },
                            
                            {
                                width: '50%', 
                                stack: [
                                    {
                                        text: 'No. Cotización: ' + cve_tecFin,
                                        fontSize: 12,
                                        bold: true,
                                        alignment: 'right', 
                                    },
                                    {
                                        text: "\n"+'Fecha de elaboración: ' + fechaElaboracionFormateada,
                                        fontSize: 10,
                                        bold: false,
                                        alignment: 'right', 
                                    }
                                ]
                            },
                        ],
                        margin: [0, 110, 0, 0], 
                        
                    },
                    {
                        margin: [0, 10, 0, 0],
                        text: "Estimado usuario, no es grato presentar la propuesta de servicios de Correccion de prensas y levantamiento agradecemos de manera anticipada sus atenciones esperando poder contar con su Vbo",
                        fontSize: 9,
                        bold: true,
                    },
                    {
                        margin: [0, 10, 0, 0],
                        table: {
                            headerRows: 1,
                            widths: [ 'auto', 'auto', '*', 'auto', 'auto' ],
                            body: [
                                [ 'Clave de documento', 'No. Partida', 'Descripción', 'Observación', 'Importe'],
                                ...tableBody20 // Agregar filas de la tabla basadas en la lista temporal
                            ]
                        }
                    },
                   {
                    text: "\n"+ "\n" +'Importe: ' + ((totalInsumo + manoDeObraTotal )* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                    fontSize: 12,
                    bold: true,
                    alignment: 'right', 
                   },
                   {
                    margin: [0, 3, 0, 0],
                    text: 'IVA: ' + (((totalInsumo + manoDeObraTotal) *.16 )* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                    fontSize: 12,
                    bold: true,
                    alignment: 'right', 
                   },
                   {
                    margin: [0, 3, 0, 0],
                    text: 'Total: ' + ((((totalInsumo + manoDeObraTotal) *.16 ) + (totalInsumo + manoDeObraTotal) )* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                    fontSize: 12,
                    bold: true,
                    alignment: 'right', 
                   },
                   {
                    margin: [0, 7, 0, 0],
                    text: "Condición comercial ",
                    fontSize: 12,
                    bold: true,
                     
                   },
                   {
                    margin: [0, 5, 0, 0],
                    text: acuedoComercial,
                    fontSize: 7,
                    bold: false,
                     
                   },
                    // Agrega más contenido según sea necesario
                ],
                
            };

            // Genera el PDF y muestra una vista preliminar
            pdfMake.createPdf(documentDefinition).open();
        };

        // Manejar errores durante la carga de la imagen
        img.onerror = (error) => {
            console.error('Error al cargar la imagen:', error);
        };
    } catch (error) {
        console.error('Error al abrir el PDF:', error);
    }
};

const asegurarCotizacion=() => {
    swal({
        title: "Estás segudo de aprobar la cotización?",
        text: "Una vez aprobada, no podrán modificarse los costos del proyecto!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            calcularCotizacion()
            //handleOpenPDF()
          swal("¡Felicidades, ahora puedes decargar tu cotización!", {
            icon: "success",
          });
          navigate("/precotizacion")
        } else {
          swal("¡Ok, seguimos viendo los costos!");
        }
      });
}

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <br></br>
          <h1 style={{textAlign: "center"}}>Analisis Técnico Financiero  </h1>
          <label> Documento: {cve_tecFin}</label>
          <br/>
          <label> Cliente: {razonSocial} ({cve_clie})</label>
          <br/>
          <label> Nombre comercial: {nombreComercial}</label>
          <table className="table table-hover">
            <thead>
                <tr>
                    <th></th>
                    <th scope="col">Valor de proyecto</th>
                    <th scope="col"></th>
                    <th scope="col">{((totalInsumo + manoDeObraTotal )* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                    <th scope="col"> 100%</th>
                </tr>
            </thead>
                <tbody>
                <tr>
                    <th scope="row">costos</th>
                    <th ></th>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <th scope="row"  >Materiales</th>
                    <td></td>
                    <td >{(totalMateria * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <th scope="row" >Subcontrato</th>
                    <td></td>
                    <td >{(totalSubContrado * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td></td>
                </tr>
                <tr>
                    <th></th>
                    <th scope="row">Viaticos</th>
                    <td></td>
                    <td >{(totalViatico * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td></td>
                </tr>
                <tr>
                    <th></th>
                    <th scope="row" >Costo por MO</th>
                    <td></td>
                    <td >{((manoDeObraTotalCostL )* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td></td>
                </tr>
                <tr>
                    <th></th>
                    <th scope="row">Costo Fijo</th>
                    <td></td>
                    <td>{(totalCostoFIjo * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td></td>
                    </tr>
                <tr>
                    <th></th>
                    <th scope="row">Factoraje</th>
                    <td></td>
                    <td>{(totalFactoraje * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td></td>
                </tr>
                <tr>
                    <th></th>
                    <th scope="row">Fianzas</th>
                    <td></td>
                    <td>{(totalFianzas * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td></td>
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
                    <th scope="row" style={{color:"red"}}>Costo Total</th>
                    <td></td>
                    <th scope="col" style={{color:"red"}}>{((totalInsumo + manoDeObraTotalCostL )* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                    <td>{(((totalInsumo + manoDeObraTotalCostL ) * 100) / (totalInsumo + manoDeObraTotal )).toFixed(2) } %</td>
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
                    <th scope="row">Utilidad en materiales</th>
                    <td></td>
                    <th scope="col" >{((totalInsumo - totalMateria)* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                    <td>{(((totalInsumo - totalMateria ) * 100) / (totalInsumo + manoDeObraTotal )).toFixed(3) } %</td>
                </tr>
                <tr>
                    <th></th>
                    <th scope="row">Utilidad en Mano de obra</th>
                    <td></td>
                    <th scope="col" >{((manoDeObraTotal - manoDeObraTotalCostL)* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                    <td>{(((manoDeObraTotal - manoDeObraTotalCostL ) * 100) / (totalInsumo + manoDeObraTotal )).toFixed(2) } %</td>
                </tr>
                <tr className="table-success">
                    <th></th>
                    <th scope="row" style={{color:"green"}}>Utilidad esperada</th>
                    <td></td>
                    <td style={{color:"green"}}>{( ( (totalInsumo + manoDeObraTotal ) - (totalInsumo + manoDeObraTotalCostL )  ) * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td style={{color:"green"}}>{( ( ( (totalInsumo + manoDeObraTotal ) - (totalInsumo + manoDeObraTotalCostL )  ) * 100) / (totalInsumo + manoDeObraTotal )).toFixed(1) }%</td>
                </tr>
                </tbody>
            </table>
          <button onClick={asegurarCotizacion} className="btn btn-success"><FaCheckCircle /> Aprovar cotización</button>
          
        </div>
      </div>
    </div>
  );
};

export default VisualizarPDF;
