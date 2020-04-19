import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer'

@Component({
   selector: 'app-shopping-list',
   templateUrl: './shopping-list.component.html',
   styleUrls: ['./shopping-list.component.css'],
   providers: [],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
   ingredients: Observable<{ ingredients: Ingredient[] }>;
   private subscription: Subscription;

   constructor(
      // private shoppingListService: ShoppingListService,
      private loggingService: LoggingService,
      private store: Store<fromApp.AppState>
   ) {}

   ngOnInit(): void {
      this.ingredients = this.store.select('shoppingList');
      // this.ingredients = this.shoppingListService.getIngedients();
      // this.subscription = this.shoppingListService.ingredientsChanged.subscribe((ingedients: Ingredient[]) => {
      //    this.ingredients = ingedients;
      // });
      // this.loggingService.printLog('A message from ShoppingListComponent ngOnInit');
   }

   ngOnDestroy() {
      if (this.subscription) {
         this.subscription.unsubscribe();
      }
   }

   onEditItem(index: number) {
      // this.shoppingListService.startedIngredient.next(index);
      this.store.dispatch(new ShoppingListActions.StartEdit(index));
   }
}
