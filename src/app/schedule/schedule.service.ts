import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PlannerEvent} from '../domain/planner-event';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {PlannerDate} from '../domain/planner-date';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  selectedDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);
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

  getOneDayEvents(date: Date) {
    let params: HttpParams = new HttpParams();
    params = params.append('dateKey', '^' + String(date.getFullYear()) + '.' + date.getMonth() + '.' + date.getDate() + '$');
    return this.http.get<PlannerEvent[]>('/api/events', { params })
      .pipe(
        take(1),
        map((events: PlannerEvent[]) => {
          return events;
        })
      );
  }

  createMonthGrid(selectedDate: Date): {rows: PlannerDate[][], dataObservers: Array<Observable<PlannerEvent[]>>} {
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
    let currentDate = this.setMidnightDate(new Date(startDate));
    const dataObservers: Array<Observable<PlannerEvent[]>> = [];
    let rowCounter = 0;
    let cellCounter = 0;
    const rows: PlannerDate[][] = [];

    while (currentDate <= endDate) {
      dataObservers.push(this.getOneDayEvents(currentDate));
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
    return { rows, dataObservers} ;
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
