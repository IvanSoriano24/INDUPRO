import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  orderBy,
  limit,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { RiFileUserFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import Swal from "sweetalert2";
import { ModalTitle, Modal, Form, Button } from "react-bootstrap";

const Tipo = () => {
  const [tipo, setTipo] = useState([]);

  const getTipo = async () => {
    const data = await getDocs(collection(db, "TIPOSSERVICIOS")); // Cambiado a "CLIENTES"
    const serviciosList = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTipo(serviciosList);
  };

  const [cve_tise, setCve_tise] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

  /***********************************************************************************************/
  const [showAddModalTp, setShowAddModalTp] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [idServicio, setIdServicio] = useState(""); // Guardar el ID del documento real
  /***********************************************************************************************/

  /*const deleteCliente = async (id) => {
       const ClienteDoc =  doc(db, "CLIENTES", id)
       await deleteCliente(ClienteDoc)
       getClientes()
    }*/

  useEffect(() => {
    getTipo(); // Cambiado a "getClientes"
  }, []);
  /***********************************************************************************************/
  const store = async () => {
    if (!cve_tise || !nombre || !descripcion) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de continuar.",
      });
      return;
    }

    try {
      const nuevoServicio = {
        cve_tise: cve_tise, // Clave generada automáticamente
        nombre: nombre,
        descripcion: descripcion,
      };

      // Agregar nuevo servicio a Firestore
      await addDoc(collection(db, "TIPOSSERVICIOS"), nuevoServicio);

      // Mensaje de éxito con SweetAlert
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El servicio se ha agregado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });

      handleCloseTp(); // Cierra el modal después de guardar
      getTipo(); // Recargar la lista de servicios
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el servicio.",
      });
      console.error("Error al guardar el servicio:", error);
    }
  };
  /***********************************************************************************************/
  const handleCloseTp = () => {
    setNombre(""); // Limpia el número de partida
    setDescripcion(""); // Limpia el trabajador seleccionado
    setShowAddModalTp(false); // Cierra el modal
  };
  const handleOpenModalTp = async () => {
    try {
      // Consulta Firestore para obtener el último código de servicio
      const q = query(
        collection(db, "TIPOSSERVICIOS"),
        orderBy("cve_tise", "desc"),
        limit(1)
      );
      const result = await getDocs(q);

      if (result.docs.length > 0) {
        const ultimoCveTise = result.docs[0].data().cve_tise;
        // Incrementar el valor de la clave y asegurarse de que tenga dos dígitos
        const nuevoCveTise = (parseInt(ultimoCveTise) + 1)
          .toString()
          .padStart(2, "0");
        setCve_tise(nuevoCveTise);
      } else {
        // Si no hay registros, comenzar desde "01"
        setCve_tise("01");
      }

      // Limpia los campos antes de abrir el modal
      setNombre("");
      setDescripcion("");
      setIsUpdateMode(false); // Asegurar que está en modo agregar

      setShowAddModalTp(true); // Mostrar el modal
    } catch (error) {
      console.error("Error al obtener el último cve_tise:", error);
    }
  };
  const updateServicio = async () => {
    if (!idServicio || !nombre || !descripcion) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de actualizar.",
      });
      return;
    }

    try {
      const servicioRef = doc(db, "TIPOSSERVICIOS", idServicio); // Usamos el ID correcto
      await updateDoc(servicioRef, {
        nombre: nombre,
        descripcion: descripcion,
      });

      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El servicio ha sido actualizado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });

      handleCloseTp(); // Cierra el modal después de actualizar
      getTipo(); // Recargar la lista de servicios actualizados
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el servicio.",
      });
      console.error("Error al actualizar el servicio:", error);
    }
  };
  const handleOpenEditModal = async (tipoId) => {
    if (!tipoId) {
      console.error("Error: tipoId es undefined o vacío.");
      return;
    }

    try {
      const servicioDoc = await getDoc(doc(db, "TIPOSSERVICIOS", tipoId));
      if (servicioDoc.exists()) {
        const data = servicioDoc.data();
        setIdServicio(tipoId); // Guardamos el ID del documento real
        setCve_tise(data.cve_tise);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);

        setIsUpdateMode(true); // Activa el modo edición
        setShowAddModalTp(true); // Muestra el modal
      } else {
        console.error("El servicio no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el servicio:", error);
    }
  };
  const handleOpenDetalleModal = async (tipoId) => {
    if (!tipoId) {
      console.error("Error: tipoId es undefined o vacío.");
      return;
    }

    try {
      const servicioDoc = await getDoc(doc(db, "TIPOSSERVICIOS", tipoId));
      if (servicioDoc.exists()) {
        const data = servicioDoc.data();
        setCve_tise(data.cve_tise);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);

        setIsUpdateMode(false); // Desactiva el modo edición
        setIsDetailMode(true); // Activamos modo detalle (solo lectura)
        setShowAddModalTp(true); // Muestra el modal en modo detalle
      } else {
        console.error("El servicio no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el servicio:", error);
    }
  };
  /*****************************************************************************************/
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="col-md-4 ">
            <div className="mb-3">
              <div class="input-group-append">
                <button
                  className="btn btn-success"
                  onClick={() => handleOpenModalTp()}
                >
                  <CiCirclePlus /> Agregar nuevo servicio
                </button>
                {/*<Link to="/agregarTipo">
                  <button class="btn btn-success" type="button">
                    <CiCirclePlus /> Agregar nuevo servicio
                  </button>
                </Link>*/}
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Nombre</th>
                <th>descripción</th>
                <th>Detalle</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {tipo.map((tipo) => (
                <tr>
                  <td>{tipo.cve_tise}</td>
                  <td>{tipo.nombre}</td>
                  <td>{tipo.descripcion}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpenDetalleModal(tipo.id)}
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpenEditModal(tipo.id)}
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
      <Modal
        show={showAddModalTp}
        onHide={handleCloseTp} // Ahora limpia al cerrar
        centered
        scrollable
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Modificacion de Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">CLAVE</label>
                  <input
                    value={cve_tise}
                    type="text"
                    className="form-control"
                    readOnly // Bloquear el campo para evitar edición manual
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">NOMBRE</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    className="form-control"
                    readOnly={!isUpdateMode}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-10">
                <div className="mb-3">
                  <label className="form-label">DESCRIPCIÓN</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="form-control"
                    readOnly={!isUpdateMode}
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTp}>
            Cancelar
          </Button>
          {!isUpdateMode ? (
            <Button variant="primary" onClick={store} hidden={isDetailMode}>
              Guardar
            </Button>
          ) : (
            <Button variant="primary" onClick={updateServicio}>
              Editar
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tipo;
