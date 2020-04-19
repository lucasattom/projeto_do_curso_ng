/* import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer'

@Injectable()
export class ShoppingListService {
   // ingredientsChanged = new EventEmitter<Ingredient[]>();
   ingredientsChanged = new Subject<Ingredient[]>();
   startedIngredient = new Subject<number>();
   private ingredients: Ingredient[] = [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)];

   constructor(private store: Store<fromShoppingList.AppState>) {}

   getIngredient(index: number) {
      return this.ingredients[index];
   }

   toAddIngredient(ingredient: Ingredient) {
      this.ingredients.push(ingredient);
      this.ingredientsChanged.next(this.ingredients);
   }

   toAddIngredients(ingredient: Ingredient[]) {
      // this.ingredients.push(...ingredient);
      // this.ingredientsChanged.next(this.ingredients);
      this.store.dispatch(new ShoppingListActions.AddIngredients(ingredient));
   }

   updateIngredient(index: number, newIngredient: Ingredient) {
      this.ingredients[index] = newIngredient;
      this.ingredientsChanged.next(this.ingredients.slice());
   }

   deleteIngredient(index) {
      this.ingredients.splice(index, 1);
      this.ingredientsChanged.next(this.ingredients.slice());
   }

   getIngedients() {
      return this.ingredients.slice();
   }
}
 */