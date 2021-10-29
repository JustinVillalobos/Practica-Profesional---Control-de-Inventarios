import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAreaModalComponent } from './add-area-modal.component';

describe('AddAreaModalComponent', () => {
  let component: AddAreaModalComponent;
  let fixture: ComponentFixture<AddAreaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAreaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAreaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
