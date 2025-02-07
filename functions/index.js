const functions = require("firebase-functions");
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
const corsOptions = {
    origin: "https://gscotiza-cd748.web.app", // Cambia esto a tu dominio frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Configuración de conexión a la base de datos SQL Server
const config = {
    user: "sa",
    password: "Green2580a.",
    server: "35.222.201.74",  
    database: "SAE90Empre01",
    options: {
        encrypt: true,  
        trustServerCertificate: true,
    },
};

// Función para conectar a SQL Server
const getConnection = async () => {
    try {
        return await sql.connect(config);
    } catch (err) {
        console.error("Error en la conexión a SQL Server:", err);
        throw err;
    }
};

// Ruta para obtener claves de INVE01
app.get("/api/claves", async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT CVE_ART, DESCR FROM INVE01");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al ejecutar la consulta:", err);
        res.status(500).json({ error: "Error al obtener datos", details: err });
    }
});

// Ruta para obtener proveedores activos
app.get("/api/proveedores", async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT CLAVE, NOMBRE FROM PROV01 WHERE STATUS = 'A'");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener proveedores:", err);
        res.status(500).json({ error: "Error al obtener datos", details: err });
    }
});

// Ruta para obtener líneas
app.get("/api/lineasMaster", async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query("SELECT CVE_LIN, DESC_LIN, CUENTA_COI FROM CLIN01 WHERE CUENTA_COI IS NOT NULL");

        const unidades = result.recordset.reduce((acc, linea) => {
            if (linea.CUENTA_COI) {
                const cuenta = linea.CUENTA_COI.split(".")[0]; 
                if (!acc.some(item => item.cuenta === cuenta)) {
                    acc.push({ cuenta, descripcion: linea.DESC_LIN });
                }
            }
            return acc;
        }, []);

        res.json(unidades);
    } catch (err) {
        console.error("Error al obtener líneas:", err);
        res.status(500).json({ error: "Error en la base de datos", details: err });
    }
});

// Ruta para obtener categorías según la unidad
app.get("/api/categorias/:unidad", async (req, res) => {
    try {
        const { unidad } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input("unidad", sql.VarChar, unidad + ".%")
            .query(`SELECT CVE_LIN, DESC_LIN, CUENTA_COI 
                    FROM CLIN01 
                    WHERE CUENTA_COI LIKE @unidad 
                    AND CHARINDEX('.', CUENTA_COI) > 0 
                    AND LEN(CUENTA_COI) - LEN(REPLACE(CUENTA_COI, '.', '')) = 1`);

        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener categorías:", err);
        res.status(500).json({ error: "Error en la base de datos", details: err });
    }
});

// Ruta para obtener líneas según la categoría
app.get("/api/lineas/:categoria", async (req, res) => {
    try {
        const { categoria } = req.params;
        const pool = await getConnection();
        const result = await pool.request()
            .input("categoria", sql.VarChar, `${categoria}.%`)
            .query(`SELECT CVE_LIN, DESC_LIN, CUENTA_COI 
                    FROM CLIN01 
                    WHERE CUENTA_COI LIKE @categoria 
                    AND LEN(CUENTA_COI) - LEN(REPLACE(CUENTA_COI, '.', '')) = 2`);
        
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener líneas:", err);
        res.status(500).json({ error: "Error en la base de datos", details: err });
    }
});

// Exportar la API para Firebase Functions
exports.api = functions.https.onRequest(app);