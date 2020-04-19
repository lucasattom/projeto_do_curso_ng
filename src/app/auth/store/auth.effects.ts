import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
   idToken: string;
   email: string;
   refreshToken: string;
   expiresIn: string;
   localId: string;
   registered?: boolean;
}

const handleAuthentication = (resData) => {
   const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
   const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
   localStorage.setItem('userData', JSON.stringify(user));
   return new AuthActions.AuthenticateSuccess({
      email: resData.email,
      userId: resData.localId,
      token: resData.idToken,
      expirationDate: expirationDate,
   });
};

const handleError = (errorRes: any) => {
   let errorMsg = 'An error occured!';
   if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMsg));
   }
   switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
         errorMsg = 'The email entered is already in use.';
         break;
      case 'EMAIL_NOT_FOUND':
         errorMsg = 'The email entered was not found.';
         break;
      case 'INVALID_PASSWORD':
         errorMsg = 'The password is invalid.';
         break;
   }
   return of(new AuthActions.AuthenticateFail(errorMsg));
};

@Injectable()
export class AuthEffects {
   @Effect()
   authSignup = this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((authData: AuthActions.SignupStart) => {
         return this.http
            .post<AuthResponseData>(
               `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
               { email: authData.payload.email, password: authData.payload.password, returnSecureToken: true }
            )
            .pipe(
               tap((resData) => {
                  this.authService.setLogoutTimer(+resData.expiresIn * 1000);
               }),
               map((resData) => {
                  return handleAuthentication(resData);
               }),
               catchError((errorRes) => {
                  return handleError(errorRes);
               })
            );
      })
   );

   @Effect()
   authLogin = this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
         return this.http
            .post<AuthResponseData>(
               `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
               { email: authData.payload.email, password: authData.payload.password, returnSecureToken: true }
            )
            .pipe(
               tap((resData) => {
                  this.authService.setLogoutTimer(+resData.expiresIn * 1);
               }),
               map((resData) => {
                  return handleAuthentication(resData);
               }),
               catchError((errorRes) => {
                  return handleError(errorRes);
               })
            );
      })
   );

   @Effect({ dispatch: false })
   authRedirect = this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap(() => {
         this.router.navigate(['/']);
      })
   );

   @Effect()
   autoLogin = this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
         const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
         } = JSON.parse(localStorage.getItem('userData'));
         if (!userData) {
            return { type: 'DUMMY' };
         }

         const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
         );

         if (loadedUser.token) {
            // this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(expirationDuration);
            return new AuthActions.AuthenticateSuccess({
               email: loadedUser.email,
               userId: loadedUser.id,
               token: loadedUser.token,
               expirationDate: new Date(userData._tokenExpirationDate),
            });

            // this.autoLogout(expirationDuration);
         }
         return { type: 'DUMMY' };
      })
   );

   @Effect({ dispatch: false })
   authLogout = this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
         this.authService.clearLogoutTimer();
         localStorage.removeItem('userData');
         this.router.navigate(['/auth']);
      })
   );

   constructor(
      private actions$: Actions,
      private http: HttpClient,
      private router: Router,
      private authService: AuthService
   ) {}
}
