const sqlConnection = require("./Config");
const sql = new sqlConnection();
const mssql = require("mysql");
module.exports = class Backup {
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
  async promiseMethod2(consult, data, conn) {
    return new Promise((resolve, reject) => {
      conn.query(consult, data, function (error, results, fields) {
        if (error) {
          //return console.error(error.message);
          return reject(error);
        }

        return resolve(results);
      });
    });
  }
  async deleteAllInfo() {
    let res = await this.promiseMethod("call sp_delete_all_info()", "");
    return res;
  }
  async insertEdifice(edifices) {
    let res = true;
    for (let i = 0; i < edifices.length; i++) {
      res = await this.promiseMethod("call sp_bk_edifice(?,?,?)", [
        edifices[i].idEdifice,
        edifices[i].name,
        edifices[i].isEnabled,
      ]);
    }
    return res;
  }
  async insertArea(areas) {
    let res = true;
    for (let i = 0; i < areas.length; i++) {
      res = await this.promiseMethod("call sp_bk_area(?,?,?,?)", [
        areas[i].idArea,
        areas[i].name,
        areas[i].isEnabled,
        areas[i].idEdifice,
      ]);
    }
    return res;
  }
  async insertActive(actives) {
    let res = true;
    for (let i = 0; i < actives.length; i++) {
      res = await this.promiseMethod("call sp_bk_active(?,?,?,?,?,?,?,?,?,?)", [
        actives[i].idActive,
        actives[i].name,
        actives[i].licensePlate,
        actives[i].mark,
        actives[i].model,
        actives[i].serie,
        actives[i].amount,
        actives[i].placeOrigin,
        actives[i].description,
        actives[i].isLoan,
      ]);
    }
    return res;
  }
  async insertLoan(loans) {
    let res = true;
    for (let i = 0; i < loans.length; i++) {
      res = await this.promiseMethod("call sp_bk_loan(?,?,?)", [
        loans[i].idLoan,
        loans[i].name,
        loans[i].loanDate,
      ]);
    }
    return res;
  }
  async insertAreaActive(objects) {
    let res = true;
    for (let i = 0; i < objects.length; i++) {
      res = await this.promiseMethod("call sp_edit_distribution(?,?,?)", [
        objects[i].idActive,
        objects[i].idArea,
        objects[i].amount,
      ]);
    }
    return res;
  }
  async insertLoanActive(objects) {
    let res = true;
    for (let i = 0; i < objects.length; i++) {
      res = await this.promiseMethod("call sp_insert_loan_active(?,?)", [
        objects[i].idLoan,
        objects[i].idActive,
      ]);
    }
    return res;
  }
  async insertAllEdifices(edifices) {
    let res = true;
    for (let i = 0; i < edifices.length; i++) {
      res = await this.promiseMethod("call sp_add_edifice(?)", [
        edifices[i].name,
      ]);
    }
    return res;
  }
  async insertAllAreas(data, edifices) {
    let res = true;
    for (let i = 0; i < data.length; i++) {
      let edifice = data[i];
      for (let j = 0; j < edifice.array.length; j++) {
        let e = edifices.filter((res) => res.name == data[i].name);
        let name = edifice.array[j].name;
        res = await this.promiseMethod("call sp_add_area(?,?)", [
          name,
          e[0].idEdifice,
        ]);
      }
    }

    return res;
  }
  connect() {
    sql.close(conn);
    let conn = sql.connect();
    try {
      conn.connect();
    } catch (err) {
      conn = sql.connectUCR();
      conn.connect();
    }
    return conn;
  }
  close(conn) {
    sql.close(conn);
  }
  async method2(active, conn) {
    let res = await this.promiseMethod2(
      "call sp_edit_distribution(?,?,?)",
      active,
      conn
    );
  }
  async method(area, active, active2, conn) {
    let res = await this.promiseMethod2(
      "call sp_add_active(?,?,?,?,?,?,?,?)",
      active2,
      conn
    );
    let convertedResponse = JSON.parse(JSON.stringify(res[0]));

    active = [
      convertedResponse[0].idActive,
      area.idArea,
      parseInt(active.amount),
    ];
    //console.log(active);
    //res  = await this.promiseMethod2('call sp_edit_distribution(?,?,?)',active,conn);
    return active;
  }
  async insertAllActives(data, areas, event) {
    var conn = sql.connect();
    let bulk = [];
    try {
      conn.connect();
    } catch (err) {
      conn = sql.connectUCR();
      conn.connect();
    }
    for (let i = 0; i < data.length; i++) {
      let edifice = data[i];
      for (let j = 0; j < edifice.array.length; j++) {
        let area = areas.filter((res) => res.name == edifice.array[j].name);

        for (let k = 0; k < edifice.array[j].array.length; k++) {
          let active = edifice.array[j].array[k];
          //	console.log(active, area);
          let active2 = [
            active.name,
            active.licensePlate,
            active.mark,
            active.model,
            active.serie,
            active.amount,
            "",
            active.description,
          ];

          let d = this.method(area[0], active, active2, conn);
          bulk.push(d);
        }
      }
    }
    sql.close(conn);
    conn = sql.connect();
    try {
      conn.connect();
    } catch (err) {
      conn = sql.connectUCR();
      conn.connect();
    }
    for (let m = 0; m < bulk.length; m++) {
      bulk[m]
        .then((_res) => {
          this.method2(_res, conn);
          if (m == bulk.length - 1) {
            sql.close(conn);
            event.reply("LoadData", { res: true });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return bulk;
  }
};
