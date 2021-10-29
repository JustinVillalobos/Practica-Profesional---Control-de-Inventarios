import { TestBed } from '@angular/core/testing';

import { EdificesService } from './edifices.service';

describe('EdificesService', () => {
  let service: EdificesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdificesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
