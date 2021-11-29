import {
  Component,
  OnInit,
  NgZone,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AlertService } from 'src/app/shared/services/general/alert.service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  mark: string = '';
  marketOthers: string = '';
  @Output() detectChangeCheck = new EventEmitter<boolean>();
  constructor(
    private router: Router,
    private _ngZone: NgZone,
    private auth: AuthService,
    private AlertService: AlertService
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.auth.removeAllListeners('reply');
  }
  changeStatus(e) {
    this.detectChangeCheck.emit(true);
  }
  goToLogin() {
    this._ngZone.run(() => {
      this.router.navigate(['/']);
    });
  }
  leaveSession() {
    this.AlertService.confirmacion(
      '¿Quieres cerrar la sesión?',
      function (response, component) {
        if (response == true) {
          component.auth.logout();
          component.goToLogin();
        }
      },
      this
    );
  }
  market() {
    if (this.mark === 'market') {
      this.mark = '';
    } else {
      this.mark = 'market';
    }
  }
  marketOthersMethod() {
    if (this.marketOthers === 'market') {
      this.marketOthers = '';
    } else {
      this.marketOthers = 'market';
    }
  }
}
