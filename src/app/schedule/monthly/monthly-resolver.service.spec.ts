import { TestBed } from '@angular/core/testing';

import { MonthlyResolverService } from './monthly-resolver.service';

describe('MonthlyResolverService', () => {
  let service: MonthlyResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
