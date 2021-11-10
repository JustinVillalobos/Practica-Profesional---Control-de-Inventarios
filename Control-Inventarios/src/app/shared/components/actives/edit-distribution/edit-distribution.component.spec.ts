import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistributionComponent } from './edit-distribution.component';

describe('EditDistributionComponent', () => {
  let component: EditDistributionComponent;
  let fixture: ComponentFixture<EditDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
