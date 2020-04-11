import { TestBed } from '@angular/core/testing';

import { ScheduleResolverService } from './schedule-resolver.service';

describe('ScheduleResolverService', () => {
  let service: ScheduleResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
