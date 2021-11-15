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
  converterEdifices(objectEdifices){
    let edifices =[];
    if(objectEdifices.length>2){
      for(let i=2;i<objectEdifices.length;i++){
        let jsonObject = JSON.stringify(objectEdifices[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(",");
        let idEdifice = object[0].split(":")[1];
        let name = object[1].split(":")[1];
        let isEnabled = object[2].split(":")[1];
         edifices.push({"idEdifice":idEdifice,"name":name,"isEnabled":isEnabled});
      }
    }else{
      return [];
    }
    console.log(edifices);
    return edifices;
  }
  converterAreas(objectActives){
    let areas =[];
    if(objectActives.length>2){
      for(let i=2;i<objectActives.length;i++){
        let jsonObject = JSON.stringify(objectActives[i]);
        let jsonFormatObject = this.converterStringInVector(jsonObject);
        let object = jsonFormatObject.split(",");
        let idArea = object[0].split(":")[1];
        let name = object[1].split(":")[1];
        let isEnabled = object[2].split(":")[1];
        let idEdifice = object[3].split(":")[1];
         areas.push({"idArea":idArea,"name":name,"isEnabled":isEnabled,"idEdifice":idEdifice});
      }
    }else{
      return [];
    }
    console.log(areas);
    return areas;
  }
  converterActives(objectAreas){
     console.log(objectAreas);
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
}
