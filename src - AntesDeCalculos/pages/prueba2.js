import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';


const Prueba2 = () => {

    const [showModal, setShowModal] = useState(false);
const [editedData, setEditedData] = useState({});
const handleEdit = (data) => {
    setEditedData(data);
    setShowModal(true);
  };
  
  
  return (
    <div className="prueba">
        <Modal show={showModal} onHide={() => setShowModal(false)} className="modal">
              <Modal.Header closeButton>
                <Modal.Title>Editar partida</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col-md-6">
                  <div className="mb-3">
                   <label className="form-label">DESCRIPCIÓN</label>
                    <input
                    className="form-control"
                    />  
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button  variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
          
        <h1>Hola </h1>
        <button onClick={() => handleEdit()}>Editar</button>
    </div>
    );
};

export default Prueba2;
