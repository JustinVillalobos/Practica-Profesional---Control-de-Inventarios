import { Component, OnInit,ViewChild,ElementRef, Renderer2 } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import { NgxSpinnerService } from "ngx-spinner";
import { EditEdificeModalComponent } from 'src/app/shared/components/edificio/edit-edifice-modal/edit-edifice-modal.component';
import { AddEdificeModalComponent } from 'src/app/shared/components/edificio/add-edifice-modal/add-edifice-modal.component';

@Component({
  selector: 'app-edifices',
  templateUrl: './edifices.component.html',
  styleUrls: ['./edifices.component.scss']
})
export class EdificesComponent implements OnInit {

  @ViewChild('pRef', {static: false}) pRef: ElementRef;
    @ViewChild('footer', { static: false }) footer: FooterComponent;
    rows = [
    {idEdifices:1,name:"Edificio 1",enabled:true},
    {idEdifices:2,name:"Edificio 2",enabled:false},
    {idEdifices:3,name:"Edificio 3",enabled:true},
    {idEdifices:4,name:"Edificio 4",enabled:true},
    {idEdifices:5,name:"Edificio 5",enabled:true},
    {idEdifices:6,name:"Edificio 6",enabled:true},
    {idEdifices:7,name:"Edificio 7",enabled:true},
    {idEdifices:8,name:"Edificio 8",enabled:true},
    {idEdifices:9,name:"Edificio 9",enabled:true},
    {idEdifices:10,name:"Edificio 10",enabled:false},
    {idEdifices:11,name:"Edificio 11",enabled:true},
  ];
  columns = [{ prop: 'name' }];
  temp = [];
   pageNumber = 0;
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
    ) {
    this.temp = this.rows;
  }
  updateContent(e){
     if(e){
      this.renderer.setStyle(this.pRef.nativeElement, 'margin-left', '65px');
      this.footer.update(e);
    }else{
       this.footer.update(e);
     this.renderer.setStyle(this.pRef.nativeElement, 'margin-left', '250px');
    }
  }
  ngOnInit(): void {

  }
  updateValue(e){
    let val = e.value;
    val = val.toLowerCase();
    if(val!='' && val!=' '){
      const f = this.temp.filter(function (d) {
        return d.name.toLowerCase().indexOf(val) !== -1
      });

      // update the rows
      this.rows = f;
      // Whenever the filter changes, always go back to the first page
      //this.table.offset = 0;
      this.pageNumber = 0;
    }else{
       this.rows = this.temp;
        this.pageNumber = 0;
    }
  }
  changeStatus(id,status){
     for(let i=0;i<this.rows.length;i++){
      if(id == this.rows[i]["idEdifices"]){
        if(status == true){
           this.rows[i].enabled = false;
         }else{
            this.rows[i].enabled = true;
         }
         return;
      }
    }
  }
  openEditModal(id,name){
     this.dialog.open(EditEdificeModalComponent, {
       height: '230px',
       width: '450px',
      data: {
        id: id,
        name:name
      }
    });
  }
  openAddModal(){
    this.dialog.open(AddEdificeModalComponent, {
       height: '230px',
       width: '450px'
     });
  }
 

}
