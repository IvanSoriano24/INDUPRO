import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { FaCircleQuestion } from "react-icons/fa6";
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { Link } from "react-router-dom";

const EditarCliente = () => {
    const [activeTab, setActiveTab] = useState("1");

    const cambiarTab = (numeroTab) =>{
        if(activeTab !== numeroTab){
            setActiveTab(numeroTab);
        }
    }

    const [cve_clie, setClave] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [rfc, setRfc] = useState("");
    const [calle, setCalle] = useState("");
    const [numExt, setNumExt] = useState("");
    const [numInt, setNumInt] = useState("");
    const [entreCalle, setEntreCalle] = useState("");
    const [colonia, setColonia] = useState("");
    const [referencia, setReferencia] = useState("");
    const [poblacion, setPoblacion] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [estado, setEstado] = useState("");
    const [pais, setPais] = useState("");
    const [municipio, setMunicipio] = useState("");
    const [nacionalidad, setNacionalidad] = useState("");
    const [nombreComercial, setNombreComercial] = useState("");
    const [condicionComercial, setCondicionComercial] = useState("");
    const [diasCredito, setDiasCredito] = useState(0);
    const [estatus, setEstatus] = useState('Activo');  // Corregido el nombre de la variable
    const navigate = useNavigate();

    const { id } = useParams();

    const updateCliente = async (e) => {
        e.preventDefault();
        const clienteRef = doc(db, "CLIENTES", id);
        const datos = {
        id,
        cve_clie,
        razonSocial,
        rfc,
        calle,
        numExt,
        numInt,
        entreCalle,
        colonia,
        referencia,
        poblacion,
        codigoPostal,
        estado,
        pais,
        municipio,
        nacionalidad,
        nombreComercial,
        condicionComercial,
        diasCredito,
        estatus,
        };
        await updateDoc(clienteRef, datos);
        navigate("/");
    };

    const getClienteById = async (id) => {
        const clienteDoc = await getDoc(doc(db, "CLIENTES", id));
        if (clienteDoc.exists()) {
        console.log(clienteDoc.data());
        setClave(clienteDoc.data().cve_clie);
        setRazonSocial(clienteDoc.data().razonSocial);
        setRfc(clienteDoc.data().rfc);
        setCalle(clienteDoc.data().calle);
        setNumExt(clienteDoc.data().numExt);
        setNumInt(clienteDoc.data().numInt);
        setEntreCalle(clienteDoc.data().entreCalle);
        setColonia(clienteDoc.data().colonia);
        setReferencia(clienteDoc.data().referencia);
        setPoblacion(clienteDoc.data().poblacion);
        setCodigoPostal(clienteDoc.data().codigoPostal);
        setEstado(clienteDoc.data().estado);
        setPais(clienteDoc.data().pais);
        setMunicipio(clienteDoc.data().municipio);
        setNacionalidad(clienteDoc.data().nacionalidad);
        setNombreComercial(clienteDoc.data().nombreComercial);
        setCondicionComercial(clienteDoc.data().condicionComercial);
        setDiasCredito(clienteDoc.data().diasCredito);
        setEstatus(clienteDoc.data().estatus);  // Corregido el nombre de la variable
        
        } else {
        console.log("El cliente no existe");
        }
    };

    useEffect(() => {
        getClienteById(id);
    }, [id]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                <h1>Editar Cliente</h1>
                        <form onSubmit={updateCliente}>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                        onClick={()=>cambiarTab("1")}
                        className={(activeTab=="1" ? "activeTab baseTap": "baseTap")}
                        >Información General</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                        onClick={()=>cambiarTab("2")}
                        className={(activeTab=="2" ? "activeTab baseTap": "baseTap")}
                        >Información Comercial</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        
                            <div className="row">
                            
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label className="form-label">Clave</label>
                                        <input
                                            value={cve_clie}
                                            onChange={(e) => setClave(e.target.value)}
                                            type="text"
                                            className="form-control"
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="col-md-9 ">
                                    <div className="mb-3">
                                        <label className="form-label">Razon Social</label>
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={razonSocial}
                                            onChange={(e) => setRazonSocial(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                    <div className="mb-3">
                                        <label className="form-label">RFC</label>
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={rfc}
                                            onChange={(e) => setRfc(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                    <div className="mb-3">
                                        <label className="form-label">Calle</label>
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={rfc}
                                            onChange={(e) => setRfc(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Número Exterior</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={numExt}
                                            onChange={(e) => setNumExt(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Número Interior</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={numInt}
                                            onChange={(e) => setNumInt(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8 ">
                                <label className="form-label">Entre Calle</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={entreCalle}
                                            onChange={(e) => setEntreCalle(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Colonia</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={colonia}
                                            onChange={(e) => setColonia(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-8 ">
                                <label className="form-label">Referencia</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={referencia}
                                            onChange={(e) => setReferencia(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Población</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={poblacion}
                                            onChange={(e) => setPoblacion(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Estado</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Código Postal</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={codigoPostal}
                                            onChange={(e) => setCodigoPostal(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Pais</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={pais}
                                            onChange={(e) => setPais(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Municipio</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={municipio}
                                            onChange={(e) => setMunicipio(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">Nacionalidad</label>
                                    <div class="input-group mb-3">          
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={nacionalidad}
                                        onChange={(e) => setNacionalidad(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        />
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
                                    </div>
                                </div>
                        </div>
                                
                            </div>
                            {/* ... Otras columnas y campos aquí ... */}
                            <div className="buttons-container">
                                <button type="submit" className="btn btn-primary">Editar</button>
                                <Link to="/clientes"><button className="btn btn-danger" >Regresar</button></Link>
                             </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="row">
                            <div className="col-md-9 ">
                                <label className="form-label">Nombre Comercial</label>
                                <div class="input-group mb-3">
                                                
                                <input
                                placeholder="" aria-label="" aria-describedby="basic-addon1"
                                value={nombreComercial}
                                onChange={(e) => setNombreComercial(e.target.value)}
                                type="text"
                                className="form-control"
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button"><FaCircleQuestion /></button>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-3 ">
                                <label className="form-label">Días de Crédito</label>
                                <div class="input-group mb-3">
                                                
                                <input
                                placeholder="" aria-label="" aria-describedby="basic-addon1"
                                value={diasCredito}
                                onChange={(e) => setDiasCredito(e.target.value)}
                                type="number"
                                className="form-control"
                                />
                                </div>
                            </div>
                            <div className="col-md-12 ">
                                <label className="form-label">Condición Comercial</label>
                                <div class="input-group mb-3">
                                                
                                <textarea
                                placeholder="" aria-label="" aria-describedby="basic-addon1"
                                value={condicionComercial}
                                onChange={(e) => setCondicionComercial(e.target.value)}
                                type="number"
                                className="form-control"
                                />
                                </div>
                            </div>
                        </div>            
                    </TabPane>
                </TabContent>
               
                </form>
                </div>
            </div>
        </div>

    );
};

export default EditarCliente;