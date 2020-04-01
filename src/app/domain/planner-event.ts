export interface PlannerEvent {
  id: string;
  dateKey: string;
  name: string;
  startDate: Date;
  endDate: Date;
  repeatId?: string; // Use this when generating repeating events to identify an id that applies for all
  description?: string;
  location?: string;
}
