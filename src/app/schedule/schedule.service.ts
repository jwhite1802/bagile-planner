import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PlannerEvent} from '../domain/planner-event';
import {BehaviorSubject, empty, from, Observable, of} from 'rxjs';
import {catchError, map, mergeMap, take} from 'rxjs/operators';
import {PlannerDate} from '../domain/planner-date';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  selectedDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  previousDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  nextDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
  visibleDates: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);
  constructor(private http: HttpClient) { }
  private getEvents(params: HttpParams): Observable<PlannerEvent[]> {
    console.log(params);
    return this.http.get<PlannerEvent[]>('/api/events', { params })
      .pipe(
        take(1),
        map((events: PlannerEvent[]) => {
          return events;
        })
      );
  }

  getOneDayEvents(date: Date): Observable<PlannerDate> {
    let params: HttpParams = new HttpParams();
    params = params.append('dateKey', '^' + String(date.getFullYear()) + '.' + date.getMonth() + '.' + date.getDate() + '$');
    return this.http.get<PlannerEvent[]>('/api/events', { params })
      .pipe(
        take(1),
        map((plannerEvents: PlannerEvent[]) => {
          const plannerDate: PlannerDate = {
            calendarDate: this.setMidnightDate(date),
            events: plannerEvents
          }

          return plannerDate;
        })
      );
  }

  createMonthGrid(selectedDate: Date): {rows: PlannerDate[][] } {
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

  getDateKey(date: Date) {
    return [String(date.getFullYear()), String(date.getMonth()), String(date.getDate())].join('.');
  }

  getMultiplePlannerDates(): Observable<Map<string, PlannerDate>> {
    const plannerDateMap: Map<string, PlannerDate> = new Map();
    return from(this.visibleDates.value)
      .pipe(
        mergeMap(
          (date: Date) => this.getOneDayEvents(date)
            .pipe(
              catchError(() => of([])),
              map((plannerDate: PlannerDate) => {
                plannerDateMap.set(
                   String(date.getFullYear()) + '.' + String(date.getMonth()) + '.' + String(date.getDate()), plannerDate);
                return plannerDateMap;
              })
            ),
          2),
      );
  }

  setMidnightDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  areDatesEqual(date1: Date, date2: Date) {
    date1 = this.setMidnightDate(date1);
    date2 = this.setMidnightDate(date2);
    return date1.getTime() === date2.getTime();
  }

}
