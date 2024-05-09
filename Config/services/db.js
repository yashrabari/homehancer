const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results, ] = await connection.execute(sql, params);
  connection.end();
  return results;
}



async function query1(sql, params) {
  const pool = await mysql.createPool(config.db);

  pool.getConnection((err,connection)=> {
    if(err)
    throw err;
    console.log('Database connected successfully');
    connection.release();
  });

  const [results, ] =await pool.query(sql);
  // const [results, ] = await connection.execute(sql, params);

  return results;
}




module.exports = {
  query,
  query1
}