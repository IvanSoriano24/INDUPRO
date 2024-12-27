import React, {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit,getDocs } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { FaCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";

const AgregarTipo  = () => {
    const [cve_tise, setCve_tise] = useState("")
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        // Obtener el último valor de CVE_PEPR
        const obtenerUltimoCvePepr = async () => {
            const q = query(collection(db, "TIPOSSERVICIOS"), orderBy("cve_tise", "desc"), limit(1));
            const result = await getDocs(q);

            if (result.docs.length > 0) {
                const ultimoCvePepr = result.docs[0].data().cve_tise;
                // Incrementar el valor y establecerlo en el estado
                const nuevoCvePepr = (parseInt(ultimoCvePepr) + 1).toString().padStart(2, "0");
                setCve_tise(nuevoCvePepr);
            } else {
                // Si no hay registros, establecer el primer valor
                setCve_tise("01");
            }
        };

        obtenerUltimoCvePepr();
    }, []);

    const tipoCollecion = collection(db,"TIPOSSERVICIOS")

    const addTipo = async(e) =>{
        e.preventDefault()
        await addDoc( tipoCollecion, { cve_tise: cve_tise,  nombre: nombre, descripcion: descripcion })
        navigate("/tipo")
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>EDITAR SERVICIO</h1>
                    <form onSubmit={addTipo}>
                        <div className="row">
                            <div className="col-md-8">
                                <div className="mb-3">
                                   <label className="form-label">NOMBRE</label>
                                   <input
                                   value={nombre}
                                   onChange={(e) => setNombre(e.target.value)}
                                   type="text"
                                   className="form-control"/>
                                </div>
                            </div>
                            <div className="col-md-10">
                                <div className="mb-3">
                                   <label className="form-label">DESCRIPCIÓN</label>
                                   <textarea
                                   value={descripcion}
                                   onChange={(e) => setDescripcion(e.target.value)}
                                   type="text"
                                   className="form-control"/>
                                </div>
                            </div>
                            <div className="buttons-container">
                                <button type="submit" className="btn btn-success"><CiCirclePlus/> Agregar</button>
                                <Link to="/clientes"><button className="btn btn-danger" >Regresar</button></Link>
                             </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AgregarTipo