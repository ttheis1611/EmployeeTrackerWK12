const mysql = require('mysql2');

const connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "PASSWORD",
    database: "business_db"
    
});

connection.connect((err) => {
    if(err) throw err
    console.log("You have connected to MySQL " + connection.threadId)
});

module.exports = connection;
