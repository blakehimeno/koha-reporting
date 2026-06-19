const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    trustServerCertificate: true,
  },
};

let pool;

async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

module.exports = { getConnection, sql };