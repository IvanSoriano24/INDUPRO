import React, { useState, useEffect } from "react"
import { Container, Row, Col } from "reactstrap"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"
import {Link, useNavigate, useParams} from "react-router-dom"
import { CiCalculator1 } from "react-icons/ci";
import { LiaPercentageSolid } from "react-icons/lia";
import { db } from "../firebaseConfig/firebase";

const EditarPartidasInsumosATF = () => {
    const[noPartida, setNoPartida] = useState("");
    const[descripcionInsumo, setDescripcionInsumo] = useState("");
    const[proveedor, setProveedor] = useState("")
    const[comentariosAdi, setComentariosAdi] = useState("");
    const[costoCotizado, setCostoCotizado] = useState();
    const[cantidad, setCantidad] = useState();
    const[costoFijo, setCostoFijo] = useState();
    const[factoraje, setFactoraje] = useState();
    const[utilidad, setUtilidad] = useState()
    const[fianzas, setFianzas] = useState();
    const[totalCompleta, setTotalCompleta] = useState()
    const [total, setTotal] = useState();
    const[unidad, setUnidad] = useState("");
    const[costoFijoPorce, setCostoFijoPorce] = useState()
    const[factorajePorce, setFactorajePorce] = useState()
    const[fianzasPorce, setFianzasPorce] = useState()
    const[utilidadPorce, setUtilidadPorce] = useState()
    const[factores, setFactores] = useState([])
    const[insumo, setInsumo] = useState("");
    const navigate = useNavigate()
    const { id } = useParams();

    /* ------------------------------------ OBTENER TABLA DE INSUMOS -------------------------------*/
    const obtenerFactores = async () => {
        try {
          const data = await getDocs(collection(db, "FACTORES"));
          const factoresList = data.docs.map((doc) => doc.data().nombre);
          return factoresList;
        } catch (error) {
          console.error("Error al obtener datos de FACTORES:", error);
          return [];
        }
      };
      useEffect(() => {
        const cargarFactores = async () => {
          const factoresList = await obtenerFactores();
          setFactores(factoresList);
        };
    
        cargarFactores();
      }, [factores]);
    
    const getParLevDigById = async (id) => {
        const parInsumoDOC = await getDoc(doc(db, "PAR_TECFIN_INSU", id));
        if (parInsumoDOC.exists()) {
            //setClave(clienteDoc.data().clave);
            setInsumo(parInsumoDOC.data().insumo)
            setProveedor(parInsumoDOC.data().proveedor)
            setDescripcionInsumo(parInsumoDOC.data().descripcionInsumo)
            setComentariosAdi(parInsumoDOC.data().comentariosAdi)
            setCostoCotizado(parInsumoDOC.data().costoCotizado)
            setCantidad(parInsumoDOC.data().cantidad)
            setUnidad(parInsumoDOC.data().unidad)
            setCostoFijo(parInsumoDOC.data().costoFijo)
            setFactoraje(parInsumoDOC.data().factoraje)
            setUtilidad(parInsumoDOC.data().utilidad)
            setFianzas(parInsumoDOC.data().fianzas)
            setTotal(parInsumoDOC.data().total)
            setUtilidadPorce((100 *parInsumoDOC.data().utilidad)/parInsumoDOC.data().total)
            setCostoFijoPorce((100 *parInsumoDOC.data().costoFijo)/parInsumoDOC.data().total)
            setFactorajePorce((100 *parInsumoDOC.data().factoraje)/parInsumoDOC.data().total)
            setFianzasPorce((100 *parInsumoDOC.data().fianzas)/parInsumoDOC.data().total)
        }else {
            console.log("El cliente no existe");
        }
    };
    useEffect(() => {
        getParLevDigById(id);
    }, [id]);

    const calcularFactores = async (e) => {
        e.preventDefault();
        const parTecFinRef = doc(db, "PAR_TECFIN_INSU", id);
        const datos = {
            cantidad: cantidad,
            costoCotizado: costoCotizado,
            total: cantidad * costoCotizado,
            costoFijo: (costoFijoPorce * 0.01) * (cantidad * costoCotizado),
            factoraje: (factorajePorce * 0.01) * (cantidad * costoCotizado),
            fianzas: (fianzasPorce * 0.01) * (cantidad * costoCotizado),
            utilidad: (utilidadPorce * 0.01) * (cantidad * costoCotizado)
        };
        await updateDoc(parTecFinRef, datos)
        window.location.reload();
    }
    const calcularPorcentajes = async (e) => {
        e.preventDefault();
        const parTecFinRef = doc(db, "PAR_TECFIN_INSU", id);
        const datos = {
            costoFijo: (costoFijoPorce * 0.01) * (cantidad * costoCotizado),
            factoraje: (factorajePorce * 0.01) * (cantidad * costoCotizado),
            fianzas: (fianzasPorce * 0.01) * (cantidad * costoCotizado),
            utilidad: (utilidadPorce * 0.01) * (cantidad * costoCotizado)
        };
        await updateDoc(parTecFinRef, datos)
        window.location.reload();
    }
    // Función para formatear el valor como moneda
    const formatCurrency = (value) => {
        return `$${parseFloat(value).toFixed(2)}`;
    };
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <h1>EDITAR PARTIDA</h1>
                        <div className="row">
                            <div className="col-md-2">
                                <div className="mb-3">
                                     <label className="form-label">INSUMO</label>
                                     <input
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={insumo}
                                    onChange={(e) => setInsumo(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    />
                                </div>
                            </div>
                            <div className="col-md-8 ">
                                <label>PROVEEDOR</label>
                                <br></br>
                                <div class="input-group mb-3">
                                    <input
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={proveedor}
                                    onChange={(e) => setProveedor(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 ">
                                <label>DESCRIPCIÓN</label>
                                <div class="input-group mb-3">
                                    <textarea
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={descripcionInsumo}
                                    onChange={(e) => setDescripcionInsumo(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    />
                                    
                                </div>
                            </div>
                            <div className="col-md-6 ">
                                <label>COMENTARIOS ADICIONALES</label>
                                <div class="input-group mb-3">
                                    <textarea
                                    placeholder="" aria-label="" aria-describedby="basic-addon1"
                                    value={comentariosAdi}
                                    onChange={(e) => setComentariosAdi(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    readOnly
                                    />
                                </div>
                            </div>
                            <div className="row" style={{ border: '1px solid #000' }}>
                            <div className="col-md-2 ">
                                    <label>CANTIDAD</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>COSTO COTIZADO ($)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={costoCotizado}
                                        onChange={(e) => setCostoCotizado(e.target.value)}
                                        type="number"
                                        step="0.01" min="0"
                                        className="form-control"
                                        
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>SUB TOTAL ($)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={cantidad * costoCotizado} // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setTotal(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label></label>
                                    <div class="input-group mb-3">
                                    <button className="btn btn-success" onClick={calcularFactores}><CiCalculator1 />Calcular factores</button>
                                    </div>
                                </div>
                                <p/>
                                <div className="col-md-2 ">
                                    <label>COSTO FIJO ($)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={costoFijo} // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setCostoFijo(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>FACTORAJE ($)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={factoraje} // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setFactoraje(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>FIANZAS ($)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={fianzas} // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setFianzas(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>UTILIDAD ($)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={utilidad} // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setUtilidad(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>TOTAL ($)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={total + costoFijo + factoraje + fianzas + utilidad} // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setUtilidad(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row" style={{ border: '1px solid #000' }}>
                                <div className="col-md-2 ">
                                    <label>COSTO FIJO (%)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={costoFijoPorce } // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setCostoFijoPorce(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>FACTORAJE (%)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={factorajePorce } // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setFactorajePorce(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>FIANZAS (%)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={fianzasPorce } // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setFianzasPorce(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 ">
                                    <label>UTILIDAD (%)</label>
                                    <div class="input-group mb-3">
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={utilidadPorce } // Aplicar el formateo al valor mostrado
                                        onChange={(e) => setUtilidadPorce(e.target.value)}
                                        type="number"
                                        className="form-control"
                                        
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                    <label></label>
                                    <div class="input-group mb-3">
                                    <button className="btn btn-success" onClick={calcularPorcentajes}><LiaPercentageSolid />Calcular porcentaje</button>
                                    </div>
                                </div>
                                <p/>
                            </div>
                            <div>
                                <div className="buttons-container">
                                    <div>
                                        <br/>
                                        
                                        <Link to="/revTenicoFinanciero"><button className="btn btn-danger">Regresar</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default EditarPartidasInsumosATF