const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: process.env.REMOTE_HOST,
  user: process.env.USER_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.PASSWORD,
  multipleStatements: true,
});

export default connection;