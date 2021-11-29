import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationsService {
  constructor() {}
  eventPath(evt) {
    var path = (evt.composedPath && evt.composedPath()) || evt.path,
      target = evt.target;

    if (path != null) {
      // Safari doesn't include Window, but it should.
      return path.indexOf(window) < 0 ? path.concat(window) : path;
    }

    if (target === window) {
      return [window];
    }

    return [target].concat(this.getParents(target, []), window);
  }
  getParents(node, memo) {
    memo = memo || [];
    var parentNode = node.parentNode;

    if (!parentNode) {
      return memo;
    } else {
      return this.getParents(parentNode, memo.concat(parentNode));
    }
  }

  evaluatePattern(letras, tecla) {
    if (letras.indexOf(tecla) === -1) {
      return false;
    } else {
      return true;
    }
  }
  WordsAlphabeticValidation(evento) {
    let digitos = document.all ? evento.keyCode : evento.which;
    var value = evento.target.value;
    var tamanio = value.length;
    let tecla = String.fromCharCode(digitos).toLowerCase(),
      letras =
        ' áéíóúabcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMÑOPQRSTUVWXYZÁÉÍÓÚ';
    let response = this.evaluatePattern(letras, tecla);
    return response;
  }
  WordsAlphaNumericValidation(evento) {
    let digitos = document.all ? evento.keyCode : evento.which;
    var value = evento.target.value;
    var tamanio = value.length;
    let tecla = String.fromCharCode(digitos).toLowerCase(),
      letras =
        ' áéíóúabcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMÑOPQRSTUVWXYZÁÉÍÓÚ0123456789';
    let response = this.evaluatePattern(letras, tecla);
    return response;
  }
  passwordValidation(evento) {
    let digitos = document.all ? evento.keyCode : evento.which;
    var value = evento.target.value;
    var tamanio = value.length;
    let tecla = String.fromCharCode(digitos).toLowerCase(),
      letras =
        ' áéíóúabcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMÑOPQRSTUVWXYZÁÉÍÓÚ0123456789!.,?¡¿_#-';
    let response = this.evaluatePattern(letras, tecla);
    return response;
  }

  AlphabeticPattern() {
    return '[^a-zA-Z]';
  }
  AlphabeticAndSpacePattern() {
    return '[^a-zA-Z ]';
  }
  AlphaNumericAndSpacePattern() {
    return '[^a-zA-Z0-9áéíóúaÁÉÍÓÚ ]';
  }
  MixtPattern() {
    return '[^a-zA-Z0-9áéíóúaÁÉÍÓÚ,. ]';
  }
  EmailPattern() {
    return '[^a-zA-Z0-9áéíóúaÁÉÍÓÚ,@_. ]';
  }
  MixtAltPattern() {
    return '[^a-zA-Z0-9áéíóúaÁÉÍÓÚ,.\\s ]';
  }

  AlphaNumericPattern() {
    return '[^a-zA-Z0-9]';
  }
  PasswordPattern() {
    return '[^a-zA-Z0-9!.,?¡¿_#]';
  }
  evaluateValue(value, pattern) {
    var regex = new RegExp(pattern, 'g');
    return regex.test(value);
  }
  validateLength(value: string, maxlength: number) {
    if (value.length <= maxlength) {
      return true;
    } else {
      return false;
    }
  }
}
