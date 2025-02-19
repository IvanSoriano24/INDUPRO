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
import { Link } from "react-router-dom";
import { FaPencilAlt, FaEye } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

const Tipo = () => {
  const [tipo, setTipo] = useState([]);

  const getTipo = async () => {
    try {
      const q = query(collection(db, "TIPOSSERVICIOS"), orderBy("cve_tise", "asc"));
      const data = await getDocs(q);
      const serviciosList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTipo(serviciosList);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      setTipo([]);
    }
  };

  const [cve_tise, setCve_tise] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [idServicio, setIdServicio] = useState("");

  useEffect(() => {
    getTipo();
  }, []);

  const obtenerUltimoCveTise = async () => {
    try {
      const q = query(collection(db, "TIPOSSERVICIOS"), orderBy("cve_tise", "desc"), limit(1));
      const result = await getDocs(q);
      if (result.docs.length > 0) {
        const ultimoCveTise = result.docs[0].data().cve_tise;
        setCve_tise((parseInt(ultimoCveTise) + 1).toString().padStart(2, "0"));
      } else {
        setCve_tise("01");
      }
    } catch (error) {
      console.error("Error al obtener el último cve_tise:", error);
    }
  };

  const handleOpenModal = async () => {
    await obtenerUltimoCveTise();
    setNombre("");
    setDescripcion("");
    setShowAddModal(true);
  };

  const store = async () => {
    if (!cve_tise || !nombre || !descripcion) {
      Swal.fire("Campos incompletos", "Por favor, completa todos los campos.", "warning");
      return;
    }

    try {
      await addDoc(collection(db, "TIPOSSERVICIOS"), { cve_tise, nombre, descripcion });
      Swal.fire("¡Éxito!", "El servicio ha sido agregado correctamente.", "success");
      setShowAddModal(false);
      getTipo();
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al agregar el servicio.", "error");
      console.error("Error al guardar:", error);
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
        setIdServicio(tipoId);
        setCve_tise(data.cve_tise);
        setNombre(data.nombre);
        setDescripcion(data.descripcion);
        setIsDetailMode(false);
        setShowEditModal(true);
      } else {
        console.error("El servicio no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el servicio:", error);
    }
  };

  const updateServicio = async () => {
    if (!idServicio || !nombre || !descripcion) {
      Swal.fire("Campos incompletos", "Por favor, completa todos los campos antes de actualizar.", "warning");
      return;
    }

    try {
      await updateDoc(doc(db, "TIPOSSERVICIOS", idServicio), { nombre, descripcion });
      Swal.fire("¡Actualizado!", "El servicio ha sido actualizado correctamente.", "success");
      setShowEditModal(false);
      getTipo();
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al actualizar el servicio.", "error");
      console.error("Error al actualizar el servicio:", error);
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
        setIsDetailMode(true);
        setShowEditModal(true);
      } else {
        console.error("El servicio no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el servicio:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <button className="btn btn-success mb-3" onClick={handleOpenModal}>
            <CiCirclePlus /> Agregar nuevo servicio
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Detalle</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {tipo.map((tipo) => (
                <tr key={tipo.id}>
                  <td>{tipo.cve_tise}</td>
                  <td>{tipo.nombre}</td>
                  <td>{tipo.descripcion}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleOpenDetalleModal(tipo.id)}>
                      <FaEye />
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleOpenEditModal(tipo.id)}>
                      <FaPencilAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>Clave</label>
            <input type="text" className="form-control mb-2" value={cve_tise} readOnly />
            <label>Nombre</label>
            <input type="text" className="form-control mb-2" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <label>Descripción</label>
            <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={store}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Editar / Detalle */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isDetailMode ? "Detalles del Servicio" : "Editar Servicio"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>Clave</label>
            <input type="text" className="form-control mb-2" value={cve_tise} readOnly />
            <label>Nombre</label>
            <input type="text" className="form-control mb-2" value={nombre} onChange={(e) => setNombre(e.target.value)} readOnly={isDetailMode} />
            <label>Descripción</label>
            <textarea className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} readOnly={isDetailMode} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cerrar</Button>
          {!isDetailMode && <Button variant="primary" onClick={updateServicio}>Guardar Cambios</Button>}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tipo;
