const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql = require("mysql");
module.exports = class Active {
  constructor() {}
  async promiseMethod(consult, data) {
    var conn = sql.connect();
    try {
      conn.connect();
    } catch (err) {
      conn = sql.connectUCR();
      conn.connect();
    }
    if (data != "") {
      return new Promise((resolve, reject) => {
        conn.query(consult, data, function (error, results, fields) {
          if (error) {
            //return console.error(error.message);
            return reject(error);
          }
          sql.close(conn);
          return resolve(results);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        conn.query(consult, function (error, results, fields) {
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
    let res = await this.promiseMethod("call sp_allActives()", "");
    return res;
  }
  async activesById(data) {
    let active = [data];
    let res = await this.promiseMethod("call sp_allActives_by_area(?)", active);
    return res;
  }
  async activesByIdActive(data) {
    let active = [data];
    let res = await this.promiseMethod("call sp_active_by_id(?)", active);
    return res;
  }
  async view_loan(data) {
    let active = [data];
    let res = await this.promiseMethod("call sp_view_loan(?)", active);
    return res;
  }

  async activesByIdArea(data) {
    let active = [data];
    let res = await this.promiseMethod(
      "call sp_allActives_by_id_area(?)",
      active
    );
    return res;
  }
  async activesByIdEdifice(data) {
    let active = [data];
    let res = await this.promiseMethod(
      "call sp_allActives_by_id_edifice(?)",
      active
    );
    return res;
  }

  async addActive(data) {
    let active = [
      data.active.name,
      data.active.licensePlate,
      data.active.mark,
      data.active.model,
      data.active.serie,
      data.active.amount,
      data.active.placeOrigin,
      data.active.description,
    ];
    let res = await this.promiseMethod(
      "call sp_add_active(?,?,?,?,?,?,?,?)",
      active
    );
    return res;
  }
  async editActive(data) {
    let active = [
      data.idActive,
      data.name,
      data.licensePlate,
      data.mark,
      data.model,
      data.serie,
      data.amount,
      data.placeOrigin,
      data.description,
    ];
    let res = await this.promiseMethod(
      "call sp_edit_active(?,?,?,?,?,?,?,?,?)",
      active
    );
    return res;
  }
  async editStatusActive(data) {
    let active = [data.idActive, data.isLoan];
    let res = await this.promiseMethod("call sp_edit_loan_active(?,?)", active);
    return res;
  }
  async insertLoan(data) {
    let active = [data.name, data.loanDate];
    let res = await this.promiseMethod("call sp_insert_loan(?,?)", active);
    return res;
  }
  async insertLoanActive(data) {
    let active = [data.idLoan, data.idActive];
    let res = await this.promiseMethod(
      "call sp_insert_loan_active(?,?)",
      active
    );
    return res;
  }
  async updateLoanActive(data, status) {
    let active = [data, status];
    let res = await this.promiseMethod("call sp_edit_loan_active(?,?)", active);
    return res;
  }
  async sp_delete_distribution(data) {
    let active = [data];
    let res = await this.promiseMethod(
      "call sp_delete_distribution(?)",
      active
    );
  }
  async editDistributionActive(data) {
    let active;
    let res;
    for (let i = 0; i < data.areas.length; i++) {
      active = [data.idActive, data.areas[i].idArea, data.areas[i].amount];
      res = await this.promiseMethod(
        "call sp_edit_distribution(?,?,?)",
        active
      );
    }
    return res;
  }
  async allLoans() {
    let res = await this.promiseMethod("call sp_allLoans()", "");
    return res;
  }
  async allAreasActives() {
    let res = await this.promiseMethod("call sp_allAreasActives()", "");
    return res;
  }
  async allLoanActives() {
    let res = await this.promiseMethod("call sp_allLoanActives()", "");
    return res;
  }
};
