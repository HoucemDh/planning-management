import { TestBed } from '@angular/core/testing';

import { MvstService } from './mvst.service';

describe('MvstService', () => {
  let service: MvstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MvstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
