import {PlannerEvent} from './planner-event';

export interface PlannerDate {
  calendarDate: Date,
  events: PlannerEvent[];
}
