import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye  } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";

const PersonalProyectos  = () => {
    const [personal, setPersonal] = useState([]);

    const getPersonal = async () => {
        const data = await getDocs(collection(db, "PERSONAL"));
        const personalList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setPersonal(personalList);
    }

    /* 
    // No olvides cambiar las referencias a la colección y la función deleteCliente si las utilizas
    const deletePersonal = async (id) => {
        const personalDoc = doc(db, "PERSONAL", id);
        await deleteDoc(personalDoc);
        getPersonal();
    }
    */

    useEffect(() => {
        getPersonal();
}, []);


    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="col-md-4 ">
                            <div className="mb-3">
                                <div class="input-group-append">
                                    <Link to="/agregarPersonal"><button class="btn btn-success" type="button"><CiCirclePlus  /> Agregar nuevo personal </button></Link>
                                </div>
                            </div>
                        </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Clave</th>
                                <th>Personal</th>
                                <th>Salario Diario</th>
                                <th>Valor Hombre</th>
                                <th>Detalle</th>
                                <th>Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personal.map((personal) => (
                                <tr>
                                    <td>{personal.CVE_PEPR}</td>
                                    <td>{personal.personal}</td>
                                    <td>{personal.salarioDiario.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    <td>{(personal.valorHombre).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    <td><Link to={`/visualizarPersonal/${personal.id}`} className="btn btn-primary"><FaEye /></Link></td>
                                    <td><Link to={`/editarPersonalProyecto/${personal.id}`} className="btn btn-primary"><FaPencilAlt /></Link></td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PersonalProyectos