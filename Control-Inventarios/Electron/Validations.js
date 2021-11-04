module.exports = class Validation {

	constructor() {
       
    }
 FormatoNumerico(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		const pattern='~[^0-9]+~i';
 		validate=this.evaluatePattern(cadena,pattern);
	 }
 	return validate;
 }
  FormatoPalabraSinEspacio(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		let pattern='~[^a-zA-ZñÑáéíóúÁÉÍÓÚ]+~i';
 		let validate=this.evaluatePattern(cadena,pattern);

 	}
 	return validate;
 }
  FormatoPalabraConEspacio(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		let pattern='~[^a-zA-zñÑáéíóúÁÉÍÓÚ ]+~i';
 		validate=this.evaluatePattern(cadena,pattern);
 	}
 	return validate;
 }
  FormatoTelefono(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		let pattern='~[^0-9 \- +]+~i';
 		validate=this.evaluatePattern(cadena,pattern);
 	}
 	return validate;
 }
 FormatoPalabraConSaltoLinea(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		let pattern='~[^a-zA-ZñÑáéíóúÁÉÍÓÚ \n]+~i';
 		validate=this.evaluatePattern(cadena,pattern);
 	}
 	return validate;
 }
  FormatoAlfaNumerico(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		let pattern='~[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ \n]+~i';
 		validate=this.evaluatePattern(cadena,pattern);
 	}
 	return validate;
 }
 FormatoAlfaNumericonCaracteres(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		let pattern='~[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ:.*,_;=!¡¿?{}[\] \- \n]+~i';
 		validate=this.evaluatePattern(cadena,pattern);
 	}
 	return validate;
 }
 FormatoCorreo(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(cadena)){
		    return true;
		  } else {
		     
		   return false;
		  }
 	}
 	return validate;
 }
 FormatoPSW(cadena, tamanioMaximo){
 	let validate=true;
 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		let pattern='~[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ./+_!=]+~i';
 		validate=this.evaluatePattern(cadena,pattern);
 	}
 	return validate;
 }

  evaluateLength(cadena, tamanioMaximo){
 	cadena=cadena+" ";
 	cadena=cadena.trim();
 	if(cadena.length>tamanioMaximo || cadena.length<=0){
 		return false;
 	}else{
 		return true;
 	}
 }
  evaluatePattern(cadena, pattern){
 	let re = new RegExp(pattern);

 	if(re.test(cadena)==true){
 		return false;
 	}
 	return true;
 }
 evaluateSpace(cadena, tamanioMaximo){
 	let validate=true;

 	if(this.evaluateLength(cadena, tamanioMaximo)==false){
 		return false;
 	}else{
 		let pattern='~[^a-zA-ZñÑáéíóúÁÉÍÓÚ]+~i';
 			let re = new RegExp(pattern);
 		if(re.test(cadena)==true){
 			return false;
 		}else{
 			return true;
 		}
 		return true;

 	}
 }
 evaluateTextPattern(cadena,tamanioMinimo,tamanioMaximo){

 	if(cadena.length>=tamanioMaximo){
	 	let newCadena=cadena.substring(tamanioMinimo,tamanioMaximo);
	 	return this.evaluateSpace(newCadena,tamanioMaximo);
	 }else{
	 	let newCadena=cadena.substring(tamanioMinimo,cadena.length);
	 	return this.evaluateSpace(newCadena,cadena.length);
	 }
 }
}