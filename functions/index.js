const functions = require("firebase-functions");
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();

// Configuración de SQL
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

// Configuración CORS
const corsOptions = {
  origin: ["*"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Ruta de prueba
app.get("/api/test", (req, res) => {
  res.status(200).json({ mensaje: "CORS funcionando correctamente" });
});

// Ruta para obtener las claves y descripciones de INVE01
app.get("/api/claves", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT CVE_ART, DESCR FROM INVE01");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({
      error: "Error al obtener datos de la base de datos",
      details: err,
    });
  }
});

// Ruta para obtener proveedores activos
app.get("/api/proveedores", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query("SELECT CLAVE, NOMBRE FROM PROV01 WHERE STATUS = 'A'");
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No hay proveedores activos." });
    }
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    res.status(500).json({
      error: "Error al obtener datos de la base de datos",
      details: err.message,
    });
  }
});

// Ruta para obtener las líneas master (unidades)
app.get("/api/lineasMaster", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query("SELECT CVE_LIN, DESC_LIN, CUENTA_COI FROM CLIN01 WHERE CUENTA_COI IS NOT NULL");

    // Crear lista única de unidades con descripción
    const unidades = result.recordset.reduce((acc, linea) => {
      if (linea.CUENTA_COI) {
        const cuenta = linea.CUENTA_COI.split(".")[0];
        if (!acc.some((item) => item.cuenta === cuenta)) {
          acc.push({ cuenta, descripcion: linea.DESC_LIN });
        }
      }
      return acc;
    }, []);

    res.json(unidades);
  } catch (err) {
    console.error("Error al ejecutar la consulta de líneas:", err);
    res.status(500).json({
      error: "Error al obtener las líneas de la base de datos",
      details: err.message,
    });
  }
});

// Ruta para obtener categorías según la unidad (segundo nivel)
app.get("/api/categorias/:unidad", async (req, res) => {
  try {
    const { unidad } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("unidad", sql.VarChar, unidad + ".%")
      .query(`SELECT CVE_LIN, DESC_LIN, CUENTA_COI 
              FROM CLIN01 
              WHERE CUENTA_COI LIKE @unidad 
                AND CHARINDEX('.', CUENTA_COI) > 0 
                AND LEN(CUENTA_COI) - LEN(REPLACE(CUENTA_COI, '.', '')) = 1`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener las categorías:", err);
    res.status(500).json({ error: "Error al obtener las categorías", details: err });
  }
});

// Ruta para obtener las líneas según la categoría (tercer nivel)
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
    res.status(500).json({ error: "Error al obtener las líneas", details: err });
  }
});
// Ruta para obtener la Clave SAE desde SQL Server basado en CVE_LIN
app.get("/api/clave-sae/:cveLin", async (req, res) => {
  try {
    const { cveLin } = req.params;
    const pool = await sql.connect(config);

    // Consulta SQL para obtener CVE_ART y DESCR en base al CVE_LIN
    const result = await pool
      .request()
      .input("cveLin", sql.VarChar, cveLin)
      .query(`
        SELECT CVE_ART, DESCR 
        FROM INVE01 
        WHERE LIN_PROD = @cveLin
      `);

    console.log("🔹 Claves SAE obtenidas desde SQL:", result.recordset);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontraron claves SAE." });
    }

    // Retornar los resultados en formato JSON
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error al obtener la Clave SAE:", err);
    res.status(500).json({
      error: "Error al obtener la Clave SAE",
      details: err.message,
    });
  }
});

// Exportar la API para Firebase Functions
exports.api = functions.https.onRequest(app);
