import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, addDoc, updateDoc, doc, getDoc, endAt, query, orderBy, limit,getDocs  } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { FaCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import swal from "sweetalert";

const AgregarPersonal  = () => {
    const [cvePepr, setCvePepr] = useState("");
    const [factor, setFactor] = useState();
    const [personal, setPersonal] = useState("");
    const [salarioDiario, setSalarioDiario] = useState("");
    const valorHombre = salarioDiario * parseFloat(factor);
    const navigate = useNavigate();
    useEffect(() => {
        // Obtener el último valor de CVE_PEPR
        const obtenerUltimoCvePepr = async () => {
            const q = query(collection(db, "PERSONAL"), orderBy("CVE_PEPR", "desc"), limit(1));
            const result = await getDocs(q);

            if (result.docs.length > 0) {
                const ultimoCvePepr = result.docs[0].data().CVE_PEPR;
                // Incrementar el valor y establecerlo en el estado
                const nuevoCvePepr = (parseInt(ultimoCvePepr) + 1).toString().padStart(2, "0");
                setCvePepr(nuevoCvePepr);
            } else {
                // Si no hay registros, establecer el primer valor
                setCvePepr("01");
            }
        };

        obtenerUltimoCvePepr();
    }, []);

    const personalCollection = collection(db,"PERSONAL")

    const addPersonal = async(e) => {
        e.preventDefault()
        await addDoc(personalCollection, { CVE_PEPR: cvePepr,  personal: personal, salarioDiario: parseFloat(salarioDiario), factor: parseFloat(factor), valorHombre: valorHombre})
        navigate("/personalProyectos");
    }

    const infoNombreLider=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " Este campo permite identificar a los trabajadores registrados, facilitando su selección durante el cálculo de una cotización. Esta funcionalidad es esencial para distinguir a cada empleado y asignar adecuadamente sus costos laborales en la estimación de la cotización." + "\n"+ "\n" + "Ingresa el nombre del trabajador con la primera letra en mayúscula y el resto en minúscula." +  "\n" + "\n" + "EJEMPLO: Lider", 
          icon: "info",
          
          buttons: "Aceptar"
        })
      }
      const infoFactor=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El factor, al ser multiplicado por el salario diario del trabajador, establece los costos laborales y el valor que el empleado representa para la empresa. Es una medida esencial en la gestión de recursos humanos." + "\n"+ "\n" + "Ingresa el valor del factor con número, puede contener decimales " +  "\n" + "\n" + "EJEMPLO: 1.03", 
          icon: "info",
          
          buttons: "Aceptar"
        })
      }
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                <h1>Agregar un contato</h1>
                        <form onSubmit={addPersonal}>
                            <div className="row">
                            <div className="col-md-3">
                                <label className="form-label">NOMBRE DE PERSONAL</label>
                                    <div className="input-group mb-3">
                                        <input
                                            value={personal}
                                            onChange={(e) => setPersonal(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />

                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" onClick={infoNombreLider}><FaCircleQuestion /></button>
                                         </div>
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
                                            
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">FACTOR</label>
                                    <div className="input-group mb-3">
                                        <input
                                            value={factor}
                                            onChange={(e) =>{
                                                const value = e.target.value;
                                                if (!isNaN(value) && value !== '') {
                                                    setFactor(e.target.value)
                                                }
                                            }}
                                            type="text"
                                            className="form-control"
                                            
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" onClick={infoFactor}><FaCircleQuestion /></button>
                                         </div>
                                    </div>
                                </div>
                                <div className="buttons-container">
                                <button type="submit" className="btn btn-success"><CiCirclePlus/> Agregar</button>
                                <Link to="/clientes"><button className="btn btn-danger" >Regresar</button></Link>
                             </div>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default AgregarPersonal