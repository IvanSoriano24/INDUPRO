import { BiSolidUserAccount } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { FaHandsHelping, FaPercent, FaUserFriends, FaUserTie, FaSignOutAlt } from "react-icons/fa";
import { TiDocumentText } from "react-icons/ti";
import { AiFillEdit } from "react-icons/ai";
import { Gi3DGlasses } from "react-icons/gi";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import GSSOLUCIONESLOGO from "../imagenes/GS-SOLUCIONES-LOGO.png";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const userRole = sessionStorage.getItem('userRole'); 
const SidebarComponent = ({ onLogout }) => {
  const clave = "NTtgoYURKvkxbuq2ospC";
  const navigate = useNavigate();
const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem('isAuthenticated') // Carga el estado inicial desde localStorage
  );
  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("userRole");
    sessionStorage.clear();
    //setIsAuthenticated(false);
    onLogout();
    navigate("/login");
    //window.location.reload();
  };

  return (
    <div className="sidebar bg-light p-3" style={{ width: "250px", minHeight: "100vh" }}>
      <div className="text-center mb-4">
        <img src={GSSOLUCIONESLOGO} alt="Logo" width="150" height="150" />
      </div>
      <Sidebar aria-label="Main Sidebar" className="bg-light border-0">
        <ul className="list-unstyled">
          <li>
            <NavLink
              className="text-dark rounded py-2 w-100 d-inline-block"
              exact="true"
              to="/"
              style={{ textDecoration: "none", border: "none" }}
            >
              <FaUserFriends className="me-2" />
              Inicio
            </NavLink>
          </li>
          <Sidebar.Collapse
            label={
              <span className="text-dark">
                <TiDocumentText className="me-2" />
                
                Documentos
              </span>
            }
            style={{ textDecoration: "none", border: "none", background: "transparent" }}
          >
            <ul className="list-unstyled ps-3">
            {(userRole === "ADMINISTRADOR" || userRole === "LIDER") && (
              <li>
                <NavLink
                  exact="true"
                  to="/levantamientoDigital"
                  className="text-dark rounded py-2 w-100 d-inline-block"
                >
                  <AiFillEdit className="me-2" />
                  Levantamiento Digital
                </NavLink>
              </li>
               )}
               {(userRole === "ADMINISTRADOR" || userRole === "COMPRAS" || userRole === "VENTAS") && (
              <li>
                <NavLink
                  exact="true"
                  to="/precotizacion"
                  className="text-dark rounded py-2 w-100 d-inline-block"
                >
                  <FaMoneyCheckAlt className="me-2" />
                  Pre-cotización
                </NavLink>
              </li>
              )}
              {(userRole === "ADMINISTRADOR" || userRole === "JEFE") && (
              <li>
                <NavLink
                  exact="true"
                  to="/revTecnicoFinanciero"
                  className="text-dark rounded py-2 w-100 d-inline-block"
                >
                  <Gi3DGlasses className="me-2" />
                  Revisión Técnico Financiero
                </NavLink>
              </li>
              )}
              {(userRole === "ADMINISTRADOR" || userRole === "VENTAS") && (
              <li>
                <NavLink
                  exact="true"
                  to="/cotizacion"
                  className="text-dark rounded py-2 w-100 d-inline-block"
                >
                  <LiaMoneyCheckAltSolid className="me-2" />
                  Cotización
                </NavLink>
              </li>
              )}
            </ul>
          </Sidebar.Collapse>
          {(userRole === "ADMINISTRADOR" || userRole === "VENTAS") && (
          <li>
            <NavLink
              exact="true"
              to="/clientes"
              className="text-dark rounded py-2 w-100 d-inline-block"
            >
              <FaUserFriends className="me-2" />
              Clientes
            </NavLink>
          </li>
          )}
          {(userRole === "ADMINISTRADOR" || userRole === "VENTAS" || userRole === "COMPRAS") && (
          <li>
            <NavLink
              exact="true"
              to="/contactos"
              className="text-dark rounded py-2 w-100 d-inline-block"
            >
              <BiSolidUserAccount className="me-2" />
              Contactos
            </NavLink>
          </li>
          )}
          {(userRole === "ADMINISTRADOR" || userRole === "COMPRAS") && (
          <li>
            <NavLink
              exact="true"
              to="/tipo"
              className="text-dark rounded py-2 w-100 d-inline-block"
            >
              <FaHandsHelping className="me-2" />
              Tipos de Servicios
            </NavLink>
          </li>
          )}
          {(userRole === "ADMINISTRADOR" || userRole === "JEFE") && (
          <li>
            <NavLink
              exact="true"
              to="/personalProyectos"
              className="text-dark rounded py-2 w-100 d-inline-block"
            >
              <FaUserTie className="me-2" />
              Mano de Obra
            </NavLink>
          </li>
          )}
          {(userRole === "ADMINISTRADOR" || userRole === "JEFE") && (
          <li>
            <NavLink
              exact="true"
              to={`/factores/${clave}`}
              className="text-dark rounded py-2 w-100 d-inline-block"
            >
              <FaPercent className="me-2" />
              Insumo por Factores
            </NavLink>
          </li>
        )}
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
              <FaSignOutAlt className="me-2" />
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
