import {Component, Input, OnInit} from '@angular/core';
import {PlannerEvent} from '../../domain/planner-event';
import {PlannerDate} from '../../domain/planner-date';
import {PlannerHour} from '../../domain/planner-hour';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit {
  @Input() plannerDate: PlannerDate;
  minHour = 9;
  maxHour = 22;
  firstHour = 23;
  lastHour = 0;
  plannerHours: {[key: number]: PlannerHour } = {};
  hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  hasEarlyEvents = false;
  hasLateEvents = false;
  constructor() {}

  ngOnInit(): void {
    this.hours.map((hour: number ) => {
      const newDate = new Date(this.plannerDate.calendarDate.getTime());
      newDate.setHours(hour);
      newDate.setMinutes(0)
      this.plannerHours[hour] = {
        hourTime: newDate,
        events: []
      };
    });
    this.setHourEvents();
  }

  setHourEvents() {
    if (this.plannerDate && this.plannerDate.events) {
      this.plannerDate.events.forEach((plannerEvent: PlannerEvent) => {
        const eventHour = new Date(plannerEvent.startDate).getHours();
        if (eventHour < this.firstHour) {
          this.firstHour = eventHour;
        }
        if (eventHour > this.lastHour) {
          this.lastHour = eventHour;
        }
        this.plannerHours[eventHour].events.push(plannerEvent);
      });
    }
  }
}
