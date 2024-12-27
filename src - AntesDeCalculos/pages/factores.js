import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye  } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";

const Factores = () => {
    const [factores, setFactores] = useState([]);
    const getFactores = async () => {
        const data = await getDocs(collection(db, "FACTORES"));
        const factoresList = data.docs.map(doc => ({ ...doc.data(), id: doc.id}));
        setFactores(factoresList);

    };

    useEffect(() => {
        getFactores(); // Cambiado a "getClientes"
    }, []);
    /*
    const getContactos = async () => {
        const data = await getDocs(collection(db, "CONTACTOS")); // Cambiado a "CLIENTES"
        const contactosList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setContactos(contactosList);
    }
     */
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="col-md-4 ">
                        <div className="mb-3">
                            <div class="input-group-append">
                                <Link to="/agregarFactores"><button class="btn btn-success" type="button"><CiCirclePlus  /> Agregar nuevo insumo </button></Link>
                            </div>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Clave</th>
                                <th>Nombre</th>
                                <th>Utilidad</th>
                                <th>Costo Fijo</th>
                                <th>Detalle</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {factores.map((factores) => (
                                <tr>
                                    <td>{factores.cve_far}</td>
                                    <td>{factores.nombre}</td>
                                    <td>{Math.floor(factores.utilidad)}%</td>
                                    <td>{Math.floor(factores.costoFijo)}%</td>
                                    <td><Link to={`/visualizarFactor/${factores.id}`} className="btn btn-primary"><FaEye /></Link></td>
                                    <td><Link to={`/editarFactores/${factores.id}`} className="btn btn-primary"><FaPencilAlt /></Link></td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Factores