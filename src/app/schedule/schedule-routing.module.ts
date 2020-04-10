import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleComponent } from './schedule.component';
import {MonthlyComponent} from './monthly/monthly.component';
import {MonthlyResolverService} from './monthly/monthly-resolver.service';
import {ScheduleType} from '../domain/schedule-type.enum';

const routes: Routes = [
  { path: '', redirectTo: ScheduleType.MONTHLY, pathMatch: 'full' },
  { path: ScheduleType.MONTHLY, component: ScheduleComponent, children: [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }
