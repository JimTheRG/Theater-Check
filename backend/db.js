const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
     host: process.env.DB_HOST || 'localhost',
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || '',
     database: process.env.DB_NAME || 'theater_booking',
     connectionLimit: 10,
     acquireTimeout: 10000
});

module.exports = {
  query: async (sql, params) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(sql, params);
      // Simplify results to plain JS objects (handles BigInt issues naturally)
      return JSON.parse(JSON.stringify(res, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
    } catch (err) {
      console.error("Database Error: ", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
};
