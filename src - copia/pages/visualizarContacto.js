import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { FaCircleQuestion } from "react-icons/fa6";
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { Link } from "react-router-dom";

const VisualizarContacto = () => {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();


    const updateContacto = async (e) => {
        e.preventDefault();
        const contactoRef = doc(db, "CONTACTOS", id);
        const datos = {
            nombre,
            telefono,
            correo
        };
        await updateDoc(contactoRef, datos);
        navigate("/");
    }
    const getContactoById = async (id) => {
        const contactosDOC = await getDoc(doc(db, "CONTACTOS", id));
        if (contactosDOC.exists()) {
            //setClave(clienteDoc.data().clave);
            setNombre(contactosDOC.data().nombre);
            setTelefono(contactosDOC.data().telefono);
            setCorreo(contactosDOC.data().correo);
        }else {
            console.log("El cliente no existe");
        }
    };
    useEffect(() => {
        getContactoById(id);
    }, [id]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                <h1>DATOS DEL CONTACTO</h1>
                        <form onSubmit={updateContacto}>
                            <div className="row">
                                    <div className="col-md-9">
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
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">TELEFONO</label>
                                            <input
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                                type="text"
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">CORREO</label>
                                            <input
                                                value={correo}
                                                onChange={(e) => setCorreo(e.target.value)}
                                                type="email"
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="buttons-container">
                                        <Link to="/contactos"><button className="btn btn-danger" >Regresar</button></Link>
                                    </div>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default VisualizarContacto