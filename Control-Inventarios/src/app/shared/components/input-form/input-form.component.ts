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
  @Input() isFirst: boolean;
  @Input() isSearch: boolean;
  @Input() rows: number;
  inputvalue :string = "";
  @Output() updateValue = new EventEmitter<any>();
  @Input() min: number;
  @Input() max: number;
  constructor() { 
    
  }

  ngOnInit(): void {
    if(this.value != '' && this.value !== undefined){
      this.inputvalue = this.value;
    }
    if(this.isFirst){
      this.inputvalue = this.items[0].name;
    }
  }
  isNumber(n){
    return typeof n==='number';
  }
  validateInput(e){
    if(this.typed=='number'){
      console.log("Entro 1");
      console.log("Valor Numerico ",e.target.value);
       let digitos = (document.all) ? e.keyCode : e.which;
       let value=e.target.value;
    let tecla = String.fromCharCode(digitos).toLowerCase();
    let numeroFuturo =parseInt(value+""+tecla);
    let numero = parseInt(tecla);
    console.log(numero,numeroFuturo);
      if(numero>=0 && numeroFuturo>=this.min && numeroFuturo<=this.max){
           console.log("Entro 3");
           return true;
      }else{
             e.preventDefault();
      }
    }
  }
  updateEvent(e){
    this.updateValue.emit({"name":this.name,"value":this.inputvalue});
  }
  setText(text:string){
    this.inputvalue = text;
  }

}
