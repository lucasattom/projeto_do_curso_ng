import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
   selector: 'app-auth',
   templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy, OnInit {
   isLoginMode = true;
   isLoading = false;
   error: string = null;
   @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
   private closeSub: Subscription;
   private storeSub: Subscription;

   constructor(
      private AuthService: AuthService,
      private router: Router,
      private componentFactoryResolver: ComponentFactoryResolver,
      private store: Store<fromApp.AppState>
   ) {}

   ngOnInit() {
      this.storeSub = this.store.select('auth').subscribe((authState) => {
         this.isLoading = authState.loading;
         this.error = authState.authError;
         if(this.error) {
            this.showErrorAlert(this.error);
         }
      });
   }

   onSwitchMode() {
      this.isLoginMode = !this.isLoginMode;
   }

   onSubmit(form: NgForm) {
      if (!form.valid) {
         return;
      }
      const email = form.value.email;
      const password = form.value.password;
      // let authObs: Observable<AuthResponseData>;

      this.isLoading = true;
      if (!this.isLoginMode) {
         // authObs = this.AuthService.signup(email, password);
         this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}))
      } else {
         this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }));
         // authObs = this.AuthService.login(email, password);
      }

      // authObs.subscribe(
      //    (resData) => {
      //       console.log(resData);
      //       this.isLoading = false;
      //       this.router.navigate(['/recipes']);
      //    },
      //    (errorMsg) => {
      //       console.log(errorMsg);
      //       this.error = errorMsg;
      //       this.showErrorAlert(errorMsg);
      //       this.isLoading = false;
      //    }
      // );

      form.reset();
   }

   onHandleError() {
      // this.error = null;
      this.store.dispatch(new AuthActions.ClearError());
   }

   private showErrorAlert(message: string) {
      const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      const hostViewContainerRef = this.alertHost.viewContainerRef;
      hostViewContainerRef.clear();

      const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

      componentRef.instance.message = message;
      this.closeSub = componentRef.instance.close.subscribe(() => {
         this.closeSub.unsubscribe();
         hostViewContainerRef.clear();
      });
   }

   ngOnDestroy() {
      if (this.closeSub) {
         this.closeSub.unsubscribe();
      }
      this.storeSub.unsubscribe();
   }
}
