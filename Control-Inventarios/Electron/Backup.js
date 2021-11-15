
const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql =  require('mysql');
module.exports = class Backup {
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
    async deleteAllInfo() {
    	 let res  = await this.promiseMethod('call sp_delete_all_info()','');
    	 return res;
    }
    async insertEdifice(edifices) {
    	 let res=true;
    	 for(let i=0;i<edifices.length;i++){
    	 	res  = await this.promiseMethod('call sp_bk_edifice(?,?,?)',[edifices[i].idEdifice,edifices[i].name,edifices[i].isEnabled]);
    	 }
    	 return res;
    }
     async insertArea(areas) {
    	 let res=true;
    	 for(let i=0;i<areas.length;i++){
    	 	res  = await this.promiseMethod('call sp_bk_area(?,?,?,?)',[areas[i].idArea,areas[i].name,areas[i].isEnabled,areas[i].idEdifice]);
    	 }
    	 return res;
    }
      async insertActive(actives) {
    	 let res=true;
    	 for(let i=0;i<actives.length;i++){
    	 	res  = await this.promiseMethod('call sp_bk_active(?,?,?,?,?,?,?,?,?,?)',[actives[i].idActive,actives[i].name,actives[i].licensePlate,actives[i].mark,actives[i].model,actives[i].serie,actives[i].amount,actives[i].placeOrigin,actives[i].description,actives[i].isLoan]);
    	 }
    	 return res;
    }
     async insertLoan(loans) {
    	 let res=true;
    	 for(let i=0;i<loans.length;i++){
    	 	res  = await this.promiseMethod('call sp_bk_loan(?,?,?)',[loans[i].idLoan,loans[i].name,loans[i].loanDate]);
    	 }
    	 return res;
    }
    async insertAreaActive(objects) {
    	 let res=true;
    	 for(let i=0;i<objects.length;i++){
    	 	res  = await this.promiseMethod('call sp_edit_distribution(?,?,?)',[objects[i].idActive,objects[i].idArea,objects[i].amount]);
    	 }
    	 return res;
    }
    async insertLoanActive(objects) {
    	 let res=true;
    	 for(let i=0;i<objects.length;i++){
    	 	res  = await this.promiseMethod('call sp_insert_loan_active(?,?)',[objects[i].idLoan,objects[i].idActive]);
    	 }
    	 return res;
    }
 }
   
