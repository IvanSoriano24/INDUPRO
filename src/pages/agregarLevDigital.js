import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { TabContent, TabPane, Nav, NavItem, NavLink, Label } from "reactstrap";
import { FaCircleQuestion, FaCirclePlus } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";
import swal from "sweetalert2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { red } from "@mui/material/colors";
import * as XLSX from "xlsx";
import { ModalTitle, Modal, Button } from "react-bootstrap";

const AgregarLevDigital = () => {
  /*----------------------------------------------------------*/
  /*const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Guardar el archivo en el estado
    } else {
      alert("Por favor, selecciona un archivo.");
    }
  };
  const processExcelFile = () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Selecciona la primera hoja
      const sheet = workbook.Sheets[sheetName];

      // Convertir la hoja de cálculo en JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Asegúrate de que las primeras filas son las que contienen los encabezados
      const headers = jsonData[0]; // Primera fila como encabezados

      let isValid = true; // Bandera para verificar la validez de los datos
      let prevPartida = 0; // Variable para almacenar el último número de partida
      const filteredData = jsonData.slice(1).map((row, index) => {
        const noPartida = String(row[0] || "").trim();
        const cantidad = String(row[1] || "").trim();
        const descripcion = String(row[2] || "").trim();
        const observaciones = String(row[3] || "").trim();

        // Validación de secuencialidad del número de partida
        if (parseInt(noPartida) !== prevPartida + 1) {
          isValid = false;
          swal.fire({
            text: `El número de partida no es secuencial en la fila ${
              index + 2
            }.`,
            icon: "error",
          });
          //alert(`El número de partida no es secuencial en la fila ${index + 2}.`);
        }

        // Validación de cantidad (debe ser un número entero)
        if (!Number.isInteger(Number(cantidad)) || cantidad === "") {
          isValid = false;
          swal.fire({
            text: `La cantidad no es un número entero en la fila ${index + 2}.`,
            icon: "error",
          });
          //alert(`La cantidad no es un número entero en la fila ${index + 2}.`);
        }

        prevPartida = parseInt(noPartida);

        return {
          noPartida,
          cantidad,
          descripcion,
          observaciones,
        };
      });
      if (!isValid) {
        return; // Detener el procesamiento si alguna validación falla
      }
      swal.fire(
        "Los datos del archivo Excel son válidos y se han procesado correctamente.",
        {
          icon: "success",
        }
      );
      // Si todos los datos son correctos
      //alert("Los datos del archivo Excel son válidos y se han procesado correctamente.");

      // Actualizar el estado con los datos validados
      setExcelData(filteredData);
    };

    reader.readAsArrayBuffer(selectedFile); // Lee el archivo almacenado en el estado
  };
  const handleAddFromExcel = () => {
    if (excelData.length === 0) {
      alert("No hay datos procesados del archivo.");
      return;
    }

    // Agregar las filas procesadas del archivo a la lista
    setList([...list, ...excelData]);
    setExcelData([]); // Limpiar los datos procesados una vez que se han agregado
  };*/
  const limpiarArchivo = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = ""; // 👈 Limpiar el valor
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile(file); // Guardar el archivo en el estado

        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Selecciona la primera hoja
        const sheet = workbook.Sheets[sheetName];

        // Convertir la hoja de cálculo en JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Asegúrate de que las primeras filas son las que contienen los encabezados
        const headers = jsonData[0]; // Primera fila como encabezados

        let isValid = true; // Bandera para verificar la validez de los datos
        let prevPartida = 0; // Variable para almacenar el último número de partida
        let contador = 0;
        const filteredData = jsonData.slice(1).map((row, index) => {
          const noPartida = String(row[0] || "").trim();
          const cantidad = String(row[1] || "").trim();
          const descripcion = String(row[2] || "").trim();
          const observacion = String(row[3] || "").trim();

          // Validación de secuencialidad del número de partida
          if (parseInt(noPartida) !== prevPartida + 1) {
            isValid = false;
            swal.fire({
              text: `El número de partida no es secuencial en la fila ${index + 2
                }.`,
              icon: "error",
            });
            //alert(`El número de partida no es secuencial en la fila ${index + 2}.`);
          }

          // Validación de cantidad (debe ser un número entero)
          if (!Number.isInteger(Number(cantidad)) || cantidad === "") {
            isValid = false;
            swal.fire({
              text: `La cantidad no es un número entero en la fila ${index + 2
                }.`,
              icon: "error",
            });
            //alert(`La cantidad no es un número entero en la fila ${index + 2}.`);
          }

          prevPartida = parseInt(noPartida);
          contador++;
          return {
            noPartida,
            cantidad,
            descripcion,
            observacion,
          };
        });
        if (!isValid) {
          return; // Detener el procesamiento si alguna validación falla
        }
        swal.fire(
          "Los datos del archivo Excel son válidos y se han procesado correctamente.",
          {
            icon: "success",
          }
        );
        // Si todos los datos son correctos
        //alert("Los datos del archivo Excel son válidos y se han procesado correctamente.");

        // Actualizar el estado con los datos validados
        setExcelData(filteredData);
        setList([...list, ...filteredData]);
        setExcelData([]);

        setNoPartida(idCounter + contador);
        setIdCounter(idCounter + contador);
      };

      reader.readAsArrayBuffer(file); // Lee el archivo almacenado en el estado
    } else {
      alert("Por favor, selecciona un archivo.");
    }
  };
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  /*----------------------------------------------------------*/
  /*----------------------------------------------------------*/
  const [modalNoPartida, setModalNoPartida] = useState(1);
  const [modalDescripcion, setModalDescripcion] = useState("");
  const [modalObservacion, setModalObservacion] = useState("");
  const [modalCantidad, setModalCantidad] = useState("");
  const [idMonday, setIdMonday] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setModalNoPartida(item.noPartida);
    setModalCantidad(item.cantidad);
    setModalDescripcion(item.descripcion);
    setModalObservacion(item.observacion);
    setShow(true);
  };
  const handleEdit = (index) => {
    const item = list[index];
    handleShow(item);
  };
  const guardarEdicion = () => {
    setList((prevList) =>
      prevList.map((item) =>
        item.noPartida === modalNoPartida // Asegúrate de que modalNoPartida tiene el valor correcto
          ? {
            ...item,
            cantidad: modalCantidad,
            descripcion: modalDescripcion,
            observacion: modalObservacion,
          }
          : item
      )
    );
    handleClose();
  };

  /*----------------------------------------------------------*/
  /* ---------------------ENCABEZADO DE DOCUMENTO ------------------------------------- */
  const [cve_levDig, setCve_levDig] = useState("");
  const [folios, setFolios] = useState([]);
  const [selectedFolio, setSelectedFolio] = useState("");
  const [folioSiguiente, setFolioSiguiente] = useState(0);
  const [cve_clie, setCve_clie] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [docAnt, setDocAnt] = useState("N/A");
  const [docSig, setDocSig] = useState("");
  const [estatus, setEstatus] = useState("Activo");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [horaActual, setHoraActual] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const navigate = useNavigate();
  const encabezadoCollection = collection(db, "LEVDIGITAL");
  const parLevDigCollection = collection(db, "PAR_LEVDIGITAL");
  const inputFileRef = useRef(null);
  /* --------------------   Obtener los folios correspondiente  -------------------------- */
  useEffect(() => {
    const obtenerFolios = async () => {
      const foliosCollection = collection(db, "FOLIOS");
      const q = query(foliosCollection, where("documento", "==", "LD"));
      const foliosSnapshot = await getDocs(q);

      const listaFolios = foliosSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          folio: data.folio,
          folioSiguiente: data.folioSiguiente,
        };
      });

      setFolios(listaFolios);

      // Si hay folios y no se ha seleccionado ninguno, tomar el primero por defecto
      if (listaFolios.length > 0 && !selectedFolio) {
        setSelectedFolio(listaFolios[0].folio);
      }
    };

    obtenerFolios();
  }, [selectedFolio]);
  // Se ejecutará solo una vez al cargar el componente

  useEffect(() => {
    // Actualiza el secuencial cuando se selecciona un nuevo folio
    if (selectedFolio) {
      const folioSeleccionado = folios.find(
        (folio) => folio.folio === selectedFolio
      );
      if (folioSeleccionado) {
        setFolioSiguiente(folioSeleccionado.folioSiguiente);
      }
    }
  }, [selectedFolio, folios]);

  /* --------------------  fin de Obtener los folios correspondiente  -------------------------- */
  const obtenerClientePorNombre = async (nombreCliete) => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "CLIENTES"),
        where("razonSocial", "==", nombreCliete)
      )
    );

    if (!querySnapshot.empty) {
      // Si hay resultados, devolver el primer documento encontrado
      const factor = querySnapshot.docs[0].data();
      return factor;
    } else {
      // Si no hay resultados, puedes manejarlo de alguna manera (devolver null, lanzar un error, etc.)
      return null;
    }
  };

  const addEncabezado = async (e) => {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) {
      swal.fire({
        icon: "warning",
        title: "Fechas incompletas",
        text: "Debes seleccionar tanto la fecha de inicio como la fecha de fin antes de continuar.",
      });
      return;
    }

    //ID GS
    if (!idMonday || idMonday.length === 0) {
      swal.fire({
        icon: "warning",
        title: "ID Invalido",
        text: "Ingresa un ID GS valido.",
      });
      return; // 🚨 DETIENE la ejecución aquí si faltan datos
    }

    // Obtener el documento de la colección FOLIOS con el nombre del folio
    const folioSnapshot = await getDocs(
      query(collection(db, "FOLIOS"), where("folio", "==", selectedFolio))
    );
    if (!folioSnapshot.empty) {
      if (!clienteSeleccionado) {
        swal.fire({
          icon: "warning",
          title: "Sin Cliente",
          text: "No se seleccionó ningún cliente.",
        });
        console.error("No se seleccionó ningún cliente.");
        return;
      }
      if (list.length === 0) {
        alert(
          "La lista está vacía. Por favor, agregue elementos antes de continuar."
        );
      } else {
        if (folioSiguiente != 0) {
          // Tomar el primer documento encontrado (suponiendo que hay uno)
          const folioDoc = folioSnapshot.docs[0];
          // Obtener el id del documento
          const folioId = folioDoc.id;
          // Obtener el valor actual de folioSiguiente
          const folioData = folioDoc.data();
          const folioSiguienteActual = folioData.folioSiguiente;
          // Incrementar el valor de "folioSiguiente"
          const nuevoFolioSiguiente = folioSiguienteActual + 1;
          // Actualizar el documento en la colección FOLIOS
          await updateDoc(doc(db, "FOLIOS", folioId), {
            folioSiguiente: nuevoFolioSiguiente,
          });
          const bitacora = collection(db, "BITACORA");
          const today = new Date();
          const ahora = new Date();
          const hora = ahora.getHours();
          const minuto = ahora.getMinutes();
          const segundo = ahora.getSeconds();
          const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
          const horaFormateada = `${hora}:${minuto}:${segundo}`;
          await addDoc(bitacora, {
            cve_Docu: selectedFolio + folioSiguiente.toString(),
            tiempo: horaFormateada,
            fechaRegistro: formattedDate,
            tipoDocumento: "Registro",
            noPartida: "N/A",
          });

          await addDoc(encabezadoCollection, {
            cve_levDig: selectedFolio + folioSiguiente.toString(),
            cve_clie: clienteSeleccionado.cve_clie,
            fechaElaboracion: fechaElaboracion,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            estatus: estatus,
            docAnt: docAnt,
            docSig: docSig,
            idMonday: idMonday,
            fechaRegistro: formattedDate,
            fechaModificacion: formattedDate,
          });

          list.forEach(async (item) => {
            /*console.log(item.noPartida);
            console.log(item.cantidad);
            console.log(item.descripcion);
            console.log(item.observaciones);*/
            await addDoc(bitacora, {
              cve_Docu: selectedFolio + folioSiguiente.toString(),
              tiempo: horaFormateada,
              fechaRegistro: formattedDate,
              tipoDocumento: "Registro de partida",
              noPartida: item.noPartida,
            });
            await addDoc(parLevDigCollection, {
              cve_levDig: selectedFolio + folioSiguiente.toString(),
              noPartida: item.noPartida,
              cantidad: item.cantidad,
              descripcion: item.descripcion,
              observacion: item.observacion,
              fechaRegistro: formattedDate,
              fechaModificacion: formattedDate,
              estatusPartida: "Activa",
            });
          });
          navigate("/levantamientoDigital");
        } else {
          alert("Selecciona un folio valido");
        }
      }
      // Resto del código...
    } else {
      alert("No se seleccionó ningún folio.");
      console.log("No se encontró el documento en la colección FOLIOS.");
    }
  };
  const infoCliente = () => {
    swal({
      title: "Ayuda del sistema",
      text: " El campo cliente te permite ingresar la razón social del cliente. A medida que escribes, el sistema sugiere opciones basadas en clientes existentes. Al seleccionar uno, se asigna automáticamente a los documentos futuros, simplificando el proceso y garantizando consistencia en la información. ",
      icon: "info",
      buttons: "Aceptar",
    });
  };
  const infoFechaElaboracion = () => {
    swal({
      title: "Ayuda del sistema",
      text: " La fecha de elaboración es la fecha en la que se creó el documento y por defecto muestra la fecha de hoy. Sin embargo, es posible modificarla según sea necesario. ",
      icon: "info",
      buttons: "Aceptar",
    });
  };
  const infoFechaInicio = () => {
    swal({
      title: "Ayuda del sistema",
      text: " La fecha de inicio representa el día planificado para comenzar el proyecto. Es importante destacar que esta fecha debe ser igual o posterior a la fecha de elaboración del documento. ",
      icon: "info",
      buttons: "Aceptar",
    });
  };
  const infoFechaFin = () => {
    swal({
      title: "Ayuda del sistema",
      text: " La fecha de fin indica el día previsto para concluir el proyecto. Es esencial tener en cuenta que esta fecha debe ser igual o posterior a la fecha de elaboración del documento y también mayor que la fecha de inicio programada.",
      icon: "info",
      buttons: "Aceptar",
    });
  };
  /* ----------------------------------------- AGREGAR PARTIDAS -------------------------------- */
  /* ---------------------PARTIDAS DE DOCUMENTO ------------------------------------- */
  const [cve_levDig_par, setLevDigital_par] =
    useState("LEV_DIG1"); /* Este es el campo que agregue */
  const [noPartida, setNoPartida] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [list, setList] = useState([]);
  const [idCounter, setIdCounter] = useState(1); // Inicializamos el contador en 1
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    //e.preventDefault();
    if (cantidad <= 0) {
      swal.fire({
        icon: "warning",
        title: "Error Cantidad",
        text: "La cantidad no puede ser menor o igual a 0.",
      });
      return;
    }
    const newItem = {
      cve_levDig: cve_levDig,
      noPartida: noPartida,
      cantidad: cantidad,
      descripcion: descripcion,
      observacion: observacion,
    };
    if (descripcion) {
      if (editIndex !== null) {
        // Si editIndex no es null, significa que estamos editando un elemento existente
        const updatedList = [...list];
        updatedList[editIndex] = newItem;
        setList(updatedList);
        setNoPartida(idCounter);
        setCantidad("");
        setEditIndex(null); // Reiniciamos el índice de edición
        setDescripcion("");
        setObservacion("");
      } else {
        // Si editIndex es null, estamos agregando un nuevo elemento a la lista
        setList([...list, newItem]);
        setNoPartida(idCounter + 1);
        setCantidad("");
        setDescripcion("");
        setObservacion("");
        setIdCounter(idCounter + 1); // Aumentamos el contador
      }
    }
  };
  const handleDelete = (index) => {
    const updatedList = [...list];
    updatedList.splice(index, 1);
    setList(updatedList);
  };

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "CLIENTES"), where("estatus", "==", "Activo"))
        );
        const clientesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientes(clientesData);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    obtenerClientes();
  }, []);

  useEffect(() => {
    // Obtenemos la fecha actual en formato local (YYYY-MM-DD)
    const fechaHoy = new Date().toLocaleDateString("en-CA");
    // Establecemos la fecha de hoy como valor inicial del input
    setFechaElaboracion(fechaHoy);
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Levantamiento Digital {selectedFolio}{folioSiguiente} </h1>
          <div className="row">
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Folio</label>
                <select
                  id="selectFolio"
                  className="form-control"
                  value={selectedFolio || ""}
                  onChange={(e) => setSelectedFolio(e.target.value)}
                >
                  <option value="" disabled>
                    Folio
                  </option>
                  {folios.map((folio) => (
                    <option key={folio.id} value={folio.folio}>
                      {folio.folio}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Folio siguiente: </label>
                <input
                  className="form-control"
                  id="inputFolioSecuencial"
                  type="text"
                  value={`${selectedFolio}${folioSiguiente}`}
                  onChange={(e) => setCve_levDig(e.target.value)}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <div class="input-group-append">
                  <label className="form-label">Cliente: </label>
                  &nbsp; &nbsp;
                  <button
                    class="btn btn-outline-secondary"
                    onClick={infoCliente}
                    type="button"
                  >
                    <FaCircleQuestion />
                  </button>
                </div>
                <Autocomplete
                  className="form-control"
                  options={clientes}
                  getOptionLabel={(cliente) => cliente.razonSocial}
                  onChange={(event, value) => setClienteSeleccionado(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  required
                />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">ID GS: </label>
              <div className="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="text"
                  value={idMonday}
                  onChange={(e) => setIdMonday(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4 ">
              <label className="form-label">Fecha de elaboración: </label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaElaboracion}
                  onChange={(e) => setFechaElaboracion(e.target.value)}
                  className="form-control"
                  required
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    onClick={infoFechaElaboracion}
                  >
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">Fecha de inicio: </label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="form-control"
                  required
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    onClick={infoFechaInicio}
                  >
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">Fecha de fin: </label>
              <div class="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="form-control"
                  required
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    onClick={infoFechaFin}
                  >
                    <FaCircleQuestion />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="row"
            style={{ border: "1px solid #000", marginBottom: "20px" }}
          >
            <div className="col-12">
              <label
                style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}
              >
                Lista de partidas
              </label>
            </div>
            <div className="col-md-4 offset-md-8 mt-3 text-end">
              <div className="mb-3">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="form-control"
                  ref={inputFileRef}
                />
                <button
                  type="button"
                  className="btn btn-danger mt-2"
                  onClick={limpiarArchivo}
                >
                  Limpiar
                </button>
                {/*<button
                  className="btn btn-primary mt-2"
                  onClick={processExcelFile}
                >
                  Procesar Archivo
                </button>
                <button
                  className="btn btn-success mt-2 ms-2"
                  onClick={handleAddFromExcel}
                >
                  Agregar Partidas
                </button>*/}
              </div>
            </div>

            <div className="col-md-2">
              <label className="form-label">No. Partida:</label>
              <div className="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  type="text"
                  value={noPartida}
                  onChange={(e) => setNoPartida(e.target.value)}
                  className="form-control"
                  readOnly
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label">Cantidad:</label>
              <label className="form-label" style={{ color: "red" }}>
                {" "}
                *
              </label>
              <div className="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="form-control"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="col-md-5">
              <label className="form-label">Descripción:</label>
              <label className="form-label" style={{ color: "red" }}>
                {" "}
                *
              </label>
              <div className="input-group mb-3">
                <textarea
                  placeholder=""
                  aria-label=""
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="col-md-5">
              <label className="form-label">Observaciones:</label>
              <div className="input-group mb-3">
                <textarea
                  placeholder=""
                  aria-label=""
                  type="text"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <button className="btn btn-success" onClick={handleSubmit}>
                <CiCirclePlus />
                Agregar tarea
              </button>
            </div>

            <div
              className="col-12"
              style={{
                maxHeight: "240px", // 🔵 Puedes ajustar la altura como tú quieras
                overflowY: "auto", // 🔵 Scroll vertical cuando se necesite
              }}
            >
              <br />
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">No. Partida</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, index) => (
                    <tr key={index}>
                      <td>{item.noPartida}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.observacion}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(index)}
                          className="btn btn-primary"
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(index)}
                          className="btn btn-danger"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p></p>
          <div className="buttons-container">
            <button className="btn btn-success" onClick={addEncabezado}>
              <HiDocumentPlus /> Guardar
            </button>
            <Link to="/levantamientoDigital"><button className="btn btn-danger" >Regresar</button></Link>
          </div>

        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Partida</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>No. Partida</label>
            <input
              type="text"
              className="form-control"
              value={modalNoPartida}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label>Cantidad</label>
            <input
              type="number"
              className="form-control"
              value={modalCantidad}
              onChange={(e) => setModalCantidad(e.target.value)}
              min="1"
            />
          </div>
          <div className="mb-3">
            <label>Descripción</label>
            <textarea
              className="form-control"
              value={modalDescripcion}
              onChange={(e) => setModalDescripcion(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Observaciones</label>
            <textarea
              className="form-control"
              value={modalObservacion}
              onChange={(e) => setModalObservacion(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarEdicion}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default AgregarLevDigital;

/*

 */
