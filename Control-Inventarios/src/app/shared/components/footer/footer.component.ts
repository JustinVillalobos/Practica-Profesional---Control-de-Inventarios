import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  date: Date = new Date();
  @ViewChild('fRef', { static: false }) footer: ElementRef;
  constructor(private renderer: Renderer2) {}
  update(isMargin) {
    if (isMargin) {
      this.renderer.setStyle(this.footer.nativeElement, 'margin-left', '65px');
    } else {
      this.renderer.setStyle(this.footer.nativeElement, 'margin-left', '250px');
    }
  }
  ngOnInit(): void {}
}
