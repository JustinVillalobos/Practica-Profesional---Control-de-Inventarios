import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLoanComponent } from './register-loan.component';

describe('RegisterLoanComponent', () => {
  let component: RegisterLoanComponent;
  let fixture: ComponentFixture<RegisterLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
