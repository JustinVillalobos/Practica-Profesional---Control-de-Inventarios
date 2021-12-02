let mssql = require("mysql");

const config = {
  host: "localhost",
  user: "ucr_user",
  password: "ucr_recinto_guapiles_2021",
  database: "db_control_inventario",
};
module.exports = class Sql {
  constructor() {}

  connect() {
    var connection = mssql.createConnection(config);
    return connection;
  }
  connectUCR() {
    config.host = "http://rgu.com";
    var connection = mssql.createConnection(config);
    return connection;
  }

  close(connection) {
    return connection.end();
  }
};
