import {Component, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {PlannerDate} from '../domain/planner-date';
import {DailyDialogComponent} from './daily-dialog/daily-dialog.component';
import {PlannerEvent} from '../domain/planner-event';
import {ScheduleService} from './schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  @ViewChild('monthSchedule') MonthlyComponent;
  focusedMonthDateStart: Date;
  today: Date = new Date();
  selectedDate = new Date();
  headers: string[] = [];
  footers: string[] = [];
  isLarge = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private breakpointObserver: BreakpointObserver, private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.today = this.scheduleService.setMidnightDate(new Date());
    this.scheduleService.selectedDate.next(this.today);
    this.isHandset$.subscribe((result: boolean) => {
      this.isLarge = !result;
    });
  }

  gotoMonth( changeVal: number ) {
    this.focusedMonthDateStart = this.scheduleService.setMidnightDate(
      new Date(this.focusedMonthDateStart.getFullYear(), this.focusedMonthDateStart.getMonth() + changeVal)
    );
  }

  setDate(plannerDate: PlannerDate) {
    this.selectedDate = plannerDate.calendarDate;
  }
}
