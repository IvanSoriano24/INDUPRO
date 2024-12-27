import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import {TabContent, TabPane, Nav, NavItem, NavLink  } from "reactstrap"
import { FaCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ModalTitle,  Modal, Button  } from "react-bootstrap"
import swal from "sweetalert";
import { CiCirclePlus } from "react-icons/ci";
const AgregarCliente = () => {
    const [activeTab, setActiveTab] = useState("1");

    const cambiarTab = (numeroTab) =>{
        if(activeTab !== numeroTab){
            setActiveTab(numeroTab);
        }
    }
    const[cve_clie, setCve_clie] = useState('')
    const[razonSocial, setRazonSocial] = useState('')
    const[rfc, setRfc] = useState('')
    const[calle, setCalle] = useState('')
    const[numExt, setNumExt] = useState('')
    const[numInt, setNumInt] = useState('')
    const[entreCalle, setEntreCalle] = useState('')
    const[colonia, setColonia] = useState('')
    const[referencia, setReferencia] = useState('')
    const[poblacion, setPoblacion] = useState('')
    const[codigoPostal, setCodigoPostal] = useState('')
    const[estado, setEstado] = useState('')
    const[pais, setPais] = useState('')
    const[municipio, setMunicipio] = useState('')
    const[nacionalidad, setNacionalidad] = useState('')
    const[nombreComercial, setNombreComercial] = useState('')
    const[condicionComercial, setCondicionComercial] = useState('')
    const[diasCredito, setDiasCredito] = useState(0)
    const[estatus, setEstaus] = useState('Activo')
    const navigate = useNavigate()

    const clienteCollecion = collection(db,"CLIENTES")

    const store = async(e) =>{
        e.preventDefault()
        await addDoc( clienteCollecion, { cve_clie: cve_clie, razonSocial: razonSocial,  rfc: rfc, calle: calle, numExt: numExt, numInt: numInt, entreCalle: entreCalle,  colonia: colonia, referencia: referencia, poblacion: poblacion, codigoPostal: codigoPostal, estado: estado, pais: pais, municipio: municipio, nacionalidad: nacionalidad, nombreComercial: nombreComercial, condicionComercial: condicionComercial, diasCredito: diasCredito, estatus: estatus })
        navigate("/")
    }

    const [showModal, setShowModal] = useState(false);
      const [editedData, setEditedData] = useState({});
      const handleEdit = (data) => {
      setEditedData(data);
      setShowModal(true);
      };

      const infoCveCliente=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " La clave del cliente es un identificador único asignado a cada cliente en el sistema. Puede contener caracteres alfanuméricos y no necesariamente debe seguir una secuencia. Aunque es posible manejarla de forma secuencial, no es un requisito obligatorio. La clave del cliente facilita la identificación y gestión de la información de cada cliente de manera precisa y eficiente. " + "\n"+ "\n" + "EJEMPLO: CLIE01", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infonumExt=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El número exterior de la dirección del cliente es el valor numérico que identifica la ubicación específica de la propiedad del cliente en una calle o avenida. Este número, que puede ser un número entero o una combinación alfanumérica. " + "\n"+ "\n", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infonumInt=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El número interior de la dirección del cliente es un dato opcional que indica un detalle adicional sobre la ubicación de la propiedad. Se utiliza cuando una propiedad tiene múltiples unidades o apartamentos. Este número interior puede representar un número de departamento, una letra de unidad, o cualquier otro identificador interno que distinga una subdivisión dentro de la dirección principal.  " + "\n"+ "\n" + "EJEMPLO: Dep 4", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infoRefer=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " La referencia de la dirección es una descripción adicional que ayuda a identificar la ubicación del cliente de manera más precisa. Puede incluir detalles como puntos de referencia cercanos, características distintivas del área o cualquier otra información relevante que facilite encontrar la dirección del cliente.  " + "\n"+ "\n" + "EJEMPLO: Edificio color naranja", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infoPoblacion=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " La población en la dirección del cliente se refiere al nombre de la localidad o ciudad donde se encuentra ubicada la dirección. Es un componente importante de la dirección postal que ayuda a identificar la ubicación geográfica del cliente.  " + "\n"+ "\n" + "EJEMPLO: Ciudad de México", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infoNacionalidad=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " Nacionalidad del cliente en caso de ser una persona física.  " + "\n"+ "\n" + "EJEMPLO: MEXICANA", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
      const infoNombreComercial=()=>{
        swal({
          title: "Ayuda del sistema",
          text: " El nombre comercial de la dirección se refiere a un nombre alternativo que se utiliza para identificar la dirección en términos de negocio o comercio. Puede ser un nombre distinto al de la razón social, y se emplea para propósitos administrativos, comerciales o fiscales, especialmente en situaciones donde se requiere proporcionar un nombre adicional que represente la actividad comercial de la empresa o negocio en esa dirección. .  " + "\n"+ "\n" + "EJEMPLO: COMERCIALIZADORA MEXICANA S.A. DE C.V.", 
          icon: "info",
          buttons: "Aceptar"
        })
      }
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                <Modal show={showModal} onHide={() => setShowModal(false)} className="modal">
              <Modal.Header closeButton>
                <Modal.Title>INFORMACIÓN</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div >
                   <label className="form-label">INFORMACIÓN SOBRE EL NÚMERO EXTERIOR</label>
                  
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button  variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
        
                <h1>Editar cliente</h1>
                        <form onSubmit={store}>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                        onClick={()=>cambiarTab("1")}
                        className={(activeTab=="1" ? "activeTab baseTap": "baseTap")}
                        >Información general</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                        onClick={()=>cambiarTab("2")}
                        className={(activeTab=="2" ? "activeTab baseTap": "baseTap")}
                        >Información comercial</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        
                            <div className="row">
                                <div className="col-md-3">
                                 <label className="form-label">CLAVE</label>
                                    <div className="input-group mb-3">
                                        
                                        <input
                                            value={cve_clie}
                                            onChange={(e) => setCve_clie(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" onClick={infoCveCliente}><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-9 ">
                                    <div className="mb-3">
                                        <label className="form-label">RAZON SOCIAL</label>
                                        
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
                                        <label className="form-label">CALLE</label>
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={calle}
                                            onChange={(e) => setCalle(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">NÚMERO EXTERIOR</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={numExt}
                                            onChange={(e) => setNumExt(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" onClick={infonumExt}><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">NÚMERO INTERIOR</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={numInt}
                                            onChange={(e) => setNumInt(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" onClick={infonumInt}><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8 ">
                                <label className="form-label">ENTRE CALLE</label>
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
                                <label className="form-label">COLONIA</label>
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
                                <label className="form-label">REREFRENCIA</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={referencia}
                                            onChange={(e) => setReferencia(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" onClick={infoRefer}><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">POBLACIÓN</label>
                                    <div class="input-group mb-3">
                                        
                                        <input
                                            placeholder="" aria-label="" aria-describedby="basic-addon1"
                                            value={poblacion}
                                            onChange={(e) => setPoblacion(e.target.value)}
                                            type="text"
                                            className="form-control"
                                        />
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" onClick={infoPoblacion}><FaCircleQuestion /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 ">
                                <label className="form-label">ESTADO</label>
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
                                <label className="form-label">CÓDIGO POSTAL</label>
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
                                <label className="form-label">PAIS</label>
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
                                <label className="form-label">MUNICIPIO</label>
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
                                <label className="form-label">NACIONALIDAD</label>
                                    <div class="input-group mb-3">          
                                        <input
                                        placeholder="" aria-label="" aria-describedby="basic-addon1"
                                        value={nacionalidad}
                                        onChange={(e) => setNacionalidad(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        />
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" onClick={infoNacionalidad}><FaCircleQuestion /></button>
                                    </div>
                                </div>
                        </div>
                                
                            </div>
                            {/* ... Otras columnas y campos aquí ... */}
                            <div className="buttons-container">
                                <button type="submit" className="btn btn-success"><CiCirclePlus/> Agregar</button>
                                <Link to="/clientes"><button className="btn btn-danger" >Regresar</button></Link>
                             </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="row">
                            <div className="col-md-9 ">
                                <label className="form-label">NOMBRE COMERCIAL</label>
                                <div class="input-group mb-3">
                                                
                                <input
                                placeholder="" aria-label="" aria-describedby="basic-addon1"
                                value={nombreComercial}
                                onChange={(e) => setNombreComercial(e.target.value)}
                                type="text"
                                className="form-control"
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={infoNombreComercial}><FaCircleQuestion /></button>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-3 ">
                                <label className="form-label">DÍAS DE CRÉDITO</label>
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
                                <label className="form-label">CONDICIÓN COMERCIAL</label>
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
    )
}

export default AgregarCliente