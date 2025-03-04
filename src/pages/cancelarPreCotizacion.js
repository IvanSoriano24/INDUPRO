import React, {useState, useEffect} from "react"
import {useNavigate, useParams, Link} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { FaCircleQuestion, FaCirclePlus  } from "react-icons/fa6";
import { HiDocumentPlus, HiMiniDocumentMinus  } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";
import swal from 'sweetalert';
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle,  Modal, Button  } from "react-bootstrap"

const CancelarPreCotizacion = () => {

    const[cve_precot, setPrecot] = useState(""); 
    const[par_preCot, setPar_preCot] = useState([]);

    
    const [folios, setFolios] = useState([]);
    const [cve_clie, setCve_clie] = useState("");
    const [fechaElaboracion, setFechaElaboracion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [noPartida, setNoPartida] = useState("");
    /* --------------------------- PARTIDAS DE INSUMO -----------*/
    
    const[factores, setFactores] = useState([]);
    const [par_PreCoti_insu, setPar_PreCoti_insu] = useState([])
    const [contadorDecimal, setContadorDecimal] = useState(.1);
    const[insumo, setInsumo] = useState("");
    const[no_subPartida, setNoSubPartida] = useState("");
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
    const[diasTrabajados, setDiasTrabajados] = useState("")
    const[noPartidaMO, setNoParatidaMO] = useState(1)
    const[cve_precotMO, setCve_precotMO] = useState("")
    const[personal, setPersonal] = useState("")
    const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
    const [editIndex, setEditIndex] = useState(null);
    const [listMO, setListMO] = useState([]);
    const[cantidadTrabajadores, setCantidadTrabajadores] = useState();
    /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
    const partida_levDig = collection(db, "PAR_LEVDIGITAL");
    const parPrecotizacion = collection(db,"PAR_PRECOTIZACION");
    const precotizacioncoleccion = collection(db,"PRECOTIZACION");
    const parPrecotizacionInsumos = collection(db, "PAR_PRECOTIZACION_INSU")
    const parPrecotizacionMO = collection(db, "PAR_PRECOTIZACION_MO")
    const navigate = useNavigate()
    const { id } = useParams();

    /* ---------------------JALAR INFORMACIÓN DE DOCUMENTO ANTERIOR ------------------------------------- */
    const getFactoresById = async (id) => {
        const factoresDOC = await getDoc(doc(db, "PRECOTIZACION", id));
        console.log(factoresDOC.data());
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
    const getParPreCot = async () => {
        try {
            const data = await getDocs(
            query(collection(db, "PAR_PRECOTIZACION"), where("cve_precot", "==", cve_precot)) 
            );
            //par_preCotList
            const par_preCotList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            par_preCotList.sort((a, b) => a.noPartida - b.noPartida);
            setPar_preCot(par_preCotList);
            const maxPartida = Math.max(...par_preCotList.map((item) => item.noPartida), 0);
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
        query(collection(db, "PAR_PRECOTIZACION_INSU"), where("cve_precot", "==", cve_precot)) 
        );

        const par_levDigList1 = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log("Datos de PAR_PRECOTIZACION_INSU:", par_levDigList1);
        par_levDigList1.sort((a, b) => a.noPartidaPC - b.noPartidaPC);
        setPar_PreCoti_insu(par_levDigList1);
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
    }, [cve_precot]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
    //console.log("Prueba" + par_PreCoti_insu);

          
          /* ------------------------------------ OBTENER TABLA DE TRABAJADORES -------------------------------*/
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
                //console.log("max Partida: " + maxPartida)
            } catch (error) {
                console.error("Error fetching PAR_LEVDIGITAL data:", error);
            }
            };
        
            useEffect(() => {
              obtenerPartidasMO();
            }, [cve_precot]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
            //console.log("Prueba" + par_PreCoti_insu);
            
            
            /* ------------------------------------------------------------------CANCELAR DOCUMENTO ---------------------------- */
            const handleDelete = async (cve_precot) => {
              try {
                const q = query(collection(db, "PRECOTIZACION"), where("cve_precot", "==", cve_precot));
                const querySnapshot = await getDocs(q);
                const bitacora = collection(db, "BITACORA");
                const today = new Date()
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
                    tipoDocumento: "Cancelación de documento",
                    noPartida: "N/A"
                  });
                  // Si se encuentra un documento que coincide con los identificadores proporcionados, actualiza su estatus
                    if (!querySnapshot.empty) {
                      const docSnap = querySnapshot.docs[0]; // Suponiendo que solo hay un documento que coincide con los criterios de consulta
                      const factoresRef = doc(db, "PRECOTIZACION", docSnap.id);
                      
                      // Actualiza el estatus del documento
                      const datos = {
                        estatus: "Bloqueado"
                      };
                      await updateDoc(factoresRef, datos);
                      // Actualizar el estatus en la colección par_PreCoti_insu
                      const insuQuery = query(collection(db, 'PAR_PRECOTIZACION_INSU'), where('cve_precot', '==', cve_precot));
                      const insuSnapshot = await getDocs(insuQuery);
                      insuSnapshot.forEach(async (doc) => {
                          await updateDoc(doc.ref, { estatus: 'Cancelación de partida' });
                      });

                      // Actualizar el estatus en la colección listMO
                      const moQuery = query(collection(db, 'PAR_PRECOTIZACION_MO'), where('cve_precot', '==', cve_precot));
                      const moSnapshot = await getDocs(moQuery);
                      moSnapshot.forEach(async (doc) => {
                          await updateDoc(doc.ref, { estatus: 'Cancelación de partida' });
                      });
                      // Obtener el documento LEVDIGITAL por cve_precot
                      const levDigQuery = query(collection(db, 'LEVDIGITAL'), where('docSig', '==', cve_precot));
                      const levDigSnapshot = await getDocs(levDigQuery);
                      levDigSnapshot.forEach(async (doc) => {
                          // Actualizar el estatus del documento LEVDIGITAL anterior a 'Activo'
                          await updateDoc(doc.ref, { estatus: 'Activo' });
                      });
                      // No se recomienda recargar la página; en su lugar, puedes manejar la actualización del estado localmente
                      navigate("/precotizacion")
                  } else {
                      console.log("No se encontró ningún documento que coincida con los identificadores proporcionados.");
                  }
              } catch (error) {
                console.error("Error al actualizar el estatus:", error);
            }
            }
            const mostrarAlerta=(cve_precot)=>{
              swal({
                  title: "Estás segudo de cancelar?",
                  text: "Una vez cancelado el documento no podrás hacer uso de el y solo podrás consultarlo!",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                })
                .then((willDelete) => {
                  if (willDelete) {
                      handleDelete(cve_precot)
                    swal("¡El documento ha sido cancelado exitosamente!", {
                      icon: "success",
                    });
                  } else {
                    swal("¡El documento está seguro!");
                  }
                });
              }
      
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Cancelar Pre Cotizacion</h1>
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
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="text"
                      className="form-control"
                      value={cve_clie}
                      onChange={(e) => setCve_clie(e.target.value)}
                      readOnly
                      />
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
                      readOnly
                      />
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
                      readOnly
                      />
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
                      readOnly
                      />
                  </div>
              </div>
            </div>
            <div className="row" style={{ border: '1px solid #000', borderColor: "gray" }}>   
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
                        {par_preCot.map((item, index) => (
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
                <label style={{color: "red" }}>PARTIDAS POR INSUMO </label>
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
                <label style={{color: "red" }}>PARTIDAS POR MANO DE OBRA </label>
                <div>
                <br></br>
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">No Partida</th>
                        <th scope="col">No. de trabajadores</th>
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
              <button className="btn btn-danger" onClick={() => mostrarAlerta(cve_precot)}><HiMiniDocumentMinus  /> Cancelar documento</button>
        </div>
      </div>
    </div>    
  );

}

export default CancelarPreCotizacion