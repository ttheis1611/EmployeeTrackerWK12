const mysql = require('mysql2');

const connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "business_db"
});

connection.connect((err) => {
    if(err) throw err
});

module.exports = connection;
