import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye  } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import swal from "sweetalert";

const Clientes = () => {
    const [clientes, setClientes] = useState([]);

    const getClientes = async () => {
        const data = await getDocs(collection(db, "CLIENTES")); // Cambiado a "CLIENTES"
        const clienteList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setClientes(clienteList);
    }
    
    /*const deleteCliente = async (id) => {
       const ClienteDoc =  doc(db, "CLIENTES", id)
       await deleteCliente(ClienteDoc)
       getClientes()
    }*/

    useEffect(() => {
        getClientes(); // Cambiado a "getClientes"
    }, []);

    //console.log(clientes);
    
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="col-md-4 ">
                        <div className="mb-3">
                            <div class="input-group-append">
                                <Link to="/agregarCliente"><button class="btn btn-success" type="button"><CiCirclePlus  /> Agregar nuevo cliente </button></Link>
                            </div>
                        </div>
                        </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Clave</th>
                                <th>Razón social</th>
                                <th>Calle</th>
                                <th>CP</th>
                                <th>Colonia</th>
                                <th>Estado</th>
                                <th>Municipio</th>
                                <th>Estatus</th>
                                <th>Detalle</th>
                                <th>Editar</th>
                                <th>Agregar contacto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr>
                                    <td>{cliente.cve_clie}</td>
                                    <td>{cliente.razonSocial}</td>
                                    <td>{cliente.calle}</td>
                                    <td>{cliente.codigoPostal}</td>
                                    <td>{cliente.colonia}</td>
                                    <td>{cliente.estado}</td>
                                    <td>{cliente.municipio}</td>
                                    <td>{cliente.estatus}</td>
                                    <td><Link to={`/visualizarCliente/${cliente.id}`} class="btn btn-primary"><FaEye /></Link></td>
                                    <td><Link to={`/editarCliente/${cliente.id}`} class="btn btn-primary"><FaPencilAlt /></Link></td>
                                    <td><Link to={`/agregarContacto/${cliente.id}`} className="btn btn-success"><RiFileUserFill /></Link></td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      );
      
    
}

export default Clientes;
