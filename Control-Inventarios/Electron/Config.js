const mssql = require('mysql');


const config ={
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'db_control_inventario'
   };
module.exports = class Sql {
    constructor() {

    }

    connect() {

        var connection = mssql.createConnection(config);
        return connection;
    }

    close(connection) {
        return connection.end();
    }
}