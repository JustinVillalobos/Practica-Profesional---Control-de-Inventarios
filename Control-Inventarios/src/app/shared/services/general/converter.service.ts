import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() { }
  converterStringInVector(chain){
    chain = chain.replace(/{/g, "");
    chain = chain.replace(/}/g, "");
    chain = chain.replace(/"/g, "");
    return chain;
  }
 mergeUnique(a, b){
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
  specialFormat(object){
    let actual ="";
    let indice=0;
    let vector =[]
    let flag = true;
    for(let i=0;i<object.length;i++){
      if(object[i].split(":").length==1){
        actual = actual+","+object[i];
        vector.push(i);
        if(flag){
          indice =i-1;
        }else{

        }
        flag=false;
      }else{
        if(flag==false && i!=0){
          object[indice]=actual;
          actual ="";
        }
        actual = object[i];
        flag=true;
      }
    }
    let temp =object;
    let newObject=[];
    for(let j=0;j<vector.length;j++){
      temp.splice(vector[j],1);
      newObject = this.mergeUnique(newObject,temp);
    }
    return object;
  }
  converterEdifices(objectEdifices){
    let edifices =[];
    if(objectEdifices.length>2){
      for(let i=2;i<objectEdifices.length;i++){
        let jsonObject = JSON.stringify(objectEdifices[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(",");
        let idEdifice = object[0].split(":")[1];
        let name = object[1].split(":")[1];
        let temp = (object[2].split(":")[1]=='true');
        let isEnabled = Number(temp);
         edifices.push({"idEdifice":idEdifice,"name":name,"isEnabled":isEnabled});
      }
    }else{
      return [];
    }
    console.log(edifices);
    return edifices;
  }
  converterAreas(objectAreas){
    let areas =[];
    if(objectAreas.length>2){
      for(let i=2;i<objectAreas.length;i++){
        let jsonObject = JSON.stringify(objectAreas[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(",");
        let idArea = object[0].split(":")[1];
        let name = object[1].split(":")[1];
         let temp = (object[2].split(":")[1]=='true');
        let isEnabled =  Number(temp);
        let idEdifice = object[3].split(":")[1];
         areas.push({"idArea":idArea,"name":name,"isEnabled":isEnabled,"idEdifice":idEdifice});
      }
    }else{
      return [];
    }
    console.log(areas);
    return areas;
  }
  converterCharacterInSpace(value){
    let newValue="";
    for(let i=0;i<value.length;i++){
      if(value.charAt(i)=='\\'){
         newValue = newValue+"\n";
         i=i+1;
      }else{
        newValue = newValue+""+value.charAt(i);
      }
    }
    return newValue;
  }
  converterActives(objectActives){
     let actives =[];
    if(objectActives.length>2){
      for(let i=2;i<objectActives.length;i++){
        let jsonObject = JSON.stringify(objectActives[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(",");
        object = this.specialFormat(object);
        let idActive = object[0].split(":")[1];
        let name = object[1].split(":")[1];
        let licensePlate = object[2].split(":")[1];
        let mark = object[3].split(":")[1];
        let model = object[4].split(":")[1];
        let serie = object[5].split(":")[1];
         let placeOrigin = object[6].split(":")[1];
         let isLoan = object[8].split(":")[1];
          let amount = object[7].split(":")[1];
        
        let description = this.converterCharacterInSpace(object[9].split(":")[1]);
        let active ={
          "idActive":idActive,
          "name":name,
          "licensePlate":licensePlate,
          "description":description,
          "mark":mark,
          "model":model,
          "serie":serie,
          "placeOrigin":placeOrigin,
          "amount":amount,
          "isLoan":isLoan
        }
         actives.push(active);
      }
    }else{
      return [];
    }
    console.log(actives);
    return actives;
  }
  converterLoan(objectLoans){
     let loans =[];
    if(objectLoans.length>2){
      for(let i=2;i<objectLoans.length;i++){
        let jsonObject = JSON.stringify(objectLoans[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(",");
        let idLoan = object[0].split(":")[1];
        let name = object[1].split(":")[1];
        let loanDate = object[2].split(":")[1];
         loans.push({"idLoan":idLoan,"name":name,"loanDate":loanDate});
      }
    }else{
      return [];
    }
    console.log(loans);
    return loans;
  }
  converterAreasActive(objectAreasActive){
     let areasactives =[];
    if(objectAreasActive.length>2){
      for(let i=2;i<objectAreasActive.length;i++){
        let jsonObject = JSON.stringify(objectAreasActive[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(",");
        let idActive = object[0].split(":")[1];
        let idArea = object[1].split(":")[1];
        let amount = object[2].split(":")[1];
         areasactives.push({"idActive":idActive,"idArea":idArea,"amount":amount});
      }
    }else{
      return [];
    }
    console.log(areasactives);
    return areasactives;
  }
  converterLoanActive(objectLoanActive){
      let loansactives =[];
    if(objectLoanActive.length>2){
      for(let i=2;i<objectLoanActive.length;i++){
        let jsonObject = JSON.stringify(objectLoanActive[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(",");
        let idLoan = object[0].split(":")[1];
        let idActive = object[1].split(":")[1];
         loansactives.push({"idLoan":idLoan,"idActive":idActive});
      }
    }else{
      return [];
    }
    console.log(loansactives);
    return loansactives;
  }

  converterExcelAreasToJsonAreasReport(){

  }
}
