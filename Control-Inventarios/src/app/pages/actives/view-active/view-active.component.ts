import { Component, OnInit,OnDestroy, ViewChild,ElementRef, Renderer2,NgZone,ChangeDetectorRef } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from 'src/app/shared/services/general/alert.service';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import {ActivatedRoute,Router} from "@angular/router";
const electron = (<any>window).require('electron');
import { EditDistributionComponent } from 'src/app/shared/components/actives/edit-distribution/edit-distribution.component';
import { RegisterLoanComponent } from 'src/app/shared/components/actives/register-loan/register-loan.component';
import { ActiveModel } from 'src/app/shared/models/ActiveModel';
import { LoanModel } from 'src/app/shared/models/LoanModel';
import { ActiveService } from 'src/app/shared/services/active.service';
import { InputFormComponent } from 'src/app/shared/components/input-form/input-form.component';
@Component({
  selector: 'app-view-active',
  templateUrl: './view-active.component.html',
  styleUrls: ['./view-active.component.scss']
})
export class ViewActiveComponent implements OnInit,OnDestroy {

 @ViewChild('pRef', {static: false}) pRef: ElementRef;
  @ViewChild('footer', { static: false }) footer: FooterComponent;
  @ViewChild('SelectStatus', {static: false}) SelectStatus: InputFormComponent;
  loan:LoanModel = {
    idLoan:0,
    name:"",
    loanDate:new Date()
  }
  active :ActiveModel={
    idActive:1,
    name:"",
    licensePlate:"",
    amount:1,
    description:"",
    placeOrigin:"",
    mark:"",
    model:"",
    serie:"",
    isLoan:true,
    loan:this.loan
  }
  ContDescrip : string="";
  areas = [];
  stateLoanTemp = true;
  isLoan = false;
  count =0;
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private router:ActivatedRoute,
    private _router:Router,
    private _ngZone:NgZone,
      private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private ActiveService:ActiveService,
    private AlertService:AlertService
    ) {}


  ngOnInit(): void {
    this.spinner.show();
    this.active.idActive = parseInt(this.router.snapshot.paramMap.get('idActive'));
   
    this.viewActive();
    this.viewDistribution();
     this.viewLoan();
  }
  viewDistribution(){
    this.ActiveService.allActiveByActive(this.active.idActive);
    electron.ipcRenderer.on("activesById", (event: any, data: any) => {
                if(data["res"]){              
                  this.areas = data["actives"];
                  this.count++;
                  if(this.count==3){
                  //  this.cdRef.detectChanges();
                  }
                  
                }
                  //electron.ipc.removeAllListeners("activesById");
            });
  }
  viewActive(){
     let flag=true;
    this.ActiveService.activesByIdActive(this.active.idActive);
    electron.ipcRenderer.on("activesByIdActive", (event: any, data: any) => {
               if(data["res"] && flag){ 
                  flag=false;                
                   this.active.loan = this.loan;
                   data["actives"][0].isLoan = data["actives"][0].isLoan === 1;
                   this.active = data["actives"][0];
                    this.active.loan = this.loan;
                    this.ContDescrip = this.active.description.replace(/\n/g, '<br />');
                   if(this.active.isLoan){
                       this.SelectStatus.setText('En préstamo');
                   }else{
                     this.SelectStatus.setText('Disponible');
                     this.spinner.hide();
                   }
                    //electron.ipc.removeAllListeners("activesByIdActive");
                   this.count++;
                  if(this.count==3){
                   // this.cdRef.detectChanges();
                  }
                }
            });
  }
  viewLoan(){
    this.ActiveService.view_loan(this.active.idActive);
    let flag=true;
    electron.ipcRenderer.on("view_loan", (event: any, data: any) => {
                if(data["res"] && flag){ 
                  flag=false;                
                    if(data["actives"].length!=0){
                       this.isLoan = true;
                       this.active.isLoan =true;
                      this.active.loan = this.loan;
                     data["actives"][0].loanDate = new Date(data["actives"][0].loanDate);
                     var options = { year: 'numeric', month: 'long', day: 'numeric' };
                     data["actives"][0].loanDate = data["actives"][0].loanDate.toLocaleDateString("es-ES", options);
                     this.loan = data["actives"][0];
                     this.active.loan = this.loan;
                     this.spinner.hide();
                    }
                    this.count++;
                     //electron.ipc.removeAllListeners("view_loan");
                     this.cdRef.detectChanges();
                  if(this.count==3){
                    

                  }
                }
            });
    
  }
  updateE(e){
    if(e.value === 'Disponible'){
      this.stateLoanTemp = false;
    }else{
      this.stateLoanTemp = true;
    }
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
  update(){
    this.cdRef.detectChanges();
  }
  previous(){
    this._ngZone.run(()=>{
      this._router.navigate(['/actives']);
     });
  }
  editActive(){
    localStorage.setItem("active",JSON.stringify(this.active));
    this._ngZone.run(()=>{
      this._router.navigate(['/edit_actives',this.active.idActive]);
     });
  }
  editDistribution(){
    let dialogRef = this.dialog.open(EditDistributionComponent, {
       height: '700px',
       width: '600px',
       data: {
         idActive:this.active.idActive,
         amount:this.active.amount,
         areas:this.areas
        }
     });
      dialogRef.afterClosed().subscribe(result => {
       this.spinner.show();
        this.viewActive();
        this.viewDistribution();
        this.viewLoan();

    });
  }
  validateNewState(){
    if(this.active.isLoan===false && this.stateLoanTemp===true){
      //changeState
      let dialogRef = this.dialog.open(RegisterLoanComponent, {
       height: '250px',
       width: '450px',
       data: {
         idActive:this.active.idActive
        }
     });
      dialogRef.afterClosed().subscribe(result => {
       this.spinner.show();
        this.viewActive();
        this.viewDistribution();
        this.viewLoan();

    });
    }else if(this.active.isLoan===true && this.stateLoanTemp===false){
      this.AlertService.confirmacion("¿El Activo esta disponible?",function(response,component){
       if(response==true){
          component.spinner.show(); 
          component.ActiveService.updateStatusLoan({"idActive":component.active.idActive,"status":false});
          electron.ipcRenderer.on("updateStatusLoan", (event: any, data: any) => {
                      if(data["res"]){ 

                          component.viewActive();
                          component.viewDistribution();
                           component.isLoan = false;
                      }
                  });
       }          
     },this);
      
    }
  }
  ngOnDestroy(): void {
    electron.ipcRenderer.removeAllListeners("view_loan");
    electron.ipcRenderer.removeAllListeners("activesById");
    electron.ipcRenderer.removeAllListeners("activesByIdActive");
  }
}
