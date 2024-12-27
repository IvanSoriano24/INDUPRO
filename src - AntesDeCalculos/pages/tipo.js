import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye  } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";

const Tipo = () => {
    const [tipo, setTipo] = useState([]);

    const getTipo = async () => {
        const data = await getDocs(collection(db, "TIPOSSERVICIOS")); // Cambiado a "CLIENTES"
        const serviciosList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTipo(serviciosList);
    }
    
    /*const deleteCliente = async (id) => {
       const ClienteDoc =  doc(db, "CLIENTES", id)
       await deleteCliente(ClienteDoc)
       getClientes()
    }*/

    useEffect(() => {
        getTipo(); // Cambiado a "getClientes"
    }, []);
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="col-md-4 ">
                        <div className="mb-3">
                            <div class="input-group-append">
                                <Link to="/agregarTipo"><button class="btn btn-success" type="button"><CiCirclePlus  /> Agregar nuevo servicio</button></Link>
                            </div>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Clave</th>
                                <th>Nombre</th>
                                <th>descripción</th>
                                <th>Detalle</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tipo.map((tipo) => (
                                <tr>
                                    <td>{tipo.cve_tise}</td>
                                    <td>{tipo.nombre}</td>
                                    <td>{tipo.descripcion}</td>
                                    <td><Link to={`/visualizarTipo/${tipo.id}`} className="btn btn-primary"><FaEye /></Link></td>
                                    <td><Link to={`/editarTipo/${tipo.id}`} className="btn btn-primary"><FaPencilAlt /></Link></td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Tipo