import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ScheduleService} from '../schedule.service';
import {PlannerEvent} from '../../domain/planner-event';
import {concat, forkJoin, Observable, of, pipe} from 'rxjs';
import {concatMap, flatMap, map, shareReplay} from 'rxjs/operators';
import {PlannerDate} from '../../domain/planner-date';
import {MatDialog} from '@angular/material/dialog';
import {Grid} from '../../domain/grid';
import {ActivatedRoute, Data} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements OnInit {
  @Input() selectedDate: Date = new Date();
  @Input() isLarge: boolean;
  @Output() onDatePreview: EventEmitter<PlannerDate> = new EventEmitter<PlannerDate>();
  today: Date = new Date();
  headers: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  shortHeaders: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  selectedPlannerDate: PlannerDate;
  rows: PlannerDate[][] = [];
  private grid: Grid;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(public scheduleService: ScheduleService, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      this.grid = data.grid;
      this.rows = this.grid.rows;
    });

    this.isHandset$.subscribe((result: boolean) => {
      this.isLarge = !result;
    });
  }

  previewDate(plannerDate: PlannerDate) {
    this.onDatePreview.emit(plannerDate);
  }
}
