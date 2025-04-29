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
import { RiFileUserFill } from "react-icons/ri";
import { CiCirclePlus } from "react-icons/ci";
import { ModalTitle, Modal, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2"; // Asegúrate de que esté importado así

const PersonalProyectos = () => {
  const [personal, setPersonal] = useState([]);

  const getPersonal = async () => {
    try {
      const q = query(collection(db, "PERSONAL"), orderBy("CVE_PEPR", "asc")); // Orden ascendente
      const data = await getDocs(q);
      const personalList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
  
      console.log("Datos obtenidos de Firestore:", personalList); // Para depuración
  
      setPersonal(personalList);
    } catch (error) {
      console.error("Error al obtener personal:", error);
      setPersonal([]); // Asegurar que siempre sea un array
    }
  };
  

  /***************************************************************************************************************/
  const [showAddModal, setShowAddModal] = useState(false);
  const [cvePepr, setCvePepr] = useState("");
  const [factor, setFactor] = useState("");
  const [nuevoPersonal, setNuevoPersonal] = useState(""); // Almacena solo el nombre ingresado
  const [salarioDiario, setSalarioDiario] = useState("");
  const [valorHombre, setValorHombre] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false); // Modal para editar
  const [isDetailMode, setIsDetailMode] = useState(false); // Controla si solo es detalle
  const [idPersonal, setIdPersonal] = useState(""); // ID del documento real

  /***************************************************************************************************************/

  /* 
    // No olvides cambiar las referencias a la colección y la función deleteCliente si las utilizas
    const deletePersonal = async (id) => {
        const personalDoc = doc(db, "PERSONAL", id);
        await deleteDoc(personalDoc);
        getPersonal();
    }
    */

  useEffect(() => {
    getPersonal();
  }, []);
  useEffect(() => {
    if (!isNaN(salarioDiario) && !isNaN(factor) && salarioDiario && factor) {
      setValorHombre((parseFloat(salarioDiario) * parseFloat(factor)).toFixed(2));
    } else {
      setValorHombre(0);
    }
  }, [salarioDiario, factor]); // Se ejecuta cada vez que estos valores cambian
  
  /***************************************************************************************************************/
  const obtenerUltimoCvePepr = async () => {
    const q = query(
      collection(db, "PERSONAL"),
      orderBy("CVE_PEPR", "desc"),
      limit(1)
    );
    const result = await getDocs(q);

    if (result.docs.length > 0) {
      const ultimoCvePepr = result.docs[0].data().CVE_PEPR;
      const nuevoCvePepr = (parseInt(ultimoCvePepr) + 1)
        .toString()
        .padStart(2, "0");
      setCvePepr(nuevoCvePepr);
    } else {
      setCvePepr("01");
    }
  };
  const handleOpenModal = async () => {
    await obtenerUltimoCvePepr();
    setNuevoPersonal(""); // Limpiar solo el campo del modal
    setSalarioDiario("");
    setFactor("");
    setValorHombre(0);
    setShowAddModal(true);
  };
  const addPersonal = async () => {
    if (!nuevoPersonal || !salarioDiario || !factor) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de continuar.",
      });
      return;
    }

    try {
      const nuevoPersonalData = {
        CVE_PEPR: cvePepr,
        personal: nuevoPersonal,
        salarioDiario: parseFloat(salarioDiario),
        factor: parseFloat(factor),
        valorHombre: parseFloat(salarioDiario) * parseFloat(factor),
      };

      await addDoc(collection(db, "PERSONAL"), nuevoPersonalData);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El personal ha sido agregado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });

      setShowAddModal(false); // Cierra el modal sin afectar la tabla
      getPersonal(); // Recargar la tabla sin borrar los datos
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar el personal.",
      });
      console.error("Error al guardar:", error);
    }
  };
  const handleOpenEditModal = async (personalId) => {
    if (!personalId) {
      console.error("Error: personalId es undefined o vacío.");
      return;
    }

    try {
      const personalDoc = await getDoc(doc(db, "PERSONAL", personalId));
      if (personalDoc.exists()) {
        const data = personalDoc.data();
        setIdPersonal(personalId); // Guardamos el ID del documento real
        setCvePepr(data.CVE_PEPR);
        setNuevoPersonal(data.personal);
        setSalarioDiario(data.salarioDiario);
        setFactor(data.factor);
        setValorHombre(data.valorHombre);

        setIsDetailMode(false); // Aseguramos que sea modo edición
        setShowEditModal(true); // Mostramos el modal
      } else {
        console.error("El personal no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el personal:", error);
    }
  };
  const updatePersonal = async () => {
    if (!idPersonal || !nuevoPersonal || !salarioDiario || !factor) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos antes de actualizar.",
      });
      return;
    }
  
    try {
      const personalRef = doc(db, "PERSONAL", idPersonal);
      await updateDoc(personalRef, {
        personal: nuevoPersonal,
        salarioDiario: parseFloat(salarioDiario),
        factor: parseFloat(factor),
        valorHombre: parseFloat(salarioDiario) * parseFloat(factor), // Actualiza el valor hombre
      });
  
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El personal ha sido actualizado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });
  
      setShowEditModal(false); // Cierra el modal después de actualizar
      getPersonal(); // Recargar la lista
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el personal.",
      });
      console.error("Error al actualizar:", error);
    }
  };  
  const handleOpenDetalleModal = async (personalId) => {
    if (!personalId) {
      console.error("Error: personalId es undefined o vacío.");
      return;
    }

    try {
      const personalDoc = await getDoc(doc(db, "PERSONAL", personalId));
      if (personalDoc.exists()) {
        const data = personalDoc.data();
        setCvePepr(data.CVE_PEPR);
        setNuevoPersonal(data.personal);
        setSalarioDiario(data.salarioDiario);
        setFactor(data.factor);
        setValorHombre(data.valorHombre);

        setIsDetailMode(true); // Activa el modo detalle (solo lectura)
        setShowEditModal(true); // Muestra el modal en modo detalle
      } else {
        console.error("El personal no existe en Firestore.");
      }
    } catch (error) {
      console.error("Error al obtener el personal:", error);
    }
  };

  /***************************************************************************************************************/
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="col-md-4 ">
            <div className="mb-3">
              <div class="input-group-append">
                <button className="btn btn-success" onClick={handleOpenModal}>
                  <CiCirclePlus /> Agregar Nuevo Personal
                </button>
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Personal</th>
                <th>Salario Diario</th>
                <th>Valor Hombre</th>
                <th>Detalle</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(personal) && personal.length > 0 ? (
                personal.map((persona) => (
                  <tr key={persona.id}>
                    <td>{String(persona.CVE_PEPR)}</td>{" "}
                    {/* Asegurar que sea string */}
                    <td>{String(persona.personal)}</td>{" "}
                    {/* Asegurar que sea string */}
                    <td>
                      {typeof persona.salarioDiario === "number"
                        ? persona.salarioDiario.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        : "No definido"}
                    </td>
                    <td>
                      {typeof persona.valorHombre === "number"
                        ? persona.valorHombre.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        : "No definido"}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOpenDetalleModal(persona.id)}
                      >
                        <FaEye />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOpenEditModal(persona.id)}
                      >
                        <FaPencilAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hay personal registrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/*************************************************************************************************************/}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Personal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Clave</label>
                <input
                  type="text"
                  className="form-control"
                  value={cvePepr}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nuevoPersonal}
                  onChange={(e) => setNuevoPersonal(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Salario Diario</label>
                <input
                  type="number"
                  className="form-control"
                  value={salarioDiario}
                  onChange={(e) => setSalarioDiario(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Factor</label>
                <input
                  type="number"
                  className="form-control"
                  value={factor}
                  onChange={(e) => setFactor(e.target.value)}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Valor Hombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={(salarioDiario * factor).toFixed(2)}
                  readOnly
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={addPersonal}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      {/*************************************************************************************************************/}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isDetailMode ? "Detalles del Personal" : "Editar Personal"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Clave</label>
                <input
                  type="text"
                  className="form-control"
                  value={cvePepr}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nuevoPersonal}
                  onChange={(e) => setNuevoPersonal(e.target.value)}
                  readOnly={isDetailMode} // Bloquear si es modo detalle
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Salario Diario</label>
                <input
                  type="number"
                  className="form-control"
                  value={salarioDiario}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setSalarioDiario(value >= 0 ? value : 0); // Si es negativo, lo establece en 0
                  }}
                  min="1"
                  readOnly={isDetailMode}
                  
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Factor</label>
                <input
                  type="number"
                  className="form-control"
                  value={factor}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setFactor(value >= 0 ? value : 0); // Si es negativo, lo establece en 0
                  }}
                  min="1"
                  readOnly={isDetailMode}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Valor Hombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={valorHombre}
                  readOnly
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cerrar
          </Button>
          {!isDetailMode && (
            <Button variant="primary" onClick={updatePersonal}>
              Guardar Cambios
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PersonalProyectos;
