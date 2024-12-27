import React, { useState, useEffect } from "react"
import { Container, Row, Col } from "reactstrap"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"
import {Link, useNavigate, useParams} from "react-router-dom"
import { db } from "../firebaseConfig/firebase";

const EditarPartidasInsumosPC = () => {
    const[noPartida, setNoPartida] = useState("");
    const[cve_precot, setCve_precot] = useState("");
    const[descripcionInsumo, setDescripcionInsumo] = useState("");
    const[proveedor, setProveedor] = useState("")
    const[comentariosAdi, setComentariosAdi] = useState("");
    const[costoCotizado, setCostoCotizado] = useState();
    const[cantidad, setCantidad] = useState();
    const total = costoCotizado * cantidad; 
    const[unidad, setUnidad] = useState("");
    const[factores, setFactores] = useState([])
    const[insumo, setInsumo] = useState("");
    const navigate = useNavigate()
    const { id } = useParams();

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

    const updateParInsumo = async (e) => {
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
            tipoDocumento: "Edición de partida",
            noPartida: "N/A"
        });
        const factorSeleccionado = await obtenerFactorPorNombre(insumo)
        const { costoFijo, factoraje, fianzas, utilidad } = factorSeleccionado;
        const parLevRef = doc(db, "PAR_PRECOTIZACION_INSU", id);
        const datos = {
          insumo: insumo,
          proveedor: proveedor,
          descripcionInsumo: descripcionInsumo,
          comentariosAdi: comentariosAdi,
          costoCotizado: costoCotizado,
          cantidad: cantidad,
          unidad: unidad,
          total: cantidad * costoCotizado,
          costoFijo: (costoFijo/100) * (costoCotizado * cantidad),
          factoraje: (factoraje/100) * (costoCotizado * cantidad),
          fianzas: (fianzas/100) * (costoCotizado * cantidad),
          utilidad: (utilidad/100) * (costoCotizado * cantidad),
        };
        await updateDoc(parLevRef, datos);
        navigate("/precotizacion");
    }
    
    const getParLevDigById = async (id) => {
        const parInsumoDOC = await getDoc(doc(db, "PAR_PRECOTIZACION_INSU", id));
        if (parInsumoDOC.exists()) {
            setNoPartida(parInsumoDOC.data().noPartidaPC)
            setCve_precot(parInsumoDOC.data().cve_precot)
            //setClave(clienteDoc.data().clave);
            setInsumo(parInsumoDOC.data().insumo)
            setProveedor(parInsumoDOC.data().proveedor)
            setDescripcionInsumo(parInsumoDOC.data().descripcionInsumo)
            setComentariosAdi(parInsumoDOC.data().comentariosAdi)
            setCostoCotizado(parInsumoDOC.data().costoCotizado)
            setCantidad(parInsumoDOC.data().cantidad)
            setUnidad(parInsumoDOC.data().unidad)
        }else {
            console.log("El cliente no existe");
        }
    };
    useEffect(() => {
        getParLevDigById(id);
    }, [id]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>EDITAR PARTIDA</h1>
                    <form onSubmit={updateParInsumo}>
                        <div className="row">
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
                                <label>PROVEEDOR</label>
                                <br></br>
                                <div class="input-group mb-3">
                                    <input
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={proveedor}
                                    onChange={(e) => setProveedor(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 ">
                                <label>DESCRIPCIÓN</label>
                                <div class="input-group mb-3">
                                    <textarea
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={descripcionInsumo}
                                    onChange={(e) => setDescripcionInsumo(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 ">
                                <label>COMENTARIOS ADICIONALES</label>
                                <div class="input-group mb-3">
                                    <textarea
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={comentariosAdi}
                                    onChange={(e) => setComentariosAdi(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 ">
                                <label>UNIDAD</label>
                                <div class="input-group mb-3">
                                    <input
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={unidad}
                                    onChange={(e) => setUnidad(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 ">
                                <label>CANTIDAD</label>
                                <div class="input-group mb-3">
                                    <input
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    type="number"
                                    className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 ">
                                <label>COSTO COTIZADO</label>
                                <div class="input-group mb-3">
                                    <input
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={costoCotizado}
                                    onChange={(e) => setCostoCotizado(e.target.value)}
                                    type="number"
                                    className="form-control"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="buttons-container">
                                    <button className="btn btn-success">Editar</button>
                                    <Link to="/levantamientoDigital"><button className="btn btn-danger">Regresar</button></Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditarPartidasInsumosPC