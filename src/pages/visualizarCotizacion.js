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
import encabezadoPDF from "../imagenes/GS-ENCABEZADO-2.PNG";
import { VscFilePdf } from "react-icons/vsc";
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";
import swal from "sweetalert";
import { ModalTitle, Modal, Button } from "react-bootstrap";
import Select from "react-select";

const VisualizarCotizacion = () => {
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
      //par_preCotList
      const par_preCotList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setParCotizacionLista(par_preCotList);
    } catch (error) {
      console.error("Error fetching PAR_LEVDIGITAL data:", error);
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

  const handleOpenPDF = () => {
    try {
      // Crear un elemento de imagen
      const img = new Image();

      // Establecer la URL de la imagen
      img.src = encabezadoPDF;

      // Manejar la carga de la imagen
      img.onload = () => {
        // Crear un lienzo HTML5
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Establecer las dimensiones del lienzo para que coincidan con las de la imagen
        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar la imagen en el lienzo
        ctx.drawImage(img, 0, 0);

        // Obtener la representación base64 de la imagen desde el lienzo
        const base64Image = canvas.toDataURL("image/png");
        const fechaElaboracionFormateada = new Date(
          fechaElaboracion
        ).toLocaleDateString("es-ES");
        // Construir datos para la tabla dinámica

        const tableBody20 = parCotizacionLista.map((itemTotales) => [
          itemTotales.cve_tecFin,
          itemTotales.noPartidaATF,
          itemTotales.descripcion,
          itemTotales.observacion,
          itemTotales.totalPartida.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }), // Formatea costoCotizado,,
        ]);

        // Define el contenido del documento PDF
        const documentDefinition = {
          header: {
            margin: [0, 0, 0, 0], // Margen superior, derecho, inferior e izquierdo del encabezado de la página
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
                      text: "Información del cliente: ",
                      fontSize: 12,
                      bold: true,
                    },
                    {
                      text: `${clienteLista[0].razonSocial} (${clienteLista[0].cve_clie})\nCalle: ${clienteLista[0].calle} Int: ${clienteLista[0].numInt}, Col: ${clienteLista[0].colonia}\n${clienteLista[0].municipio}, cp: ${clienteLista[0].codigoPostal}, estado: ${clienteLista[0].estado}, RFC: ${clienteLista[0].rfc}`,
                      fontSize: 8,
                      bold: false,
                    },
                  ],
                },

                {
                  width: "50%",
                  stack: [
                    {
                      text: "No. Cotización: " + cve_tecFin,
                      fontSize: 12,
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text:
                        "\n" +
                        "Fecha de elaboración: " +
                        fechaElaboracionFormateada,
                      fontSize: 10,
                      bold: false,
                      alignment: "right",
                    },
                  ],
                },
              ],
              margin: [0, 110, 0, 0],
            },
            {
              margin: [0, 10, 0, 0],
              text: "Estimado usuario, no es grato presentar la propuesta de servicios de Correccion de prensas y levantamiento agradecemos de manera anticipada sus atenciones esperando poder contar con su Vbo",
              fontSize: 9,
              bold: true,
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                headerRows: 1,
                widths: ["auto", "auto", "*", "auto", "auto"],
                body: [
                  [
                    "Clave de documento",
                    "No. Partida",
                    "Descripción",
                    "Observación",
                    "Importe",
                  ],
                  ...tableBody20, // Agregar filas de la tabla basadas en la lista temporal
                ],
              },
            },
            {
              text:
                "\n" +
                "\n" +
                "Importe: " +
                subtotal.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 3, 0, 0],
              text:
                "IVA: " +
                iva.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 3, 0, 0],
              text:
                "Total: " +
                total.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 7, 0, 0],
              text: "Condición comercial ",
              fontSize: 12,
              bold: true,
            },
            {
              margin: [0, 5, 0, 0],
              text: "Prueba",
              fontSize: 7,
              bold: false,
            },
            // Agrega más contenido según sea necesario
          ],
        };

        // Genera el PDF y muestra una vista preliminar
        pdfMake.createPdf(documentDefinition).open();
      };

      // Manejar errores durante la carga de la imagen
      img.onerror = (error) => {
        console.error("Error al cargar la imagen:", error);
      };
    } catch (error) {
      console.error("Error al abrir el PDF:", error);
    }
  };

  const descargarOpenPDF = () => {
    try {
      // Crear un elemento de imagen
      const img = new Image();

      // Establecer la URL de la imagen
      img.src = encabezadoPDF;

      // Manejar la carga de la imagen
      img.onload = () => {
        // Crear un lienzo HTML5
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Establecer las dimensiones del lienzo para que coincidan con las de la imagen
        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar la imagen en el lienzo
        ctx.drawImage(img, 0, 0);

        // Obtener la representación base64 de la imagen desde el lienzo
        const base64Image = canvas.toDataURL("image/png");
        const fechaElaboracionFormateada = new Date(
          fechaElaboracion
        ).toLocaleDateString("es-ES");
        // Construir datos para la tabla dinámica

        const tableBody20 = parCotizacionLista.map((itemTotales) => [
          itemTotales.cve_tecFin,
          itemTotales.noPartidaATF,
          itemTotales.descripcion,
          itemTotales.observacion,
          itemTotales.totalPartida.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          }), // Formatea costoCotizado,,
        ]);

        // Define el contenido del documento PDF
        const documentDefinition = {
          header: {
            margin: [0, 0, 0, 0], // Margen superior, derecho, inferior e izquierdo del encabezado de la página
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
                      text: "Información del cliente: ",
                      fontSize: 12,
                      bold: true,
                    },
                    {
                      text: `${clienteLista[0].razonSocial} (${clienteLista[0].cve_clie})\nCalle: ${clienteLista[0].calle} Int: ${clienteLista[0].numInt}, Col: ${clienteLista[0].colonia}\n${clienteLista[0].municipio}, cp: ${clienteLista[0].codigoPostal}, estado: ${clienteLista[0].estado}, RFC: ${clienteLista[0].rfc}`,
                      fontSize: 8,
                      bold: false,
                    },
                  ],
                },

                {
                  width: "50%",
                  stack: [
                    {
                      text: "No. Cotización: " + cve_tecFin,
                      fontSize: 12,
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text:
                        "\n" +
                        "Fecha de elaboración: " +
                        fechaElaboracionFormateada,
                      fontSize: 10,
                      bold: false,
                      alignment: "right",
                    },
                  ],
                },
              ],
              margin: [0, 110, 0, 0],
            },
            {
              margin: [0, 10, 0, 0],
              text: "Estimado usuario, no es grato presentar la propuesta de servicios de Correccion de prensas y levantamiento agradecemos de manera anticipada sus atenciones esperando poder contar con su Vbo",
              fontSize: 9,
              bold: true,
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                headerRows: 1,
                widths: ["auto", "auto", "*", "auto", "auto"],
                body: [
                  [
                    "Clave de documento",
                    "No. Partida",
                    "Descripción",
                    "Observación",
                    "Importe",
                  ],
                  ...tableBody20, // Agregar filas de la tabla basadas en la lista temporal
                ],
              },
            },
            {
              text:
                "\n" +
                "\n" +
                "Importe: " +
                subtotal.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 3, 0, 0],
              text:
                "IVA: " +
                iva.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 3, 0, 0],
              text:
                "Total: " +
                total.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }),
              fontSize: 12,
              bold: true,
              alignment: "right",
            },
            {
              margin: [0, 7, 0, 0],
              text: "Condición comercial ",
              fontSize: 12,
              bold: true,
            },
            {
              margin: [0, 5, 0, 0],
              text: "Prueba",
              fontSize: 7,
              bold: false,
            },
            // Agrega más contenido según sea necesario
          ],
        };

        // Genera el PDF y descarga el archivo
        pdfMake.createPdf(documentDefinition).download(cve_tecFin + ".pdf");
      };

      // Manejar errores durante la carga de la imagen
      img.onerror = (error) => {
        console.error("Error al cargar la imagen:", error);
      };
    } catch (error) {
      console.error("Error al abrir el PDF:", error);
    }
  };
  /******************************************** SAE  *****************************************************************/
  const mandarSae = () => {
    swal({
      title: "Estás seguro de aprobar la cotización?",
      text: "Una vez aprobada, no podrán modificarse los costos del proyecto!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        addSae();
      } else {
        swal("No se mando a SAE!");
      }
    });
  };
  const addSae = async () => {

    console.log("Cliente:", cliente);

    const { folioSiguiente } = (
      await axios.get("http://localhost:5000/api/obtenerFolio")
    ).data;
    setFolioSig(folioSiguiente);

    let CVE = folioSiguiente.toString().padStart(10, "0");
    let CVE_DOC = CVE.toString().padStart(20, " ");

    let clave = cliente.toString(); // sin padStart
    const clie = await axios.get(
      `http://localhost:5000/api/datosClie/${clave}`
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
          `http://localhost:5000/api/datosInsumoe/${cve_art}`
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

    /*const dataPartidas = {
      data: data,
      CVE_DOC: CVE_DOC,
      nuPartida: data.noPartidaATF,
      CVE_ART: data.claveSae,
      CANT: data.cantidad,
      PREC: data.costoCotizado,
      IMPU1: results.IMPUESTO1,
      IMPU2: results.IMPUESTO2,
      IMPU3: results.IMPUESTO3,
      IMPU4: results.IMPUESTO4,
      IMPU5: results.IMPUESTO5,
      IMPU6: results.IMPUESTO6,
      IMPU7: results.IMPUESTO7,
      IMPU8: results.IMPUESTO8,
      IMP1APLICA: results.IMP1APLICA,
      IMP2APLICA: results.IMP2APLICA,
      IMP3APLICA: results.IMP3APLICA,
      IMP4APLICA: results.IMP4APLICA,
      IMP5APLICA: results.IMP5APLICA,
      IMP6APLICA: results.IMP6APLICA,
      IMP7APLICA: results.IMP7APLICA,
      IMP8APLICA: results.IMP8APLICA,
      CVE_ESQ: results.CVE_ESQIMPU,
      TOT_PARTIDA: data.total,
      UNI_VENTA: results.UNI_MED,
    };*/
    const data = detallesArticulos;
    const dataPartidas = detallesArticulos.map((detalle, index) => {
      const impuestos = results[index] || {};

      return {
        data: detalle,
        CVE_DOC: CVE_DOC ?? "",
        nuPartida: detalle.noPartidaATF ?? "",
        CVE_ART: detalle.claveSae ?? "",
        CANT: detalle.cantidad ?? "",
        PREC: detalle.costoCotizado ?? "",
        TOT_PARTIDA: detalle.total ?? "",
        UNI_VENTA: impuestos.UNI_MED ?? "",
        CVE_ESQ: impuestos.CVE_ESQIMPU ?? "",

        IMPU1: impuestos.IMPUESTO1 ?? "",
        IMPU2: impuestos.IMPUESTO2 ?? "",
        IMPU3: impuestos.IMPUESTO3 ?? "",
        IMPU4: impuestos.IMPUESTO4 ?? "",
        IMPU5: impuestos.IMPUESTO5 ?? "",
        IMPU6: impuestos.IMPUESTO6 ?? "",
        IMPU7: impuestos.IMPUESTO7 ?? "",
        IMPU8: impuestos.IMPUESTO8 ?? "",

        IMP1APLICA: impuestos.IMP1APLICA ?? "",
        IMP2APLICA: impuestos.IMP2APLICA ?? "",
        IMP3APLICA: impuestos.IMP3APLICA ?? "",
        IMP4APLICA: impuestos.IMP4APLICA ?? "",
        IMP5APLICA: impuestos.IMP5APLICA ?? "",
        IMP6APLICA: impuestos.IMP6APLICA ?? "",
        IMP7APLICA: impuestos.IMP7APLICA ?? "",
        IMP8APLICA: impuestos.IMP8APLICA ?? "",
      };
    });

    console.log("Partidas: ", dataPartidas);

    await axios.post("http://localhost:5000/api/guardarPartidas", {
      data: dataPartidas,
    });
    
    //const partidas = response.data;

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
      clie: clave ?? "",
      IMP_TOT4: IMP_TOT4.toFixed(2) ?? "",
      IMPORTE: totalPartida.toFixed(2) ?? "",
      RFC: datosCliente.RFC ?? "",
      folio: folioSiguiente ?? "",
      METODOPAGO: datosCliente.METODODEPAGO ?? "",
      NUMCTAPAGO: datosCliente.NUMCTAPAGO ?? "",
      FORMAPAGOSAT: datosCliente.FORMADEPAGOSAT ?? "",
      USO_CFDI: datosCliente.USO_CFDI ?? "",
      REG_FISC: datosCliente.REG_FISC ?? "",
    };
    console.log("Cotizacion: ", dataCotizacion);
    const responseCotizacion = await axios.post(
      "http://localhost:5000/api/cotizacion",
      dataCotizacion
    );

    const { nuevoFolio } = (
      await axios.get("http://localhost:5000/api/actualizarFolio")
    ).data;
  };

  const handleOpenModal = async () => {
    let listaClientes = [...clientes];
    if (clientes.length === 0) {
      console.log("🔄 Cargando proveedores antes de editar...");
      const responseClientes = await axios.get(
        "http://localhost:5000/api/cliente"
        //"/api/proveedores"
      );
      listaClientes = responseClientes.data;
      setClientes(listaClientes);
    }

    // 🟢 Buscar el proveedor en la lista de proveedores
    const cve_clie = cve_int.toString().padStart(10, " ");
    console.log("Clave Para Select", cve_clie);
    const clienteEncontrado = listaClientes.find(
      (prov) => prov.CLAVE === cve_clie
    );

    setTimeout(() => {
      setCliente(clienteEncontrado ? clienteEncontrado.CLAVE : "");
    }, 200);
    const { folioSiguiente } = (
      await axios.get("http://localhost:5000/api/obtenerFolio")
    ).data;
    setFolioSae(folioSiguiente);
    setIdMonday(idMonday);
    setShowModal(true);
  };
  /******************************************** SAE  *****************************************************************/
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h4 style={{ color: "green" }}>
            Felicidades! terminaste todo el proceso para realizar tu cotización,
            ahora podrás descargarla y enviarla a tu cliente
          </h4>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">FOLIO</label>
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
              <label className="form-label">CLIENTE</label>
              <div class="input-group mb-3">
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
              <label className="form-label">Folio Monday: </label>
              <div className="input-group mb-3">
                <input
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  type="number"
                  value={idMonday}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Validar: solo números positivos y máximo 10 dígitos
                    if (/^\d{0,10}$/.test(value)) {
                      setIdMonday(value);
                    }
                  }}
                  className="form-control"
                  readOnly
                  min="0"
                  max="9999999999"
                />
              </div>
            </div>

            <div className="col-md-4 ">
              <label className="form-label">FECHA DE ELABORACIÓN</label>
              <div class="input-group mb-3">
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
              <label className="form-label">FECHA DE INICIO</label>
              <div class="input-group mb-3">
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
              <label className="form-label">FECHA FIN</label>
              <div class="input-group mb-3">
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
          </div>
          <div
            className="row"
            style={{ border: "1px solid #000", borderColor: "gray" }}
          >
            <div>
              <br></br>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No. Partida</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Observaciones</th>
                    <th scope="col">Sub total</th>
                  </tr>
                </thead>
                <tbody>
                  {parCotizacionLista.map((item, index) => (
                    <tr key={index}>
                      <td>{item.noPartidaATF}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.observacion}</td>
                      <td>
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
          <button className="btn btn-success" onClick={descargarOpenPDF}>
            <FaFileDownload /> Descargar PDF
          </button>
          &nbsp; &nbsp;
          <button className="btn btn-success" onClick={handleOpenPDF}>
            <VscFilePdf /> Ver PDF
          </button>
          &nbsp; &nbsp;
          <button className="btn btn-danger" onClick={() => navigate(-1)}>
            <IoArrowBackCircleOutline /> Regresar
          </button>
          &nbsp; &nbsp;
          <button className="btn btn-success" onClick={handleOpenModal}>
            <VscFilePdf /> Mandar a SAE
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
