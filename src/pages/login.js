import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import swal from "sweetalert";
import GSSOLUCIONESLOGO from "../imagenes/GS-SOLUCIONES-LOGO.png";
import { Container } from "reactstrap";
import { db, auth, signInWithEmailAndPassword } from "../firebaseConfig/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";  // Importa funciones de Firestore

const Login = () => {
  const [username, setUsername] = useState('');  // Para el campo "usuario"
  const [password, setPassword] = useState('');  // Para el campo "Contraseña"
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Hook para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Consulta la colección "USUARIOS" en Firestore
      const q = query(collection(db, "USURIOS"), where("usuario", "==", username));  // Busca por el campo "usuario"
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Si el usuario existe, verifica la contraseña
        const userDoc = querySnapshot.docs[0];  // Obtiene el primer documento que coincide
        const userData = userDoc.data();
        
        if (userData.Contraseña === password) {
          // Si las credenciales son correctas, guarda el estado de autenticación
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', userData.Nombre);  // Guarda el nombre o rol del usuario
          swal("Inicio Correcto ", {
            icon: "success",
          });
          navigate('/');  // Redirige al home
          window.location.reload();
        } else {
          // Si la contraseña es incorrecta
          swal("Contraseña incorrecta", {
            icon: "error",
          });
        }
      } else {
        // Si el usuario no se encuentra
        swal("Usuario no encontrado", {
          icon: "error",
        });
      }
    } catch (error) {
      // Manejo de errores
      console.error("Error al iniciar sesión: ", error);
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
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="text-center mb-4">
          <img src={GSSOLUCIONESLOGO} width="150" height="150" alt="GS Soluciones Logo" />
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
            <Form.Control
              type="password"
              placeholder="Ingrese su Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button variant="primary" type="submit" className="w-100">Inisiar Sesion</Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
