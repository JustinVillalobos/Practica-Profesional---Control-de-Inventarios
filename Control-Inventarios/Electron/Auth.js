const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql =  require('mysql');
module.exports = class Sql {
     
    constructor() {

    }
    async promiseMethod(username, password){
    	var conn = sql.connect();
    	conn.connect();
    	return new Promise((resolve, reject) => {
		conn.query( 'call sp_session(?,?)',[username,password],
			function (error, results, fields) {
			  if (error) {
			    //return console.error(error.message);
			    return reject(error);
			  }
			  sql.close(conn);
			  return resolve(results);
			});
		 });
    }
    async session(username,password) {
    	 let res  = await this.promiseMethod(username, password);
    	 return res;
    }

}