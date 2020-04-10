import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PlannerEvent} from '../domain/planner-event';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {PlannerDate} from '../domain/planner-date';
import {Grid} from '../domain/grid';
import {ParamMap} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  selectedDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  previousDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  nextDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  visibleDates: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
  constructor(private http: HttpClient) { }

  private getEventMap(keyName: string, keysValues: string[]): Observable<Map<string, PlannerEvent[]>> {
    const eventMap: Map<string, PlannerEvent[]> = new Map();
    return from(keysValues)
      .pipe(
        mergeMap(
          (keyValue: string) => this.getEvents(keyName, keyValue)
            .pipe(
              map((plannerEvents: PlannerEvent[]) => {
                plannerEvents.forEach((plannerEvent: PlannerEvent) => {
                  if (eventMap.has(plannerEvent.dateKey)) {
                    eventMap.get(plannerEvent.dateKey).push(plannerEvent);
                  } else {
                    eventMap.set(plannerEvent.dateKey, [plannerEvent]);
                  }
                });
              }),
              catchError(() => of([]))
            ),
          2),
        map(() => {
          return eventMap;
        })
      );
  }

  private getEvents(keyName: string, keyValue: string): Observable<PlannerEvent[]> {
    let params: HttpParams = new HttpParams();
    params = params.append(keyName, '^' + keyValue + '$');
    return this.http.get('/api/events', { params})
      .pipe(
        map((plannerEvents: PlannerEvent[]) => {
          return plannerEvents.sort((plannerEvent1: PlannerEvent, plannerEvent2: PlannerEvent) => {
            return new Date(plannerEvent1.startDate).getTime()  - new Date(plannerEvent2.startDate).getTime();
          });
        }),
        catchError((err: Error) => {
          console.error(err);
          return of(null);
        })
      );
  }

  getDateFromParamMap(paramMap: ParamMap): Date {
    let dateKey: string = this.getDateKey(this.setMidnightDate(new Date()));
    if (paramMap.has('dateKey')) {
      dateKey = paramMap.get('dateKey');
    }
    return this.setDateFromDateKey(dateKey);
  }

  setMidnightDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  areDatesEqual(date1: Date, date2: Date) {
    date1 = this.setMidnightDate(date1);
    date2 = this.setMidnightDate(date2);
    return date1.getTime() === date2.getTime();
  }

  getDateKey(date: Date): string {
    const localDateParts: string[] = date.toLocaleDateString()
      .split('/')
      .map((part: string) => part.padStart(2, '0'));
    return [localDateParts[2], localDateParts[0], localDateParts[1]].join('-');
  }

  setDateFromDateKey(dateKey: string): Date {
    const dateParts: number[] = dateKey.split('-')
      .map((key: string, index) => {
        let keyNum: number = Number(key);
        if (index === 1) {
          keyNum = keyNum - 1;
        }
        return keyNum;
      });
    return this.setMidnightDate(new Date(dateParts[0], dateParts[1], dateParts[2]));
  }

  getMonthKey(date: Date): string {
    const keyParts: string[] = this.getDateKey(date).split('-');
    keyParts.pop();
    return keyParts.join('-');
  }

  getWeekStartKey(date: Date): string {
    if (date.getDay() === 0 ) {
      return this.getDateKey(date);
    }
    const sundayAdjuster = (-1 * (date.getDay())) + 1;
    return this.getDateKey(this.setMidnightDate(new Date(date.getFullYear(), date.getMonth(), sundayAdjuster)));
  }

  getQuarterKey(date: Date, fiscal?: boolean): string {
    let month: number = date.getMonth();
    let year: number = date.getFullYear();
    let prefix = '';
    if (fiscal) {
      prefix = 'FY';
      if (month >= 9) {
        month = month - 9;
        year++;
      } else {
        month = month + 3;
      }
    }
    const quarter: string = 'Q' + String(Math.floor((month / 3)) + 1).padStart(2, '0');
    return [prefix + String(year), quarter].join(':');
  }

  getYearKey(date: Date, fiscal?: boolean): string {
    return this.getQuarterKey(date, fiscal).split(':')[0];
  }

  getMonthEvents(): Observable<Map<string, PlannerEvent[]>> {
    const selectedDate = this.selectedDate.value;
    const currentMonthKey: string = this.getMonthKey(selectedDate);
    const previousMonthKey: string = this.getMonthKey(
      this.setMidnightDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0))
    );
    const nextMonthKey: string = this.getMonthKey(
      this.setMidnightDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
    );
    const monthKeys: string[] = [
      previousMonthKey,
      currentMonthKey,
      nextMonthKey
    ];
    return this.getEventMap('monthKey', monthKeys);
  }

  getWeeklyEvents(): Observable<Map<string, PlannerEvent[]>> {
    const selectedDate = this.selectedDate.value;
    const currentWeekKey: string = this.getWeekStartKey(selectedDate);
    const previousWeekKey: string = this.getWeekStartKey(
      this.setMidnightDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 7))
    );
    const nextWeekKey: string = this.getMonthKey(
      this.setMidnightDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 7))
    );
    const monthKeys: string[] = [
      previousWeekKey,
      currentWeekKey,
      nextWeekKey
    ];
    return this.getEventMap('weekStartKey', monthKeys);
  }

  createMonthGrid(selectedDate: Date): Grid {
    let startDate = this.setMidnightDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    let endDate = this.setMidnightDate(new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0));
    let sundayAdjuster = (-1 * (startDate.getDay())) + 1;
    let saturdayAdjuster = 6;
    if (startDate.getDay() === 0) {
      sundayAdjuster = 1;
    }

    if (endDate.getDay() !== 6) {
      saturdayAdjuster = (6 - endDate.getDay());
    }
    startDate = this.setMidnightDate(new Date(startDate.getFullYear(), startDate.getMonth(), sundayAdjuster));
    endDate = this.setMidnightDate(new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + saturdayAdjuster));
    this.previousDate.next(this.setMidnightDate(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 1)));
    this.nextDate.next(this.setMidnightDate(new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1)));
    let currentDate = this.setMidnightDate(new Date(startDate));
    let dates: Array<Date> = [];
    let rowCounter = 0;
    let cellCounter = 0;
    const rows: PlannerDate[][] = [];

    while (currentDate <= endDate) {
      dates.push(currentDate);
      if (cellCounter === 0 ) {
        rows[rowCounter] = [];
      }
      rows[rowCounter][cellCounter] = { calendarDate: this.setMidnightDate(currentDate), events: [] };

      if ( cellCounter === 6 ) {
        cellCounter = 0;
        rowCounter++;
      } else {
        cellCounter++;
      }
      currentDate = this.setMidnightDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    }
    dates = dates.sort();
    this.visibleDates.next(dates);
    return { rows };
  }
}
