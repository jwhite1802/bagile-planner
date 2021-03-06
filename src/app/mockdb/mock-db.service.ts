import {Injectable, Injector} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import * as faker from 'faker';
import * as uuid from 'uuid';
import {PlannerEvent} from '../domain/planner-event';
import {ScheduleService} from '../schedule/schedule.service';
import {EventType} from '../domain/event-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MockDbService implements InMemoryDbService {
  private scheduleService: ScheduleService;
  constructor(private injector: Injector) {}
  createEvents(): PlannerEvent[] {
    const mockEvents: PlannerEvent[] = [];
    for (let yr = 2010; yr < 2030; yr++) {
      for (let m = 0; m < 12; m++) {
        const earliestDate = new Date(yr, m, 1, 8, 20);
        const latestDate = new Date(yr, m + 1, 8, 20);
        const eventsLengths = faker.random.number(50);
        for (let i = 0; i <  eventsLengths; i++) {
          const randomDate = faker.date.between(earliestDate, latestDate);
          const endTime = new Date(yr, m, randomDate.getDate(), randomDate.getHours() + 1.5);
          const event: PlannerEvent = {
            id: uuid.v4(),
            name: 'Meeting with ' + faker.name.findName(),
            eventType: EventType.NORMAL,
            startDate: randomDate,
            endDate: endTime,
            dateKey: this.scheduleService.getDateKey(randomDate),
            monthKey: this.scheduleService.getMonthKey(randomDate),
            weekStartKey: this.scheduleService.getWeekStartKey(randomDate),
            calendarQuarterKey: this.scheduleService.getQuarterKey(randomDate),
            fiscalQuarterKey: this.scheduleService.getQuarterKey(randomDate, true),
            calendarYearKey: this.scheduleService.getYearKey(randomDate),
            fiscalYearKey: this.scheduleService.getYearKey(randomDate, true)
          };
          const randomDate2 = this.scheduleService.setMidnightDate(faker.date.between(earliestDate, latestDate));
          const endTime2 = new Date(randomDate2.getFullYear(), randomDate2.getMonth(), randomDate2.getDate(),
            23, 59, 59, 59);
          const allDayEvent: PlannerEvent = {
            id: uuid.v4(),
            name: 'Travel to ' + faker.address.city(),
            eventType: EventType.ALL_DAY_EVENT,
            startDate: randomDate2,
            endDate: endTime2,
            dateKey: this.scheduleService.getDateKey(randomDate2),
            monthKey: this.scheduleService.getMonthKey(randomDate2),
            weekStartKey: this.scheduleService.getWeekStartKey(randomDate2),
            calendarQuarterKey: this.scheduleService.getQuarterKey(randomDate2),
            fiscalQuarterKey: this.scheduleService.getQuarterKey(randomDate2, true),
            calendarYearKey: this.scheduleService.getYearKey(randomDate2),
            fiscalYearKey: this.scheduleService.getYearKey(randomDate2, true)
          };
          mockEvents.push(allDayEvent);
          mockEvents.push(event);
        }
      }
    }
    return mockEvents;
  }

  createDb() {
    this.scheduleService = this.injector.get(ScheduleService);
    const db = {
      events: this.createEvents()
    };
    return db;
  }
}
