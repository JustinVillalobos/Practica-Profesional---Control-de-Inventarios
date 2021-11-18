import { Component, OnInit, ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import { ConverterService } from "src/app/shared/services/general/converter.service";
const electron = (<any>window).require('electron');
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { SortType } from '@swimlane/ngx-datatable/esm2015/public-api';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as fs from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as XLSX from 'xlsx';
import { MatTabGroup} from '@angular/material/tabs';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @ViewChild('pRef', {static: false}) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("demo3Tab", { static: false }) demo3Tab: MatTabGroup;
  data ={};
  isVisible =false;
   pageNumber = 0;
  limit=10;
  columns =[{ prop: 'licensePlate' },{ prop: 'name' }];
   SortType = SortType;
   rows=[];
   temp=[];
   items=[];
   public demo1TabIndex = 1;
  constructor( private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private AlertService:AlertService,
    private converter:ConverterService) { }

  ngOnInit(): void {
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
  updateValue(e){
    let val = e.value;
    val = val.toLowerCase();
    console.log(val,this.temp);
    if(val!='' && val!=' '){
      const f = this.temp.filter(function (d) {
          return (d.name.toLowerCase().indexOf(val) !== -1) || (d.licensePlate.toLowerCase().indexOf(val) !== -1) 
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
    updateShow(e){
       this.limit = parseInt(e.value, 10);
        this.table.limit = parseInt(e.value, 10);
      this.table.recalculate();
      setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        // TODO[Dmitry Teplov] find a better way.
        // TODO[Dmitry Teplov] test with server-side paging.
        this.table.offset = Math.floor((this.table.rowCount - 1) / this.table.limit);
        // this.table.offset = 0;
      }
    });
  }
  private onPaginated(event) {
    this.table.limit = this.limit ;
    this.table.recalculate();
     setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        // TODO[Dmitry Teplov] find a better way.
        // TODO[Dmitry Teplov] test with server-side paging.
        this.table.offset = Math.floor((this.table.rowCount - 1) / this.table.limit);
        // this.table.offset = 0;
      }
    });
}
  onFileChange(ev) {
    var fileInput = (<HTMLInputElement>document.getElementById("file"));
    var filePath = fileInput.value;
    var allowedExtensions = /(.xlsx|.pdf|.ods)$/i;
    if(!allowedExtensions.exec(filePath)){
        alert('Please upload file having extensions .xlsx|.pdf|.ods only.');
        fileInput.value = '';
        return false;
    }else{
       allowedExtensions = /(.pdf)$/i;
        if(!allowedExtensions.exec(filePath)){
             let workBook = null;
              let jsonData = null;
              const reader = new FileReader();
              const file = ev.target.files[0];
              reader.onload = (event) => {
                const data = reader.result;
                workBook = XLSX.read(data, { type: 'binary' });
                jsonData = workBook.SheetNames.reduce((initial, name) => {
                  const sheet = workBook.Sheets[name];
                  initial[name] = XLSX.utils.sheet_to_json(sheet);
                  return initial;
                }, {});
                const dataString = JSON.stringify(jsonData);
                console.log(jsonData);
                this.data = this.converter.converterExcelAreasToJsonAreasReport(jsonData);
              
               
              }
              reader.readAsBinaryString(file);
        }else{

         // this.document(ev.target.files[0]);
        }
   
    }
    
  }
analice(){
    this.isVisible =true;
    for(let i=0;i<this.data['Faltantes'].length;i++){
      this.items.push({'name':'Table '+(i+1)});
    }
   this.rows = this.data['Faltantes'][0].array;
   this.temp = this.rows;
    const tabGroup = this.demo3Tab;
     const tabCount = 3;
     this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
 
  tabGroup.selectedIndex = (tabGroup.selectedIndex + 1) % tabCount;
  
   console.log(tabCount);
}
generatePDF(){
  
}

}
