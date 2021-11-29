import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
const electron = (<any>window).require('electron');
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { EdificeModel } from 'src/app/shared/models/EdificeModel';
import { EditEdificeModalComponent } from 'src/app/shared/components/edificio/edit-edifice-modal/edit-edifice-modal.component';
import { AddEdificeModalComponent } from 'src/app/shared/components/edificio/add-edifice-modal/add-edifice-modal.component';
import { EdificeService } from 'src/app/shared/services/edifice.service';
@Component({
  selector: 'app-edifices',
  templateUrl: './edifices.component.html',
  styleUrls: ['./edifices.component.scss'],
})
export class EdificesComponent implements OnInit {
  @ViewChild('pRef', { static: false }) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  rows: EdificeModel[] = [];
  edifice: EdificeModel = {
    idEdifice: 0,
    name: '',
    isEnabled: true,
  };
  columns = [{ prop: 'name' }];
  temp = [];
  pageNumber = 0;
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private EdificeService: EdificeService
  ) {
    this.temp = this.rows;
  }

  allEdifices() {
    this.EdificeService.allEdifices();
    electron.ipcRenderer.on('allEdifices', (event: any, data: any) => {
      if (data['res']) {
        const edifices = data['edifices'].map(function (e) {
          var isTrueSet = e.isEnabled.toLowerCase() === 'true';
          return { idEdifice: e.idEdifice, name: e.name, isEnabled: isTrueSet };
        });
        this.rows = edifices;
        this.temp = this.rows;
        this.spinner.hide();
      }
    });
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
  ngOnInit(): void {
    this.spinner.show();
    this.allEdifices();
  }
  updateValue(e) {
    let val = e.value;
    val = val.toLowerCase();
    if (val != '' && val != ' ') {
      const f = this.temp.filter(function (d) {
        return d.name.toLowerCase().indexOf(val) !== -1;
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
  changeStatus(id, status) {
    this.spinner.show();
    for (let i = 0; i < this.rows.length; i++) {
      if (id == this.rows[i]['idEdifice']) {
        if (status == true) {
          this.rows[i].isEnabled = false;
        } else {
          this.rows[i].isEnabled = true;
        }
        this.edifice.idEdifice = this.rows[i]['idEdifice'];
        this.edifice.isEnabled = this.rows[i].isEnabled;
        this.EdificeService.editStatusEdifice(this.edifice);
        electron.ipcRenderer.on(
          'editStatusEdifice',
          (event: any, data: any) => {
            if (data['res']) {
              this.spinner.hide();
            }
          }
        );
        return;
      }
    }
  }
  openEditModal(id, name) {
    let dialogRef = this.dialog.open(EditEdificeModalComponent, {
      height: '230px',
      width: '450px',
      data: {
        idEdifice: id,
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.spinner.show();
      this.allEdifices();
    });
  }
  openAddModal() {
    let dialogRef = this.dialog.open(AddEdificeModalComponent, {
      height: '230px',
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.spinner.show();
      this.allEdifices();
    });
  }
}
