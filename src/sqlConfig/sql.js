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
    res.status(500).json({
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
    res.status(500).json({
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

    const result = await pool.request().input("cveLin", sql.VarChar, cveLin) // 📌 Asegurar que coincida con el tipo de dato
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
app.get("/api/obtenerFolio", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(`
        SELECT (ULT_DOC + 1) AS FolioSiguiente 
        FROM FOLIOSF01 
        WHERE TIP_DOC = 'C' AND SERIE = 'STAND.'
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontró el folio." });
    }
    const folioSiguiente = result.recordset[0].FolioSiguiente;
    res.json({ folioSiguiente }); // Retornar el folio en un objeto
  } catch (err) {
    console.error("Error al ejecutar la consulta de folio:", err);
    res.status(500).json({
      error: "Error al obtener el folio de la base de datos",
      details: err.message,
    });
  }
});
app.post("/api/cotizacion", async (req, res) => {
  try {
    const {
      TIP_DOC, CVE_DOC, CVE_CLPV, STATUS, FECHA_DOC, FECHA_ENT, FECHA_VEN,
      IMP_TOT1, IMP_TOT2, IMP_TOT3, IMP_TOT4, DESC_FIN, COM_TOT,
      NUM_MONED, TIPCAMB, PRIMERPAGO, RFC, AUTORIZA, FOLIO, SERIE, ESCFD,
      NUM_ALMA, ACT_CXC, ACT_COI, CVE_VEND, DES_TOT, CONDICION, NUMPAGOS,
      DAT_ENVIO, CONTADO, DAT_MOSTR, CVE_BITA, BLO1, FECHAELAB, CTLPOL,
      CVE_OBS, FORMAENCIO, DES_FIN_PORC, DES_TOT_PORC, IMPORTE,
      COM_TOT_PORC, METODODEPAGO, NUMCATPAGO, UUID, VERSION_SIN,
      IMP_TOT5, IMP_TOT6, IMP_TOT7, REG_FISC, TIP_FAC, IMP_TOT8
    } = req.body;

    const pool = await sql.connect(config);

    const query = `
      INSERT INTO FACTP01 (
        TIP_DOC, CVE_DOC, CVE_CLPV, STATUS, FECHA_DOC, FECHA_ENT, FECHA_VEN,
        IMP_TOT1, IMP_TOT2, IMP_TOT3, IMP_TOT4, DESC_FIN, COM_TOT,
        NUM_MONED, TIPCAMB, PRIMERPAGO, RFC, AUTORIZA, FOLIO, SERIE, ESCFD,
        NUM_ALMA, ACT_CXC, ACT_COI, CVE_VEND, DES_TOT, CONDICION, NUMPAGOS,
        DAT_ENVIO, CONTADO, DAT_MOSTR, CVE_BITA, BLO1, FECHAELAB, CTLPOL,
        CVE_OBS, FORMAENCIO, DES_FIN_PORC, DES_TOT_PORC, IMPORTE,
        COM_TOT_PORC, METODODEPAGO, NUMCATPAGO, UUID, VERSION_SIN,
        IMP_TOT5, IMP_TOT6, IMP_TOT7, REG_FISC, TIP_FAC, IMP_TOT8
      )
      VALUES (
        @TIP_DOC, @CVE_DOC, @CVE_CLPV, @STATUS, @FECHA_DOC, @FECHA_ENT, @FECHA_VEN,
        @IMP_TOT1, @IMP_TOT2, @IMP_TOT3, @IMP_TOT4, @DESC_FIN, @COM_TOT,
        @NUM_MONED, @TIPCAMB, @PRIMERPAGO, @RFC, @AUTORIZA, @FOLIO, @SERIE, @ESCFD,
        @NUM_ALMA, @ACT_CXC, @ACT_COI, @CVE_VEND, @DES_TOT, @CONDICION, @NUMPAGOS,
        @DAT_ENVIO, @CONTADO, @DAT_MOSTR, @CVE_BITA, @BLO1, @FECHAELAB, @CTLPOL,
        @CVE_OBS, @FORMAENCIO, @DES_FIN_PORC, @DES_TOT_PORC, @IMPORTE,
        @COM_TOT_PORC, @METODODEPAGO, @NUMCATPAGO, @UUID, @VERSION_SIN,
        @IMP_TOT5, @IMP_TOT6, @IMP_TOT7, @REG_FISC, @TIP_FAC, @IMP_TOT8
      )
    `;

    await pool.request()
      .input("TIP_DOC", sql.VarChar, TIP_DOC)
      .input("CVE_DOC", sql.VarChar, CVE_DOC)
      .input("CVE_CLPV", sql.VarChar, CVE_CLPV)
      .input("STATUS", sql.VarChar, STATUS)
      .input("FECHA_DOC", sql.DateTime, FECHA_DOC)
      .input("FECHA_ENT", sql.DateTime, FECHA_ENT)
      .input("FECHA_VEN", sql.DateTime, FECHA_VEN)
      .input("IMP_TOT1", sql.Float, IMP_TOT1)
      .input("IMP_TOT2", sql.Float, IMP_TOT2)
      .input("IMP_TOT3", sql.Float, IMP_TOT3)
      .input("IMP_TOT4", sql.Float, IMP_TOT4)
      .input("DESC_FIN", sql.Float, DESC_FIN)
      .input("COM_TOT", sql.Float, COM_TOT)
      .input("NUM_MONED", sql.Int, NUM_MONED)
      .input("TIPCAMB", sql.Float, TIPCAMB)
      .input("PRIMERPAGO", sql.Float, PRIMERPAGO)
      .input("RFC", sql.VarChar, RFC)
      .input("AUTORIZA", sql.VarChar, AUTORIZA)
      .input("FOLIO", sql.Int, FOLIO)
      .input("SERIE", sql.VarChar, SERIE)
      .input("ESCFD", sql.Bit, ESCFD)
      .input("NUM_ALMA", sql.Int, NUM_ALMA)
      .input("ACT_CXC", sql.Bit, ACT_CXC)
      .input("ACT_COI", sql.Bit, ACT_COI)
      .input("CVE_VEND", sql.VarChar, CVE_VEND)
      .input("DES_TOT", sql.Float, DES_TOT)
      .input("CONDICION", sql.VarChar, CONDICION)
      .input("NUMPAGOS", sql.Int, NUMPAGOS)
      .input("DAT_ENVIO", sql.VarChar, DAT_ENVIO)
      .input("CONTADO", sql.Bit, CONTADO)
      .input("DAT_MOSTR", sql.VarChar, DAT_MOSTR)
      .input("CVE_BITA", sql.Int, CVE_BITA)
      .input("BLO1", sql.Int, BLO1)
      .input("FECHAELAB", sql.DateTime, FECHAELAB)
      .input("CTLPOL", sql.Int, CTLPOL)
      .input("CVE_OBS", sql.Int, CVE_OBS)
      .input("FORMAENCIO", sql.Int, FORMAENCIO)
      .input("DES_FIN_PORC", sql.Float, DES_FIN_PORC)
      .input("DES_TOT_PORC", sql.Float, DES_TOT_PORC)
      .input("IMPORTE", sql.Float, IMPORTE)
      .input("COM_TOT_PORC", sql.Float, COM_TOT_PORC)
      .input("METODODEPAGO", sql.VarChar, METODODEPAGO)
      .input("NUMCATPAGO", sql.Int, NUMCATPAGO)
      .input("UUID", sql.VarChar, UUID)
      .input("VERSION_SIN", sql.VarChar, VERSION_SIN)
      .input("IMP_TOT5", sql.Float, IMP_TOT5)
      .input("IMP_TOT6", sql.Float, IMP_TOT6)
      .input("IMP_TOT7", sql.Float, IMP_TOT7)
      .input("REG_FISC", sql.VarChar, REG_FISC)
      .input("TIP_FAC", sql.VarChar, TIP_FAC)
      .input("IMP_TOT8", sql.Float, IMP_TOT8)
      .query(query);

    res.status(201).json({ message: "Cotización insertada correctamente." });
  } catch (err) {
    console.error("Error al insertar la cotización:", err);
    res.status(500).json({
      error: "Error al insertar la cotización",
      details: err.message,
    });
  }
});
// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
  console.log("Servidor corriendo en el puerto 5000");
});
