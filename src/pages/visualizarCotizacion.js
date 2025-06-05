import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import encabezadoPDF from "../imagenes/nuevoEncabezado.png";
import { VscFilePdf } from "react-icons/vsc";
import { FaFileDownload } from "react-icons/fa";
import swal from "sweetalert2";
import axios from "axios";
import { ModalTitle, Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { FaDatabase } from "react-icons/fa";
import { NumerosALetras } from "numero-a-letras";
import { FaCheckCircle } from "react-icons/fa";

const VisualizarCotizacion = () => {
  const  [acuerdoComercial, setAcuerdoComercial] = useState("");
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [cve_tecFin, setCve_tecFin] = useState("");
  const [folioSae, setFolioSae] = useState("");
  const [cve_clie, setCve_clie] = useState("");
  const [fechaElaboracion, setFechaElaboracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [iva, setIva] = useState("");
  const [subtotal, setSubTotal] = useState("");
  const [total, setTotal] = useState("");
  const [cotizacionLista, setCotizacionLista] = useState([]);
  const [parCotizacionLista, setParCotizacionLista] = useState([]);
  const [clienteLista, setClienteLista] = useState([]);
  /******************************************** SAE  *****************************************************************/
  const [folioSig, setFolioSig] = useState("");
  const [cve_int, setCve_int] = useState("");
  const [valoresArticulo, seValoresArticulo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCve_int, setSelectedCve_int] = useState("");
  const [cliente, setCliente] = useState("");
  const [clientes, setClientes] = useState([]);

  /******************************************** SAE  *****************************************************************/
  /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
  const navigate = useNavigate();
  const { id } = useParams();
  const [idMonday, setIdMonday] = useState("");

  /* ---------------------JALAR INFORMACIÓN DE DOCUMENTO ANTERIOR ------------------------------------- */
  const getFactoresById = async (id) => {
    const factoresDOC = await getDoc(doc(db, "COTIZACION", id));
    if (factoresDOC.exists()) {
      setCve_tecFin(factoresDOC.data().cve_tecFin);
      setCve_clie(factoresDOC.data().cve_clie);
      setCve_int(factoresDOC.data().cve_int);
      setFechaElaboracion(factoresDOC.data().fechaElaboracion);
      setFechaInicio(factoresDOC.data().fechaInicio);
      setFechaFin(factoresDOC.data().fechaFin);
      setSubTotal(factoresDOC.data().subtotal);
      setIva(factoresDOC.data().IVA);
      setTotal(factoresDOC.data().total);
      setIdMonday(factoresDOC.data().idMonday);

      setAcuerdoComercial(factoresDOC.data().acuerdoComercial);

    } else {
      console.log("El personals no existe");
    }
  };

  useEffect(() => {
    getFactoresById(id);
  }, [id]);

  /* --------------------- JALAR INFORMACIÓN DE PARTIDAS ANTERIORES ------------------------------------- */
  const getParPreCot = async () => {
    try {
      const data = await getDocs(
        query(
          collection(db, "PAR_COTIZACION"),
          where("cve_tecFin", "==", cve_tecFin)
        )
      );

      const par_preCotList = data.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) => Number(a.noPartidaATF) - Number(b.noPartidaATF)); // 🔧 Orden numérico

      setParCotizacionLista(par_preCotList);
    } catch (error) {
      console.error("Error fetching PAR_COTIZACION data:", error);
    }
  };

  useEffect(() => {
    getParPreCot();
  }, [cve_tecFin]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

  const getCliente = async () => {
    try {
      const data = await getDocs(
        query(collection(db, "CLIENTES"), where("cve_clie", "==", cve_clie))
      );
      //par_preCotList
      const par_preCotList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setClienteLista(par_preCotList);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
    }
  };

  useEffect(() => {
    getCliente();
  }, [cve_clie]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect


  const generarPDF = async (accion = "open") => {
    try {
      const getAcuerdoComercialSnapshot = await getDocs(
          query(
              collection(db, "COTIZACION"),
              where("cve_clie", "==", cve_clie),
              where("cve_tecFin", "==", cve_tecFin),
              where("estatus", "==", "Activo")
          )
      );

      let acuerdoTexto = "Sin acuerdo";
      if (!getAcuerdoComercialSnapshot.empty) {
        const docData = getAcuerdoComercialSnapshot.docs[0].data();
        acuerdoTexto = docData.acuedoComercial ?? "Sin acuerdo";
      } else {
        //console.log("No hay documento con cve_clie y cve_tecFin activos");
      }


      const img = new Image();
      img.src = encabezadoPDF;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const base64Image = canvas.toDataURL("image/png");
        const fechaFormateada = new Date(fechaElaboracion).toLocaleDateString("es-ES");
        let enLetras = NumerosALetras(total).toUpperCase();
        enLetras = enLetras.replace(/\bDE\b/g, "").replace(/\s{2,}/g, " ");
        console.log(enLetras);

        const documentDefinition = {
          pageMargins: [40, 160, 40, 40],
          header: {
            margin: [0, 0, 0, 0],
            image: base64Image,
            width: 600,
            height: 150,
          },
          content: [
            {
              columns: [
                {
                  width: "50%",
                  stack: [
                    {
                      text: "Información del cliente:",
                      fontSize: 12,
                      bold: true,
                    },
                    {
                      text: `${clienteLista[0].razonSocial} (${clienteLista[0].cve_clie})\nCalle: ${clienteLista[0].calle} Int: ${clienteLista[0].numInt}, Col: ${clienteLista[0].colonia}\n${clienteLista[0].municipio}, cp: ${clienteLista[0].codigoPostal}, estado: ${clienteLista[0].estado}, RFC: ${clienteLista[0].rfc}`,
                      fontSize: 8,
                    },
                  ],
                },
                {
                  width: "50%",
                  stack: [
                    {
                      text: "\nFecha de elaboración: " + fechaFormateada,
                      fontSize: 10,
                      alignment: "right",
                    },
                  ],
                },
              ],
              margin: [0, 20, 0, 0],
            },
            {
              margin: [0, 10, 0, 0],
              text: `Estimado cliente, nos es grato presentar la propuesta de servicios de ${nombreProyecto}, agradecemos de manera anticipada sus atenciones esperando poder contar con su Vo.Bo.`,
              fontSize: 9,
              bold: true,
            },
            ...parCotizacionLista
                .map((item) => ({
                  unbreakable: true,
                  stack: [
                    {
                      text: "Partida: " + item.noPartidaATF,
                      fontSize: 12,
                      bold: true,
                      alignment: "left",
                      margin: [0, 10, 0, 0],
                    },
                    {
                      margin: [0, 5, 0, 0],
                      table: {
                        headerRows: 1,
                        widths: ["*"],
                        body: [
                          [
                            {
                              text: "Descripción",
                              bold: true,
                              fontSize: 12,
                              alignment: "center",
                              fillColor: "#eeeeee",
                            },
                          ],
                          [item.descripcion],
                          [
                            {
                              text: "Observaciones",
                              bold: true,
                              fontSize: 12,
                              alignment: "center",
                              fillColor: "#eeeeee",
                            },
                          ],
                          [item.observacion],
                        ],
                      },
                      layout: "noBorders",
                    },
                    {
                      text: "Importe: " + item.totalPartida.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      }),
                      fontSize: 14,
                      bold: true,
                      alignment: "right",
                      margin: [0, 10, 0, 0],
                    },
                  ],
                })),
            {
              text: "\n\nImporte: " + subtotal.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 3, 0, 0],
              text: "IVA: " + iva.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 3, 0, 0],
              text: "Total: " + total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 3, 0, 0],
              text: enLetras,
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 20, 0, 0],
              text: "Condición comercial",
              fontSize: 14,
              bold: true,
            },
            {
              margin: [0, 5, 0, 0],
              text: acuerdoTexto,
              fontSize: 12,
            },
          ],
        };
        // Acción: abrir o descargar
        const pdf = pdfMake.createPdf(documentDefinition);
        accion === "download" ? pdf.download(cve_tecFin + ".pdf") : pdf.open();
      };

      img.onerror = (error) => {
        console.error("Error al cargar la imagen:", error);
      };
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  const validarYGenerarPDF = (accion) => {
    if (!nombreProyecto.trim()) {
      swal.fire({
        icon: "error",
        title: "Campo requerido",
        text: "Debes ingresar el nombre del proyecto para continuar.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    generarPDF(accion);
  };

  const mostrarAlerta = (cve_tecFin) => {
    swal
      .fire({
        title: "¿Estás seguro de aceptar?",
        text: "Una vez aceptado el documento no podrás hacer uso de él.",
        icon: "warning",
        showCancelButton: true, // ✅ muestra botón de cancelar
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        reverseButtons: true, // ✅ opcional: pone "Cancelar" a la izquierda
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleOpenModal();
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal.fire("Cancelado", "No se acepto la cotizacion.", "info");
        }
      });
  };

  const aceptarCotizacion = async (cve_tecFin, folioSiguiente) => {
    try {
      swal.fire({
        title: "Procesando Solicitud...",
        text: "Por favor espera mientras se valida el contenido.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          swal.showLoading();
        },
      });
      const q = query(
        collection(db, "COTIZACION"),
        where("cve_tecFin", "==", cve_tecFin)
      );
      const querySnapshot = await getDocs(q);
      const bitacora = collection(db, "BITACORA");
      const today = new Date();
      const ahora = new Date();
      const hora = ahora.getHours();
      const minuto = ahora.getMinutes();
      const segundo = ahora.getSeconds();
      const formattedDate = today.toLocaleDateString(); // Opcional: Puedes pasar opciones de formato
      const horaFormateada = `${hora}:${minuto}:${segundo}`;

      await addDoc(bitacora, {
        cve_Docu: cve_tecFin,
        tiempo: horaFormateada,
        fechaRegistro: formattedDate,
        tipoDocumento: "Aceptacion de Cotizacion",
        noPartida: "N/A",
      });
      // Si se encuentra un documento que coincide con los identificadores proporcionados, actualiza su estatus
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0]; // Suponiendo que solo hay un documento que coincide con los criterios de consulta

        const factoresRef = doc(db, "COTIZACION", docSnap.id);

        // Actualiza el estatus del documento
        const datos = {
          estatus: "Aceptado",
          folioSae: folioSiguiente,
        };
        await updateDoc(factoresRef, datos);
        // Obtener el documento COTIZACION por cve_tecFin
        // No se recomienda recargar la página; en su lugar, puedes manejar la actualización del estado localmente
        swal.close();
        swal
          .fire({
            icon: "success",
            title: "Guardado",
            text: "Cotizacion Guardada.",
            timer: 1500, // Espera 1.5 segundos
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          })
          .then(() => {
            navigate("/cotizacion");
          });
      } else {
        console.log(
          "No se encontró ningún documento que coincida con los identificadores proporcionados."
        );
      }
    } catch (error) {
      console.error("Error al actualizar el estatus:", error);
    }
  };
  /******************************************** SAE  *****************************************************************/
  const addSae = async () => {
    //console.log("Cliente:", cliente);
swal.fire({
        title: "Procesando Solicitud...",
        text: "Por favor espera mientras se valida el contenido.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          swal.showLoading();
        },
      });
    const { folioSiguiente } = (
      await axios.get(
        //"http://localhost:5000/api/obtenerFolio"
        "/api/obtenerFolio"
      )
    ).data;
    setFolioSig(folioSiguiente);

    let CVE = folioSiguiente.toString().padStart(10, "0");
    console.log("CVE:", CVE);
    const CVE_DOC = CVE.toString().padStart(20, " ");

    let clave = cliente.toString(); // sin padStart
    const clie = await axios.get(
      //`http://localhost:5000/api/datosClie/${clave}`
      `/api/datosClie/${clave}`
    );

    const datosCliente = clie.data.datosCliente;
    console.log("Cliente:", datosCliente);

    const articulos = [];
    const results = [];
    const detallesArticulos = []; // aquí vas a guardar cada `data`
    const qTecFin = query(
      collection(db, "TECNICOFINANCIERO"),
      where("docSig", "==", cve_tecFin)
    );
    const snapshotTecFin = await getDocs(qTecFin);

    if (snapshotTecFin.empty) {
      console.warn(
        "⚠️ No se encontró un documento en TECNICOFINANCIERO con docSig:",
        cve_tecFin
      );
      return;
    }
    const docTecFin = snapshotTecFin.docs[0].data();
    const cveFinReal = docTecFin.cve_tecFin;

    const qPartidas = query(
      collection(db, "PAR_TECFIN_INSU"),
      where("cve_tecFin", "==", cveFinReal)
    );
    const snapshotPartidas = await getDocs(qPartidas);

    if (snapshotPartidas.empty) {
      console.warn("⚠️ No se encontraron partidas con cve_tecFin:", cveFinReal);
      return;
    }
    snapshotPartidas.forEach((doc) => {
      const data = doc.data();
      if (data.claveSae) {
        articulos.push(data.claveSae);
        detallesArticulos.push(data);
      }
      //console.log("📦 Insumo encontrado:", data);
    });

    for (const cve_art of articulos) {
      try {
        const response = await axios.get(
          //`http://localhost:5000/api/datosInsumoe/${cve_art}`
          `/api/datosInsumoe/${cve_art}`
        );
        const datosInsumo = response.data.datosInsumos;
        console.log("🧾 Datos del insumo:", datosInsumo);
        results.push(datosInsumo);
      } catch (err) {
        console.error(
          `❌ Error consultando el insumo ${cve_art}:`,
          err.message
        );
      }
    }

    // Paso 1: Obtener costos de PAR_COTIZACION
    const costosInsumos = query(
      collection(db, "PAR_COTIZACION"),
      where("cve_tecFin", "==", cve_tecFin)
    );
    const querySnapshot = await getDocs(costosInsumos);
    const costos = [];
    querySnapshot.forEach((doc) => {
      costos.push(doc.data());
    });

    console.log("cve_tecFin. ", cve_tecFin);

    const data = detallesArticulos;
    const dataPartidas = detallesArticulos.map((detalle, index) => {
      const impuestos = results[index] || {};
      //console.log("costos: ", costos);
       const costoMatch = costos.find(c => Number(c.noPartidaATF) === Number(detalle.noPartidaATF)) || {};
      console.log("costoMatch: ", costoMatch);
  
      console.log("cantidad: ", detalle.cantidad);
      return {
        
        data: detalle,
        CVE_DOC: CVE_DOC ?? "",
        noPartida: detalle.noPartidaATF ?? "",
        CVE_ART: detalle.claveSae ?? "",
        //CANT: Number(detalle.cantidad) ?? 0,
        CANT: Number((detalle.cantidad + "").replace(/[^0-9.]/g, "")) || 0,
        PREC: detalle.costoCotizado ?? 0,
        TOT_PARTIDA: detalle.total ?? 0,
        UNI_VENTA: impuestos.UNI_MED ?? "",
        CVE_ESQ: impuestos.CVE_ESQIMPU ?? 0,

        IMPU1: impuestos.IMPUESTO1 ?? 0,
        IMPU2: impuestos.IMPUESTO2 ?? 0,
        IMPU3: impuestos.IMPUESTO3 ?? 0,
        IMPU4: impuestos.IMPUESTO4 ?? 0,
        IMPU5: impuestos.IMPUESTO5 ?? 0,
        IMPU6: impuestos.IMPUESTO6 ?? 0,
        IMPU7: impuestos.IMPUESTO7 ?? 0,
        IMPU8: impuestos.IMPUESTO8 ?? 0,

        IMP1APLICA: impuestos.IMP1APLICA ?? 0,
        IMP2APLICA: impuestos.IMP2APLICA ?? 0,
        IMP3APLICA: impuestos.IMP3APLICA ?? 0,
        IMP4APLICA: impuestos.IMP4APLICA ?? 0,
        IMP5APLICA: impuestos.IMP5APLICA ?? 0,
        IMP6APLICA: impuestos.IMP6APLICA ?? 0,
        IMP7APLICA: impuestos.IMP7APLICA ?? 0,
        IMP8APLICA: impuestos.IMP8APLICA ?? 0,

        //CAMPLIB1: costoMatch.folio ?? "",
        //CAMPLIB2: costoMatch.descripcion ?? "",
        CAMPLIB24: costoMatch.totalServicio ?? 0,
        CAMPLIB22: costoMatch.totalMaterial ?? 0,
        CAMPLIB23: 0,
        CAMPLIB25: costoMatch.totalViaticos ?? 0
      };
    });

    //console.log("CVE_DOC:", CVE_DOC);
    console.log("Partidas: ", dataPartidas);

    await axios.post(
      //"http://localhost:5000/api/guardarPartidas",
      "/api/guardarPartidas",
      {
        data: dataPartidas,
      }
    );

    const IMP_TOT4 = data.reduce((sum, partida, index) => {
      const impuesto4 = results[index]?.IMPUESTO4 || 0;
      const total = parseFloat(partida.total) || 0;
      const impuestoAplicado = total * (impuesto4 / 100);
      return sum + impuestoAplicado;
    }, 0);
    const totalPartida = data.reduce((sum, partida) => {
      return sum + (parseFloat(partida.total) || 0);
    }, 0);

    const dataCotizacion = {
      data: data,
      CVE_DOC: CVE_DOC ?? "",
      clie: clave ?? 0,
      IMP_TOT4: IMP_TOT4.toFixed(2) ?? 0,
      IMPORTE: totalPartida.toFixed(2) ?? 0,
      RFC: datosCliente.RFC ?? "",
      FOLIO: folioSiguiente ?? 0,
      METODOPAGO: datosCliente.METODODEPAGO ?? "",
      NUMCTAPAGO: datosCliente.NUMCTAPAGO ?? "",
      FORMAPAGOSAT: datosCliente.FORMADEPAGOSAT ?? "",
      USO_CFDI: datosCliente.USO_CFDI ?? "",
      REG_FISC: datosCliente.REG_FISC ?? "",
    };
    console.log("Cotizacion: ", dataCotizacion);
    const responseCotizacion = await axios.post(
      //"http://localhost:5000/api/cotizacion",
      "/api/cotizacion",
      dataCotizacion
    );

    const { nuevoFolio } = (
      await axios.get(
        //"http://localhost:5000/api/actualizarFolio"
        "/api/actualizarFolio"
      )
    ).data;

    aceptarCotizacion(cve_tecFin, folioSiguiente);
  };

  const handleOpenModal = async () => {
    let listaClientes = [...clientes];
    if (clientes.length === 0) {
      console.log("🔄 Cargando proveedores antes de editar...");
      const responseClientes = await axios.get(
        //"http://localhost:5000/api/cliente"
        "/api/cliente"
      );
      listaClientes = responseClientes.data;
      setClientes(listaClientes);
    }

    // 🟢 Buscar el proveedor en la lista de proveedores
    if (cve_int) {
      const cve_clie = cve_int.toString().padStart(10, " ");
      console.log("Clave Para Select", cve_clie);
      const clienteEncontrado = listaClientes.find(
        (prov) => prov.CLAVE === cve_clie
      );

      setTimeout(() => {
        setCliente(clienteEncontrado ? clienteEncontrado.CLAVE : "");
      }, 200);
    }

    const { folioSiguiente } = (
      await axios.get(
        //"http://localhost:5000/api/obtenerFolio"
        "/api/obtenerFolio"
      )
    ).data;
    setFolioSae(folioSiguiente);
    setIdMonday(idMonday);
    setShowModal(true);
  };
  /******************************************** SAE  *****************************************************************/
  const actualizarStatusMonday = async ({ itemId, columnId, nuevoStatus }) => {
    const apiKey = "TU_TOKEN_DE_API"; // Reemplaza con tu API Token
    const query = `
      mutation {
        change_column_value(
          item_id: ${itemId},
          column_id: "${columnId}",
          value: "{\"index\": ${nuevoStatus}}"
        ) {
          id
        }
      }
    `;

    try {
      const response = await fetch("https://api.monday.com/v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log("Respuesta de Monday:", data);
      return data;
    } catch (error) {
      console.error("Error al actualizar el status en Monday:", error);
      throw error;
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h4 style={{ color: "green" }}>
            Felicidades! Terminaste Todo el Proceso para Realizar tu Cotización,
            Ahora Podrás Descargarla y Enviarla a tu Cliente
          </h4>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Folio</label>
                <input
                    className="form-control"
                    id="inputFolioSecuencial"
                    type="text"
                    value={cve_tecFin}
                    onChange={(e) => setCve_tecFin(e.target.value)}
                    readOnly
                />
              </div>
            </div>
            <div className="col-md-4 ">
              <label className="form-label">Cliente</label>
              <div className="input-group mb-3">
                <input
                    placeholder=""
                    aria-label=""
                    aria-describedby="basic-addon1"
                    type="text"
                    className="form-control"
                    value={cve_clie}
                    onChange={(e) => setCve_clie(e.target.value)}
                    readOnly
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
                    readOnly
                />
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">Fecha de Elaboración</label>
              <div className="input-group mb-3">
                <input
                    placeholder=""
                    aria-label=""
                    aria-describedby="basic-addon1"
                    type="date"
                    value={fechaElaboracion}
                    onChange={(e) => setFechaElaboracion(e.target.value)}
                    className="form-control"
                />
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">Fecha de Inicio</label>
              <div className="input-group mb-3">
                <input
                    placeholder=""
                    aria-label=""
                    aria-describedby="basic-addon1"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="form-control"
                />
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">Fecha Fin</label>
              <div className="input-group mb-3">
                <input
                    placeholder=""
                    aria-label=""
                    aria-describedby="basic-addon1"
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="form-control"
                />
              </div>
            </div>


            <div className="col-md-4 ">
              <label className="form-label">Nombre del Proyecto</label>
              <div className="input-group mb-3">
                <input
                    placeholder="Ingresa un nombre del proyecto"
                    aria-label=""
                    aria-describedby="basic-addon1"
                    type="text"
                    value={nombreProyecto}
                    onChange={(e) => setNombreProyecto(e.target.value)}
                    className="form-control"
                />
              </div>
            </div>
          </div>
          <div
              className="row"
              style={{border: "1px solid #000", borderColor: "gray"}}
          >
            <div
                style={{
                  border: "1px solid #000",
                  maxHeight: "550px",
                  overflowY: "auto",
                }}
            >
              <br></br>
              <table class="table">
                <thead>
                <tr>
                  <th scope="col">No. Partida</th>
                  <th scope="col">Descripción</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col">Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  {parCotizacionLista.map((item, index) => (
                    <tr key={index}>
                      <td>{item.noPartidaATF}</td>
                      <td style={{ whiteSpace: "pre-wrap" }}>{item.descripcion}</td>
                      <td style={{ whiteSpace: "pre-wrap" }}>{item.observacion}</td>
                      <td style={{ textAlign: "right" }}>
                        {item.totalPartida.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <br></br>
          <br></br>
          <button className="btn btn-success" onClick={() => validarYGenerarPDF("download")}>
            <FaFileDownload /> Descargar PDF
          </button>
          &nbsp; &nbsp;
          <button className="btn btn-success" onClick={() => validarYGenerarPDF("open")}>
            <VscFilePdf /> Ver PDF
          </button>
          &nbsp; &nbsp;
          <button className="btn btn-danger" onClick={() => navigate(-1)}>
            <IoArrowBackCircleOutline /> Regresar
          </button>
          &nbsp; &nbsp;
          <button
            className="btn btn-success"
            onClick={() => mostrarAlerta(cve_tecFin)}
          >
            <FaCheckCircle /> Aceptar Cotizacion
          </button>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        scrollable
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Enviar a Sae</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-4">
                  <label>Cotizacion</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cve_tecFin || ""} // Aquí el valor se establece automáticamente
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-4">
                  <label>Folio SAE</label>
                  <input
                    type="text"
                    className="form-control"
                    value={folioSae || ""} // Aquí el valor se establece automáticamente
                    readOnly
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-4">
                  <label>ID Monday</label>
                  <input
                    type="text"
                    className="form-control"
                    value={idMonday || ""} // Aquí el valor se establece automáticamente
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    Selecciona el Cliente SAE
                  </label>
                  <Select
                    options={clientes.map((prov) => ({
                      value: prov.CLAVE,
                      label: prov.NOMBRE,
                    }))}
                    value={
                      cliente
                        ? {
                          value: cliente,
                          label:
                            clientes.find((prov) => prov.CLAVE === cliente)
                              ?.NOMBRE || "",
                        }
                        : null
                    }
                    onChange={(selectedOption) => {
                      console.log(
                        "🔹 Nuevo cliente seleccionado:",
                        selectedOption
                      );
                      setCliente(selectedOption.value);
                    }}
                    placeholder="Buscar cliente..."
                    menuPortalTarget={document.body} // Renderiza fuera del modal
                    menuPlacement="auto" // Ajusta la posición automáticamente
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={addSae}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VisualizarCotizacion;
