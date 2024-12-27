import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye  } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";

const Contactos = () => {
    const [contactos, setContactos] = useState([]);

    const getContactos = async () => {
        const data = await getDocs(collection(db, "CONTACTOS")); // Cambiado a "CLIENTES"
        const contactosList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setContactos(contactosList);
    }
    
    /*const deleteCliente = async (id) => {
       const ClienteDoc =  doc(db, "CLIENTES", id)
       await deleteCliente(ClienteDoc)
       getClientes()
    }*/

    useEffect(() => {
        getContactos(); // Cambiado a "getClientes"
    }, []);
    //console.log(clientes);
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Telefono</th>
                                <th>Correo</th>
                                <th>Detalle</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactos.map((contactos) => (
                                <tr>
                                    <td>{contactos.nombre}</td>
                                    <td>{contactos.telefono}</td>
                                    <td>{contactos.correo}</td>
                                    <td><Link to={`/visualizarContacto/${contactos.id}`} className="btn btn-primary"><FaEye /></Link></td>
                                    <td><Link to={`/editarContacto/${contactos.id}`} className="btn btn-primary"><FaPencilAlt /></Link></td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Contactos