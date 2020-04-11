import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleComponent } from './schedule.component';
import {MonthlyComponent} from './monthly/monthly.component';
import {MonthlyResolverService} from './monthly/monthly-resolver.service';
import {ScheduleType} from '../domain/schedule-type.enum';
import {AgendaComponent} from './agenda/agenda.component';
import {AgendaResolverService} from './agenda/agenda-resolver.service';
import {ScheduleResolverService} from './schedule-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: ScheduleType.AGENDA, pathMatch: 'full' },
  { path: ScheduleType.MONTHLY,
    component: ScheduleComponent,
    resolve: {
      scheduleType: ScheduleResolverService
    },
    children: [
      { path: ':dateKey',
        component: MonthlyComponent,
        resolve: {
          grid: MonthlyResolverService
        }
      },
      { path: '',
        component: MonthlyComponent,
        resolve: {
          grid: MonthlyResolverService
        }
      }
    ]},
  { path: ScheduleType.AGENDA,
    component: ScheduleComponent,
    resolve: {
      scheduleType: ScheduleResolverService
    },
    children: [
      { path: ':dateKey',
        component: AgendaComponent,
        resolve: {
          grid: AgendaResolverService
        }
      },
      { path: '',
        component: AgendaComponent,
        resolve: {
          grid: AgendaResolverService
        }
      }
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
