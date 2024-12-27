import React, { useState, useEffect } from "react"
import { Container, Row, Col } from "reactstrap"
import { getDoc, updateDoc, doc, collection, addDoc } from "firebase/firestore";
import {Link, useNavigate, useParams} from "react-router-dom"
import { db } from "../firebaseConfig/firebase";

const EditarParPrecot = () => {
    const[noPartida, setNoPartida] = useState("");
    const[descripcion, setDescripcion] = useState("");
    const[observacion, setObservacion] = useState("");
    const[cve_precot, setCve_precot] = useState("");
    const navigate = useNavigate()
    const { id } = useParams();

    const updateParLevDig = async (e) => {
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
              noPartida: noPartida,
            });
        const parLevRef = doc(db, "PAR_PRECOTIZACION", id);
        const datos = {
            descripcion: descripcion,
            observacion: observacion
        };
        await updateDoc(parLevRef, datos);
        //navigate("/precotizacion");
    }
    
    const getParLevDigById = async (id) => {
        const parLevDigDOC = await getDoc(doc(db, "PAR_PRECOTIZACION", id));
        if (parLevDigDOC.exists()) {
            //setClave(clienteDoc.data().clave);
            setDescripcion(parLevDigDOC.data().descripcion)
            setObservacion(parLevDigDOC.data().observacion)
            setCve_precot(parLevDigDOC.data().cve_precot)
            setNoPartida(parLevDigDOC.data().noPartida)
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
                    <form onSubmit={updateParLevDig}>
                        <div className="row">
                            <div className="col-md-6 ">
                                <label>DESCRIPCIÓN</label>
                                <div class="input-group mb-3">
                                    <textarea
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 ">
                                <label>OBSERVACIONES</label>
                                <div class="input-group mb-3">
                                    <textarea
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={observacion}
                                    onChange={(e) => setObservacion(e.target.value)}
                                    type="text"
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

export default EditarParPrecot