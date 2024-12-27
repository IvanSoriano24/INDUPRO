import React, {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit,getDocs } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { FaCircleQuestion } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import formula from "./../imagenes/formula.PNG"

const AgregarFactores  = () => {
    const [cve_far, setCve_far] = useState("");
    const [nombre, setNombre] = useState("");
    const [costoFijo, setCostoFijo] = useState();
    const [factoraje, setFactoraje] = useState();
    const [fianzas, setFianzas] = useState();
    const [utilidad, setUtilidad] = useState();
    const factorUtilidad = 1.0 + (parseFloat(parseInt(costoFijo/100)) + parseFloat(parseInt(factoraje)/100) + parseFloat(parseInt(fianzas)/100) + parseFloat(parseInt(utilidad)/100));
    const navigate = useNavigate()
    const factoresCollection = collection(db,"FACTORES")

    useEffect(() => {
        // Obtener el último valor de CVE_PEPR
        const obtenerUltimoCvePepr = async () => {
            const q = query(collection(db, "FACTORES"), orderBy("cve_far", "desc"), limit(1));
            const result = await getDocs(q);

            if (result.docs.length > 0) {
                const ultimoCvePepr = result.docs[0].data().cve_far;
                // Incrementar el valor y establecerlo en el estado
                const nuevoCvePepr = (parseInt(ultimoCvePepr) + 1).toString().padStart(2, "0");
                setCve_far(nuevoCvePepr);
            } else {
                // Si no hay registros, establecer el primer valor
                setCve_far("01");
            }
        };
        obtenerUltimoCvePepr();
    }, []);

    const addFactores = async(e) =>{
        e.preventDefault()
        await addDoc(factoresCollection, {
            cve_far: cve_far, 
            nombre: nombre, 
            costoFijo: costoFijo, 
            factoraje: factoraje,
            fianzas: fianzas,
            utilidad: utilidad,
            factorUtilidad: factorUtilidad
            } );
            navigate("/factores")
    };
    const infoInsumo=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El campo de nombre de insumo permite ingresar el nombre que se asignará al insumo que será calculado en la cotización. " +  "\n" + "\n" + "Ingresa el nombre del insumo con la primera letra en mayúscula y el resto en minúscula." + "\n"+ "\n" + "EJEMPLO: Material", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infoCostoFijo=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El campo de costo fijo representa un gasto constante asociado a la operación del insumo. Este costo se multiplica por el subtotal de la partida en el proyecto, proporcionando una estimación adicional que contribuye a la determinación total de los costos asociados con ese insumo específico." + "\n"+ "\n" + "Agrega la cantidad en número entero sin el signo de porcentaje (%) " +  "\n" + "\n" + "EJEMPLO: 9% = 9", 
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
                    <h1>AGREGAR INSUMOS POR FACTOR</h1>
                    <form onSubmit={addFactores}>
                        <div className="row">
                            <div className="col-md-3">
                            <label className="form-label">NOMBRE DE INSUMO</label>
                                <div className="input-group mb-3"> 
                                    <input
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    type="text"
                                    className="form-control"            
                                    />
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" onClick={infoInsumo}><FaCircleQuestion /></button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">COSTO FIJO (%)</label>
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
                                <label className="form-label">FACTORAJE (%)</label>
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
                              <label className="form-label">FIANZAS (%)</label>
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
                                <label className="form-label">UTILIDAD (%)</label>
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
                            <div className="buttons-container">
                                <button type="submit" className="btn btn-success"><CiCirclePlus/> Agregar</button>
                                <Link to="/factores"><button className="btn btn-danger" >Regresar</button></Link>

                             </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AgregarFactores