import React, { useState } from "react";
import { BiSolidUserAccount } from "react-icons/bi";
import { NavLink, Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";
import { FaHandsHelping } from "react-icons/fa";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { AiFillEdit } from "react-icons/ai";
import { FaPercent, FaMoneyCheckAlt } from "react-icons/fa";
import { Gi3DGlasses } from "react-icons/gi";
import { FaUserFriends } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { AiFillCaretDown } from "react-icons/ai";
import GSSOLUCIONESLOGO from "../imagenes/GS-SOLUCIONES-LOGO.png"
import { BiChevronDown } from "react-icons/bi";
import { useNavigate } from "react-router-dom";



const Sidebar = () => {
    const clave = "NTtgoYURKvkxbuq2ospC";

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        navigate("/login");
        window.location.reload();
    };

    // Estado para manejar el dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Función para alternar el estado del dropdown
    const toggleDropdown = () => {
        console.log("Dropdown toggled");
        setIsDropdownOpen((prevState) => !prevState);
    };

    return (
        <div className="sidebar">
            <ul>
                <li>
                    <img src={GSSOLUCIONESLOGO} alt="Logo" width="150" height="150" />
                </li>
                <li>
                    <NavLink className="text-dark rounded py-2 w-100 d-inline-block" exact activeClassName="active" to="/">
                        <FaIcons.FaHome className="me-2" /> Inicio
                    </NavLink>
                </li>
                <li className="dropdown_list">
                    <div className="dropdown_header" onClick={toggleDropdown}>
                        <span className="text-dark">
                            <TiDocumentText className="me-2" /> Documentos
                        </span>
                    </div>
                    {/* Mostrar las opciones si el estado está activo */}
                    {isDropdownOpen && (
                        <div className="dropdown_content">
                            <ul className="dropdown_sub">
                                <li className="dropdown_anchor">
                                    <NavLink
                                        exact
                                        activeClassName="active"
                                        to="/levantamientoDigital"
                                        className="text-dark rounded py-2 w-100 d-inline-block"
                                    >
                                        <AiFillEdit className="me-2" /> Levantamiento digital
                                    </NavLink>
                                </li>
                                <li className="dropdown_anchor">
                                    <NavLink
                                        exact
                                        activeClassName="active"
                                        to="/precotizacion"
                                        className="text-dark rounded py-2 w-100 d-inline-block"
                                    >
                                        <FaMoneyCheckAlt className="me-2" /> Pre-cotización
                                    </NavLink>
                                </li>
                                <li className="dropdown_anchor">
                                    <NavLink
                                        exact
                                        activeClassName="active"
                                        to="/revTecnicoFinanciero"
                                        className="text-dark rounded py-2 w-100 d-inline-block"
                                    >
                                        <Gi3DGlasses className="me-2" /> Revisión técnico financiero
                                    </NavLink>
                                </li>
                                <li className="dropdown_anchor">
                                    <NavLink
                                        exact
                                        activeClassName="active"
                                        to="/cotizacion"
                                        className="text-dark rounded py-2 w-100 d-inline-block"
                                    >
                                        <LiaMoneyCheckAltSolid className="me-2" /> Cotización
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    )}
                </li>

                <li>
                    <NavLink exact activeClassName="active" to="/clientes" className="text-dark rounded py-2 w-100 d-inline-block">
                        <FaUserFriends className="me-2" /> Clientes
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active" to="/contactos" className="text-dark rounded py-2 w-100 d-inline-block">
                        <BiSolidUserAccount className="me-2" /> Contactos
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active" to="/tipo" className="text-dark rounded py-2 w-100 d-inline-block">
                        <FaHandsHelping className="me-2" /> Tipos de servicios
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active" to="/personalProyectos" className="text-dark rounded py-2 w-100 d-inline-block">
                        <FaUserTie className="me-2" /> Mano de obra
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active" to={`/factores/${clave}`} className="text-dark rounded py-2 w-100 d-inline-block">
                        <FaPercent className="me-2" /> Insumo por factores
                    </NavLink>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="text-dark rounded py-2 w-100 d-inline-block"
                        style={{
                            background: "none",
                            border: "none",
                            textAlign: "left",
                            cursor: "pointer",
                        }}
                    >
                        <FaIcons.FaSignOutAlt className="me-2" /> Cerrar Sesión
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;