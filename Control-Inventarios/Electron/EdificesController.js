const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql =  require('mysql');
module.exports = class Sql {
	constructor() {

    }
    async promiseMethod(consult,data){
    	var conn = sql.connect();
    	conn.connect();
    	if(data != ""){
    		return new Promise((resolve, reject) => {
				conn.query( consult,data,
					function (error, results, fields) {
					  if (error) {
					    //return console.error(error.message);
					    return reject(error);
					  }
					  sql.close(conn);
					  return resolve(results);
					});
				 });
    	}else{
    		return new Promise((resolve, reject) => {
			conn.query( consult,
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
    }

    async allEdifices() {
    	 let res  = await this.promiseMethod('call sp_all_edifices()','');
    	 return res;
    }
    async addEdifice(data) {
    	let edifice = [data.name];
    	 let res  = await this.promiseMethod('call sp_add_edifice(?)',edifice);
    	 return res;
    }
    async editEdifice(data) {
    	let edifice = [data.idEdifice,data.name];
    	 let res  = await this.promiseMethod('call sp_edit_edifice(?,?)',edifice);
    	 return res;
    }
    async editStatusEdifice(data) {
    	let edifice = [data.idEdifice,data.status];
    	 let res  = await this.promiseMethod('call sp_edit_status(?,?)',edifice);
    	 return res;
    }


}