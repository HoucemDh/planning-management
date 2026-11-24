import { TestBed } from '@angular/core/testing';

import { BomNService } from './bomn.service';

describe('BomnService', () => {
  let service: BomNService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BomNService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
