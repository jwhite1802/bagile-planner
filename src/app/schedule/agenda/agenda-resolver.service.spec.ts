import { TestBed } from '@angular/core/testing';

import { AgendaResolverService } from './agenda-resolver.service';

describe('AgendaResolverService', () => {
  let service: AgendaResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
