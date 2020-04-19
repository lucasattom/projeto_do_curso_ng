import { Recipe } from './recipe.model';
import { EventEmitter } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Subject } from 'rxjs';

export class RecipeService {
  // recipeSelected = new Subject<Recipe>();
  // recipeSelected = new EventEmitter<Recipe>();
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Chocolate cake',
  //     "I hope it's delicious",
  //     'https://tastesbetterfromscratch.com/wp-content/uploads/2010/06/Hersheys-Perfectly-Chocolate-Chocolate-Cake-13.jpg',
  //     [new Ingredient('Farinha', 1), new Ingredient('Chocolate', 3)]
  //   ),
  //   new Recipe(
  //     'Bolinho gostoso',
  //     "I hope it's delicious",
  //     'https://tastesbetterfromscratch.com/wp-content/uploads/2010/06/Hersheys-Perfectly-Chocolate-Chocolate-Cake-13.jpg',
  //     [new Ingredient('leite', 2), new Ingredient('Manteiga', 4)]
  //   ),
  // ];
  

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes.splice(index, 1, newRecipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
