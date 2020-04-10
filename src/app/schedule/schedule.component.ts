import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs/operators';
import {PlannerDate} from '../domain/planner-date';
import {DailyDialogComponent} from './daily-dialog/daily-dialog.component';
import {ScheduleService} from './schedule.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ScheduleType} from '../domain/schedule-type.enum';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  @ViewChild('monthSchedule') MonthlyComponent;
  today: Date = new Date();
  selectedDate = new Date();
  plannerDate: PlannerDate;
  loading = false;
  nextDate: Date;
  previousDate: Date;
  isLarge = true;
  scheduleType: ScheduleType = ScheduleType.MONTHLY;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(
    private breakpointObserver: BreakpointObserver,
    public scheduleService: ScheduleService,
    private dailyDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isHandset$.subscribe((result: boolean) => {
      this.isLarge = !result;
    });
  }

  nextSchedule() {
    this.router.navigate(['/schedule', this.scheduleType, this.scheduleService.getDateKey(this.scheduleService.nextDate.value)])
      .then(() => {
        this.selectedDate = this.scheduleService.selectedDate.value;
      })
      .catch((reason: any) => {
        console.error(reason);
      });
  }

  previousSchedule() {
    this.router.navigate(['/schedule', this.scheduleType, this.scheduleService.getDateKey(this.scheduleService.previousDate.value)])
      .then(() => {
        this.selectedDate = this.scheduleService.selectedDate.value;
      })
      .catch((reason: any) => {
        console.error(reason);
      });
  }

  previewDate(plannerDate: PlannerDate) {
    this.plannerDate = plannerDate;
    const dialogRef = this.dailyDialog.open(DailyDialogComponent, {
      width: '60%',
      position: {top: '100px', right: '100px'},
      data: {plannerDate: this.plannerDate}
    });

    dialogRef.afterClosed().subscribe((result: PlannerDate) => {
      console.log('The dialog was closed');
      this.plannerDate = result;
    });
  }
}
