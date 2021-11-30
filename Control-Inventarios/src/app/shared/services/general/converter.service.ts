import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');
@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  constructor() {}
  readPDF(data) {
    electron.ipcRenderer.send('readPDF', data);
  }
  readXlSX(data) {
    electron.ipcRenderer.send('readXlSX', data);
  }
  converterStringInVector(chain) {
    chain = chain.replace(/{/g, '');
    chain = chain.replace(/}/g, '');
    chain = chain.replace(/"/g, '');
    return chain;
  }
  mergeUnique(a, b) {
    var hash = {};
    var i;

    for (i = 0; i < a.length; i++) {
      hash[a[i]] = true;
    }
    for (i = 0; i < b.length; i++) {
      hash[b[i]] = true;
    }
    return Object.keys(hash);
  }
  specialFormat(object) {
    let actual = '';
    let indice = 0;
    let vector = [];
    let flag = true;
    for (let i = 0; i < object.length; i++) {
      if (object[i].split(':').length == 1) {
        actual = actual + ',' + object[i];
        vector.push(i);
        if (flag) {
          indice = i - 1;
        } else {
        }
        flag = false;
      } else {
        if (flag == false && i != 0) {
          object[indice] = actual;
          actual = '';
        }
        actual = object[i];
        flag = true;
      }
    }
    let temp = object;
    let newObject = [];
    for (let j = 0; j < vector.length; j++) {
      temp.splice(vector[j], 1);
      newObject = this.mergeUnique(newObject, temp);
    }
    return object;
  }
  converterEdifices(objectEdifices) {
    let edifices = [];
    if (objectEdifices.length > 2) {
      for (let i = 2; i < objectEdifices.length; i++) {
        let jsonObject = JSON.stringify(objectEdifices[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(',');
        let idEdifice = object[0].split(':')[1];
        let name = object[1].split(':')[1];
        let temp = object[2].split(':')[1] == 'true';
        let isEnabled = Number(temp);
        edifices.push({
          idEdifice: idEdifice,
          name: name,
          isEnabled: isEnabled,
        });
      }
    } else {
      return [];
    }
    return edifices;
  }
  converterAreas(objectAreas) {
    let areas = [];
    if (objectAreas.length > 2) {
      for (let i = 2; i < objectAreas.length; i++) {
        let jsonObject = JSON.stringify(objectAreas[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(',');
        let idArea = object[0].split(':')[1];
        let name = object[1].split(':')[1];
        let temp = object[2].split(':')[1] == 'true';
        let isEnabled = Number(temp);
        let idEdifice = object[3].split(':')[1];
        areas.push({
          idArea: idArea,
          name: name,
          isEnabled: isEnabled,
          idEdifice: idEdifice,
        });
      }
    } else {
      return [];
    }
    return areas;
  }
  converterCharacterInSpace(value) {
    let newValue = '';
    for (let i = 0; i < value.length; i++) {
      if (value.charAt(i) == '\\') {
        newValue = newValue + '\n';
        i = i + 1;
      } else {
        newValue = newValue + '' + value.charAt(i);
      }
    }
    return newValue;
  }
  converterActives(objectActives) {
    let actives = [];
    if (objectActives.length > 2) {
      for (let i = 2; i < objectActives.length; i++) {
        let jsonObject = JSON.stringify(objectActives[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(',');
        object = this.specialFormat(object);
        let idActive = object[0].split(':')[1];
        let name = object[1].split(':')[1];
        let licensePlate = object[2].split(':')[1];
        let mark = object[3].split(':')[1];
        let model = object[4].split(':')[1];
        let serie = object[5].split(':')[1];
        let placeOrigin = object[6].split(':')[1];
        let isLoan = object[8].split(':')[1];
        let amount = object[7].split(':')[1];

        let description = this.converterCharacterInSpace(
          object[9].split(':')[1]
        );
        let active = {
          idActive: idActive,
          name: name,
          licensePlate: licensePlate,
          description: description,
          mark: mark,
          model: model,
          serie: serie,
          placeOrigin: placeOrigin,
          amount: amount,
          isLoan: isLoan,
        };
        actives.push(active);
      }
    } else {
      return [];
    }

    return actives;
  }
  converterLoan(objectLoans) {
    let loans = [];
    if (objectLoans.length > 2) {
      for (let i = 2; i < objectLoans.length; i++) {
        let jsonObject = JSON.stringify(objectLoans[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(',');
        let idLoan = object[0].split(':')[1];
        let name = object[1].split(':')[1];
        let loanDate = object[2].split(':')[1];
        loans.push({ idLoan: idLoan, name: name, loanDate: loanDate });
      }
    } else {
      return [];
    }
    return loans;
  }
  converterAreasActive(objectAreasActive) {
    let areasactives = [];
    if (objectAreasActive.length > 2) {
      for (let i = 2; i < objectAreasActive.length; i++) {
        let jsonObject = JSON.stringify(objectAreasActive[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(',');
        let idActive = object[0].split(':')[1];
        let idArea = object[1].split(':')[1];
        let amount = object[2].split(':')[1];
        areasactives.push({
          idActive: idActive,
          idArea: idArea,
          amount: amount,
        });
      }
    } else {
      return [];
    }
    return areasactives;
  }
  converterLoanActive(objectLoanActive) {
    let loansactives = [];
    if (objectLoanActive.length > 2) {
      for (let i = 2; i < objectLoanActive.length; i++) {
        let jsonObject = JSON.stringify(objectLoanActive[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(',');
        let idLoan = object[0].split(':')[1];
        let idActive = object[1].split(':')[1];
        loansactives.push({ idLoan: idLoan, idActive: idActive });
      }
    } else {
      return [];
    }
    return loansactives;
  }

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

  reconstructColumnName(columName, object) {
    for (let j = 0; j < object.length; j++) {
      let col = object[j].split(':')[0];
      if (col == columName) {
        let temp = col.split('_');
        if (temp[0] == '_') {
          return parseInt(temp[temp.length - 1]);
        } else {
          let value = j + 1;
          if (value < object.length) {
            col = object[value].split(':')[0];
            temp = col.split('_');
            if (temp[0] == '') {
              if (Number(temp[temp.length - 1])) {
                return parseInt(temp[temp.length - 1]);
              } else {
                return j;
              }
            } else {
              return '00';
            }
          } else {
            value = j - 1;
            col = object[value].split(':')[0];
            temp = col.split('_');
            if (temp[0] == '') {
              if (Number(temp[temp.length - 1])) {
                return parseInt(temp[temp.length - 1]);
              } else {
                return j;
              }
            } else {
              return '000';
            }
          }
        }
        return '00000';
      }
    }
  }
  findPatron(objects) {
    let actives = [];
    let colNumber;
    for (let i = 0; i < objects.length; i++) {
      let objectString = this.converterStringInVector(
        JSON.stringify(objects[i])
      );
      let object = objectString.split(',');
      let newFormatObject = this.specialFormat(object);
      let flagPlate = false;
      let flagName = false;
      let plate = '';
      let name = '';
      let countPattern = 0;
      for (let j = 0; j < newFormatObject.length; j++) {
        let col = newFormatObject[j].split(':')[1];
        let countNumbers = this.count(col);
        if (col == undefined || col == null || col == '') {
          //console.log('STATUS', undefined);
        } else {
          if (
            (countNumbers == col.length || countNumbers >= col.length - 2) &&
            col.length > 3
          ) {
            flagPlate = true;
            plate = col;
            colNumber = newFormatObject[j].split(':')[0];
          } else {
            if (col.length > 2) {
              flagName = true;
              if (flagName && flagPlate) {
                colNumber = this.reconstructColumnName(colNumber, object);
                countPattern++;
                name = col;
                flagName = false;
                flagPlate = false;
                let active = { licensePlate: plate, name: name };
                if (actives.length == 0) {
                  actives.push({ id: colNumber, array: [] });

                  let act = actives.find((res) => res.id === colNumber);
                  act.array.push(active);
                } else {
                  let act = actives.find((res) => res.id === colNumber);
                  if (act != null && act != {} && act != undefined) {
                    act.array.push(active);
                  } else {
                    actives.push({ id: colNumber, array: [] });
                    act = actives.find((res) => res.id === colNumber);
                    act.array.push(active);
                  }
                }
                name = '';
                plate = '';
              } else {
                // console.log("No hay patron ",col);
              }
            } else {
              //console.log("CAdena insuficiente ", col);
            }
          }
        }
      }
    }

    return actives;
  }
  recoveryDate(position, array) {
    try {
      if (array[position] == undefined) {
        return '';
      } else {
        return array[position];
      }
    } catch (e) {
      return '';
    }
  }
  isNumber(n) {
    return Number(n) == n;
  }
  analyzeLoadData(data) {
    let newData = [];
    let countEdifice = 0;
    let count = 0;
    let coincidente = 'Edificio de Vida Estudiantil';
    let suma = 0;
    let flag = false;
    for (let i = 0; i < data.length; i++) {
      if (JSON.stringify(data[i]).split(',').length <= 2) {
        let object = JSON.stringify(data[i]);
        object = this.converterStringInVector(object);
        let temp = object.split(':');
        if (temp[1] == coincidente) {
          flag = true;
        }

        if (flag && !this.isNumber(temp[1])) {
          if(temp[1].split(",").length<=1){
            newData.push({ id: countEdifice, name: temp[1], array: [] });
          }else{
            let temp2=temp[1].split(",")[0];
            newData.push({ id: countEdifice, name: temp2, array: [] });
          }
          
        }

        //Edifice
      }
      if (JSON.stringify(data[i]).split(',').length >= 3 && flag) {
        count = 0;
        let object = JSON.stringify(data[i]);
        object = this.converterStringInVector(object);

        let temp = object.split(',');
        let amount = temp[0].split(':')[1];
        try {
          if (
            amount != undefined &&
            amount != null &&
            parseInt(amount) != NaN &&
            parseInt(amount) < 100
          ) {
            suma += parseInt(amount);
          } else {
            amount = '0';
          }
        } catch (e) {}
        let code = this.recoveryDate('__EMPTY_1', data[i]);
        let name = this.recoveryDate('__EMPTY_2', data[i]);
        let mark = this.recoveryDate('__EMPTY_3', data[i]);
        let model = this.recoveryDate('__EMPTY_4', data[i]);
        let serie = this.recoveryDate('__EMPTY_5', data[i]);
        let description = this.recoveryDate('__EMPTY_7', data[i]);
        let active = {
          name: name,
          licensePlate: code,
          mark: mark,
          model: model,
          serie: serie,
          description: description,
          amount: amount,
        };
        newData[newData.length - 1].array.push(active);
      }
    }
    return newData;
  }
  grouBy(data) {
    let newData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].array.length == 0) {
        newData.push({ name: data[i].name, array: [] });
      } else {
        newData[newData.length - 1].array.push(data[i]);
      }
    }
    return newData;
  }
  loadData(json) {
    if (json['Inventario Físico 2021']) {
      let data = this.analyzeLoadData(json['Inventario Físico 2021']);
      data = this.grouBy(data);
      return data;
    } else {
      if (json['Activos']) {
        let data = this.analyzeLoadData(json['Inventario Físico 2021']);
        data = this.grouBy(data);
        return data;
      }else if(json['Inventario_Físico_2021']) {
        let data = this.analyzeLoadData(json['Inventario_Físico_2021']);
        data = this.grouBy(data);
        return data;
      }
    }
  }
  converterExcelAreasToJsonAreasReport(json) {
    let data = {};
    if (json['Coincidentes'] != undefined) {
      let coincidentes = json['Coincidentes'];
      let sobrantes = json['Sobrantes'];
      let Faltantes = json['Faltantes'];
      let actives = this.findPatron(coincidentes);
      let actives2 = this.findPatron(sobrantes);
      let actives3 = this.findPatron(Faltantes);
      data = {
        Coincidentes: actives,
        Sobrantes: actives2,
        Faltantes: actives3,
      };
    } else {
      if (json['Actives'] != undefined) {
        let Actives = json['Actives'];
        let actives = this.findPatron(Actives);
        data = {
          Actives: actives,
        };
      }
    }
    return data;
  }
}
