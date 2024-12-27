import React, {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc} from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink, Label  } from "reactstrap"
import { FaCircleQuestion, FaCirclePlus  } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";
import swal from "sweetalert";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { red } from "@mui/material/colors"

const AgregarLevDigital = () => {
    /* ---------------------ENCABEZADO DE DOCUMENTO ------------------------------------- */
    const [cve_levDig, setCve_levDig] = useState("");
    const [folios, setFolios] = useState([]);
    const [selectedFolio, setSelectedFolio] = useState("");
    const [folioSiguiente, setFolioSiguiente] = useState(0);
    const [cve_clie, setCve_clie] = useState("");
    const [cantidad, setCantidad] = useState("");

    const [fechaElaboracion, setFechaElaboracion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [docAnt, setDocAnt] = useState("N/A");
    const [docSig, setDocSig] = useState("");
    const[estatus, setEstatus] = useState("Activo");
    const [fechaRegistro, setFechaRegistro] = useState(""); 
    const [horaActual, setHoraActual] = useState('');
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const navigate = useNavigate()
    const encabezadoCollection = collection(db, "LEVDIGITAL");
    const parLevDigCollection = collection(db, "PAR_LEVDIGITAL");
    

    /* --------------------   Obtener los folios correspondiente  -------------------------- */
    useEffect(() => {
      
        const obtenerFolios = async () => {
          const foliosCollection = collection(db, "FOLIOS");
          const q = query(foliosCollection, where("documento", "==", "LD"));
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
      const obtenerClientePorNombre = async (nombreCliete) => {
        const querySnapshot = await getDocs(query(collection(db, "CLIENTES"), where("razonSocial", "==", nombreCliete)));
      
        if (!querySnapshot.empty) {
          // Si hay resultados, devolver el primer documento encontrado
          const factor = querySnapshot.docs[0].data();
          return factor;
        } else {
          // Si no hay resultados, puedes manejarlo de alguna manera (devolver null, lanzar un error, etc.)
          return null;
        }
      };

      const addEncabezado = async (e) => {
        e.preventDefault();

          

        // Obtener el documento de la colección FOLIOS con el nombre del folio
        const folioSnapshot = await getDocs(query(collection(db, "FOLIOS"), where("folio", "==", selectedFolio)));
        if (!folioSnapshot.empty) {
          if (!clienteSeleccionado) {
            alert("No se seleccionó ningún cliente.")
            console.error("No se seleccionó ningún cliente.");
            return;
          }
        if (list.length === 0) {
          alert("La lista está vacía. Por favor, agregue elementos antes de continuar.");
        }
        else{
          if(folioSiguiente != 0){
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
                noPartida: "N/A"
              });
              
              await addDoc(encabezadoCollection, {
                cve_levDig: selectedFolio + folioSiguiente.toString(),
                cve_clie: clienteSeleccionado.cve_clie,
                fechaElaboracion: fechaElaboracion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                estatus: estatus,
                docAnt: docAnt,
                docSig: docSig,
                fechaRegistro: formattedDate,
                fechaModificacion: formattedDate
              });
              list.forEach(async (item) => {
                await addDoc(bitacora, {
                  cve_Docu: selectedFolio + folioSiguiente.toString(),
                  tiempo: horaFormateada,
                  fechaRegistro: formattedDate,
                  tipoDocumento: "Registro de partida",
                  noPartida: item.noPartida,
                });
                await addDoc(parLevDigCollection, {
                  cve_levDig: selectedFolio + folioSiguiente.toString(),
                  noPartida: item.noPartida,
                  cantidad: item.cantidad,
                  descripcion: item.descripcion,
                  observacion: item.observacion,
                  fechaRegistro: formattedDate,
                  fechaModificacion: formattedDate,
                  estatusPartida: "Activa"
                });
              });
              navigate("/levantamientoDigital");
          }else{
            alert("Selecciona un folio valido")
          }
        }  
          // Resto del código...
        } else {
          alert("No se seleccionó ningún folio.")
          console.log("No se encontró el documento en la colección FOLIOS.");
        }
        
      };
      const infoCliente=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El campo cliente te permite ingresar la razón social del cliente. A medida que escribes, el sistema sugiere opciones basadas en clientes existentes. Al seleccionar uno, se asigna automáticamente a los documentos futuros, simplificando el proceso y garantizando consistencia en la información. ", 
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
      /* ----------------------------------------- AGREGAR PARTIDAS -------------------------------- */
      /* ---------------------PARTIDAS DE DOCUMENTO ------------------------------------- */
    const [cve_levDig_par, setLevDigital_par] = useState("LEV_DIG1"); /* Este es el campo que agregue */
    const [noPartida, setNoPartida] = useState(1);
    const [descripcion, setDescripcion] = useState("");
    const [observacion, setObservacion] = useState("");
    const [list, setList] = useState([]);
    const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
    const [editIndex, setEditIndex] = useState(null);
    
    const handleSubmit = (e) => {
      //e.preventDefault();
      const newItem = {
          cve_levDig: cve_levDig,
          noPartida: noPartida,
          cantidad: cantidad,
          descripcion: descripcion,
          observacion: observacion
      }; 
      if(descripcion){
        if (editIndex !== null) {
            // Si editIndex no es null, significa que estamos editando un elemento existente
            const updatedList = [...list];
            updatedList[editIndex] = newItem;
            setList(updatedList);
            setNoPartida(idCounter);
            setCantidad("");
            setEditIndex(null); // Reiniciamos el índice de edición
            setDescripcion("");
            setObservacion("");
          } else {
            // Si editIndex es null, estamos agregando un nuevo elemento a la lista
            setList([...list, newItem]);
            setNoPartida(idCounter + 1);
            setCantidad("");
            setDescripcion("");
            setObservacion("");
            setIdCounter(idCounter + 1); // Aumentamos el contador
          }
      }
    };
    const handleEdit = (index) => {
      const itemToEdit = list[index];
      setNoPartida(itemToEdit.noPartida);
      setCantidad(itemToEdit.cantidad);
      setDescripcion(itemToEdit.descripcion);
      setObservacion(itemToEdit.observacion);
      setEditIndex(index);
    };
    const handleDelete = (index) => {
      const updatedList = [...list];
      updatedList.splice(index, 1);
      setList(updatedList);
    };

    useEffect(() => {
      const obtenerClientes = async () => {
        try {
          const querySnapshot = await getDocs(query(collection(db, 'CLIENTES'), where('estatus', '==', 'Activo')));
          const clientesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setClientes(clientesData);
        } catch (error) {
          console.error('Error al obtener clientes:', error);
        }
      };
  
      obtenerClientes();
    }, []);

    useEffect(() => {
      // Obtenemos la fecha actual en formato local (YYYY-MM-DD)
      const fechaHoy = new Date().toLocaleDateString('en-CA');
      // Establecemos la fecha de hoy como valor inicial del input
      setFechaElaboracion(fechaHoy);
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Levantamiento Digital</h1>
            <div className="row">
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Folio</label>
                  <select
                    id="selectFolio"
                    className="form-control"
                    value={selectedFolio}
                    onChange={(e) => setSelectedFolio(e.target.value)}
                    >
                    <option value="" disabled>Folio: </option>
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
                    <label className="form-label">Folio siguiente: </label>
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
              <div className="col-md-6">
                <div className="mb-3">
                  <div class="input-group-append">
                    <label className="form-label">Cliente: </label>
                    &nbsp;
                    &nbsp;
                    <button class="btn btn-outline-secondary" onClick={infoCliente} type="button"><FaCircleQuestion /></button>
                  </div>
                    <Autocomplete
                    className="form-control"
                    options={clientes}
                    getOptionLabel={cliente => cliente.razonSocial}
                    
                    onChange={(event, value) => setClienteSeleccionado(value)}
                    renderInput={params => <TextField {...params} label="Cliente" variant="outlined" fullWidth />}
                    required
                    />
                </div>
              </div>
              <div className="col-md-4 ">
                  <label className="form-label">Fecha de elaboración: </label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="date"
                      value={fechaElaboracion}
                      onChange={(e) => setFechaElaboracion(e.target.value)}
                      className="form-control"
                      required
                      />
                      <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="button" onClick={infoFechaElaboracion}><FaCircleQuestion /></button>
                      </div>
                  </div>
              </div>

              <div className="col-md-4 ">
                  <label className="form-label">Fecha de inicio: </label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="form-control"
                      required
                      />
                      <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="button" onClick={infoFechaInicio}><FaCircleQuestion /></button>
                      </div>
                  </div>
              </div>

              <div className="col-md-4 ">
                  <label className="form-label">Fecha de fin: </label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="form-control"
                      required
                      />
                      <div class="input-group-append">
                          <button class="btn btn-outline-secondary" type="button" onClick={infoFechaFin}><FaCircleQuestion /></button>
                      </div>
                  </div>
              </div>
            </div>
            <div className="row" style={{ border: '1px solid #000' }}>
              <label style={{color:"red"}}>Lista de partidas</label>
              <p></p>
          <div className="col-md-2">
              <label className="form-label">No. Partida: </label>
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
          <div>
                <label className="form-label">Cantidad: </label>
                <label className="form-label" style={{color:"red"}}> *</label>
              </div>
               <div class="input-group mb-3">            
                <input
                placeholder="" aria-label="" aria-describedby="basic-addon1"        
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="form-control"
                required
                />
              </div>
          </div>
          <p></p>
          <div className="col-md-5 ">
              <div>
                <label className="form-label">Descripción: </label>
                <label className="form-label" style={{color:"red"}}> *</label>
              </div>
                  <div class="input-group mb-3">            
                      <textarea
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="text"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="form-control"
                      required
                      />
                  </div>
        </div>
        <div className="col-md-5 ">
            <label className="form-label">Observaciones: </label>
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
            <button className="btn btn-success" onClick={handleSubmit}><CiCirclePlus  />Agregar tarea</button>
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
            {list.map((item, index) => (
            <tr key={index}>
              <td>{item.noPartida}</td>
              <td>{item.cantidad}</td>
              <td>{item.descripcion}</td>
              <td>{item.observacion}</td>
              <td><button onClick={() => handleEdit(index)} className="btn btn-primary"><FaPencilAlt /></button></td>
              <td><button onClick={() => handleDelete(index)} className="btn btn-danger"><MdDelete /></button></td>
            </tr>
              ))}
           </tbody>
          </table>
      </div>
      </div>
      <p></p>
      <button className="btn btn-success" onClick={addEncabezado}><HiDocumentPlus/> GUARDAR DOCUMENTO</button>
        </div>
      </div>
    </div>    
  );
};

export default AgregarLevDigital;
