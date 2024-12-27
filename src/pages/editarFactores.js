import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { FaCircleQuestion } from "react-icons/fa6";
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"



const EditarFactores  = () => {
    const [cve_far, setCve_far] = useState("");
    const [nombre, setNombre] = useState("");
    const [costoFijo, setCostoFijo] = useState();
    const [factoraje, setFactoraje] = useState();
    const [fianzas, setFianzas] = useState();
    const [utilidad, setUtilidad] = useState();
    const factorUtilidad = 1.0 + (parseFloat(parseInt(costoFijo/100)) + parseFloat(parseInt(factoraje)/100) + parseFloat(parseInt(fianzas)/100) + parseFloat(parseInt(utilidad)/100));
    const navigate = useNavigate()
    const { id } = useParams();

    const updateContacto = async (e) => {
        e.preventDefault();
        const factoresRef = doc(db, "FACTORES", id);
        const datos = {
            nombre: nombre,
            costoFijo: costoFijo,
            factoraje: factoraje,
            fianzas: fianzas,
            utilidad: utilidad,
            factorUtilidad: factorUtilidad
        };
        await updateDoc(factoresRef, datos);
        navigate("/fatores")
    };
    const getFactoresById = async (id) => {
        const factoresDOC = await getDoc(doc(db, "FACTORES", id));
        if (factoresDOC.exists()) {
            setNombre(factoresDOC.data().nombre);
            setCostoFijo(factoresDOC.data().costoFijo);
            setFactoraje(factoresDOC.data().factoraje);
            setFianzas(factoresDOC.data().fianzas);
            setUtilidad(factoresDOC.data().utilidad)
        }else{
            console.log("El personals no existe");
        }
    };

    useEffect(() => {
        getFactoresById(id);
      }, [id]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>AGREGAR INSUMOS POR FACTOR</h1>
                    <form onSubmit={updateContacto}>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">NOMBRE DE INSUMO</label>
                                    <input
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    type="text"
                                    className="form-control"            
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">COSTO FIJO</label>
                                    <input
                                    value={costoFijo}
                                    onChange={(e) => setCostoFijo(e.target.value)}
                                    type="number"
                                    
                                    className="form-control"            
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">FACTORAJE</label>
                                    <input
                                    value={factoraje}
                                    onChange={(e) => setFactoraje(e.target.value)}
                                    type="number"
                                    
                                    className="form-control"            
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">FIANZAS</label>
                                    <input
                                    value={fianzas}
                                    onChange={(e) => setFianzas(e.target.value)}
                                    type="number"
                                    
                                    className="form-control"            
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label className="form-label">UTILIDAD</label>
                                    <input
                                    value={utilidad}
                                    onChange={(e) => setUtilidad(e.target.value)}
                                    type="number"
                                    
                                    className="form-control"            
                                    />
                                </div>
                            </div>
                            <div className="buttons-container">
                                <button type="submit" className="btn btn-primary">AGREGAR</button>
                                <Link to="/factores"><button className="btn btn-danger" >Regresar</button></Link>
                             </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditarFactores