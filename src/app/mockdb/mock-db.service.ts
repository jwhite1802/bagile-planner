import { Injectable } from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import * as faker from 'faker';
import * as uuid from 'uuid';
import {PlannerEvent} from '../domain/planner-event';
import {PlannerMonth} from '../domain/planner-month';

@Injectable({
  providedIn: 'root'
})
export class MockDbService implements InMemoryDbService {
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
            dateKey: String(randomDate.getFullYear()) + '.' + String(randomDate.getMonth()) + '.' + String(randomDate.getDate()),
            name: 'Meeting with ' + faker.name.findName(),
            startDate: randomDate,
            endDate: endTime
          };
          mockEvents.push(event);
        }
      }
    }
    return mockEvents;
  }

  createDb() {
    console.log('createdb');
    const db = {
      events: this.createEvents()
    };
    return db;
  }
}
