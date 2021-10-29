import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEdificeModalComponent } from './edit-edifice-modal.component';

describe('EditEdificeModalComponent', () => {
  let component: EditEdificeModalComponent;
  let fixture: ComponentFixture<EditEdificeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEdificeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEdificeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
