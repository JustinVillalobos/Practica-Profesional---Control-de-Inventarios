import { Component, OnInit, Input, Output,EventEmitter,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputFormComponent implements OnInit {
  @Input() name:string;
  @Input() typeComponent: string;
  @Input() typed: string;
  @Input() label: string;
  @Input() value: string;
  @Input() placeholder: string;
  @Input() items: any[];
  @Input() isRequired: boolean;
  @Input() isSearch: boolean;
  inputvalue :string = "";
  @Output() updateValue = new EventEmitter<any>();
  constructor() { 
    
  }

  ngOnInit(): void {
    if(this.value != '' && this.value !== undefined){
      this.inputvalue = this.value;
    }
  }

  updateEvent(){
    this.updateValue.emit({"name":this.name,"value":this.inputvalue});
  }

}
