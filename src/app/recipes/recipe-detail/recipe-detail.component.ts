import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
// import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions'
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
   selector: 'app-recipe-detail',
   templateUrl: './recipe-detail.component.html',
   styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
   item: Recipe;
   id: number;

   constructor(
      // private slService: ShoppingListService,
      private route: ActivatedRoute,
      private recipesService: RecipeService,
      private router: Router,
      private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
   ) {}

   ngOnInit(): void {
      this.route.params.subscribe((params: Params) => {
         this.id = +params['id'];
         this.item = this.recipesService.getRecipe(this.id);
      });
   }

   addToSL() {
      // this.slService.toAddIngredients(this.item.ingredients);
      this.store.dispatch(new ShoppingListActions.AddIngredients(this.item.ingredients));
   }

   onEditRecipe() {
      this.router.navigate(['edit'], { relativeTo: this.route });
   }

   onDeleteRecipe() {
      this.recipesService.deleteRecipe(this.id);
      this.router.navigate(['recipes']);
   }
}
