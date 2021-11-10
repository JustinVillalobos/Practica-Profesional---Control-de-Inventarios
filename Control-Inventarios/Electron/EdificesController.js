const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql =  require('mysql');
module.exports = class Edifice {
	constructor() {

    }
    async promiseMethod(consult,data){
    	var conn = sql.connect();
<<<<<<< HEAD
    	conn.connect();
=======
    	try{
    		conn.connect();
    	}catch(err){
    		conn = sql.connectUCR();
    		conn.connect();
    	}
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
    	if(data != ""){
    		return new Promise((resolve, reject) => {
				conn.query( consult,data,
					function (error, results, fields) {
					  if (error) {
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

<<<<<<< HEAD
=======
	async allEdificesActive() {
    	 let res  = await this.promiseMethod('call sp_all_edifices_actives()','');
    	 return res;
    }
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
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
<<<<<<< HEAD
=======
    	console.log(data);
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
    	let edifice = [data.idEdifice,data.name];
    	 let res  = await this.promiseMethod('call sp_edit_edifice(?,?)',edifice);
    	 return res;
    }
    async editStatusEdifice(data) {
<<<<<<< HEAD
    	let edifice = [data.idEdifice,data.status];
=======
    	let edifice = [data.idEdifice,data.isEnabled];
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
    	 let res  = await this.promiseMethod('call sp_edit_status(?,?)',edifice);
    	 return res;
    }


}