import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewActiveComponent } from './view-active.component';

describe('ViewActiveComponent', () => {
  let component: ViewActiveComponent;
  let fixture: ComponentFixture<ViewActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewActiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
