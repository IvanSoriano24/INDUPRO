const express = require('express');
const sql = require('mssql'); // Cambiar a mssql
const app = express();
const cors = require('cors');

// Middleware para permitir solicitudes CORS
app.use(cors());

// Configuración de conexión a la base de datos SQL Server
const config = {
    user: 'sa',
    password: 'Green2580a.',
    server: '35.222.201.74',  // Cambia la IP según tu configuración
    database: 'SAE90Empre01',
    options: {
        encrypt: true,   // Si estás usando SSL
        trustServerCertificate: true,  // Evita problemas con certificados en algunos entornos
    },
};

// Conexión a la base de datos
sql.connect(config).then(pool => {
    console.log('Conexión exitosa a SQL Server');
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});

// Ruta para obtener las claves y descripciones de INVE01
app.get('/api/claves', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT CVE_ART, DESCR FROM INVE01');
        res.json(result.recordset);  // Enviar los resultados como respuesta
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error al obtener datos de la base de datos', details: err });
    }
});

// Ruta para obtener las líneas
app.get('/api/lineasMaster', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query('SELECT CVE_LIN, DESC_LIN FROM CLIN01');
        
        // Crear un objeto único basado en los primeros dos dígitos y asociar la descripción
        const unidades = result.recordset.reduce((acc, linea) => {
            const unidad = linea.CVE_LIN.slice(0, 2);
            if (!acc.some(item => item.unidad === unidad)) {
                acc.push({ unidad, descripcion: linea.DESC_LIN });
            }
            return acc;
        }, []);

        res.json(unidades); // Enviar unidades con descripciones
    } catch (err) {
        console.error('Error al ejecutar la consulta de líneas:', err);
        res.status(500).json({ error: 'Error al obtener las líneas de la base de datos', details: err });
    }
});
app.get('/api/categorias/:unidad', async (req, res) => {
    try {
        const { unidad } = req.params; // Obtener el primer par (unidad) de los parámetros
        const pool = await sql.connect(config);

        // Query para obtener categorías (segundo par) relacionadas con la unidad
        const result = await pool.request()
            .input('unidad', sql.VarChar, unidad)
            .query(`SELECT CVE_LIN, DESC_LIN 
                    FROM CLIN01 
                    WHERE CVE_LIN LIKE @unidad + '.%' 
                    AND CHARINDEX('.', CVE_LIN) > 0`);

        res.json(result.recordset); // Enviar las categorías al cliente
    } catch (err) {
        console.error('Error al obtener las categorías:', err);
        res.status(500).json({ error: 'Error al obtener las categorías', details: err });
    }
});
app.get('/api/lineas/:categoria', async (req, res) => {
    const { categoria } = req.params;
    console.log("Categoría recibida:", categoria); // Log para verificar el parámetro recibido
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('categoria', sql.VarChar, `${categoria}%`)
            .query(`SELECT CVE_LIN, DESC_LIN 
                    FROM CLIN01 
                    WHERE CVE_LIN LIKE @categoria 
                    AND CHARINDEX('.', CVE_LIN) > 0`);
        console.log("Líneas obtenidas:", result.recordset); // Verifica el resultado de la consulta
        res.json(result.recordset);
    } catch (err) {
        console.error("Error al obtener las líneas:", err);
        res.status(500).json({ error: 'Error al obtener las líneas', details: err });
    }
});
// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
    console.log('Servidor corriendo en el puerto 5000');
});