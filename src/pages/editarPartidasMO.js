import React, { useState, useEffect } from "react"
import { Container, Row, Col } from "reactstrap"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"
import {Link, useNavigate, useParams} from "react-router-dom"
import { db } from "../firebaseConfig/firebase";

const EditarPartidasMO = () => {
    const[manoObra, setManoObra] = useState([]);
    const[diasTrabajados, setDiasTrabajados] = useState("")
    const[personal, setPersonal] = useState("")
    const navigate = useNavigate()
    const { id } = useParams();

     /* ------------------------------------ OBTENER TABLA DE TRABAJADORES -------------------------------*/
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
      
    const updateParInsumo = async (e) => {
        e.preventDefault();
        const parLevRef = doc(db, "PAR_PRECOTIZACION_MO", id);
        const datos = {
          personal: personal,
          diasTrabajados: diasTrabajados
        };
        await updateDoc(parLevRef, datos);
        navigate("/precotizacion");
    }
    
    const getParLevDigById = async (id) => {
        const parInsumoDOC = await getDoc(doc(db, "PAR_PRECOTIZACION_MO", id));
        if (parInsumoDOC.exists()) {
            //setClave(clienteDoc.data().clave);
            setPersonal(parInsumoDOC.data().personal)
            setDiasTrabajados(parInsumoDOC.data().diasTrabajados)
            
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
                    <h1>Editar partida de Mano de Obra</h1>
                    <form onSubmit={updateParInsumo}>
                        <div className="row">
                            <div className="col-md-3">
                                 <div className="mb-3">
                                    <label className="form-label">TRABAJADOR</label>
                                        <select
                                        id="selectTrabajador"
                                        className="form-control"
                                        value={personal}
                                        onChange={(e) => setPersonal(e.target.value)}
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
                                <label>DÍAS TRABAJADOS</label>
                                <br></br>
                                <div class="input-group mb-3">
                                    <input
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={diasTrabajados}
                                    onChange={(e) => setDiasTrabajados(e.target.value)}
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

export default EditarPartidasMO