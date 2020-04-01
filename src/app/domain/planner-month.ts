import {PlannerEvent} from './planner-event';

export interface PlannerMonth {
  id: string;
  events: PlannerEvent[];
}
