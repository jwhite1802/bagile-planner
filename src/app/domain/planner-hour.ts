import {PlannerEvent} from './planner-event';

export interface PlannerHour {
  hourTime: Date;
  events?: PlannerEvent[]
}
