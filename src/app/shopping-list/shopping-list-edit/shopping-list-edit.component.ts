import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
// import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
   selector: 'app-shopping-list-edit',
   templateUrl: './shopping-list-edit.component.html',
   styleUrls: ['./shopping-list-edit.component.css'],
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
   @ViewChild('f', { static: false }) slForm: NgForm;
   subscription: Subscription;
   editMode = false;
   editedItemIndex: number;
   editedItem: Ingredient;

   constructor(
      /* private shoppingListService: ShoppingListService,  */
      private store: Store<fromApp.AppState>
   ) {}

   ngOnInit(): void {
      this.subscription = this.store.select('shoppingList').subscribe((stateData) => {
         if (stateData.editedIngredientIndex > -1) {
            this.editMode = true;
            this.editedItem = stateData.editedIngredient;
            this.slForm.setValue({
               name: this.editedItem.name,
               amount: this.editedItem.amount,
            });
         } else {
            this.editMode = false;
         }
      });
      // this.subscription = this.shoppingListService.startedIngredient.subscribe((index) => {
      //    this.editedItemIndex = index;
      //    this.editMode = true;
      //    this.editedItem = this.shoppingListService.getIngredient(index);
      //    this.slForm.setValue({
      //       name: this.editedItem.name,
      //       amount: this.editedItem.amount,
      //    });
      // });
   }

   ngOnDestroy() {
      this.subscription.unsubscribe();
      this.store.dispatch(new ShoppingListActions.StopEdit());
   }

   onAddIngredient(form: NgForm) {
      const value = form.value;
      const newIngredient = new Ingredient(value.name, value.amount);
      if (!this.editMode) {
         //  this.shoppingListService.toAddIngredient(newIngredient);
         this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
      } else {
         // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
         this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
         this.editMode = false;
      }
      this.slForm.reset();
   }

   onDelete() {
      console.log(this.editMode);
      if (this.editMode) {
         // this.shoppingListService.deleteIngredient(this.editedItemIndex);
         this.store.dispatch(new ShoppingListActions.DeleteIngredient());
         this.onClear();
      }
   }

   onClear() {
      this.slForm.reset();
      this.editMode = false;
      this.store.dispatch(new ShoppingListActions.StopEdit());
   }

   // addIngredient(name: HTMLInputElement, amount: HTMLInputElement){
   //   this.newIngredient.emit(new Ingredient(name.value, parseInt(amount.value)));
   // }
}
