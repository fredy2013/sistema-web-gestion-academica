const pool = require('../config/db');
 
const obtenerTodos = async () => {
const resultado = await pool.query(
"SELECT * FROM estudiantes ORDER BY id"
);
 
return resultado.rows;
};
 
const crear = async (estudiante) => {
const resultado = await pool.query(
`
INSERT INTO estudiantes
(
tipo_documento,
numero_documento,
nombres,
apellidos,
correo,
celular,
estado
)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *
`,
[
estudiante.tipoDocumento,
estudiante.numeroDocumento,
estudiante.nombres,
estudiante.apellidos,
estudiante.correo,
estudiante.celular,
estudiante.estado
]
);
 
return resultado.rows[0];
};
 
module.exports = {
obtenerTodos,
crear
};