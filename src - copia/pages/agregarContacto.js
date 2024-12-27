import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, updateDoc, doc, getDoc, endAt } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { FaCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";


const AgregarContacto = () => {
    const [cve_clie, setClave] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    const verCliente = async (e) => {
        e.preventDefault();
        const contactoRef = doc(db, "CLIENTES", id);
        const datos = {
            id,
            cve_clie
        };
        await updateDoc(contactoRef, datos);
        navigate("/contactos");
    };
    const getContactoById = async (id) => {
        const contactosDoc = await getDoc(doc(db,"CLIENTES",id));
        if(contactosDoc.exists()){
            setClave(contactosDoc.data().cve_clie);
        }else{
            console.log("El cliente no existe");
        }
    };
    const contactoCollection = collection(db, "CONTACTOS")
    const store = async(el) => {
        el.preventDefault()
        await addDoc (contactoCollection, {cve_clie: cve_clie, nombre: nombre, telefono: telefono, correo: correo })
        navigate("/")
    }
    useEffect(() => {
        getContactoById(id);
    }, [id]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                <h1>AGREGAR CONTACTO</h1>
                        <form onSubmit={store}>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label className="form-label">CLAVE</label>
                                        <input
                                            value={cve_clie}
                                            onChange={(e) => setClave(e.target.value)}
                                            type="text"
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <div className="mb-3">
                                        <label className="form-label">NOMBRE</label>
                                        <input
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            type="text"
                                            className="form-control"
                                            
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
                                            
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">CORREO</label>
                                        <input
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            type="text"
                                            className="form-control"
                                            
                                        />
                                    </div>
                                </div>
                                <div className="buttons-container">
                                <button type="submit" className="btn btn-primary">AGREGAR CONTACTO</button>
                                <Link to="/contactos"><button className="btn btn-danger" >Regresar</button></Link>
                             </div>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default AgregarContacto