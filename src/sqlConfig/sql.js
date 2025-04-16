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
  server: "35.222.201.74",
  database: "SAE90Empre01",
  options: {
    encrypt: true, // Si estás usando SSL
    trustServerCertificate: true, // Evita problemas con certificados en algunos entornos
  },
};
/*const config = {
  user: "sun",
  password: "Green2580a.",
  server: "187.188.133.4", 
  database: "SAE90Empre02",
  options: {
    encrypt: true, // Si estás usando SSL
    trustServerCertificate: true, // Evita problemas con certificados en algunos entornos
  },
};*/
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
    const result = await pool.request().query(`
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
      CVE_DOC,
      clie,
      IMP_TOT4,
      RFC,
      FOLIO,
      CVE_VEND,
      IMPORTE,
      METODODEPAGO,
      NUMCATPAGO,
      USO_CFDI,
      REG_FISC,
      FORMAPAGOSAT,
    } = req.body;

    const pool = await sql.connect(config);
    const CVE_CLPV = clie.padStart(10, " ");
    const now = new Date();

    const FECHA_DOC = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now
      .getDate()
      .toString()
      .padStart(2, "0")} 00:00:00.000`;
    const VERSION_SINC = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}.000`;
    const query = `
      INSERT INTO FACTP01 (
        TIP_DOC, CVE_DOC, CVE_CLPV, STATUS, FECHA_DOC, FECHA_ENT, FECHA_VEN,
        IMP_TOT1, IMP_TOT2, IMP_TOT3, IMP_TOT4, DESC_FIN, COM_TOT,
        NUM_MONED, TIPCAMB, PRIMERPAGO, RFC, AUTORIZA, FOLIO, SERIE, ESCFD,
        NUM_ALMA, ACT_CXC, ACT_COI, CVE_VEND, DES_TOT, CONDICION, NUMPAGOS,
        DAT_ENVIO, CONTADO, DAT_MOSTR, CVE_BITA, BLOQ, FECHAELAB, CTLPOL,
        CVE_OBS, FORMAENCIO, DES_FIN_PORC, DES_TOT_PORC, IMPORTE,
        COM_TOT_PORC, METODODEPAGO, NUMCATPAGO, UUID, VERSION_SINC,
        FORMADEPAGOSAT, USO_CFDI, IMP_TOT5, IMP_TOT6, IMP_TOT7, REG_FISC, TIP_FAC, IMP_TOT8
      )
      VALUES (
        @TIP_DOC, @CVE_DOC, @CVE_CLPV, @STATUS, @FECHA_DOC, @FECHA_ENT, @FECHA_VEN,
        @IMP_TOT1, @IMP_TOT2, @IMP_TOT3, @IMP_TOT4, @DESC_FIN, @COM_TOT,
        @NUM_MONED, @TIPCAMB, @PRIMERPAGO, @RFC, @AUTORIZA, @FOLIO, @SERIE, @ESCFD,
        @NUM_ALMA, @ACT_CXC, @ACT_COI, @CVE_VEND, @DES_TOT, @CONDICION, @NUMPAGOS,
        @DAT_ENVIO, @CONTADO, @DAT_MOSTR, @CVE_BITA, @BLOQ, @FECHAELAB, @CTLPOL,
        @CVE_OBS, @FORMAENCIO, @DES_FIN_PORC, @DES_TOT_PORC, @IMPORTE,
        @COM_TOT_PORC, @METODODEPAGO, @NUMCATPAGO, @UUID, @VERSION_SIN,
        @FORMADEPAGOSAT, @USO_CFDI, @IMP_TOT5, @IMP_TOT6, @IMP_TOT7, @REG_FISC, @TIP_FAC, @IMP_TOT8
      )
    `;

    await pool
      .request()
      .input("TIP_DOC", sql.VarChar, "C")
      .input("CVE_DOC", sql.VarChar, CVE_DOC)
      .input("CVE_CLPV", sql.VarChar, CVE_CLPV)
      .input("STATUS", sql.VarChar, "E")
      .input("FECHA_DOC", sql.DateTime, FECHA_DOC)//AQUI
      .input("FECHA_ENT", sql.DateTime, FECHA_DOC)
      .input("FECHA_VEN", sql.DateTime, FECHA_DOC)
      .input("IMP_TOT1", sql.Float, 0)
      .input("IMP_TOT2", sql.Float, 0)
      .input("IMP_TOT3", sql.Float, 0)
      .input("IMP_TOT4", sql.Float, IMP_TOT4)
      .input("DESC_FIN", sql.Float, 0)
      .input("COM_TOT", sql.Float, 0)
      .input("NUM_MONED", sql.Int, 1)
      .input("TIPCAMB", sql.Float, 1)
      .input("PRIMERPAGO", sql.Float, 0)
      .input("RFC", sql.VarChar, RFC)
      .input("AUTORIZA", sql.VarChar, 1)
      .input("FOLIO", sql.Int, FOLIO)
      .input("SERIE", sql.VarChar, '')
      .input("ESCFD", sql.Bit, 'N')
      .input("NUM_ALMA", sql.Int, 1)
      .input("ACT_CXC", sql.Bit, 'S')
      .input("ACT_COI", sql.Bit, 'N')
      .input("CANT_TOT", sql.VarChar, IMPORTE)
      .input("CVE_VEND", sql.VarChar, CVE_VEND)//AQUI
      .input("DES_TOT", sql.Float, 0)
      .input("CONDICION", sql.VarChar, '')
      .input("NUMPAGOS", sql.Int, 1)
      .input("DAT_ENVIO", sql.VarChar, 0)
      .input("CONTADO", sql.Bit, 'N')
      .input("DAT_MOSTR", sql.VarChar, 0)
      .input("CVE_BITA", sql.Int, 0)//AQUI
      .input("BLOQ", sql.Int, BLOQ)
      .input("FECHAELAB", sql.DateTime, VERSION_SINC)
      .input("CTLPOL", sql.Int, 0)
      .input("CVE_OBS", sql.Int, 0)//AQUI
      .input("FORMAENCIO", sql.Int, 'I')
      .input("DES_FIN_PORC", sql.Float, 0)
      .input("DES_TOT_PORC", sql.Float, 0)
      .input("IMPORTE", sql.Float, (IMPORTE + IMP_TOT4))
      .input("COM_TOT_PORC", sql.Float, 0)
      .input("METODODEPAGO", sql.VarChar, METODODEPAGO)
      .input("NUMCATPAGO", sql.Int, NUMCATPAGO)
      .input("UUID", sql.VarChar, '')
      .input("VERSION_SIN", sql.VarChar, VERSION_SINC)
      .input("IMP_TOT5", sql.Float, 0)
      .input("IMP_TOT6", sql.Float, 0)
      .input("IMP_TOT7", sql.Float, 0)
      .input("REG_FISC", sql.VarChar, REG_FISC)
      .input("TIP_FAC", sql.VarChar, 'C')
      .input("IMP_TOT8", sql.Float, 0)
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
app.post("/api/guardarPartidas", async (req, res) => {
  try {
    const { data: partidas } = req.body;
    for (const data of partidas) {
      const {
        CVE_DOC,
        nuPartida,
        CVE_ART,
        CANT,
        PREC,
        IMPU1,
        IMPU2,
        IMPU3,
        IMPU4,
        IMPU5,
        IMPU6,
        IMPU7,
        IMPU8,
        CVE_ESQ,
        TOT_PARTIDA,
        IMP1APLICA,
        IMP2APLICA,
        IMP3APLICA,
        IMP4APLICA,
        IMP5APLICA,
        IMP6APLICA,
        IMP7APLICA,
        IMP8APLICA,
        UNI_VENTA,
      } = req.body;

      const pool = await sql.connect(config);
      const date = new Date();
      const VERSION_SINC = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${date
        .getSeconds()
        .toString()
        .padStart(2, "0")}.000`;

      const TIPO_PROD = ["No aplica", "SERVICIO", "Servicio"].includes(
        UNI_VENTA
      )
        ? "S"
        : "P";
      const TOTIMP4 = TOT_PARTIDA - TOT_PARTIDA * (IMPU4 / 100);
      const query = `
      INSERT INTO PAR_FACTP01 (
        CVE_DOC, NUM_PAR, CVE_ART, CANT, PXS, PREC, COST
        IMPU1, IMPU2, IMPU3, IMPU4, IMP1APLA, IMP2APLA, IMP3APLA, IMP4APLA
        TOTIMP1, TOTIMP2, TOTIMP3, TOTIMP4, DESC1, DESC2, DESC3, COMI,
        APAR, ACT_INV, NUM_ALM, TIP_CAM, UNI_VENTA, TIPO_PROD, CVE_OBS,
        REG_SERIE, E_LTPD, TIPO_ELEM, NUM_MOV, TOT_PARTIDA, IMPRIMIR, MAN_IEPS,
        APL_MAN_IMP, CUOTA_IEPS, APL_MAN_IEPS, MTO_PORC, MTO_CUOTA, CVE_ESQ,
        UUID, VERSION_SINC, TOTIMP8, TOTIMP7, TOTIMP6, TOTIMP5
        IMP8APLA, IMP7APLA, IMP6APLA, IMP5APLA, IMPU8, IMPU7, IMPU6, IMPU5
      )
      VALUES (
        @CVE_DOC, @NUM_PAR, @CVE_ART, @CANT, @PXS, @PREC, @COST
        @IMPU1, @IMPU2, @IMPU3, @IMPU4, @IMP1APLA, @IMP2APLA, I@MP3APLA, I@MP4APLA
        @TOTIMP1, @TOTIMP2, @TOTIMP3, @TOTIMP4, @DESC1, @DESC2, @DESC3, @COMI,
        @APAR, @ACT_INV, @NUM_ALM, @TIP_CAM, @UNI_VENTA, @TIPO_PROD, @CVE_OBS,
        @REG_SERIE, @E_LTPD, @TIPO_ELEM, @NUM_MOV, @TOT_PARTIDA, @IMPRIMIR, @MAN_IEPS,
        @APL_MAN_IMP, @CUOTA_IEPS, @APL_MAN_IEPS, @MTO_PORC, @MTO_CUOTA, @CVE_ESQ,
        @UUID, @VERSION_SINC, @TOTIMP8, @TOTIMP7, @TOTIMP6, @TOTIMP5
        @IMP8APLA, @IMP7APLA, @IMP6APLA, @IMP5APLA, @IMPU8, @IMPU7, @IMPU6, @IMPU5
      )
    `;

      await pool
        .request()
        .input("CVE_DOC", sql.VarChar, CVE_DOC)
        .input("NUM_PAR", sql.VarChar, nuPartida)
        .input("CVE_ART", sql.VarChar, CVE_ART)
        .input("CANT", sql.VarChar, CANT)
        .input("PXS", sql.DateTime, 0)
        .input("PREC", sql.DateTime, PREC)
        .input("COST", sql.DateTime, 0)
        .input("IMPU1", sql.Float, IMPU1)
        .input("IMPU2", sql.Float, IMPU2)
        .input("IMPU3", sql.Float, IMPU3)
        .input("IMPU4", sql.Float, IMPU4)
        .input("IMP1APLA", sql.Float, IMP1APLICA)
        .input("IMP2APLA", sql.Float, IMP2APLICA)
        .input("IMP3APLA", sql.Int, IMP3APLICA)
        .input("IMP4APLA", sql.Float, IMP4APLICA)
        .input("TOTIMP1", sql.Float, 0)
        .input("TOTIMP2", sql.VarChar, 0)
        .input("TOTIMP3", sql.VarChar, 0)
        .input("TOTIMP4", sql.Int, TOTIMP4)
        .input("DESC1", sql.VarChar, 0)
        .input("DESC2", sql.Bit, 0)
        .input("COMI", sql.Int, 0)
        .input("APAR", sql.Bit, 0)
        .input("ACT_INV", sql.Bit, N)
        .input("NUM_ALM", sql.VarChar, 1)
        .input("TIP_CAM", sql.Float, 1)
        .input("UNI_VENTA", sql.VarChar, UNI_VENTA)
        .input("TIPO_PROD", sql.Int, TIPO_PROD)
        .input("CVE_OBS", sql.Int, 0)
        .input("REG_SERIE", sql.VarChar, 0)
        .input("E_LTPD", sql.Bit, 0)
        .input("TIPO_ELEM", sql.VarChar, "N")
        .input("NUM_MOV", sql.Int, 0)
        .input("TOT_PARTIDA", sql.Int, TOT_PARTIDA)
        .input("IMPRIMIR", sql.DateTime, "S")
        .input("MAN_IEPS", sql.DateTime, "N")
        .input("APL_MAN_IMP", sql.Int, 1)
        .input("CUOTA_IEPS", sql.Int, 0)
        .input("APL_MAN_IEPS", sql.Int, "N")
        .input("MTO_PORC", sql.Float, 0)
        .input("MTO_CUOTA", sql.Float, 0)
        .input("CVE_ESQ", sql.Float, CVE_ESQ)
        .input("UUID", sql.VarChar, "")
        .input("VERSION_SINC", sql.VarChar, VERSION_SINC)
        .input("TOTIMP8", sql.Float, 0)
        .input("TOTIMP7", sql.Float, 0)
        .input("TOTIMP6", sql.Float, 0)
        .input("TOTIMP5", sql.VarChar, 0)
        .input("IMP8APLA", sql.VarChar, IMP8APLICA)
        .input("IMP7APLA", sql.Float, IMP7APLICA)
        .input("IMP6APLA", sql.Float, IMP6APLICA)
        .input("IMP5APLA", sql.Float, IMP5APLICA)
        .input("IMPU8", sql.Float, IMPU8)
        .input("IMPU7", sql.Float, IMPU7)
        .input("IMPU6", sql.Float, IMPU6)
        .input("IMPU5", sql.Float, IMPU5)
        .query(query);
    }
    res.status(201).json({ message: "Cotización insertada correctamente." });
  } catch (err) {
    console.error("Error al insertar la cotización:", err);
    res.status(500).json({
      error: "Error al insertar la cotización",
      details: err.message,
    });
  }
});
app.get("/api/datosClie/:clave", async (req, res) => {
  try {
    const { clave } = req.params;
    const claveFormateada = clave.padStart(10, " ");

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("clave", sql.VarChar, claveFormateada).query(`
        SELECT METODODEPAGO, RFC, NUMCTAPAGO, FORMADEPAGOSAT, USO_CFDI, REG_FISC
        FROM CLIE01 
        WHERE CLAVE = @clave
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontró el cliente." });
    }

    res.json({ datosCliente: result.recordset[0] });
  } catch (err) {
    console.error("Error al obtener datos del cliente:", err);
    res.status(500).json({
      error: "Error al obtener los datos del cliente",
      details: err.message,
    });
  }
});
app.get("/api/datosInsumoe/:cve_art", async (req, res) => {
  try {
    const { cve_art } = req.params;
    const pool = await sql.connect(config);
    const result = await pool.request().input("cve_art", sql.VarChar, cve_art) // ✅ importante usar .input()
      .query(`
        SELECT I.COSTO_PROM, I.CVE_ESQIMPU, I.UNI_MED,
               E.IMPUESTO1, E.IMPUESTO2, E.IMPUESTO3, E.IMPUESTO4,
               E.IMPUESTO5, E.IMPUESTO6, E.IMPUESTO7, E.IMPUESTO8,
               E.IMP1APLICA, E.IMP2APLICA, E.IMP3APLICA, E.IMP4APLICA,
               E.IMP5APLICA, E.IMP6APLICA, E.IMP7APLICA, E.IMP8APLICA
        FROM INVE01 I
        INNER JOIN IMPU01 E ON I.CVE_ESQIMPU = E.CVE_ESQIMPU
        WHERE CVE_ART = @cve_art
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No se encontró el insumo." });
    }

    const datosInsumos = result.recordset[0]; // ✅
    res.json({ datosInsumos }); // ✅
  } catch (err) {
    console.error("❌ Error al ejecutar la consulta:", err);
    res.status(500).json({
      error: "Error al obtener el insumo de la base de datos",
      details: err.message,
    });
  }
});
// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
  console.log("Servidor corriendo en el puerto 5000");
});
