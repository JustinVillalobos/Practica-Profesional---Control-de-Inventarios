import { TestBed } from '@angular/core/testing';

import { EdificeService } from './edifice.service';

describe('EdificeService', () => {
  let service: EdificeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdificeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
