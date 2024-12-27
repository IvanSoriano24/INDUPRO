import React, {useState, useEffect} from "react"
import {useNavigate, useParams, Link, useSearchParams} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc, connectFirestoreEmulator} from "firebase/firestore"
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
    const[clientesList, setClientesList] = useState([])
    //const[nombreComercial, setNombreComercial] = useState("")
    const[totalesDoc, setTotalesDoc] = useState([]);
    const[list, setList] = useState([]);
    const[noPartida, setNoPartida] = useState("");
    /* --------------------------- PARTIDAS DE INSUMO -----------*/
    const[costoCotizado, setCostoCotizado] = useState();
    const[cantidad, setCantidad] = useState();
    const total = costoCotizado * cantidad; 
    const [sumaValorLider, setSumaValorLider] = useState(0);
    const[par_PreCoti_insu, setPar_PreCoti_insu] = useState([])
    const[totalMateria, setTotalMateria] = useState()
    const[totalSubContrado, setTotalSubContrado] = useState()
    const[totalViatico, setTotalViatico] = useState()
    const[sumaCostoFactorizadoT, setSumaCostoFactorizadoT] = useState("");
    const[sumaCostoXpartidaT, setSumaCostoXpartidaT] = useState("")
    /* --------------------------------PARTIDAS PARA MANO DE OBRA -----------------*/
    const [manoDeObraTotal, setManoDeObraTotal] = useState();
    const [manoDeObraTotalCostL, setManoDeObraTotalCostL] = useState();
    /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
    const navigate = useNavigate()
    const { id } = useParams();

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

      useEffect(() => {
        const sumarValorTotales = async () => {
          try {
            const moSnapshot = await getDocs(query(collection(db, 'ANALISIS_TOTALES'), where('cve_tecFin', '==', cve_tecFin)));
            let sumaValorLider = 0;
            let sumaCostoFactorizado = 0;
            let sumaCostoXpartida = 0; 
            moSnapshot.forEach((moDoc) => {
              const moData = moDoc.data();
              sumaValorLider += moData.precioXpartida;
              sumaCostoFactorizado += moData.costoFactorizado;
              sumaCostoXpartida  += moData.costoXpartida;
            });
            console.log(sumaValorLider)
            setSumaValorLider(sumaValorLider);
            setSumaCostoFactorizadoT(sumaCostoFactorizado)
            setSumaCostoXpartidaT(sumaCostoXpartida)
          } catch (error) {
            console.error('Error al sumar valores:', error);
          }
        };
    
        sumarValorTotales();
      }, [cve_tecFin]);

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
            query(collection(db, "PAR_TECFIN_INSU"), where("cve_tecFin", "==", cve_tecFin), where("insumo", "==", "Viáticos"))
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



  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <br></br>
          <h1 style={{textAlign: "center"}}>Analisis Técnico Financiero  </h1>
          <label> Documento: {cve_tecFin}</label>
          <br/>
          <label> Cliente: {razonSocial} </label>
          <br/>
          <label> Nombre comercial: {nombreComercial}</label>
          <table className="table table-hover">
            <thead>
                <tr>
                    <th></th>
                    <th scope="col">Valor de proyecto</th>
                    <th scope="col"></th>
                    <th scope="col">{sumaValorLider.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
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
                    <td>{((totalMateria * 100)/sumaValorLider).toFixed(2)} %</td>
                </tr>
                <tr>
                    <td></td>
                    <th scope="row" >Subcontrato</th>
                    <td></td>
                    <td >{(totalSubContrado * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td>{((totalSubContrado* 100)/sumaValorLider).toFixed(2)} %</td>
                </tr>
                <tr>
                    <th></th>
                    <th scope="row">Viaticos</th>
                    <td></td>
                    <td >{(totalViatico * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td>{((totalViatico*100)/sumaValorLider).toFixed(2)} %</td>
                </tr>
                <tr>
                    <th></th>
                    <th scope="row" >Costo por MO</th>
                    <td></td>
                    <td >{((manoDeObraTotalCostL )* 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td>{((manoDeObraTotalCostL *100)/sumaValorLider).toFixed(2)} %</td>
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
                    <td>{(totalMateria +  totalSubContrado + totalViatico + manoDeObraTotalCostL).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td>{(((totalMateria +  totalSubContrado + totalViatico + manoDeObraTotalCostL)*100)/sumaValorLider).toFixed(2)} %</td>
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
                    <td>{(sumaCostoFactorizadoT - sumaCostoXpartidaT).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td>{(((sumaCostoFactorizadoT - sumaCostoXpartidaT)*100)/sumaValorLider).toFixed(2)} %</td>
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
                    <th scope="row" style={{color:"green"}}>Utilidad esperada</th>
                    <td></td>
                    <td style={{color:"green"}}>{(sumaValorLider - (totalMateria +  totalSubContrado + totalViatico + manoDeObraTotalCostL)- (sumaCostoFactorizadoT - sumaCostoXpartidaT)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                    <td style={{color:"green"}}>{(((sumaValorLider - (totalMateria +  totalSubContrado + totalViatico + manoDeObraTotalCostL)- (sumaCostoFactorizadoT - sumaCostoXpartidaT)) * 100) /sumaValorLider).toFixed(2) }%</td>
                </tr>
                </tbody>
            </table>
          <button className="btn btn-success"><FaCheckCircle /> Aprovar cotización</button>
          
        </div>
      </div>
    </div>
  );
};

export default VisualizarPDF;
