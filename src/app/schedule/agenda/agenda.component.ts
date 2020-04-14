import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Grid} from '../../domain/grid';
import {ScheduleService} from '../schedule.service';
import {EventType} from '../../domain/event-type.enum';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
  grid: Grid;
  today: Date = new Date();
  EventType = EventType;
  constructor(private route: ActivatedRoute, public scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.today = this.scheduleService.setMidnightDate(new Date());
    this.route.data.subscribe((data: Data) => {
      this.grid = data.grid;
    });
  }
}
