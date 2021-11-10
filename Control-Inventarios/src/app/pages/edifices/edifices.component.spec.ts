import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdificesComponent } from './edifices.component';

describe('EdificesComponent', () => {
  let component: EdificesComponent;
  let fixture: ComponentFixture<EdificesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdificesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdificesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
