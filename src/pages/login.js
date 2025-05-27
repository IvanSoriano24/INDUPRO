import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import swal from "sweetalert";
import GSSOLUCIONESLOGO from "../imagenes/GS-SOLUCIONES-LOGO.png";
import { Container } from "reactstrap";
import {
  db,
  auth,
  signInWithEmailAndPassword,
} from "../firebaseConfig/firebase";
import { collection, getDocs, query, where } from "firebase/firestore"; // Importa funciones de Firestore
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState(""); // Para el campo "usuario"
  const [password, setPassword] = useState(""); // Para el campo "Contraseña"
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Hook para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        collection(db, "USURIOS"),
        where("usuario", "==", username)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.Contraseña === password) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userRole", userData.rol); // Guarda el rol
          localStorage.setItem("userName", userData.Nombre);
          swal("Inicio Correcto", {
            icon: "success",
          });
          navigate("/"); // Redirige al home
          window.location.reload();
        } else {
          swal("Contraseña incorrecta", {
            icon: "error",
          });
        }
      } else {
        swal("Usuario no encontrado", {
          icon: "error",
        });
      }
    } catch (error) {
      swal("Error en el inicio de sesión", {
        icon: "error",
      });
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <div
        className="p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="text-center mb-4">
          <img
            src={GSSOLUCIONESLOGO}
            width="150"
            height="150"
            alt="GS Soluciones Logo"
          />
        </div>
        <h2 className="text-center mb-4">InduPro</h2>
        <form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </Form.Group>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button variant="primary" type="submit" className="w-100">
            Iniciar Sesion
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
