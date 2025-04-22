import React, { useState, useEffect } from "react";
import { collection, query, where, getDoc } from "@firebase/firestore";
import {  updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link, useNavigate, useParams} from "react-router-dom";
import { FaPencilAlt, FaEye  } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import { FaCircleQuestion } from "react-icons/fa6";
import swal from "sweetalert";


const Factores = () => {
    const [clave, setClave] = useState("");
    const [costoFijo, setCostoFijo] = useState("");
    const [factoraje, setFactoraje] = useState("");
    const [fianzas, setFianzas] = useState("");
    const [utilidad, setUtilidad] = useState("");
    const [factores, setFactores] = useState([]);
    const navigate = useNavigate()
    const { id } = useParams();


    const getTipoById = async (id) => {
        const tipoDoc = await getDoc(doc(db, "PORCENTAJES", id));
        if (tipoDoc.exists()) {
            setCostoFijo(tipoDoc.data().costoFijo);
            setFactoraje(tipoDoc.data().factoraje);
            setFianzas(tipoDoc.data().fianzas);
            setUtilidad(tipoDoc.data().utilidad);
        }else {
            console.log("El factor de porcentaje no existe");
            }
    };

    useEffect(() => {
        getTipoById(id);
    }, [id]);

    const updatePorcentaje = async (e) => {
        e.preventDefault();
        const tipoRef = doc(db, "PORCENTAJES", id);
        const datos = {
            costoFijo: parseInt(costoFijo),
            factoraje: parseInt(factoraje),
            fianzas: parseInt(fianzas),
            utilidad: parseInt(utilidad)
        };
        await updateDoc(tipoRef, datos);
        navigate("/")
    };
      const infoCostoFijo=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El campo de costo indirecto representa un gasto constante asociado a la operación del insumo. Este costo se multiplica por el subtotal de la partida en el proyecto, proporcionando una estimación adicional que contribuye a la determinación total de los costos asociados con ese insumo específico." + "\n"+ "\n" + "Agrega la cantidad en número entero sin el signo de porcentaje (%) " +  "\n" + "\n" + "EJEMPLO: 9% = 9", 
          icon: "info",
          
          buttons: "Aceptar"
        })
      }
      const infoFactoraje=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El factoraje  financia gastos operativos como proveedores, salarios y otros costos asociados a la ejecución del proyecto. Este porcentaje puede variar según las características y requisitos específicos de cada partida y/o proyecto." + "\n" + "Usualmente se estima un 10 % de manera general." +"\n" +"\n" + "Agrega la cantidad en número entero sin el signo de porcentaje (%) " +  "\n" + "\n" + "EJEMPLO: 10% = 10", 
          icon: "info",
          
          buttons: "Aceptar"
        })
      }
      const infoFianza=()=>{
        swal({
          title: "Ayuda del sistema",
          text: "La fianza actúa como respaldo y protección contra posibles pérdidas. En caso de que el afianzado no cumpla con sus compromisos, el fiador asume las obligaciones acordadas, respondiendo con sus propios recursos o bienes ( valorar de acuerdo a contrato)." +"\n" +"\n" + "Agrega la cantidad en número entero sin el signo de porcentaje (%) " +  "\n" + "\n" + "EJEMPLO: 10% = 10", 
          icon: "info",
          
          buttons: "Aceptar"
        })
      }
      const infoUtilidad=()=>{
        swal({
          title: "Ayuda del sistema",
          text: "El porcentaje de utilidad del proyecto indica de manera crucial la eficiencia y rentabilidad de este, se sugiere un porcentaje superior al 25% a fin de poder soportar alguna desviación en el proyecto una vez ejecutado." +"\n" +"\n" + "Agrega la cantidad en número entero sin el signo de porcentaje (%) " +  "\n" + "\n" + "EJEMPLO: 25% = 25", 
          icon: "info",
          
          buttons: "Aceptar"
        })
      }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>Cambiar Porcentajes</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Costo Indirecto</th>
                                <th>Factoraje</th>
                                <th>Fianzas</th>
                                <th>Utilidad</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                    <td>{costoFijo} %</td>
                                    <td>{factoraje} % </td>
                                    <td>{fianzas} %</td>
                                    <td>{utilidad} %</td>
                                </tr>
                        </tbody>
                    </table>
                    <div className="col-md-3">
                        {/*<label className="form-label">COSTO FIJO (%)</label>*/}
                        <label className="form-label">Costo Indirecto (%)</label>
                        <div className="input-group mb-3">
                            <input
                            value={costoFijo}
                            onChange={(e) => setCostoFijo(e.target.value)}
                            type="number"
                            className="form-control"            
                            />
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button" onClick={infoCostoFijo}><FaCircleQuestion /></button>
                            </div>
                        </div>
                    </div>
                            <div className="col-md-3">
                                <label className="form-label">Factoraje (%)</label>
                                <div className="input-group mb-3">
                                    <input
                                    value={factoraje}
                                    onChange={(e) => setFactoraje(e.target.value)}
                                    type="number"
                                    className="form-control"            
                                    />
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" onClick={infoFactoraje}><FaCircleQuestion /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Fianzas (%)</label>
                                <div className="input-group mb-3">
                                    <input
                                    value={fianzas}
                                    onChange={(e) => setFianzas(e.target.value)}
                                    type="number"
                                    className="form-control"            
                                    />
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" onClick={infoFianza}><FaCircleQuestion /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Utilidad (%)</label>
                                <div className="input-group mb-3">
                                    <input
                                    value={utilidad}
                                    onChange={(e) => setUtilidad(e.target.value)}
                                    type="number"
                                    className="form-control"            
                                    />
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" onClick={infoUtilidad}><FaCircleQuestion /></button>
                                    </div>
                                </div>
                            </div>
                            <p></p>
                            <div className="buttons-container">
                                <button type="submit" className="btn btn-success" onClick={updatePorcentaje}><CiCirclePlus/> Cambiar Porcentajes</button>
                             </div>
                </div>
            </div>
        </div>
    )
}

export default Factores