import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { interval as observableInterval } from 'rxjs';
import { takeWhile, scan, tap } from 'rxjs/operators';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { ConverterService } from 'src/app/shared/services/general/converter.service';
const electron = (<any>window).require('electron');
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { SortType } from '@swimlane/ngx-datatable/esm2015/public-api';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as fs from 'file-saver';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  @ViewChild('pRef', { static: false }) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  data = {};
  isVisible = false;
  pageNumber = 0;
  limit = 10;
  columns = [{ prop: 'licensePlate' }, { prop: 'name' }];
  SortType = SortType;
  rows = [];
  temp = [];
  items = [];
  title = 'Faltantes';
  head = [
    [
      { content: 'Placa', styles: { halign: 'center', lineWidth: 0.1 } },
      { content: 'Nombre', styles: { halign: 'center', lineWidth: 0.1 } },
    ],
  ];
  public demo1TabIndex = 0;
  isExcel = false;
  path = '';
  isReload = false;
  page = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    min: 0,
    max: this.limit - 1,
  };
  workbook: any;
  worksheet: any;
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private AlertService: AlertService,
    private cdRef: ChangeDetectorRef,
    private converter: ConverterService
  ) {}

  ngOnInit(): void {
    this.items = [
      { name: 'Coincidentes' },
      { name: 'Faltantes' },
      { name: 'Sobrantes' },
    ];
  }
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
    let val = e.value;
    val = val.toLowerCase();
    console.log(val, this.temp);
    if (val != '' && val != ' ') {
      const f = this.temp.filter(function (d) {
        return (
          d.name.toLowerCase().indexOf(val) !== -1 ||
          d.licensePlate.toLowerCase().indexOf(val) !== -1
        );
      });

      // update the rows
      this.rows = f;
      // Whenever the filter changes, always go back to the first page
      //this.table.offset = 0;
      this.pageNumber = 0;
    } else {
      this.rows = this.temp;
      this.pageNumber = 0;
    }
  }
  updateType(e) {
    console.log(e.value);
    this.isReload = false;
    this.spinner.show();
    if (e.value == 'Coincidentes') {
      //  this.rows = this.data["Faltantes"];
      this.temp = this.data['Coincidentes'];
      this.title = 'Coincidentes';
    } else if (e.value == 'Faltantes') {
      //this.rows = this.data["Coincidentes"];
      this.temp = this.data['Faltantes'];
      this.title = 'Faltantes';
    } else if (e.value == 'Sobrantes') {
      //this.rows = this.data["Sobrantes"];
      this.temp = this.data['Sobrantes'];
      this.title = 'Sobrantes';
    }
    this.page.max = this.limit;
    this.page.min = 0;
    this.setPage({ offset: 0 }, false);
    this.isReload = true;
    this.spinner.hide();
  }
  change(e) {
    if (e.index == 0) {
      this.isReload = false;
    } else {
      this.isReload = true;
    }
  }
  updateShow(e) {
    this.limit = parseInt(e.value, 10);
    this.setPage({ offset: 0 }, false);

    this.table.limit = parseInt(e.value, 10);
    this.table.recalculate();
    setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        this.table.offset = Math.floor(
          (this.table.rowCount - 1) / this.table.limit
        );
        // this.table.offset = 0;
      }
    });
  }
  onPaginated(event, container) {
    this.setPage(event, true, container);
    this.table.limit = this.limit;
    this.table.recalculate();
    setTimeout(() => {
      if (this.table.bodyComponent.temp.length <= 0) {
        this.table.offset = Math.floor(
          (this.table.rowCount - 1) / this.table.limit
        );
      }
    });
  }
  onFileChange(ev) {
    var fileInput = <HTMLInputElement>document.getElementById('file');
    var filePath = fileInput.value;
    var allowedExtensions = /(.xlsx|.pdf|.ods)$/i;
    if (!allowedExtensions.exec(filePath)) {
      alert('Please upload file having extensions .xlsx|.pdf|.ods only.');
      fileInput.value = '';
      return false;
    } else {
      allowedExtensions = /(.pdf)$/i;
      if (!allowedExtensions.exec(filePath)) {
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
          this.data = jsonData;
          this.isExcel = true;
        };
        reader.readAsBinaryString(file);
      } else {
        this.isExcel = false;
        this.path = ev.target.files[0].path;
      }
    }
  }
  checkOption(e) {
    this.isReload = false;
    this.spinner.show();
    if (e.index == 0) {
      //  this.rows = this.data["Faltantes"];
      this.temp = this.data['Faltantes'];
      this.title = 'Faltantes';
    } else if (e.index == 1) {
      //this.rows = this.data["Coincidentes"];
      this.temp = this.data['Coincidentes'];
      this.title = 'Coincidentes';
    } else if (e.index == 2) {
      //this.rows = this.data["Sobrantes"];
      this.temp = this.data['Sobrantes'];
      this.title = 'Sobrantes';
    }
    this.setPage({ offset: 0 }, false);
    this.isReload = true;
    this.spinner.hide();
  }
  analice() {
    this.isReload = false;
    this.isVisible = false;
    this.spinner.show();
    if (this.isExcel) {
      this.data = this.converter.converterExcelAreasToJsonAreasReport(
        this.data
      );
      let newData = [];
      if (this.data['Coincidentes'] != undefined) {
        for (let i = 0; i < this.data['Faltantes'].length; i++) {
          newData = newData.concat(this.data['Faltantes'][i].array);
        }
        for (let i = 0; i < this.data['Coincidentes'].length; i++) {
          newData = newData.concat(this.data['Coincidentes'][i].array);
        }
        for (let i = 0; i < this.data['Sobrantes'].length; i++) {
          newData = newData.concat(this.data['Sobrantes'][i].array);
        }
      } else {
        for (let i = 0; i < this.data['Actives'].length; i++) {
          newData = newData.concat(this.data['Actives'][i].array);
        }
      }
      this.converter.readXlSX(newData);
      electron.ipcRenderer.on('readXlSX', (event: any, data: any) => {
        if (data['res']) {
          this.data = data['data'];
          this.checkOption({ index: 1 });
          const tabGroup = this.tabGroup;
          const tabCount = 3;
          this.demo1TabIndex = 1;
          this.tabGroup.selectedIndex = this.demo1TabIndex;
          this.isVisible = true;
          this.cdRef.detectChanges();
        } else {
          this.AlertService.alertaError('Not valid');
        }
        this.spinner.hide();
      });
    } else {
      this.spinner.show();
      this.converter.readPDF(this.path);
      electron.ipcRenderer.on('readPDF', (event: any, data: any) => {
        if (data['res']) {
          this.data = data['data'];
          this.checkOption({ index: 1 });
          const tabGroup = this.tabGroup;

          const tabCount = 3;
          this.demo1TabIndex = 1;
          this.tabGroup.selectedIndex = this.demo1TabIndex;
          this.isVisible = true;
          electron.ipcRenderer.removeAllListeners('readPDF');
          this.cdRef.detectChanges();
        }
        this.spinner.hide();
      });
    }
  }
  generateExcel() {
    this.excel(this.temp);
  }
  setTitle(title) {
    let titleRow = this.worksheet.addRow([title]);
    // Set font, size and style in title row.
    titleRow.font = {
      name: 'Comic Sans MS',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };

    // Blank Row
    this.worksheet.addRow([]);
    //Add row with current date
    let date = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    let new_format_date = date.toLocaleString();
    let subTitleRow = this.worksheet.addRow(['Date : ' + new_format_date]);
    this.worksheet.mergeCells('A1:G2');
    this.worksheet.mergeCells('A3:G3');
    return titleRow;
  }
  setHeader(header) {
    //Add Header Row
    let headerRow = this.worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4169E1' },
        bgColor: { argb: 'FF4169E1' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    return headerRow;
  }
  excel(datos) {
    this.workbook = new Excel.Workbook();
    let date = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    let new_format_date = date.toLocaleString();
    let title = 'Reporte de Activos ' + this.title + '';
    let header = ['Placa', 'name'];

    this.worksheet = this.workbook.addWorksheet('Activos');
    // Add new row
    let titleRow = this.setTitle(title);

    let col1 = this.worksheet.getColumn(1);
    let col2 = this.worksheet.getColumn(2);
    col1.width = 20;
    col2.width = 55;
    let headerRow = this.setHeader(header);
    if (datos.length > 0) {
      datos.forEach((d) => {
        const rowU = [d.licensePlate, d.name];
        let row = this.worksheet.addRow(rowU);
      });
    }

    this.spinner.hide();

    this.workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Reporte ' + this.title + ' ' + new Date() + '.xlsx');
    });
  }

  generatePDF() {
    this.downloadrpt();
  }
  convertedData(data) {
    let converted_data = [];
    for (let i = 0; i < data.length; i++) {
      let data_simplex = [
        { content: data[i]['licensePlate'], styles: { halign: 'center' } },
        { content: data[i]['name'], styles: { halign: 'center' } },
      ];
      converted_data.push(data_simplex);
    }
    return converted_data;
  }

  center(doc, text) {
    var textWidth =
      (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    return textOffset;
  }
  addFooters(doc) {
    const pageCount = doc.internal.getNumberOfPages();

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        'Página ' + String(i) + ' de ' + String(pageCount),
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.getHeight() - 5,
        {
          align: 'center',
        }
      );
    }
    return doc;
  }
  setPage(pageInfo, optional, container?) {
    let flag = false;
    this.rows = [];
    this.page.totalElements = this.temp.length;
    this.page.min = pageInfo.offset * this.limit;
    this.page.max = this.page.min + this.limit;
    if (this.page.max > this.temp.length) {
      this.page.max = this.temp.length;
    }
    for (let i = this.page.min; i < this.page.max; i++) {
      this.rows.push(this.temp[i]);
    }
    if (optional) {
      this.scrollToTop(container);
    }

    // this.cdRef.detectChanges();
  }
  scrollToTop(el) {
    const duration = 600;
    const interval = 5;
    const move = (el.scrollTop * interval) / duration;
    observableInterval(interval)
      .pipe(
        scan((acc, curr) => acc - move, el.scrollTop),
        tap((position) => (el.scrollTop = position)),
        takeWhile((val) => val > 0)
      )
      .subscribe();
  }
  async downloadrpt() {
    let data_formmated = this.convertedData(this.temp);
    let date = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    let new_format_date = date.toLocaleString();
    var doc = new jsPDF('l', 'mm', [200, 210]);
    var pageHeight =
      doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    let wantedTableWidth = 100;

    let margin = (pageWidth - wantedTableWidth) / 2;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    let text = 'Universidad de Costa Rica';
    let textPostion = this.center(doc, text);
    doc.text(text, textPostion, 15);
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    text = 'Recinto Guápiles';
    textPostion = this.center(doc, text);
    doc.text(text, textPostion, 20);
    doc.setFontSize(13);
    text = 'Control de Inventario';
    textPostion = this.center(doc, text);
    doc.text(text, textPostion, 25);
    doc.setFontSize(12);
    doc.text(new_format_date, pageWidth - 45, 35);
    text = 'Reporte de Activos ' + this.title;
    textPostion = this.center(doc, text);
    doc.text(text, textPostion, 35);
    doc.line(0, 37, pageWidth, 37);

    doc.setFontSize(11);
    doc.setTextColor(100);

    (doc as any).autoTable({
      head: this.head,
      body: data_formmated,
      margin: { left: margin, right: margin },
      theme: 'striped',
      startY: 40,
      didDrawCell: (data) => {
        //console.log(data.column.index)
      },
    });
    doc = this.addFooters(doc);
    doc.save('Reporte ' + this.title + ' ' + date + '.pdf');
  }
}
