import React, {useState, useEffect} from "react"
import {useNavigate, useParams, Link} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, and} from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { FaCircleQuestion, FaCirclePlus  } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";
import swal from "sweetalert";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const AgregarParLevDiGAdicional = () => {
    /* ---------------------ENCABEZADO DE DOCUMENTO ------------------------------------- */
    const [cve_levDig, setCve_levDig] = useState("");
    const [folios, setFolios] = useState([]);
    const [selectedFolio, setSelectedFolio] = useState("");
    const [folioSiguiente, setFolioSiguiente] = useState(1);
    const [cantidad, setCantidad] = useState("");
    const [cve_clie, setCve_clie] = useState("");
    const [fechaElaboracion, setFechaElaboracion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [docAnt, setDocAnt] = useState("N/A");
    const [docSig, setDocSig] = useState("");
    const[estatus, setEstatus] = useState("Activo");
    const navigate = useNavigate()
    const { id } = useParams();

    const getFactoresById = async (id) => {
        const factoresDOC = await getDoc(doc(db, "LEVDIGITAL", id));
        if (factoresDOC.exists()) {
            setCve_levDig(factoresDOC.data().cve_levDig);
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
      /* ----------------------------------------- AGREGAR PARTIDAS -------------------------------- */
      /* ---------------------PARTIDAS DE DOCUMENTO ------------------------------------- */
    const [cve_levDig_par, setLevDigital_par] = useState("LEV_DIG1"); /* Este es el campo que agregue */
    const [descripcion, setDescripcion] = useState("");
    const [observacion, setObservacion] = useState("");
    const [list, setList] = useState([]);
    const [par_levDigital, setPar_levDigital] = useState([])
    const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
    const [editIndex, setEditIndex] = useState(null);
    const [noPartida, setNoPartida] = useState("");
    const partidaAdicional = collection(db,"PAR_LEVDIGITAL");

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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

    const getParLevDigital = async () => {
        try {
            const data = await getDocs(
            query(collection(db, "PAR_LEVDIGITAL"), where("cve_levDig", "==", cve_levDig), where("estatusPartida", "==", "Activa")) 
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
        }, [cve_levDig]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

        /* ------------------------------------ - Editar Documento -------------------------------*/
        const updateContacto = async (e) => {
            e.preventDefault();
            const factoresRef = doc(db, "LEVDIGITAL", id);
            const datos = {
                cve_clie: cve_clie,
                fechaElaboracion: fechaElaboracion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
               
            };
            await updateDoc(factoresRef, datos);

            navigate("/levantamientoDigital")
        }

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
              cve_Docu: cve_levDig,
              tiempo: horaFormateada,
              fechaRegistro: formattedDate,
              tipoDocumento: "Registro de partida",
              noPartida: noPartida
            });
        await addDoc(partidaAdicional, {
            cve_levDig: cve_levDig,
            cantidad: cantidad,
            noPartida: noPartida,
            descripcion: descripcion,
            observacion:observacion,
            estatusPartida: "Activa"
        });
        window.location.reload();
    }
    
    const handleDelete = async (noPartida, cve_levDig) => {
       /* if(noPartida == 1){
          swal({
            title: "Error del sistema",
            text: "No puedes dejar el documento sin partidas ", 
            icon: "warning",
            buttons: "Aceptar"
          })
        }else{*/
          // Realiza una consulta para encontrar el documento que coincida con los identificadores proporcionados
          const q = query(collection(db, "PAR_LEVDIGITAL"), where("noPartida", "==", noPartida), where("cve_levDig", "==", cve_levDig));
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
              cve_Docu: cve_levDig,
              tiempo: horaFormateada,
              fechaRegistro: formattedDate,
              tipoDocumento: "Baja de partida",
              noPartida: noPartida
            });
          // Si se encuentra un documento que coincide con los identificadores proporcionados, actualiza su estatus
          if (!querySnapshot.empty) {
              const docSnap = querySnapshot.docs[0]; // Suponiendo que solo hay un documento que coincide con los criterios de consulta
              const factoresRef = doc(db, "PAR_LEVDIGITAL", docSnap.id);
              
              // Actualiza el estatus del documento
              const datos = {
                  estatusPartida: "Baja"
              };
              await updateDoc(factoresRef, datos);
              
              // No se recomienda recargar la página; en su lugar, puedes manejar la actualización del estado localmente
               window.location.reload();
          } else {
              console.log("No se encontró ningún documento que coincida con los identificadores proporcionados.");
          }
       // }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Levantamiento Digital</h1>
          <form onSubmit={updateContacto} >
            <div className="row">
              <div className="col-md-4 ">
                  <label className="form-label">CLIENTE</label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="text"
                      className="form-control"
                      value={cve_clie}
                      onChange={(e) => setCve_clie(e.target.value)}
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
                          <button class="btn btn-outline-secondary" type="button" onClick={infoFechaInicio} ><FaCircleQuestion /></button>
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
            <div className="row" style={{ border: '1px solid #000' }}>
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
              <p></p>
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
                <button className="btn btn-success" onClick={agregarPartidaAdicional}><CiCirclePlus  /> Agregar partida</button>
              </div>
              <div>
                <br></br>
                <table class="table">
                  <thead>
                    <tr>
                    <th scope="col">No. Partida</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">observaciones</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {par_levDigital.map((item, index) => (
                    <tr key={index}>
                    <td>{item.noPartida}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.observacion}</td>
                    <td><Link to={`/editarParLevDig/${item.id}` }><button className="btn btn-primary"><FaPencilAlt /></button></Link></td>
                    <td><button onClick={() => handleDelete(item.noPartida, item.cve_levDig )} className="btn btn-danger"><MdDelete /></button></td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p></p>
              <button className="btn btn-success" ><HiDocumentPlus /> GUARDAR DOCUMENTO</button>
          </form>
        </div>
      </div>
    </div>    
    
  );
};

export default AgregarParLevDiGAdicional;
