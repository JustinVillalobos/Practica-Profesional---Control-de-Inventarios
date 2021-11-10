const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql =  require('mysql');
module.exports = class Area {
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

    async allAreas() {
    	 let res  = await this.promiseMethod('call sp_all_areas()','');
    	 return res;
    }
<<<<<<< HEAD
     async allAreasByEdifice(data) {
     	let area = [data.idEdifice];
=======
     async allAreasActives() {
    	 let res  = await this.promiseMethod('call sp_all_areas_actives()','');
    	 return res;
    }
     async allAreasByEdifice(data) {
     	let area = [data];
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
    	 let res  = await this.promiseMethod('call sp_all_area_edificio(?)',area);
    	 return res;
    }
    async addArea(data) {
<<<<<<< HEAD
    	let area = [data.name,data.edifice];
=======
    	let area = [data.name,data.edifice.idEdifice];
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
    	 let res  = await this.promiseMethod('call sp_add_area(?,?)',area);
    	 return res;
    }
    async editArea(data) {
<<<<<<< HEAD
    	let area = [data.idArea,data.name,data.edifice];
=======
    	let area = [data.idArea,data.name,data.edifice.idEdifice];
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
    	 let res  = await this.promiseMethod('call sp_edit_area(?,?,?)',area);
    	 return res;
    }
    async editStatusArea(data) {
<<<<<<< HEAD
    	let area = [data.idArea,data.status];
=======
    	let area = [data.idArea,data.isEnabled];
>>>>>>> 3cff6faa947af30c940eff6730790e73b39c89af
    	 let res  = await this.promiseMethod('call sp_edit_area_status(?,?)',area);
    	 return res;
    }


}