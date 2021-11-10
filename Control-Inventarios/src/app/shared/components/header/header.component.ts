import { Component, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() updateContent=new EventEmitter<boolean>();
  status = false;
  constructor() { }

  ngOnInit(): void {
  }
  detectChange(e){
    this.status = !this.status;
    this.updateContent.emit(this.status);
  }

}
