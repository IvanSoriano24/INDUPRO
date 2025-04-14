import React, {useState, useEffect} from "react"
import {useNavigate, useParams, Link} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import { HiDocumentPlus } from "react-icons/hi2";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import encabezadoPDF from "../imagenes/GS-ENCABEZADO-2.PNG";
import { VscFilePdf } from "react-icons/vsc";
import { FaFileDownload } from "react-icons/fa";

const VisualizarCotizacion = () => {

    
    const[cve_tecFin, setCve_tecFin] = useState("");
    const[cve_clie, setCve_clie] = useState("");
    const[fechaElaboracion, setFechaElaboracion] = useState("");
    const[fechaInicio, setFechaInicio] = useState("");
    const[fechaFin, setFechaFin] = useState("");
    const[iva, setIva] = useState("");
    const[subtotal, setSubTotal] = useState("");
    const[total, setTotal] = useState("");
    const [cotizacionLista, setCotizacionLista] = useState([]) 
    const [parCotizacionLista, setParCotizacionLista] = useState([]) 
    const [clienteLista, setClienteLista] = useState([]);
    /* ---------------------------------------- LLAMADA A COLECCIONES ---------------------------------------- */
    const navigate = useNavigate()
    const { id } = useParams();
    const [idMonday, setIdMonday] = useState("");
    /* ---------------------JALAR INFORMACIÓN DE DOCUMENTO ANTERIOR ------------------------------------- */
    const getFactoresById = async (id) => {
        const factoresDOC = await getDoc(doc(db, "COTIZACION", id));
        if (factoresDOC.exists()) {
            setCve_tecFin(factoresDOC.data().cve_tecFin);
            setCve_clie(factoresDOC.data().cve_clie);
            setFechaElaboracion(factoresDOC.data().fechaElaboracion);
            setFechaInicio(factoresDOC.data().fechaInicio);
            setFechaFin(factoresDOC.data().fechaFin);
            setSubTotal(factoresDOC.data().subtotal);
            setIva(factoresDOC.data().IVA);
            setTotal(factoresDOC.data().total);
            setIdMonday(factoresDOC.data().idMonday);
        }else{
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
            query(collection(db, "PAR_COTIZACION"), where("cve_tecFin", "==", cve_tecFin)) 
            );
            //par_preCotList
            const par_preCotList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
                const par_preCotList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
        
                    // Establecer las dimensiones del lienzo para que coincidan con las de la imagen
                    canvas.width = img.width;
                    canvas.height = img.height;
        
                    // Dibujar la imagen en el lienzo
                    ctx.drawImage(img, 0, 0);
        
                    // Obtener la representación base64 de la imagen desde el lienzo
                    const base64Image = canvas.toDataURL('image/png');
                    const fechaElaboracionFormateada = new Date(fechaElaboracion).toLocaleDateString('es-ES');
                    // Construir datos para la tabla dinámica
        
                    const tableBody20 = parCotizacionLista.map(itemTotales => [
                        itemTotales.cve_tecFin,
                        itemTotales.noPartidaATF,
                        itemTotales.descripcion,
                        itemTotales.observacion,
                        itemTotales.totalPartida.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), // Formatea costoCotizado,,
                    ])
                    
                    // Define el contenido del documento PDF
                    const documentDefinition = {
                        header: {
                            margin: [0, 0, 0, 0], // Margen superior, derecho, inferior e izquierdo del encabezado de la página
                            image: base64Image,
                            width: 600,
                            height:150
                        },
                        content: [
                            {
                                columns: [
                                    {
                                        width: '50%', 
                                        stack: [
                                            {
                                                text: 'Información del cliente: ',
                                                fontSize: 12,
                                                bold: true,
                                            },
                                            {
                                                text: `${clienteLista[0].razonSocial} (${clienteLista[0].cve_clie})\nCalle: ${clienteLista[0].calle} Int: ${clienteLista[0].numInt}, Col: ${clienteLista[0].colonia}\n${clienteLista[0].municipio}, cp: ${clienteLista[0].codigoPostal}, estado: ${clienteLista[0].estado}, RFC: ${clienteLista[0].rfc}`,
                                                fontSize: 8,
                                                bold: false,
                                                
                                            },
                                        ]
                                    },
                                    
                                    {
                                        width: '50%', 
                                        stack: [
                                            {
                                                text: 'No. Cotización: ' + cve_tecFin,
                                                fontSize: 12,
                                                bold: true,
                                                alignment: 'right', 
                                            },
                                            {
                                                text: "\n"+'Fecha de elaboración: ' + fechaElaboracionFormateada,
                                                fontSize: 10,
                                                bold: false,
                                                alignment: 'right', 
                                            }
                                        ]
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
                                    widths: [ 'auto', 'auto', '*', 'auto', 'auto' ],
                                    body: [
                                        [ 'Clave de documento', 'No. Partida', 'Descripción', 'Observación', 'Importe'],
                                        ...tableBody20 // Agregar filas de la tabla basadas en la lista temporal
                                    ]
                                }
                            },
                           {
                            text: "\n"+ "\n" +'Importe: ' + subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                            fontSize: 12,
                            bold: true,
                            alignment: 'right', 
                           },
                           {
                            margin: [0, 3, 0, 0],
                            text: 'IVA: ' + iva.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                            fontSize: 12,
                            bold: true,
                            alignment: 'right', 
                           },
                           {
                            margin: [0, 3, 0, 0],
                            text: 'Total: ' + total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                            fontSize: 12,
                            bold: true,
                            alignment: 'right', 
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
                    console.error('Error al cargar la imagen:', error);
                };
            } catch (error) {
                console.error('Error al abrir el PDF:', error);
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
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
        
                    // Establecer las dimensiones del lienzo para que coincidan con las de la imagen
                    canvas.width = img.width;
                    canvas.height = img.height;
        
                    // Dibujar la imagen en el lienzo
                    ctx.drawImage(img, 0, 0);
        
                    // Obtener la representación base64 de la imagen desde el lienzo
                    const base64Image = canvas.toDataURL('image/png');
                    const fechaElaboracionFormateada = new Date(fechaElaboracion).toLocaleDateString('es-ES');
                    // Construir datos para la tabla dinámica
        
                    const tableBody20 = parCotizacionLista.map(itemTotales => [
                        itemTotales.cve_tecFin,
                        itemTotales.noPartidaATF,
                        itemTotales.descripcion,
                        itemTotales.observacion,
                        itemTotales.totalPartida.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), // Formatea costoCotizado,,
                    ])
                    
                    // Define el contenido del documento PDF
                    const documentDefinition = {
                        header: {
                            margin: [0, 0, 0, 0], // Margen superior, derecho, inferior e izquierdo del encabezado de la página
                            image: base64Image,
                            width: 600,
                            height:150
                        },
                        content: [
                            {
                                columns: [
                                    {
                                        width: '50%', 
                                        stack: [
                                            {
                                                text: 'Información del cliente: ',
                                                fontSize: 12,
                                                bold: true,
                                            },
                                            {
                                                text: `${clienteLista[0].razonSocial} (${clienteLista[0].cve_clie})\nCalle: ${clienteLista[0].calle} Int: ${clienteLista[0].numInt}, Col: ${clienteLista[0].colonia}\n${clienteLista[0].municipio}, cp: ${clienteLista[0].codigoPostal}, estado: ${clienteLista[0].estado}, RFC: ${clienteLista[0].rfc}`,
                                                fontSize: 8,
                                                bold: false,
                                                
                                            },
                                        ]
                                    },
                                    
                                    {
                                        width: '50%', 
                                        stack: [
                                            {
                                                text: 'No. Cotización: ' + cve_tecFin,
                                                fontSize: 12,
                                                bold: true,
                                                alignment: 'right', 
                                            },
                                            {
                                                text: "\n"+'Fecha de elaboración: ' + fechaElaboracionFormateada,
                                                fontSize: 10,
                                                bold: false,
                                                alignment: 'right', 
                                            }
                                        ]
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
                                    widths: [ 'auto', 'auto', '*', 'auto', 'auto' ],
                                    body: [
                                        [ 'Clave de documento', 'No. Partida', 'Descripción', 'Observación', 'Importe'],
                                        ...tableBody20 // Agregar filas de la tabla basadas en la lista temporal
                                    ]
                                }
                            },
                           {
                            text: "\n"+ "\n" +'Importe: ' + subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                            fontSize: 12,
                            bold: true,
                            alignment: 'right', 
                           },
                           {
                            margin: [0, 3, 0, 0],
                            text: 'IVA: ' + iva.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                            fontSize: 12,
                            bold: true,
                            alignment: 'right', 
                           },
                           {
                            margin: [0, 3, 0, 0],
                            text: 'Total: ' + total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                            fontSize: 12,
                            bold: true,
                            alignment: 'right', 
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
                    pdfMake.createPdf(documentDefinition).download(cve_tecFin + '.pdf');

                };
        
                // Manejar errores durante la carga de la imagen
                img.onerror = (error) => {
                    console.error('Error al cargar la imagen:', error);
                };
            } catch (error) {
                console.error('Error al abrir el PDF:', error);
            }
        };
    
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h4 style={{color: "green"}}>Felicidades! terminaste todo el proceso para realizar tu cotización, ahora podrás descargarla y enviarla a tu cliente
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
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
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
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
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
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
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
                      placeholder="" aria-label="" aria-describedby="basic-addon1"        
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="form-control"
                      />
                    
                  </div>
              </div>
            </div>
            <div className="row" style={{ border: '1px solid #000', borderColor: "gray" }}>
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
                        <td>{item.totalPartida.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              </div>
              <br></br>  
              <br></br>
              <button className="btn btn-success" onClick={descargarOpenPDF}><FaFileDownload  /> Descargar PDF</button>
              &nbsp;
              &nbsp;
              <button className="btn btn-success" onClick={handleOpenPDF}><VscFilePdf  /> Ver PDF</button>
              &nbsp;
              &nbsp;
              <button className="btn btn-danger" onClick={() => navigate(-1)}><IoArrowBackCircleOutline /> Regresar</button>
        </div>
      </div>
    </div>    
  );

}

export default VisualizarCotizacion