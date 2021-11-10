import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

 alertaError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: '¡Hubo un error!',
        html: mensaje,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
    });
}
 alertaWarning(mensaje) {
    Swal.fire({
        icon: 'warning',
        title: '¡Cuidado!',
        html: mensaje,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
    });
}
 confirmacion(mensaje, callback,component) {

  Swal.fire({
      title: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.value) {
          callback(true,component);
      }else {
        callback(false,component);
      }
  });
}

 alertTimeCorrect(mensaje,callback,component) {

  let timerInterval;
  Swal.fire({
    icon: 'success',
    title:'¡Excelente!',
    html:mensaje,
    timer: 2500,
    showConfirmButton:false,
    timerProgressBar: false,
    willOpen: () => {
      Swal.showLoading()
      timerInterval = setInterval(() => {
        const content = Swal.getHtmlContainer()
        if (content) {
          const b = content.querySelector('b')
          if (b) {
           // b.textContent = Swal.getTimerLeft()
          }
        }
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      return callback(component);
    }
  })
}



 

}