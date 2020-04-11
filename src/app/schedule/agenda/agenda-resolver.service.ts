import { Injectable } from '@angular/core';
import {ScheduleService} from '../schedule.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Grid} from '../../domain/grid';
import {map} from 'rxjs/operators';
import {PlannerEvent} from '../../domain/planner-event';
import {PlannerDate} from '../../domain/planner-date';

@Injectable({
  providedIn: 'root'
})
export class AgendaResolverService implements Resolve<Observable<Grid>> {
  constructor(private scheduleService: ScheduleService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Grid> {
    const selectedDate: Date = this.scheduleService.getDateFromParamMap(route.paramMap);
    this.scheduleService.selectedDate.next(selectedDate);
    const grid: Grid = this.scheduleService.createAgendaGrid(selectedDate);
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
