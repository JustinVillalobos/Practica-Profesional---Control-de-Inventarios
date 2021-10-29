import { Component, OnInit,ViewChild,ElementRef, Renderer2 } from '@angular/core';
import { FooterComponent } from "src/app/shared/components/footer/footer.component";
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-edifices',
  templateUrl: './edifices.component.html',
  styleUrls: ['./edifices.component.scss']
})
export class EdificesComponent implements OnInit {

  @ViewChild('pRef', {static: false}) pRef: ElementRef;
    @ViewChild('footer', { static: false }) footer: FooterComponent;
    rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
     { name: 'Molly', gender: 'Female', company: 'Burger King' },
      { name: 'Molly', gender: 'Female', company: 'Burger King' },
       { name: 'Molly', gender: 'Female', company: 'Burger King' },
        { name: 'Molly', gender: 'Female', company: 'Burger King' },
         { name: 'Molly', gender: 'Female', company: 'Burger King' },
          { name: 'Molly', gender: 'Female', company: 'Burger King' },
           { name: 'Molly', gender: 'Female', company: 'Burger King' },
            { name: 'Molly', gender: 'Female', company: 'Burger King' },
             { name: 'Molly', gender: 'Female', company: 'Burger King' },
              { name: 'Molly', gender: 'Female', company: 'Burger King' }
  ];
  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService
    ) {
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
 

}
