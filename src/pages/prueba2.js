import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "../Modal.css"

export default function Prueba2() {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal)
  };

  return (
    <>
    <button onClick={toggleModal} className='btn-modal'>
    Open
    </button>
    {modal && (
      <div >
      <div onClick={toggleModal} className='overlay'></div>
        <div className='modal-content'>
          <h2>Hola mundo</h2>
          <div className="col-md-4 ">
                  <label className="form-label">CLIENTE</label>
                  <div class="input-group mb-3">            
                      <input
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="text"
                      className="form-control"                    
                      />
                  </div>
              </div>
          <button className='close-modal' onClick={toggleModal}>X</button>
        </div>
      
    </div>
    )}
    
    </>
  );
};

