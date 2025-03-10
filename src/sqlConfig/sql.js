const express = require("express");
const sql = require("mssql"); // Cambiar a mssql
const app = express();
const cors = require("cors");
// Middleware para permitir solicitudes CORS
app.use(cors());
// Configuración de conexión a la base de datos SQL Server
const config = {
  user: "sa",
  password: "Green2580a.",
  server: "35.222.201.74", // Cambia la IP según tu configuración
  database: "SAE90Empre01",
  options: {
    encrypt: true, // Si estás usando SSL
    trustServerCertificate: true, // Evita problemas con certificados en algunos entornos
  },
};
// Conexión a la base de datos
sql
  .connect(config)
  .then((pool) => {
    console.log("Conexión exitosa a SQL Server");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

// Ruta para obtener las claves y descripciones de INVE01
app.get("/api/claves", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query("SELECT CVE_ART, DESCR FROM INVE01");
    res.json(result.recordset); // Enviar los resultados como respuesta
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res
      .status(500)
      .json({
        error: "Error al obtener datos de la base de datos",
        details: err,
      });
  }
});
app.get("/api/proveedores", async (req, res) => {
  try {
    // Conectar a la base de datos
    const pool = await sql.connect(config);

    // Ejecutar la consulta
    const result = await pool
      .request()
      .query("SELECT CLAVE, NOMBRE FROM PROV01 WHERE STATUS = 'A'");

    // Verifica si hay resultados
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No hay proveedores activos." });
    }

    // Enviar la respuesta
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res
      .status(500)
      .json({
        error: "Error al obtener datos de la base de datos",
        details: err.message,
      });
  }
});
// Ruta para obtener las líneas
app.get("/api/lineasMaster", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT CVE_LIN, DESC_LIN, CUENTA_COI FROM CLIN01 WHERE CUENTA_COI IS NOT NULL"
      );

    // Crear lista única de unidades con descripción
    const unidades = result.recordset.reduce((acc, linea) => {
      if (linea.CUENTA_COI) {
        // Extraer los primeros dos segmentos de CUENTA_COI (Ejemplo: "12" de "12.01.01")
        const cuenta = linea.CUENTA_COI.split(".")[0];

        // Agregar solo si no existe en la lista
        if (!acc.some((item) => item.cuenta === cuenta)) {
          acc.push({ cuenta, descripcion: linea.DESC_LIN });
        }
      }
      return acc;
    }, []);

    res.json(unidades); // Enviar unidades con descripciones
  } catch (err) {
    console.error("Error al ejecutar la consulta de líneas:", err);
    res
      .status(500)
      .json({
        error: "Error al obtener las líneas de la base de datos",
        details: err.message,
      });
  }
});
app.get("/api/categorias/:unidad", async (req, res) => {
  try {
    const { unidad } = req.params; // Obtener el primer par (unidad) de los parámetros
    const pool = await sql.connect(config);

    // Query para obtener solo el segundo nivel (00.00) de la estructura CUENTA_COI (00.00.00)
    const result = await pool
      .request()
      .input("unidad", sql.VarChar, unidad + ".%") // Filtra con LIKE basado en unidad
      .query(`SELECT CVE_LIN, DESC_LIN, CUENTA_COI 
                    FROM CLIN01 
                    WHERE CUENTA_COI LIKE @unidad 
                    AND CHARINDEX('.', CUENTA_COI) > 0 
                    AND LEN(CUENTA_COI) - LEN(REPLACE(CUENTA_COI, '.', '')) = 1`); // Solo incluir 1 punto (nivel 2)

    res.json(result.recordset); // Enviar las categorías filtradas
  } catch (err) {
    console.error("Error al obtener las categorías:", err);
    res
      .status(500)
      .json({ error: "Error al obtener las categorías", details: err });
  }
});
app.get("/api/lineas/:categoria", async (req, res) => {
  const { categoria } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("categoria", sql.VarChar, categoria)
      .input("categoriaZ", sql.VarChar, categoria + "Z")
      .query(`SELECT CVE_LIN, DESC_LIN, CUENTA_COI 
                FROM CLIN01 
                WHERE CUENTA_COI >= @categoria 
                  AND CUENTA_COI < @categoriaZ
                  AND LEN(CUENTA_COI) - LEN(REPLACE(CUENTA_COI, '.', '')) = 2`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener las líneas:", err);
    res
      .status(500)
      .json({ error: "Error al obtener las líneas", details: err });
  }
});
app.get("/api/clave-sae/:cveLin", async (req, res) => {
    try {
      const { cveLin } = req.params;
      console.log("🔎 Recibido en la API (cveLin):", cveLin); // 🔍 Verifica qué está recibiendo la API
  
      const pool = await sql.connect(config);
  
      const result = await pool
        .request()
        .input("cveLin", sql.VarChar, cveLin) // 📌 Asegurar que coincida con el tipo de dato
        .query(`
          SELECT CVE_ART, DESCR 
          FROM INVE01 
          WHERE LIN_PROD = @cveLin
        `);
  
      console.log("🔹 Claves SAE obtenidas desde SQL:", result.recordset);
  
      if (result.recordset.length === 0) {
        console.warn("⚠️ No se encontraron claves SAE.");
        return res.status(404).json({ message: "No se encontraron claves SAE." });
      }
  
      res.json(result.recordset);
    } catch (err) {
      console.error("❌ Error al obtener la Clave SAE:", err);
      res.status(500).json({
        error: "Error al obtener la Clave SAE",
        details: err.message,
      });
    }
  });  
  
// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
  console.log("Servidor corriendo en el puerto 5000");
});
