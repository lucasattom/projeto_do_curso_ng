import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { catchError, tap } from 'rxjs/operators';
// import { throwError, BehaviorSubject } from 'rxjs';
// import { User } from './user.model';
import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
   idToken: string;
   email: string;
   refreshToken: string;
   expiresIn: string;
   localId: string;
   registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
   // user = new BehaviorSubject<User>(null);
   private tokenExpirationTimer: any;

   constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}

   // signup(email: string, password: string) {
   //    return this.http
   //       .post<AuthResponseData>(
   //          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
   //          { email, password, returnSecureToken: true }
   //       )
   //       .pipe(
   //          catchError(this.handleError),
   //          tap((resData) => {
   //             this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
   //          })
   //       );
   // }

   // login(email: string, password: string) {
   //    return this.http
   //       .post<AuthResponseData>(
   //          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
   //          { email, password, returnSecureToken: true }
   //       )
   //       .pipe(
   //          catchError(this.handleError),
   //          tap((resData) => {
   //             this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
   //          })
   //       );
   // }

   // autoLogin() {
   //    const userData: {
   //       email: string;
   //       id: string;
   //       _token: string;
   //       _tokenExpirationDate: string;
   //    } = JSON.parse(localStorage.getItem('userData'));
   //    if (!userData) {
   //       return;
   //    }

   //    const loadedUser = new User(
   //       userData.email,
   //       userData.id,
   //       userData._token,
   //       new Date(userData._tokenExpirationDate)
   //    );

   //    if (loadedUser.token) {
   //       // this.user.next(loadedUser);
   //       this.store.dispatch(
   //          new AuthActions.AuthenticateSuccess({
   //             email: loadedUser.email,
   //             userId: loadedUser.id,
   //             token: loadedUser.token,
   //             expirationDate: new Date(userData._tokenExpirationDate),
   //          })
   //       );
   //       const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
   //       this.autoLogout(expirationDuration);
   //    }
   // }

   // logout() {
   //    // this.user.next(null);
   //    this.store.dispatch(new AuthActions.Logout());
   //    this.router.navigate(['/auth']);
   //    localStorage.removeItem('userData');
   //    if (this.tokenExpirationTimer) {
   //       clearTimeout(this.tokenExpirationTimer);
   //    }
   //    this.tokenExpirationTimer = null;
   // }

   // autoLogout(expirationDuration: number) {
   //    this.tokenExpirationTimer = setTimeout(() => {
   //       this.logout();
   //    }, expirationDuration);
   // }

   setLogoutTimer(expirationDuration: number) {
      this.tokenExpirationTimer = setTimeout(() => {
         this.store.dispatch(new AuthActions.Logout())
      }, expirationDuration);
   }

   clearLogoutTimer() {
      if (this.tokenExpirationTimer) {
         clearTimeout(this.tokenExpirationTimer);
         this.tokenExpirationTimer = null
      }
   }

   // private handleAuthentication(email: string, id: string, idToken: string, expiresIn: number) {
   //    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
   //    const user = new User(email, id, idToken, expirationDate);
   //    // this.user.next(user);
   //    this.store.dispatch(
   //       new AuthActions.AuthenticateSuccess({ email: email, userId: id, token: idToken, expirationDate: expirationDate })
   //    );
   //    this.autoLogout(1000 * expiresIn);
   //    localStorage.setItem('userData', JSON.stringify(user));
   // }

   // private handleError(errorRes: HttpErrorResponse) {
   //    let errorMsg = 'An error occured!';
   //    if (!errorRes.error || !errorRes.error.error) {
   //       return throwError(errorMsg);
   //    }
   //    switch (errorRes.error.error.message) {
   //       case 'EMAIL_EXISTS':
   //          errorMsg = 'The email entered is already in use.';
   //          break;
   //       case 'EMAIL_NOT_FOUND':
   //          errorMsg = 'The email entered was not found.';
   //          break;
   //       case 'INVALID_PASSWORD':
   //          errorMsg = 'The password is invalid.';
   //          break;
   //    }
   //    return throwError(errorMsg);
   // }
}
