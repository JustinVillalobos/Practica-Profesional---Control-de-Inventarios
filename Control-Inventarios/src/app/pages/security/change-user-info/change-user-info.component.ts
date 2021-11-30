import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { PasswordService } from 'src/app/shared/services/password.service';
const electron = (<any>window).require('electron');
import { ValidationsService } from 'src/app/shared/services/general/validations.service';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { InputFormComponent } from 'src/app/shared/components/input-form/input-form.component';

@Component({
  selector: 'app-change-user-info',
  templateUrl: './change-user-info.component.html',
  styleUrls: ['./change-user-info.component.scss'],
})
export class ChangeUserInfoComponent implements OnInit {
  @ViewChild('pRef', { static: false }) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  @ViewChild('user', { static: false }) inputName: InputFormComponent;
  @ViewChild('email', { static: false }) inputEmail: InputFormComponent;
  @ViewChild('psw', { static: false }) inputPsw: InputFormComponent;
  userControl = { isInvalid: false, error: '' };
  emailControl = { isInvalid: false, error: '' };
  psw = { isInvalid: false, error: '' };
  password = '';
  email = '';
  user = '';
  passwordTemp = '';
  constructor(
    private renderer: Renderer2,
    private validation: ValidationsService,
    private spinner: NgxSpinnerService,
    private AlertService: AlertService,
    private PasswordService: PasswordService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.userInfo();
  }
  /*Método que recupera la información de usuario*/
  userInfo() {
    this.PasswordService.userData({ token: localStorage.getItem('idToken') });
    electron.ipcRenderer.on('userInfo', (event: any, data: any) => {
      if (data['res']) {
        this.user = data['user'][0].username;
        this.email = data['user'][0].email;
        this.passwordTemp = data['user'][0].password;
        this.inputName.setText(this.user);
        this.inputEmail.setText(this.email);
        this.spinner.hide();
      }
    });
  }
/*Método que controla el DOM del aplicativo*/
  updateContent(e) {
    if (e) {
      this.renderer.setStyle(this.pRef.nativeElement, 'margin-left', '65px');
      this.footer.update(e);
    } else {
      this.footer.update(e);
      this.renderer.setStyle(this.pRef.nativeElement, 'margin-left', '250px');
    }
  }
  updateValue(e) {
    if (e.name == 'psw') {
      this.password = e.value;
    } else if (e.name == 'user') {
      this.user = e.value;
    } else if (e.name == 'email') {
      this.email = e.value;
    }
  }
  /*Método que válida y guarda la información */
  save() {
    if (this.user == '') {
      this.userControl.isInvalid = true;
      this.userControl.error = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(
        this.user,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.userControl.isInvalid = true;
      this.userControl.error = 'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.user, 125)) {
      this.userControl.isInvalid = true;
      this.userControl.error = 'El nombre es muy extenso';
    } else {
      this.userControl.isInvalid = false;
    }
    if (this.password == '') {
      this.psw.isInvalid = true;
      this.psw.error = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(
        this.password,
        this.validation.AlphaNumericAndSpacePattern()
      )
    ) {
      this.psw.isInvalid = true;
      this.psw.error = 'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.password, 125)) {
      this.psw.isInvalid = true;
      this.psw.error = 'La contraseña es muy extensa';
    } else {
      this.psw.isInvalid = false;
    }
    if (this.email == '') {
      this.emailControl.isInvalid = true;
      this.emailControl.error = 'Campo Vacío';
    } else if (
      this.validation.evaluateValue(this.email, this.validation.EmailPattern())
    ) {
      this.emailControl.isInvalid = true;
      this.emailControl.error = 'Solo se aceptan Carácteres Alfanúmericos';
    } else if (!this.validation.validateLength(this.email, 125)) {
      this.emailControl.isInvalid = true;
      this.emailControl.error = 'El correo es muy extenso';
    } else {
      this.emailControl.isInvalid = false;
    }
    if (
      !this.psw.isInvalid &&
      !this.emailControl.isInvalid &&
      !this.userControl.isInvalid
    ) {
      if (this.passwordTemp == this.password) {
        this.AlertService.confirmacion(
          '¿Esta seguro/a?',
          function (response, component) {
            if (response == true) {
              component.spinner.show();
              component.PasswordService.changeData({
                username: component.user,
                email: component.email,
                token: localStorage.getItem('idToken'),
              });
              electron.ipcRenderer.on('editUser', (event: any, data: any) => {
                if (data['res']) {
                  component.spinner.hide();
                  component.AlertService.alertTimeCorrect(
                    'Se ha actualizado la información',
                    function (_component) {
                      _component.password = '';
                      _component.inputPsw.setText('');
                    },
                    component
                  );
                } else {
                  component.spinner.hide();
                  component.AlertService.alertaError(
                    'Usuario no encontrado en el sistema'
                  );
                }
              });
            }
          },
          this
        );
      } else {
        this.AlertService.alertaError('Contraseña de verificación incorrecta');
      }
    } else {
      return;
    }
  }
}
