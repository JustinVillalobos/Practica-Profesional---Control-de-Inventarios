import { Component, OnInit,ViewChild,ElementRef, Renderer2 } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import { NgxSpinnerService } from "ngx-spinner";
import { EditAreaModalComponent } from 'src/app/shared/components/area/edit-area-modal/edit-area-modal.component';
import { AddAreaModalComponent } from 'src/app/shared/components/area/add-area-modal/add-area-modal.component';


@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

   @ViewChild('pRef', {static: false}) pRef: ElementRef;
    @ViewChild('footer', { static: false }) footer: FooterComponent;
    rows = [
    {idArea:1,name:"Area 1",edifice:"Edificio 1",enabled:"true"},
    {idArea:2,name:"Area 2",edifice:"Edificio 1",enabled:"false"},
    {idArea:3,name:"Area 3",edifice:"Edificio 1",enabled:"true"},
    {idArea:4,name:"Area 4",edifice:"Edificio 2",enabled:"true"},
    {idArea:5,name:"Area 5",edifice:"Edificio 2",enabled:"true"},
    {idArea:6,name:"Area 6",edifice:"Edificio 3",enabled:"true"},
    {idArea:7,name:"Area 7",edifice:"Edificio 4",enabled:"true"},
    {idArea:8,name:"Area 8",edifice:"Edificio 5",enabled:"true"},
    {idArea:9,name:"Area 9",edifice:"Edificio 1",enabled:"true"},
    {idArea:10,name:"Area 10",edifice:"Edificio 3",enabled:"false"},
    {idArea:11,name:"Area 11",edifice:"Edificio 2",enabled:"true"},
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
        return (d.name.toLowerCase().indexOf(val) !== -1) || (d.edifice.toLowerCase().indexOf(val) !== -1)
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
    console.log(id,status);
  }
  openEditModal(id,name,edifice){
     this.dialog.open(EditAreaModalComponent, {
       height: '350px',
       width: '450px',
      data: {
        id: id,
        name:name,
        edifice:edifice
      }
    });
  }
  openAddModal(){
    this.dialog.open(AddAreaModalComponent, {
       height: '350px',
       width: '450px'
     });
  }

}
