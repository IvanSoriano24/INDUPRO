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
import { ModalTitle,  Modal, Form, Button   } from "react-bootstrap"

const EditarPreCotizacion = () => {

    const[cve_precot, setPrecot] = useState(""); 
    const[par_preCot, setPar_preCot] = useState([]);

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
    const[estatus, setEstatus] = useState("Activo");

    const [cve_levDig_par, setLevDigital_par] = useState(""); /* Este es el campo que agregue */
    const [descripcion, setDescripcion] = useState("");
    const [observacion, setObservacion] = useState("");
    const [list, setList] = useState([]);
    const [par_levDigital, setPar_levDigital] = useState([])
    const [noPartida, setNoPartida] = useState("");
    const [listPreCot, setListPreCot] = useState([]);
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
              tipoDocumento: "Edición de documentos", 
              noPartida: noPartida,
            });
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

    const agregarPartidaAdicional = async(e) => {
        e.preventDefault();
        if(descripcion){
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
              tipoDocumento: "Registro de partidas", 
              noPartida: noPartida,
            });
          await addDoc(parPrecotizacion, {
            cve_precot: cve_precot,
            noPartida: noPartida,
            descripcion: descripcion,
            observacion:observacion,
            estatus: "Activa"
        });
        window.location.reload();
        }else{
          alert("La descripción es obligatorio");
        }
    }
    const agregarPartidaMOAdicional = async(e) => {
      e.preventDefault();
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
          diasTrabajados:diasTrabajados,
          estatus: "Activa"
      });
      window.location.reload();
      }else{
        alert("Ingresa una cantidad en los días trabajados");
      }
  }
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
            estatus: "Activa"

        });
        setContadorDecimal(contadorDecimal + 1);
        window.location.reload();
        
      }else{
        alert("Selecciona el número de partida")
      }
  }
  /* ----------------------------------------------------AQUÍ ME QUEDE ---------------*/
  const addPartidasMO = (e) => {
    e.preventDefault();
    const newItem = {
      cve_precot: selectedFolio + folioSiguiente.toString(),
      personal: selectedTrabajador,
      diasTrabajados: diasTrabajados,
      noPartidaMO: noPartidaMO
    };
    if(diasTrabajados){
      if(editIndex !== null){
        const updatedList = [...listMO];
        updatedList[editIndex] = newItem;
        setListMO(updatedList);
        setNoParatidaMO(idCounter);
        setEditIndex(null);
        setPersonal("");
        setDiasTrabajados("")
      } else {
        setListMO([...listMO, newItem]);
        setNoParatidaMO(idCounter + 1);
        setPersonal("");
        setDiasTrabajados("")
        setIdCounter(idCounter + 1); // Aumentamos el contador
      }
    }else{
      alert("Debes ingresar los días trabajados")
    }
  };
  const EditPartidaMO = (index) => {
    const itemToEdit = listMO[index];
    setNoPartida(itemToEdit.noPartidaMO);
    setDescripcion(itemToEdit.personal);
    setObservacion(itemToEdit.diasTrabajados);
    setEditIndex(index);
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
                        <td><Link to={`/editarParPrecot/${item.id}`}><button className="btn btn-primary"><FaPencilAlt /></button></Link></td>
                        <td><button className="btn btn-danger" onClick={ () => handleDelete(item.id)}><MdDelete /></button></td>
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
                                {par_preCot.map((item, index) => (
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
                        <td>{(itemPC.costoCotizado * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td>{(itemPC.total * 1).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        <td><Link to={`/editarPartidasInsumoPC/${itemPC.id}`}><button className="btn btn-primary" ><FaPencilAlt /></button></Link></td>
                        <td><button className="btn btn-danger" ><MdDelete /></button></td>
                      </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row" style={{ border: '1px solid #000' }}>
                <label style={{color: "red" }}>PARTIDAS POR MANO DE OBRA </label>
                <div className="col-md-2">
                        <div className="mb-3">
                            <label className="form-label">NO. PARTIDA</label>
                            <select
                                id="selectFolio"
                                className="form-control"
                                value={noPartidaMO}
                                onChange={(e) => setNoParatidaMO(e.target.value)}
                                >
                                <option value="0">Seleccionar...</option>
                                {par_preCot.map((item, index) => (
                                <option key={item.noPartida} value={item.noPartida} >
                                {item.noPartida}
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
                        <td><Link to={`/editarPartidasMO/${itemMO.id}`}><button className="btn btn-primary" ><FaPencilAlt /></button></Link></td>
                        <td><button className="btn btn-danger" onClick={() => DeletePartidaMO(indexMO)}><MdDelete /></button></td>
                      </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <br></br>
              <button className="btn btn-success" onClick={updateEncabezado}><HiDocumentPlus /> Editar documento</button>
        </div>
      </div>
    </div>    
  );

}

export default EditarPreCotizacion