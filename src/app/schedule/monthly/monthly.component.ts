import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ScheduleService} from '../schedule.service';
import {PlannerEvent} from '../../domain/planner-event';
import {concat, forkJoin, Observable, of, pipe} from 'rxjs';
import {concatMap, flatMap, map} from 'rxjs/operators';
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
  private grid: { rows: PlannerDate[][] };
  constructor(public scheduleService: ScheduleService, private dailyDialog: MatDialog) { }

  ngOnInit(): void {
    this.refreshDisplay();
    this.listenForDateChanges();
  }

  listenForDateChanges() {
    this.scheduleService.selectedDate
      .pipe(
        concatMap(() => {
          return this.scheduleService.getMonthEvents()
            .pipe(
              map((dateEventMap: Map<string, PlannerEvent[]>) => {
                  this.refreshDisplay();
                  this.rows.forEach((row: PlannerDate[]) => {
                    row.forEach((cell: PlannerDate) => {
                      const dateKey = this.scheduleService.getDateKey(cell.calendarDate);
                      cell.events = [];
                      if (dateEventMap.has(dateKey)) {
                        cell.events = dateEventMap.get(this.scheduleService.getDateKey(cell.calendarDate));
                      }
                    });
                  });
              })
            );
        })
      )
      .subscribe((e) => {
        this.selectedDate = this.scheduleService.selectedDate.value;
      });
  }

  setNewDate(plannerDate: PlannerDate) {
    this.scheduleService.selectedDate.next(plannerDate.calendarDate);
    this.dateSelectedChange.emit(plannerDate);
  }

  refreshDisplay() {
    this.grid = this.scheduleService.createMonthGrid(this.selectedDate);
    this.rows = this.grid.rows;
  }
}
