const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql =  require('mysql');
module.exports = class Active {
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

    async allActives() {
    	 let res  = await this.promiseMethod('call sp_allActives()','');
    	 return res;
    }
    async activesById(data) {
    	let active = [data.idActive];
    	 let res  = await this.promiseMethod('call sp_allActives_by_area(?)',active);
    	 return res;
    }
    async addActive(data) {
    	let active = [data.name,data.licensePlate,data.mark,data.model,data.serie,data.amount];
    	 let res  = await this.promiseMethod('call sp_add_edifice(?,?,?,?,?,?)',active);
    	 return res;
    }
    async editActive(data) {
    	let active = [data.idActive,data.name,data.licensePlate,data.mark,data.model,data.serie,data.amount];
    	 let res  = await this.promiseMethod('call sp_edit_edifice(?,?,?,?,?,?,?)',active);
    	 return res;
    }
    async editStatusActive(data) {
    	let active = [data.idEdifice,data.status];
    	 let res  = await this.promiseMethod('call sp_edit_status(?,?)',active);
    	 return res;
    }


}