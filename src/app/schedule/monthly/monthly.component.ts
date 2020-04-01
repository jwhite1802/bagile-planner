import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ScheduleService} from '../schedule.service';
import {PlannerEvent} from '../../domain/planner-event';
import {forkJoin, Observable, pipe} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';
import {PlannerDate} from '../../domain/planner-date';
import {DailyDialogComponent} from '../daily-dialog/daily-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements OnInit {
  @Input() selectedDate: Date = new Date();
  @Input() isLarge: boolean;
  @Output() dateSelectedChange: EventEmitter<PlannerDate> = new EventEmitter<PlannerDate>();
  today: Date = new Date();
  headers: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  shortHeaders: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  selectedPlannerDate: PlannerDate;
  rows: PlannerDate[][] = [];
  private grid: { rows: PlannerDate[][]; dataObservers: Array<Observable<PlannerEvent[]>> };
  constructor(public scheduleService: ScheduleService, private dailyDialog: MatDialog) { }

  ngOnInit(): void {
    this.listenForDateChanges();
  }

  listenForDateChanges() {
    this.scheduleService.selectedDate
      .subscribe((newDate: Date) => {
        this.selectedDate = newDate;
        this.refreshDisplay();
      });
  }

  setNewDate(plannerDate: PlannerDate) {
    this.scheduleService.selectedDate.next(plannerDate.calendarDate);
    this.dateSelectedChange.emit(plannerDate);
  }

  refreshDisplay() {
    this.grid = this.scheduleService.createMonthGrid(this.selectedDate);
    this.rows = this.grid.rows;
    forkJoin(this.grid.dataObservers).pipe(
      map((dailyEvents: Array<PlannerEvent[]>) => {
        return dailyEvents;
      })
    ).subscribe((dailyEvents: Array<PlannerEvent[]>) => {
      let i = 0;
      this.rows.forEach((row: PlannerDate[]) => {
        row.forEach((cell: PlannerDate) => {
          cell.events = dailyEvents[i];
          cell.events.sort((eventA: PlannerEvent, eventB: PlannerEvent) => {
            if (eventA.startDate > eventB.startDate) {
              return 1;
            }
            if (eventA.startDate === eventB.startDate) {
              return 0;
            }

            return -1;
          });
          if (this.scheduleService.areDatesEqual(cell.calendarDate, this.selectedDate)) {
            this.selectedPlannerDate = cell;
          }
          i++;
        });
      });
    });
  }
}
