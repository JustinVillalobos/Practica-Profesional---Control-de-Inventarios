import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAreaModalComponent } from './edit-area-modal.component';

describe('EditAreaModalComponent', () => {
  let component: EditAreaModalComponent;
  let fixture: ComponentFixture<EditAreaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAreaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAreaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
