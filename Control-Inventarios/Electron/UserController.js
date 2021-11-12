const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql =  require('mysql');
module.exports = class User {
	constructor() {

    }
    async promiseMethod(consult,data){
    	var conn = sql.connect();
    	try{
    		conn.connect();
    	}catch(err){
    		conn = sql.connectUCR();
    		conn.connect();
    	}
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
    async userData(data) {
    	 let res  = await this.promiseMethod('call sp_user(?)',[data]);
    	 return res;
    }
    async updateUserData(data) {
    	 let res  = await this.promiseMethod('call sp_user(?,?,?)',[data.idUser,data.name,data.email]);
    	 return res;
    }
    async updatePasswordData(data) {
    	 let res  = await this.promiseMethod('call sp_user(?,?)',[data.idUser,data.password]);
    	 return res;
    }
    async validateUserData(data) {
    	 let res  = await this.promiseMethod('call sp_validate_user(?)',[data.idToken,data.username]);
    	 return res;
    }


 }