import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({
   providedIn: 'root',
})
export class AuthGuard implements CanActivate {
   constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}

   canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
      return this.store.select('auth').pipe(
         // return this.authService.user.pipe(
         take(1),
         map((authData) => {
            return authData.user;
         }),
         map((user) => {
            const isAtuth = !!user;
            if (isAtuth) {
               return true;
            }
            return this.router.createUrlTree(['/auth']);
         })
      );
   }
}
