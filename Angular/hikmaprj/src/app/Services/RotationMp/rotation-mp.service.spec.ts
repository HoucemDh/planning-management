import { TestBed } from '@angular/core/testing';

import { RotationMpService } from './rotation-mp.service';

describe('RotationMpService', () => {
  let service: RotationMpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RotationMpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
