import { TestBed } from '@angular/core/testing';

import { CdeachatService } from './cdeachat.service';

describe('CdeachatService', () => {
  let service: CdeachatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CdeachatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
