import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActiveComponent } from './edit-active.component';

describe('EditActiveComponent', () => {
  let component: EditActiveComponent;
  let fixture: ComponentFixture<EditActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditActiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
