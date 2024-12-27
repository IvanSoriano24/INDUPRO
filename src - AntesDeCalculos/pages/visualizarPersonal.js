import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { FaCircleQuestion } from "react-icons/fa6";
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"


const VisualizarPersonal  = () => {

    const [factor, setFactor] = useState();
    const [personal, setPersonal] = useState("");
    const [salarioDiario, setSalarioDiario] = useState();
    const valorHombre = salarioDiario * factor;
    const { id } = useParams();

    const navigate = useNavigate();

    const updatePersonal = async(e) => {
        e.preventDefault();
        const personalRef = doc(db, "PERSONAL", id);
        const datos = {
            personal: personal,
            salarioDiario: salarioDiario,
            factor: factor,
            valorHombre: salarioDiario * factor,
        };
        await updateDoc(personalRef, datos);
        navigate("/personalProyectos");
    };

    const getPersonalById = async (id) => {
        const personalDoc = await getDoc(doc(db, "PERSONAL", id));
        if(personalDoc.exists()){
            setPersonal(personalDoc.data().personal);
            setSalarioDiario(personalDoc.data().salarioDiario);
            setFactor(personalDoc.data().factor);
        }else{
            console.log("El personals no existe");
        }
    };

    useEffect(() => {
        getPersonalById(id);
      }, [id]); // Asegúrate de ejecutar la carga inicial cuando id cambie

      
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                <h1>INFORMACIÓN DEL PERSONAL DE PROYECTOS</h1>
                        <form onSubmit={updatePersonal}>
                            <div className="row">
                            <div className="col-md-3">
                                    <div className="mb-3">
                                        <label className="form-label">NOMBRE DE PERSONAL</label>
                                        <input
                                            value={personal}
                                            onChange={(e) => setPersonal(e.target.value)}
                                            type="text"
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label className="form-label">SALARIO DIARIO</label>
                                        <input
                                            value={salarioDiario}
                                            onChange={(e) => setSalarioDiario(e.target.value)}
                                            type="number"
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label className="form-label">FACTOR</label>
                                        <input
                                            value={factor}
                                            onChange={(e) => setFactor(e.target.value)}
                                            type="number"
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="buttons-container">
                                <Link to="/personalProyectos"><button className="btn btn-danger" >Regresar</button></Link>
                             </div>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default VisualizarPersonal