import React, { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc, addDoc } from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import Swal from "sweetalert2";
import { ModalTitle, Modal, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showAddModalAC, setShowAddModalAC] = useState(false);

  const { id } = useParams();

  const [cve_clie, setClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const navigate = useNavigate();

  const getClientes = async () => {
    const data = await getDocs(collection(db, "CLIENTES")); // Cambiado a "CLIENTES"
    const clienteList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setClientes(clienteList);
  };

  /*const deleteCliente = async (id) => {
       const ClienteDoc =  doc(db, "CLIENTES", id)
       await deleteCliente(ClienteDoc)
       getClientes()
    }*/

  useEffect(() => {
    getClientes(); // Cambiado a "getClientes"
  }, []);

  //console.log(clientes);
  /*************************************************************************************************/
  const store = async () => {
    // Validaciones básicas
    if (!cve_clie || !nombre || !telefono || !correo) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de continuar.",
      });
      return;
    }
  
    try {
      const nuevoContacto = {
        cve_clie: cve_clie, // Clave del cliente asociada
        nombre: nombre,
        telefono: telefono,
        correo: correo,
        fecha_creacion: new Date(), // Guarda la fecha de creación
      };
  
      // Agregar contacto a Firestore
      await addDoc(collection(db, "CONTACTOS"), nuevoContacto);
  
      // Mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El contacto se ha agregado correctamente.",
        showConfirmButton: false,
        timer: 2000, // Cierra automáticamente en 2 segundos
      });
  
      // Cerrar el modal después de guardar
      handleCloseContacto();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el contacto.",
      });
      console.error("Error al guardar el contacto:", error);
    }
  };
  /*************************************************************************************************/
  const handleCloseContacto = () => {
    setNombre(""); // Limpia el número de partida
    setTelefono(""); // Limpia el trabajador seleccionado
    setCorreo(""); // Limpia la cantidad de trabajadores
    setShowAddModalAC(false); // Cierra el modal
  };
  const handleOpenModalAC = async (clienteId) => {
    if (!clienteId) {
      console.error("Error: clienteId es undefined o vacío.");
      return;
    }
  
    try {
      const clienteDoc = await getDoc(doc(db, "CLIENTES", clienteId));
      if (clienteDoc.exists()) {
        setClave(clienteDoc.data().cve_clie);
        setIdCliente(clienteId); // Guarda el ID del cliente
        setShowAddModalAC(true); // Muestra el modal
      } else {
        console.error("El cliente no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el cliente:", error);
    }
  };  
  /*************************************************************************************************/
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="col-md-4 ">
            <div className="mb-3">
              <div class="input-group-append">
                <Link to="/agregarCliente">
                  <button class="btn btn-success" type="button">
                    <CiCirclePlus /> Agregar Nuevo Cliente{" "}
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Razón Social</th>
                <th>Calle</th>
                <th>CP</th>
                <th>Colonia</th>
                <th>Estado</th>
                <th>Municipio</th>
                <th>Estatus</th>
                <th>Detalle</th>
                <th>Editar</th>
                <th>Agregar Contacto</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr>
                  <td>{cliente.cve_clie}</td>
                  <td>{cliente.razonSocial}</td>
                  <td>{cliente.calle}</td>
                  <td>{cliente.codigoPostal}</td>
                  <td>{cliente.colonia}</td>
                  <td>{cliente.estado}</td>
                  <td>{cliente.municipio}</td>
                  <td>{cliente.estatus}</td>
                  <td>
                    <Link
                      to={`/visualizarCliente/${cliente.id}`}
                      class="btn btn-primary"
                    >
                      <FaEye />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/editarCliente/${cliente.id}`}
                      class="btn btn-primary"
                    >
                      <FaPencilAlt />
                    </Link>
                  </td>
                  {/*<td>
                    <Link
                      to={`/agregarContacto/${cliente.id}`}
                      className="btn btn-success"
                    >
                      <RiFileUserFill />
                    </Link>
                  </td>*/}
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleOpenModalAC(cliente.id)}
                    >
                      <RiFileUserFill />{" "}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/********************************************************************************************************/}
      <Modal
        show={showAddModalAC}
        onHide={handleCloseContacto} // Ahora limpia al cerrar
        centered
        
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Contacto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <label>Clave</label>
                  <input
                    value={cve_clie}
                    onChange={(e) => setClave(e.target.value)}
                    type="text"
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-6">
                  <label className="form-label">Nombre</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Telefono</label>
                <div className="input-group mb-3">
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Correo</label>
                <div className="input-group mb-3">
                  <input
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseContacto}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={store}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Clientes;
