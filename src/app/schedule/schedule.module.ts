import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MonthlyComponent } from './monthly/monthly.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { DailyComponent } from './daily/daily.component';
import {MatCardModule} from '@angular/material/card';
import { DailyDialogComponent } from './daily-dialog/daily-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { AgendaComponent } from './agenda/agenda.component';

@NgModule({
  declarations: [ScheduleComponent, MonthlyComponent, DailyComponent, DailyDialogComponent, AgendaComponent],
  entryComponents: [DailyDialogComponent],
    imports: [
        CommonModule,
        ScheduleRoutingModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatMenuModule
    ]
})
export class ScheduleModule { }
