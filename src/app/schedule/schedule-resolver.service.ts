import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ScheduleType} from '../domain/schedule-type.enum';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleResolverService implements Resolve<ScheduleType>{

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ScheduleType> {
    let scheduleType: ScheduleType = ScheduleType.MONTHLY;
    if (route.url[0].path === ScheduleType.AGENDA) {
      scheduleType = ScheduleType.AGENDA;
    }
    return of(scheduleType);
  }
}
