import { Component, OnInit,ViewChild,ElementRef, Renderer2 } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import { NgxSpinnerService } from "ngx-spinner";
import { EditAreaModalComponent } from 'src/app/shared/components/area/edit-area-modal/edit-area-modal.component';
import { AddAreaModalComponent } from 'src/app/shared/components/area/add-area-modal/add-area-modal.component';
const electron = (<any>window).require('electron');
import { AreaService } from 'src/app/shared/services/area.service';
import { AreaModel } from 'src/app/shared/models/AreaModel';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

   @ViewChild('pRef', {static: false}) pRef: ElementRef;
    @ViewChild('footer', { static: false }) footer: FooterComponent;
    rows: AreaModel[] = [];
  columns = [{ prop: 'name' }];
  temp = [];
   pageNumber = 0;
   edifice:EdificeModel ={
     idEdifice:0,
      name:"",
      isEnabled:true
   }
   area:AreaModel ={
      idArea:0,
      name:"",
      isEnabled:true,
      edifice:this.edifice
   }
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private AreaService:AreaService
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
   allAreas(){
    this.AreaService.allAreas();
           electron.ipcRenderer.on("allAreas", (event: any, data: any) => {
                if(data["res"]){              
                   const areas = data["areas"].map(function(e) {
                     var isTrueSet = (e.isEnabled.toLowerCase() === 'true');
                     let edifice ={
                                     idEdifice:e.idEdifice,
                                      name:e.edifice,
                                      isEnabled:true
                                   } ;
                        return {'idArea':e.idArea,'name':e.name,'isEnabled':isTrueSet,"edifice":edifice};
                    });
                   this.rows = areas;
                   this.temp = this.rows;
                   this.spinner.hide();
                }
            });
  }
  ngOnInit(): void {
    this.spinner.show();
    this.allAreas();
  }
  updateValue(e){
    let val = e.value;
    val = val.toLowerCase();
    if(val!='' && val!=' '){
      const f = this.temp.filter(function (d) {
        return (d.name.toLowerCase().indexOf(val) !== -1) || (d.edifice.name.toLowerCase().indexOf(val) !== -1)
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
      if(id == this.rows[i]["idArea"]){
        if(status == true){
           this.rows[i].isEnabled = false;
         }else{
            this.rows[i].isEnabled = true;
         }
          this.spinner.show();
          this.area.idArea = this.rows[i]["idArea"];
         this.area.isEnabled = this.rows[i].isEnabled;
         this.AreaService.editStatusArea(this.area);
          electron.ipcRenderer.on("editStatusArea", (event: any, data: any) => {
                if(data["res"]){
                  this.spinner.hide();
                }
          });
         return;
      }
    }
  }
  openEditModal(id,name,edifice,idEdifice){
     let dialogRef = this.dialog.open(EditAreaModalComponent, {
         height: '350px',
         width: '450px',
        data: {
          idArea: id,
          name:name,
          edifice:edifice,
          idEdifice:idEdifice
        }
      });
     dialogRef.afterClosed().subscribe(result => {
       this.spinner.show();
        this.allAreas();
    });
  }
  openAddModal(){
    let dialogRef = this.dialog.open(AddAreaModalComponent, {
         height: '350px',
         width: '450px'
       });
    dialogRef.afterClosed().subscribe(result => {
      this.spinner.show();
        this.allAreas();
    });
  }

}
