import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { db } from "../firebaseConfig/firebase";

const AgregarPartidasLevDig = () => {
  const [cve_levDig, setCve_levDigital] = useState("LEV_DIG1");
  const [noPartida, setNoPartida] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [list, setList] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const [editIndex, setEditIndex] = useState(null);
  const [parLevDigData, setParLevDigData] = useState([]); // Nuevo estado para los datos de PAR_LEVDIG

  const [levDigital, setLevDigital] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await db
          .collection("PAR_LEVDIGITAL")
          .where("cve_levdig", "==", "LEV_DIG1")
          .get();

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setParLevDigData(data);
      } catch (error) {
        console.error("Error fetching PAR_LEVDIG data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      cve_levDig: cve_levDig,
      noPartida: noPartida,
      descripcion: descripcion,
      observacion: observacion,
    };
    if (editIndex !== null) {
      const updatedList = [...list];
      updatedList[editIndex] = newItem;
      setList(updatedList);
      setNoPartida(idCounter);
      setEditIndex(null);
      setDescripcion("");
      setObservacion("");
    } else {
      setList([...list, newItem]);
      setNoPartida(idCounter + 1);
      setDescripcion("");
      setObservacion("");
      setIdCounter(idCounter + 1);
    }
  };

  const handleEdit = (index) => {
    const itemToEdit = list[index];
    setNoPartida(itemToEdit.noPartida);
    setDescripcion(itemToEdit.descripcion);
    setObservacion(itemToEdit.observacion);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = [...list];
    updatedList.splice(index, 1);
    setList(updatedList);
  };

  return (
    <div className="row">
      <form>
        {/* ... (Código del formulario) */}
      </form>
      <div>
        <br />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">No. PARTIDA</th>
              <th scope="col">DESCRIPCIÓN</th>
              <th scope="col">OBSERVACIONES</th>
              <th scope="col">EDITAR</th>
              <th scope="col">ELIMINAR</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapeo de datos de PAR_LEVDIG */}
            {parLevDigData.map((item, index) => (
              <tr key={`parLevDig_${index}`}>
                <td>{item.noPartida}</td>
                <td>{item.descripcion}</td>
                <td>{item.observacion}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>
                    <FaPencilAlt />
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(index)}>
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
            {/* Mapeo de datos de la lista actual */}
            {list.map((item, index) => (
              <tr key={index}>
                <td>{item.noPartida}</td>
                <td>{item.descripcion}</td>
                <td>{item.observacion}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>
                    <FaPencilAlt />
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(index)}>
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgregarPartidasLevDig;
