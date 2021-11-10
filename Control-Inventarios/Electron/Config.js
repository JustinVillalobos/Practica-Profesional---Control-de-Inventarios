const mssql = require('mysql');


const config ={
      host     : 'localhost',
<<<<<<< HEAD
      user     : 'root',
      password : 'root',
=======
      user     : 'ucr_user',
      password : 'ucr_recinto_guapiles_2021',
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
      database : 'db_control_inventario'
   };
module.exports = class Sql {
    constructor() {

    }

    connect() {

        var connection = mssql.createConnection(config);
        return connection;
    }
<<<<<<< HEAD
=======
    connectUCR() {
        config.host ="http://rgu.com";
        var connection = mssql.createConnection(config);
        return connection;
    }
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af

    close(connection) {
        return connection.end();
    }
}