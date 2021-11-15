import { Component, OnInit, ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import { BackupsService } from "src/app/shared/services/backups.service";
import { ConverterService } from "src/app/shared/services/general/converter.service";
const electron = (<any>window).require('electron');
import { AlertService } from 'src/app/shared/services/general/alert.service';
import * as fs from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss']
})
export class BackupsComponent implements OnInit {

  @ViewChild('pRef', {static: false}) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  workbook:any;
    worksheet:any;
      name = '';
      data=[];
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private BackupsService:BackupsService,
    private AlertService:AlertService,
    private converter:ConverterService
    ) {}


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
    console.log(e);
  }

  generate(){
     this.AlertService.confirmacion("¿Esta seguro/a de Generar un Backup?. Esta acción puede durar varios minutos",function(response,component){
             if(response==true){
               component.spinner.show();
                component.BackupsService.backup();
                electron.ipcRenderer.on("generate_backup", (event: any, data: any) => {
                            if(data["res"]){ 
                              console.log(data);
                              component.excel(data["data"]);
                             }else{
                               component.spinner.hide();
                             }
                              
                        });
             }
         },this);
    
  }
  setTitle(title){
     let titleRow = this.worksheet.addRow([title]);
      // Set font, size and style in title row.
      titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };

      // Blank Row
      this.worksheet.addRow([]);
      //Add row with current date
      let subTitleRow = this.worksheet.addRow(['Date : ' + new Date()]);
      this.worksheet.mergeCells('A1:G2');
      this.worksheet.mergeCells('A3:G3');
      return titleRow;
  }
  setHeader(header){
    //Add Header Row
      let headerRow = this.worksheet.addRow(header);
      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4169E1' },
          bgColor: { argb: 'FF4169E1' }
        }
         cell.font = {
          bold: true,
          color: { argb: 'FFFFFF' },
          size: 12
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      });
      return headerRow;
  }
  excel(datos){
    this.workbook= new Excel.Workbook();
    let title = "Registros de edificios  ";
      let header = ["idEdifice","name","isEnabled"];

    
       this.worksheet = this.workbook.addWorksheet("Edifices");
            // Add new row
       let titleRow = this.setTitle(title);
      //Add Header Row
      let col1 = this.worksheet.getColumn(1);
      let col2 = this.worksheet.getColumn(2);
       let col3 = this.worksheet.getColumn(3);
      col1.width = 20;
      col2.width = 45;
      col3.width = 20;
      //Add Header Row
      let headerRow = this.setHeader(header);
        datos[0].forEach(d => {
              const rowU=[d.idEdifice,d.name,d.isEnabled];
              let row = this.worksheet.addRow(rowU);
        });

      this.worksheet = this.workbook.addWorksheet("Areas");

      title = "Registros de areas  ";
      header = ["idArea","name","isEnabled","idEdifice"];
      titleRow = this.setTitle(title);
      col1 = this.worksheet.getColumn(1);
      col2 = this.worksheet.getColumn(2);
      col3 = this.worksheet.getColumn(3);
      let col4 = this.worksheet.getColumn(4);
      col1.width = 20;
      col2.width = 45;
      col3.width = 20;
      col4.width = 20;
      headerRow = this.setHeader(header);
        datos[1].forEach(d => {
              const rowU=[d.idArea,d.name,d.isEnabled,d.idEdifice];
              let row = this.worksheet.addRow(rowU);
        });

        this.worksheet = this.workbook.addWorksheet("Actives");

      title = "Registros de Activos  ";
      header = ["idActive","name","licensePlate","mark","model","serie","placeOrigin","amount","isLoan","description"];
      titleRow = this.setTitle(title);
      col1 = this.worksheet.getColumn(1);
      col2 = this.worksheet.getColumn(2);
      col3 = this.worksheet.getColumn(3);
      col4 = this.worksheet.getColumn(4);
      let col5 = this.worksheet.getColumn(5);
      let col6 = this.worksheet.getColumn(6);
      let col7 = this.worksheet.getColumn(7);
      let col8 = this.worksheet.getColumn(8);
      let col9 = this.worksheet.getColumn(9);
      let col10 = this.worksheet.getColumn(10);
      col1.width = 20;
      col2.width = 45;
      col3.width = 20;
      col4.width = 20;
      col5.width = 20;
      col6.width = 20;
      col7.width = 40;
      col8.width = 15;
      col9.width = 15;
      col10.width = 80;
      headerRow = this.setHeader(header);
        datos[2].forEach(d => {
              const rowU=[d.idActive,d.name,d.licensePlate,d.mark,d.model,d.serie,d.placeOrigin,d.amount,d.isLoan,d.description];
              let row = this.worksheet.addRow(rowU);
        });

      this.worksheet = this.workbook.addWorksheet("Loans");

      title = "Registros de Prestamos  ";
      header = ["idLoan","name","loanDate"];
      titleRow = this.setTitle(title);
      col1 = this.worksheet.getColumn(1);
      col2 = this.worksheet.getColumn(2);
      col3 = this.worksheet.getColumn(3);
      col1.width = 20;
      col2.width = 45;
      col3.width = 20;
      headerRow = this.setHeader(header);
      if(datos[5]["loans"]){
        datos[3].forEach(d => {
              const rowU=[d.idLoan,d.name,d.loanDate];
              let row = this.worksheet.addRow(rowU);
        });
      }
        

     this.worksheet = this.workbook.addWorksheet("Areas-Actives");

      title = "Registros de Areas-Actives  ";
      header = ["idActive","idArea","amount"];
      titleRow = this.setTitle(title);
      col1 = this.worksheet.getColumn(1);
      col2 = this.worksheet.getColumn(2);
      col3 = this.worksheet.getColumn(3);
      col1.width = 20;
      col2.width = 20;
      col3.width = 20;
      headerRow = this.setHeader(header);
        datos[4].forEach(d => {
              const rowU=[d.idActive,d.idArea,d.amount];
              let row = this.worksheet.addRow(rowU);
        });

      this.worksheet = this.workbook.addWorksheet("Loans-Actives");

      title = "Registros de Loans-Actives  ";
      header = ["idLoan","idActive"];
      titleRow = this.setTitle(title);
      col1 = this.worksheet.getColumn(1);
      col2 = this.worksheet.getColumn(2);
      col1.width = 20;
      col2.width = 20;
      headerRow = this.setHeader(header);
      if( datos[5]["loansactives"].length>0){
        datos[5].forEach(d => {
              const rowU=[d.idLoan,d.idActive];
              let row = this.worksheet.addRow(rowU);
        });
      }
        

    this.spinner.hide();

    this.workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       fs.saveAs(blob, 'Backup '+new Date()+'.xlsx');
    });
  }
  onFileChange(ev) {
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
      this. data = jsonData;
    }
    reader.readAsBinaryString(file);
  }
  restaurate(){
     
     if(this.data.length!=0){
        this.AlertService.confirmacion("¿Esta seguro/a de cargar un Backup?. Esta acción puede durar varios minutos",function(response,component){
             if(response==true){
               component.spinner.show();
               try{
                  let edifices = component.converter.converterEdifices(component.data["Edifices"]);
                  let areas = component.converter.converterAreas(component.data["Areas"]);
                  let actives = component.converter.converterActives(component.data["Actives"]);
                  let loans = component.converter.converterLoan(component.data["Loans"]);
                  let areasactives = component.converter.converterAreasActive(component.data["Areas-Actives"]);
                  let loansactives = component.converter.converterLoanActive(component.data["Loans-Actives"]);
                  let data = {
                    "edifices":edifices,
                    "areas":areas,
                    "actives":actives,
                    "loans":loans,
                    "areasactives":areasactives,
                    "loansactives":loansactives
                  };
                  console.log(data);
                component.BackupsService.recoverybackup(data);
                electron.ipcRenderer.on("recovery", (event: any, data: any) => {
                            if(data["res"]){ 
                              console.log(data);
                              component.spinner.hide();
                             }else{
                               component.spinner.hide();
                             }
                              
                        });
               }catch(e){
                  this.AlertService.alertaError("Backup con formato incorrecto");
               }
                
             }
         },this);
      }else{
        this.AlertService.alertaError("No se ha cargado un backup");
      }
  }
}
