import React, { useState } from "react";

const AgregarLevDigital = () => {
  const [task, setTask] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [list, setList] = useState([]);
  const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: idCounter,
      task: task,
      descripcion: descripcion,
    };

    if (task) {
      setList([...list, newItem]);
      setTask("");
      setIdCounter(idCounter + 1); // Aumentamos el contador
    }
  };

  return (
    <div className="prueba">
      <h1>TO-DO LIST</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Tarea"
        />
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />
        <button>Agregar tarea</button>
      </form>
      <div>
        {list.map((item) => (
          <div key={item.id}>
            <label>{item.id}</label>
            <label>{item.task}</label>
            <label>{item.descripcion}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgregarLevDigital;
