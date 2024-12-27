import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { FaCircleQuestion } from "react-icons/fa6";
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { Link } from "react-router-dom";


const VisualizarTipo  = () => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const navigate = useNavigate()
    const { id } = useParams();

    const updateTipo = async (e) => {
        e.preventDefault();
        const tipoRef = doc(db, "TIPOSSERVICIOS", id);
        const datos = {
            nombre: nombre,
            descripcion: descripcion
        };
        await updateDoc(tipoRef, datos);
        navigate("/tipo");
    };
    const getTipoById = async (id) => {
        const tipoDoc = await getDoc(doc(db, "TIPOSSERVICIOS", id));
        if (tipoDoc.exists()) {
            setNombre(tipoDoc.data().nombre);
            setDescripcion(tipoDoc.data().descripcion);
        }else {
            console.log("El cliente no existe");
            }
    };

    useEffect(() => {
        getTipoById(id);
    }, [id]);
    return (
        <div className="container">
        <div className="row">
            <div className="col">
                <h1>EDITAR SERVICIO</h1>
                <form onSubmit={updateTipo}>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="mb-3">
                               <label className="form-label">NOMBRE</label>
                               <input
                               value={nombre}
                               onChange={(e) => setNombre(e.target.value)}
                               type="text"
                               className="form-control"
                               readOnly
                               />
                               
                            </div>
                        </div>
                        <div className="col-md-10">
                            <div className="mb-3">
                               <label className="form-label">DESCRIPCIÓN</label>
                               <textarea
                               value={descripcion}
                               onChange={(e) => setDescripcion(e.target.value)}
                               type="text"
                               className="form-control"
                               readOnly
                               />
                            </div>
                        </div>
                        <div className="buttons-container">
                                
                                <Link to="/tipo"><button className="btn btn-danger" >Regresar</button></Link>
                             </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default VisualizarTipo