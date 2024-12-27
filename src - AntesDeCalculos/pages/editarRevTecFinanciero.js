import React, {useState, useEffect} from "react"
import {useNavigate, useParams, Link} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { FaCircleQuestion, FaCirclePlus  } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";

import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { ModalTitle,  Modal, Button  } from "react-bootstrap"
import { FaPercent } from "react-icons/fa";

const EditarRecTecFinanciero = () => {

    const[cve_precot, setPrecot] = useState(""); 
    const[par_preCot, setPar_preCot] = useState([]);
    const[cve_tecFin, setCve_tecFin] = useState("");
    const [cve_clie, setCve_clie] = useState("");
    const [fechaElaboracion, setFechaElaboracion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [list, setList] = useState([]);
    const [noPartida, setNoPartida] = useState("");
    /* --------------------------- PARTIDAS DE INSUMO -----------*/
    const [par_PreCoti_insu, setPar_PreCoti_insu] = useState([])
    const[costoCotizado, setCostoCotizado] = useState();
    const[cantidad, setCantidad] = useState();
    const total = costoCotizado * cantidad; 

    /* --------------------------------PARTIDAS PARA MANO DE OBRA -----------------*/
    const[manoObra, setManoObra] = useState([]);
    const[noPartidaMO, setNoParatidaMO] = useState(1)
    const [listMO, setListMO] = useState([]);
    /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
    const navigate = useNavigate()
    const { id } = useParams();

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

      /* --------------------- JALAR INFORMACIÓN DE PARTIDAS ANTERIORES ------------------------------------- */
    const getParPreCot = async () => {
        try {
            const data = await getDocs(
            query(collection(db, "PAR_TECFINANCIERO"), where("cve_tecFin", "==", cve_tecFin)) 
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
        }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

        /* ----------------------------------------- OBTENER PARTDIAS DE INSUMOS PARA LA PRECOTIZACIÓN -------------------------*/

  const getParPreCotizacion = async () => {
    try {
      
        const data = await getDocs(
        query(collection(db, "PAR_TECFIN_INSU"), where("cve_tecFin", "==", cve_tecFin)) 
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
    }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect
    //console.log("Prueba" + par_PreCoti_insu);

        
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

        /* ------------------------------------ - AGREGAR NUEVO DOCUMENTO -------------------------------*/
        const updateEncabezado = async (e) => {
          e.preventDefault();
          const preCotRef = doc(db, "PRECOTIZACION", id)
          const datos = {
            cve_precot: cve_precot,
            cve_clie: cve_clie,
            fechaElaboracion: fechaElaboracion,
            fechaFin: fechaFin,
            fechaInicio
          }
          await updateDoc(preCotRef, datos);
          navigate("/precotizacion")
        }


  
    /* -------------------------------------- Eliminar partidas de levantamiento dígital en precotización ----------------------------  */
    const handleDelete = async (id) => {
        const parLevDigitalRef = doc(db, "PAR_LEVDIGITAL", id);
        // Ejecutar la operación de eliminación
        await deleteDoc(parLevDigitalRef);

    };
  /* ----------------------------------- ENCONTRAR FACTORES POR PARTIDA -------------------------------------*/
  /*   ---------------------------------- AGREGAR PARTIDAS DE INSUMOS ----------------------------- */
  /* ----------------------------------------------------AQUÍ ME QUEDE ---------------*/
  const DeletePartidaMO = (index) => {
    const updatedList = [...listMO];
    updatedList.splice(index, 1);
    setList(updatedList);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Editar pre cotizacion</h1>
          <form >
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                    <label className="form-label">FOLIO</label>
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
                          <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
                          <button class="btn btn-outline-secondary" type="button"><IoSearchSharp /></button>
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
                          <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
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
                          <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
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
                          <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
                      </div>
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
                         <th scope="col">Editar</th>
                        <th scope="col">ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {par_preCot.map((item, index) => (
                        <tr key={index}>
                        <td>{item.noPartida}</td>
                        <td>{item.descripcion}</td>
                        <td>{item.observacion}</td>
                        <td><Link to={`/editarParPrecot/${item.id}`}><button className="btn btn-primary" ><FaPencilAlt /></button></Link></td>
                        <td><button className="btn btn-danger" onClick={ () => handleDelete(item.id)}><MdDelete /></button></td>
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
                        <th scope="col">No. Partida</th>
                        <th scope="col">Tipo de insumo</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Costo</th>
                        <th scope="col">Total sin factores</th>
                        <th scope="col">Costo fijo</th>
                        <th scope="col">Factoraje</th>
                        <th scope="col">fianzas</th>
                        <th scope="col">utilidad</th>
                        <th scope="col">Total</th>
                        <th scope="col">Editar</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {par_PreCoti_insu.map((itemPC, indexPC) => (
                      <tr key={indexPC}>
                        <td>{itemPC.noPartidaATF}</td>
                        <td>{itemPC.insumo}</td>
                        <td>{itemPC.cantidad + " " +  itemPC.unidad}</td>
                        <td>{(itemPC.costoCotizado * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td>{(itemPC.cantidad * itemPC.costoCotizado).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td>{(itemPC.costoFijo * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}({((100* itemPC.costoFijo)/itemPC.total).toFixed(1)}%)</td>
                        <td>{(itemPC.factoraje * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}({((100* itemPC.factoraje)/itemPC.total).toFixed(1)}%)</td>
                        <td>{(itemPC.fianzas * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({((100* itemPC.fianzas)/itemPC.total).toFixed(1)}%)</td>
                        <td>{(itemPC.utilidad * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({((100* itemPC.utilidad)/itemPC.total).toFixed(1)}%)</td>
                        <td>{((itemPC.cantidad * itemPC.costoCotizado) + itemPC.costoFijo + itemPC.factoraje +  itemPC.fianzas + itemPC.utilidad).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td><Link to={`/editarPartidasInsumosATF/${itemPC.id}`}><button className="btn btn-primary" ><FaPencilAlt /></button></Link></td>
                        
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
                        <th scope="col">No. Personal</th>
                        <th scope="col">Trabajador</th>
                        <th scope="col">Días trabajados</th>
                        <th scope="col">Costo lider</th>
                        <th scope="col">Valor lider</th>
                        <th scope="col">EDITAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listMO.map((itemMO, indexMO) => (
                      <tr key={indexMO}>
                        <td>{itemMO.noPartidaMO}</td>
                        <td>{itemMO.cantidadTrabajadores}</td>
                        <td>{itemMO.personal}</td>
                        <td>{itemMO.diasTrabajados}</td>
                        <td>{(itemMO.costoLider * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td>{(itemMO.valorLider * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td><Link to={`/editarPartidasMO/${itemMO.id}`}><button className="btn btn-primary" ><FaPencilAlt /></button></Link></td>
                      </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <br></br>
              <button className="btn btn-success" onClick={updateEncabezado}><HiDocumentPlus /> Editar documento</button>
          </form>
        </div>
      </div>
    </div>    
  );

}

export default EditarRecTecFinanciero