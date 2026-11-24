import { TestBed } from '@angular/core/testing';

import { CrltofService } from './crltof.service';

describe('CrltofService', () => {
  let service: CrltofService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrltofService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
