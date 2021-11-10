import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEdificeModalComponent } from './add-edifice-modal.component';

describe('AddEdificeModalComponent', () => {
  let component: AddEdificeModalComponent;
  let fixture: ComponentFixture<AddEdificeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEdificeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEdificeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
