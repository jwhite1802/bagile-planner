export interface PlannerEvent {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  dateKey?: string;
  monthKey?: string;
  weekStartKey?: string;
  calendarQuarterKey?: string;
  fiscalQuarterKey?: string;
  calendarYearKey?: string;
  fiscalYearKey?: string;
  repeatId?: string; // Use this when generating repeating events to identify an id that applies for all
  description?: string;
  location?: string;
}
