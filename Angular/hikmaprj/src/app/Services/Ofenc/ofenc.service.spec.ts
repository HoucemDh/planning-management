import { TestBed } from '@angular/core/testing';

import { OfencService } from './ofenc.service';

describe('OfencService', () => {
  let service: OfencService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfencService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
