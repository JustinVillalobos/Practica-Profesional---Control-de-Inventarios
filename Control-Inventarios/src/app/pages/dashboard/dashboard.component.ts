import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('pRef', { static: false }) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}
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
    console.log(e);
  }
}
