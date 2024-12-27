import React, {useState, useEffect} from "react"
import { Modal, Button } from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom"
import { collection, addDoc, query, orderBy, limit, getDocs, where, getDoc, doc, updateDoc} from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import { FaCircleQuestion, FaCirclePlus  } from "react-icons/fa6";
import { HiDocumentPlus } from "react-icons/hi2";
import { IoSearchSharp } from "react-icons/io5";

import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";



const EditarLevDigital = () => {
    /* ---------------------ENCABEZADO DE DOCUMENTO ------------------------------------- */
    const [cve_levDig, setCve_levDig] = useState("");
    const [selectedFolio, setSelectedFolio] = useState("");
    const [folioSiguiente, setFolioSiguiente] = useState(1);
    const [cve_clie, setCve_clie] = useState("");
    const [fechaElaboracion, setFechaElaboracion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [docAnt, setDocAnt] = useState("N/A");
    const [docSig, setDocSig] = useState("");
    const[estatus, setEstatus] = useState("Activo");
    const navigate = useNavigate();
    const { id } = useParams();

      const updateLevDigital = async (e) => {
        e.preventDefault();
        const levDigRef = doc(db, "LEVDIGITAL", id)
          const datos = {
          cve_clie: cve_clie,
          fechaElaboracion: fechaElaboracion,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          estatus: estatus,
          docAnt: docAnt,
          docSig: docSig,
        };
        await updateDoc(levDigRef, datos);
        navigate("/levantamientoDigital")

      };
      const updatePar_levDig = async (e) => {
        e.preventDefault();
        const levDigRef = doc(db, "LEVDIGITAL", id)
      }
      const getLevDigitalById = async (id) => {
        const levDigDOC = await getDoc(doc(db, "LEVDIGITAL", id));
        if (levDigDOC.exists()) {
            setCve_levDig(levDigDOC.data().cve_levDig);
            setCve_clie(levDigDOC.data().cve_clie);
            setFechaElaboracion(levDigDOC.data().fechaElaboracion);
            setFechaInicio(levDigDOC.data().fechaInicio);
            setFechaFin(levDigDOC.data().fechaFin)
        }else{
            console.log("El personals no existe");
        }
    };
    useEffect(() => {
        getLevDigitalById(id);
      }, [id]);
      /* ---------------------PARTIDAS DE DOCUMENTO ------------------------------------- */
      const [par_levDigital, setPar_levDigital] = useState([]);
      const [descripcion, setDescripcion] = useState("");
      const [observacion, setObservacion] = useState("");
      const [showModal, setShowModal] = useState(false);
      const [editedData, setEditedData] = useState({});

        const getParLevDigital = async () => {
        try {
            const data = await getDocs(
            query(collection(db, "PAR_LEVDIGITAL"), where("cve_levDig", "==", cve_levDig)) 
            );

            const par_levDigList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setPar_levDigital(par_levDigList);
        } catch (error) {
            console.error("Error fetching PAR_LEVDIGITAL data:", error);
        }
        };

        useEffect(() => {
        getParLevDigital();
        }, [cve_levDig]); // Asegúrate de incluir cve_levDig en las dependencias del useEffect

        const handleEdit = (data) => {
            setEditedData(data);
            setShowModal(true);
          };
  
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Levantamiento Digital</h1>
          
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                    <label className="form-label">FOLIO VINCULADO A LAS FACTURAS</label>
                    <input
                    className="form-control" 
                    id="inputFolioSecuencial"
                    type="text"
                    value={cve_levDig}
                    onChange={(e) => setCve_levDig(e.target.value)}
                    readOnly
                    />
                </div>
              </div>

              <table className="table">
                <thead>
                    <tr>
                        <th scope="col">No. PARTIDA</th>
                        <th scope="col">DESCRIPCIÓN</th>
                        <th scope="col">OBSERVACIONES</th>
                        <th scope="col">Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {par_levDigital.map((par_levDigital) => (
                        <tr  key={par_levDigital.id}>
                            <td>{par_levDigital.noPartida}</td>
                            <td>{par_levDigital.descripcion}</td>
                            <td>{par_levDigital.observacion}</td>
                            <td><Link to={`/editarParLevDig/${par_levDigital.id}`}><button className="btn btn-primary"><FaPencilAlt /></button></Link></td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <Link to="/levantamientoDigital"><button className="btn btn-danger">Regresar</button></Link>
        </div>
      </div>
    </div>     
  );
};

export default EditarLevDigital