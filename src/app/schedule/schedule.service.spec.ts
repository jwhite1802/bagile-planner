import {TestBed} from '@angular/core/testing';

import { ScheduleService } from './schedule.service';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {MockDbService} from '../mockdb/mock-db.service';
import {HttpClientModule} from '@angular/common/http';
import {PlannerEvent} from '../domain/planner-event';
import {catchError} from 'rxjs/operators';

fdescribe('ScheduleService', () => {
  let service: ScheduleService;
  const testDate: Date = new Date(1970, 0, 1);
  const testWeekStartDate = new Date(1969, 11, 28);

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

  it('setMidnightDate(date) ==> YYYY-MM-DDT00:00:00.000)', () => {
    const newDate: Date = service.setMidnightDate(new Date());
    expect(newDate.getHours()).toEqual(0);
    expect(newDate.getMinutes()).toEqual(0);
    expect(newDate.getSeconds()).toEqual(0);
  });

  it( 'areDatesEqual(d1, d2) ==> true', () => {
    expect(service.areDatesEqual(service.setMidnightDate(new Date()), service.setMidnightDate(new Date()))).toEqual(true);
  });

  it('getDateKey(date) ==> YYYY-MM-DD', () => {
    const key = service.getDateKey(testDate);
    const keyParts: string[] = key.split('-');
    expect(key).toBeTruthy();
    expect(keyParts.length).toEqual(3);
    expect(keyParts[0]).toEqual(String(1970));
    expect(keyParts[2]).toEqual('01');
  });

  it('getMonth(date) ==> YYYY-MM', () => {
    const key = service.getMonthKey(testDate);
    const keyParts: string[] = key.split('-');
    expect(key).toBeTruthy();
    expect(keyParts.length).toEqual(2);
    expect(keyParts[0]).toEqual(String(1970));
    expect(keyParts[1]).toEqual('01');
  });

  it('getWeekStartKey(date) ==> YYYY-MM', () => {
    const key = service.getWeekStartKey(testDate);
    const keyParts: string[] = key.split('-');
    expect(key).toBeTruthy();
    expect(keyParts.length).toEqual(3);
    expect(keyParts[0]).toEqual(String(1969));
    expect(keyParts[1]).toEqual('12');
    expect(keyParts[2]).toEqual('28');
  });

  it('getQuarterKey(1970-01-01) ==> 1970:Q01', () => {
    const key: string = service.getQuarterKey(testDate);
    const keyArr: string[] = key.split(':');
    expect(keyArr.length).toEqual(2);
    expect(keyArr[0]).toEqual('1970');
    expect(keyArr[1]).toEqual('Q01');
  });

  it('getQuarterKey(1970-04-15) ==> 1970:Q02', () => {
    const qrDate: Date = new Date(1970, 3, 15);
    const key: string = service.getQuarterKey(qrDate);
    const keyArr: string[] = key.split(':');
    expect(keyArr.length).toEqual(2);
    expect(keyArr[0]).toEqual('1970');
    expect(keyArr[1]).toEqual('Q02');
  });

  it('getQuarterKey(1970-06-15) ==> 1970:Q03', () => {
    const qrDate: Date = new Date(1970, 6, 15);
    const key: string = service.getQuarterKey(qrDate);
    const keyArr: string[] = key.split(':');
    expect(keyArr.length).toEqual(2);
    expect(keyArr[0]).toEqual('1970');
    expect(keyArr[1]).toEqual('Q03');
  });

  it('getQuarterKey(1970-10-15) ==> 1970:Q04', () => {
    const qrDate: Date = new Date(1970, 9, 15);
    const key: string = service.getQuarterKey(qrDate);
    const keyArr: string[] = key.split(':');
    expect(keyArr.length).toEqual(2);
    expect(keyArr[0]).toEqual('1970');
    expect(keyArr[1]).toEqual('Q04');
  });

  it('getQuarterKey(1970-01-15, true) ==> FY1970:Q02', () => {
    const qrDate: Date = testDate;
    const key: string = service.getQuarterKey(qrDate, true);
    const keyArr: string[] = key.split(':');
    expect(keyArr.length).toEqual(2);
    expect(keyArr[0]).toEqual('FY1970');
    expect(keyArr[1]).toEqual('Q02');
  });

  it('getQuarterKey(1969-10-15, true) ==> FY1970:Q01', () => {
    const qrDate: Date = new Date(1969, 9, 15);
    const key: string = service.getQuarterKey(qrDate, true);
    const keyArr: string[] = key.split(':');
    expect(keyArr.length).toEqual(2);
    expect(keyArr[0]).toEqual('FY1970');
    expect(keyArr[1]).toEqual('Q01');
  });


  it('getQuarterKey(1970-04-15, true) ==> FY1970:Q03', () => {
    const qrDate: Date = new Date(1970, 3, 15);
    const key: string = service.getQuarterKey(qrDate, true);
    const keyArr: string[] = key.split(':');
    expect(keyArr.length).toEqual(2);
    expect(keyArr[0]).toEqual('FY1970');
    expect(keyArr[1]).toEqual('Q03');
  });

  it('getQuarterKey(1970-07-15, true) ==> FY1970:Q04', () => {
    const qrDate: Date = new Date(1970, 6, 15);
    const key: string = service.getQuarterKey(qrDate, true);
    const keyArr: string[] = key.split(':');
    expect(keyArr.length).toEqual(2);
    expect(keyArr[0]).toEqual('FY1970');
    expect(keyArr[1]).toEqual('Q04');
  });

  it('getYearKey(1970-01-01) ==> 1970', () => {
    const qrDate: Date = new Date(1970, 1, 1);
    const key: string = service.getYearKey(qrDate);
    expect(key).toEqual('1970');
  });

  it('getYearKey(1969-10-15, true) ==> 1970', () => {
    const qrDate: Date = new Date(1969, 9, 15);
    const key: string = service.getYearKey(qrDate, true);
    expect(key).toEqual('FY1970');
  });

  it('getMonthEvents() ==> all events fall within an acceptable range of months', (done: DoneFn) => {
    service.selectedDate.next(service.setMidnightDate(new Date()));
    service.getMonthEvents()
      .pipe()
      .subscribe((results: Map<string, PlannerEvent[]>) => {
        expect(results.size).toBeGreaterThan(0);
        const keys: string[] = Array.from(results.keys()).sort();
        expect(results.get(keys[0]).length).toBeGreaterThan(0);
        expect(results.get(keys[keys.length - 1]).length).toBeGreaterThan(0);
        const firstEvent: PlannerEvent = results.get(keys[0])[0];
        const lastArray: PlannerEvent[] = results.get(keys[keys.length - 1]);
        const lastEvent: PlannerEvent = lastArray[lastArray.length - 1];
        done();
    });
  });

  it('getWeeklyEvents() ==> all events fall within an acceptable range of a week', (done: DoneFn) => {
    service.selectedDate.next(service.setMidnightDate(new Date()));
    service.getWeeklyEvents()
      .pipe()
      .subscribe((results: Map<string, PlannerEvent[]>) => {
        expect(results.size).toBeGreaterThan(0);
        const keys: string[] = Array.from(results.keys()).sort();
        expect(results.get(keys[0]).length).toBeGreaterThan(0);
        expect(results.get(keys[keys.length - 1]).length).toBeGreaterThanOrEqual(0);
        const firstEvent: PlannerEvent = results.get(keys[0])[0];
        const lastArray: PlannerEvent[] = results.get(keys[keys.length - 1]);
        const lastEvent: PlannerEvent = lastArray[lastArray.length - 1];
        const currentWeekStart: Date = service.setMidnightDate(new Date(service.getWeekStartKey(service.selectedDate.value)));
        const previewWeekStart: Date = service.setMidnightDate(new Date(
          currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() - 7));
        const nextWeekStart: Date = service.setMidnightDate(new Date(
          currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 7));
        done();
      });
  });
});
