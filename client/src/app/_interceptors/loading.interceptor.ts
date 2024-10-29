import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const bysyService = inject(BusyService);

  bysyService.bysy();

  return next(req).pipe(
    delay(1000), 
    finalize(() => {
      bysyService.idle()
  }));
};
