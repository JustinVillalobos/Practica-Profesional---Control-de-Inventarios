const fs = require("fs");
module.exports = class Data {
  count(str) {
    let result = 0;
    if (str == undefined) {
      return 0;
    }
    if (str.match(/[^0-9]/g) == null) {
      return str.length;
    } else {
      result = str.match(/[^0-9]/g).length;
    }
    return str.length - result;
  }
  AlphaNumericPattern() {
    return "[^a-zA-Z0-9]";
  }
  evaluateValue(value, pattern) {
    var regex = new RegExp(pattern, "g");
    return regex.test(value);
  }
  analyze(text) {
    let data = text.split("\n");
    let distanceCode = 0;
    let distanceName = 0;
    let distanceAntiPatron = 0;
    let flagCode = false;
    let flagName = "";
    let itemsTemporales = { codes: [], names: [] };
    let itemsFinales = { codes: [], names: [] };
    for (let i = 0; i < data.length; i++) {
      let row = data[i];
      let countNumbers = this.count(row);
      if (
        (countNumbers == row.length || countNumbers >= row.length - 2) &&
        row.length > 4 &&
        !this.evaluateValue(row, this.AlphaNumericPattern())
      ) {
        itemsTemporales.codes.push(row);
        if (flagCode) {
          distanceCode++;
        } else {
          flagCode = true;
          distanceCode++;
        }
      } else {
        if (flagCode) {
          if (row.length > 2) {
            itemsTemporales.names.push(row);
            distanceName++;
            if (distanceName == distanceCode) {
              distanceName = 0;
              distanceCode = 0;
              flagCode = false;
              //console.log("Patron");
              itemsFinales.codes = itemsFinales.codes.concat(
                itemsTemporales.codes
              );
              itemsFinales.names = itemsFinales.names.concat(
                itemsTemporales.names
              );
            } else {
              //console.log("Agregando nombres ",row,distanceName,distanceCode);
            }
          } else {
            distanceName = 0;
            distanceCode = 0;
            flagCode = false;
            itemsTemporales = { codes: [], names: [] };
          }
        } else {
          distanceAntiPatron++;
          if (distanceAntiPatron >= distanceCode) {
            distanceName = 0;
            distanceCode = 0;
            flagCode = false;
            itemsTemporales = { codes: [], names: [] };
          }
        }
      }
    }

    return itemsFinales;
  }
  writeFile(data) {
    fs.writeFile("LOG.txt", JSON.stringify(data), (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  }

  comprobarfaltantesCoincidentes(data, actives) {
    let newFaltantes = [];
    let newCoincidentes = [];
    let datas;
    let res;
    for (let i = 0; i < data.length; i++) {
      if(data[i].licensePlate!=null && data[i].licensePlate!="" && data[i].licensePlate!="SP"){
         res = actives.filter(
          (response) => response.licensePlate == data[i].licensePlate
        );
       }else{
          res = actives.filter(
            (response) => {
              return response.name == data[i].name
            }
          );
       }
     
      if (res == "" || res == null || res.length == 0) {
        newFaltantes.push({
          licensePlate: data[i].licensePlate,
          name: data[i].name,
        });
      } else {
        newCoincidentes.push({
          licensePlate: data[i].licensePlate,
          name: data[i].name,
        });
      }
    }
    return { Faltantes: newFaltantes, Coincidentes: newCoincidentes };
  }
  comprobarSobrantes(data, actives) {
    let sobrantes = [];
    let datas;
    let res;
    for (let i = 0; i < actives.length; i++) {
      if(actives[i].licensePlate!=null && actives[i].licensePlate!="" && actives[i].licensePlate!="SP"){
         res = data.filter(
          (response) => response.licensePlate == actives[i].licensePlate
        );
       }else{
          res = data.filter(
            (response) => {
              return response.name == actives[i].name
            }
          );
       }
      
      if (res == "" || res == null || res.length == 0) {
        sobrantes.push({
          licensePlate: actives[i].licensePlate,
          name: actives[i].name,
        });
      }
    }
    return sobrantes;
  }
  format(data) {
    let newData = [];
    for (let i = 0; i < data["codes"].length; i++) {
      newData.push({ licensePlate: data["codes"][i], name: data["names"][i] });
    }
    return newData;
  }
  comprobar(data, actives) {
    let res = this.comprobarfaltantesCoincidentes(data, actives);
    let dataS = this.comprobarSobrantes(data, actives);
    return {
      Faltantes: res["Faltantes"],
      Coincidentes: res["Coincidentes"],
      Sobrantes: dataS,
    };
  }
};
