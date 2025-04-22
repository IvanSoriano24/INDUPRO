import React, { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import Swal from "sweetalert2";
import { ModalTitle, Modal, Form, Button } from "react-bootstrap";

const Contactos = () => {
  const [contactos, setContactos] = useState([]);

  const getContactos = async () => {
    const data = await getDocs(collection(db, "CONTACTOS")); // Cambiado a "CLIENTES"
    const contactosList = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setContactos(contactosList);
  };

  /*const deleteCliente = async (id) => {
       const ClienteDoc =  doc(db, "CLIENTES", id)
       await deleteCliente(ClienteDoc)
       getClientes()
    }*/

  /***********************************************************************************/
  const [showAddModalAC, setShowAddModalAC] = useState(false);

  const { id } = useParams();

  const [cve_clie, setClave] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const navigate = useNavigate();

  const [isDetailMode, setIsDetailMode] = useState(false);
  

  /***********************************************************************************/

  useEffect(() => {
    getContactos(); // Cambiado a "getClientes"
  }, []);
  //console.log(clientes);

  /*************************************************************************************************/
  const updateContacto = async () => {
    if (!idCliente || !nombre || !telefono || !correo) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de actualizar.",
      });
      return;
    }

    try {
      const contactoRef = doc(db, "CONTACTOS", idCliente);
      await updateDoc(contactoRef, {
        nombre: nombre,
        telefono: telefono,
        correo: correo,
      });

      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El contacto se ha actualizado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });

      handleCloseContacto(); // Cierra el modal después de actualizar
      getContactos(); // Recarga los contactos para mostrar los cambios
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el contacto.",
      });
      console.error("Error al actualizar el contacto:", error);
    }
  };
  /*************************************************************************************************/
  const handleCloseContacto = () => {
    setNombre(""); // Limpia el número de partida
    setTelefono(""); // Limpia el trabajador seleccionado
    setCorreo(""); // Limpia la cantidad de trabajadores
    setShowAddModalAC(false); // Cierra el modal
  };
  const handleOpenEditModal = async (contactoId) => {
    if (!contactoId) {
      console.error("Error: contactoId es undefined o vacío.");
      return;
    }

    try {
      const contactoDoc = await getDoc(doc(db, "CONTACTOS", contactoId));
      if (contactoDoc.exists()) {
        const data = contactoDoc.data();
        setClave(data.cve_clie);
        setNombre(data.nombre);
        setTelefono(data.telefono);
        setCorreo(data.correo);
        setIdCliente(contactoId); // Guardamos el ID para la actualización

        setIsDetailMode(false);
        setShowAddModalAC(true); // Muestra el modal en modo edición
      } else {
        console.error("El contacto no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el contacto:", error);
    }
  };
  const handleOpenDetalleModal = async (contactoId) => {
    if (!contactoId) {
      console.error("Error: contactoId es undefined o vacío.");
      return;
    }
  
    try {
      const contactoDoc = await getDoc(doc(db, "CONTACTOS", contactoId));
      if (contactoDoc.exists()) {
        const data = contactoDoc.data();
        setClave(data.cve_clie);
        setNombre(data.nombre);
        setTelefono(data.telefono);
        setCorreo(data.correo);
        setIdCliente(contactoId);
  
        setIsDetailMode(true); // Activamos modo detalle (solo lectura)
        setShowAddModalAC(true); // Mostramos el modal
      } else {
        console.error("El contacto no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el contacto:", error);
    }
  };  
  /*************************************************************************************************/
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Correo</th>
                <th>Detalle</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((contactos) => (
                <tr>
                  <td>{contactos.nombre}</td>
                  <td>{contactos.telefono}</td>
                  <td>{contactos.correo}</td>
                  <td>
                  <button
                      className="btn btn-primary"
                      onClick={() => handleOpenDetalleModal(contactos.id)}
                    >
                      <FaEye />
                      </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpenEditModal(contactos.id)}
                    >
                      <FaPencilAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/**************************************************************/}
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
                    readOnly={isDetailMode}
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
                    readOnly={isDetailMode}
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
                    readOnly={isDetailMode}
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
          <Button variant="primary" onClick={updateContacto} hidden={isDetailMode}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Contactos;
