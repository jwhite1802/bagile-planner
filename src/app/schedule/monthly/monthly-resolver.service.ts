import { Injectable } from '@angular/core';
import {ScheduleService} from '../schedule.service';
import {PlannerDate} from '../../domain/planner-date';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PlannerEvent} from '../../domain/planner-event';
import {map} from 'rxjs/operators';
import {Grid} from '../../domain/grid';

@Injectable({
  providedIn: 'root'
})
export class MonthlyResolverService implements Resolve<Observable<Grid>> {

  constructor(private scheduleService: ScheduleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Grid> {
    const selectedDate: Date = this.scheduleService.getDateFromParamMap(route.paramMap);
    this.scheduleService.selectedDate.next(selectedDate);
    const grid: Grid = this.scheduleService.createMonthGrid(selectedDate);
    return this.scheduleService.getMonthEvents()
      .pipe(
        map((dateEventMap: Map<string, PlannerEvent[]>) => {
          grid.rows.forEach((row: PlannerDate[]) => {
            row.forEach((cell: PlannerDate) => {
              const dateKey = this.scheduleService.getDateKey(cell.calendarDate);
              cell.events = [];
              if (dateEventMap.has(dateKey)) {
                cell.events = dateEventMap.get(this.scheduleService.getDateKey(cell.calendarDate));
              }
            });
          });
          return grid;
        })
      );
  }

}
