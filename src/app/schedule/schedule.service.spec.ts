import { TestBed } from '@angular/core/testing';

import { ScheduleService } from './schedule.service';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {MockDbService} from '../mockdb/mock-db.service';
import {HttpClientModule} from '@angular/common/http';

fdescribe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(MockDbService)
      ]
    });
    service = TestBed.inject(ScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
