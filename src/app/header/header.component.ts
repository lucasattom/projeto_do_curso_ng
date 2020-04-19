import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions'

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
   isAuthenticated = false;
   private userSub: Subscription;

   constructor(
      private dataStorageService: DataStorageService,
      private auhtService: AuthService,
      private store: Store<fromApp.AppState>
   ) {}

   ngOnInit() {
      this.userSub = this.store.select('auth').subscribe((authResponse) => {
         // this.userSub = this.auhtService.user.subscribe((user) => {
         // this.userSub = this.store.select('auth').pipe(map(authState => authState.user)).subscribe((user) => {
         this.isAuthenticated = !!authResponse.user;
      });
   }

   ngOnDestroy() {
      this.userSub.unsubscribe();
   }

   onSaveData() {
      this.dataStorageService.storeRecipes();
   }

   onFetchData() {
      this.dataStorageService.fetchRecipes().subscribe();
   }

   onLogout() {
      // this.auhtService.logout();
      this.store.dispatch(new AuthActions.Logout());
   }
}
