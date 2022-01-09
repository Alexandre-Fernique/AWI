import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Category} from "../class/category";
import {Recipe} from "../class/recipe";
import {Step} from "../class/step";
import {Ingredient} from "../class/ingredient";
import {Allergen} from "../class/allergen";
import {Etiquette} from "../class/etiquette";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Stepable} from "../class/stepable";



@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };



  constructor(private http: HttpClient) {

  }
  getCategory(){
    let category = this.http.get<any>(environment.api+"/category/getCategory/R_Category", {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
    let res: Array<Category>=new Array<Category>();
    category.subscribe({
      next: (data) => {
        for(let d of data){
          res.push(new Category(d.ID_Category,d.NAME,d.URL));
        }
      },
      error: (e) => console.error(e)
    })
    return res;
  }
  createCategory(category:Category):Observable<any>{
    let data={
      NAME:category.name,
      URL:category.url,
    }
    return this.http.post(environment.api+"/category/createCategory/R_Category",data,this.httpOptions);
  }
  updateCategory(id:number,category:Category){
    let data={
      ID:id,
      NAME:category.name,
      URL:category.url,
    }
    return this.http.put(environment.api+"/category/updateCategory/R_Category",data,this.httpOptions);
  }
  deleteCategory(id:number){
    let data={
      ID:id,
    }
    return this.http.post(environment.api+"/category/deleteCategory/R_Category",data,this.httpOptions);
  }

  /**
   *
   * @param recipe La recette a créer
   * @param step key=position de l'étape, value= le type de l'étape + son id ex("R2")
   */
  createRecipe(recipe:Recipe,step:Array<string>) {

    var data = {
      NAME: recipe.name,
      AUTHOR: recipe.author,
      NB_COUVERT:recipe.nb_couvert,
      COUT_ASSAISONNEMENT: recipe.cout_assaisonnement,
      ISPERCENT: recipe.coutAssaisonnementIsPercent,
      ID_Category:recipe.id_category,
      STEP: ([] as Array<{ RANK: number, ID: number | null, TYPE:string }>)
    }
    step.forEach((value, index) => {
      if(value.startsWith("S")){
        data.STEP.push({
          RANK: index,
          ID: parseInt(value.substring(1)),
          TYPE:"STEP",
        })
      }else if(value.startsWith("R")) {
        data.STEP.push({
          RANK: index,
          ID: parseInt(value.substring(1)),
          TYPE:"RECIPE",
        })
      }else {
        console.log("Erreur type")
      }
    })

    return this.http.post<{ID:number}>(environment.api+"/recipe/createRecipe", data, this.httpOptions);
  }

  updateRecipe(recipe: Recipe, step: string[]) {

    var data = {
      ID:recipe.id,
      NAME: recipe.name,
      AUTHOR: recipe.author,
      NB_COUVERT:recipe.nb_couvert,
      COUT_ASSAISONNEMENT: recipe.cout_assaisonnement,
      ISPERCENT: recipe.coutAssaisonnementIsPercent,
      ID_Category:recipe.id_category,
      STEP: ([] as Array<{ RANK: number, ID: number | null, TYPE:string }>)
    }
    step.forEach((value, index) => {
      if(value.startsWith("S")){
        data.STEP.push({
          RANK: index,
          ID: parseInt(value.substring(1)),
          TYPE:"STEP",
        })
      }else if(value.startsWith("R")) {
        data.STEP.push({
          RANK: index,
          ID: parseInt(value.substring(1)),
          TYPE:"RECIPE",
        })
      }else {
        console.log("Erreur type")
      }
    })
    return this.http.put(environment.api+"/recipe/updateRecipe", data, this.httpOptions);
  }

  deleteRecipe(id:number){
    let data={ID:id}
    return this.http.post<Array<{NAME:string}>>(environment.api+"/recipe/deleteRecipe", data, this.httpOptions);
  }
  getAllRecipe(filtre?:string){
    let allRecipe = this.http.get<any>(environment.api+"/recipe/getAllRecipe"+(filtre?"/"+filtre:""), {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
    let res: Array<Etiquette>=new Array<Etiquette>();
    allRecipe.subscribe({
      next: (data) => {
        for(let d of data){
          let ingredientName=new Set<string>()
          let ingredientArray=new Array<Ingredient>()
          for (let ingredient of d.INGREDIENT){
            let newIngredient:Ingredient
            if(ingredient.ALLERGEN.ID==null){
              newIngredient=new Ingredient(ingredient.ID,ingredient.NAME,ingredient.UNIT,ingredient.UNIT_PRICE,ingredient.ID_Category,ingredient.STOCK)
            }else {
              newIngredient=new Ingredient(ingredient.ID,ingredient.NAME,ingredient.UNIT,ingredient.UNIT_PRICE,ingredient.ID_Category,ingredient.STOCK,
                new Allergen(ingredient.ALLERGEN.ID,ingredient.ALLERGEN.NAME,ingredient.ALLERGEN.ID_Category,ingredient.ALLERGEN.URL))
            }
            if(!ingredientName.has(newIngredient.name)){

              ingredientName.add(newIngredient.name)
              ingredientArray.push(newIngredient)

            }
          }
          for(let id of d.Recette){
            for(let ligne of data){
              if(id==ligne.ID_RECIPE){
                for (let ingredient of ligne.INGREDIENT){
                  let newIngredient:Ingredient
                  if(ingredient.ALLERGEN.ID==null){
                    newIngredient=new Ingredient(ingredient.ID,ingredient.NAME,ingredient.UNIT,ingredient.UNIT_PRICE,ingredient.ID_Category,ingredient.STOCK)
                  }else {
                    newIngredient=new Ingredient(ingredient.ID,ingredient.NAME,ingredient.UNIT,ingredient.UNIT_PRICE,ingredient.ID_Category,ingredient.STOCK,
                      new Allergen(ingredient.ALLERGEN.ID,ingredient.ALLERGEN.NAME,ingredient.ALLERGEN.ID_Category,ingredient.ALLERGEN.URL))
                  }
                  if(!ingredientName.has(newIngredient.name)){
                    ingredientName.add(newIngredient.name)
                    ingredientArray.push(newIngredient)
                  }
                }
              }
            }
          }
          res.push(new Etiquette(d.ID_RECIPE,d.NAME,d.AUTHOR,d.ID_Category,ingredientArray));
        }
      },
      error: (e) => console.log(e)
    })
    return res;

  }
  getRecipeById(id:number){
    let recipeRequest = this.http.get<any>(environment.api+"/recipe/getRecipeById/"+id, {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
    return new Promise<Recipe>((resolve, reject) => {
      recipeRequest.subscribe({
        next: (data) => {
          resolve(this.createRecipeFromSQL(data))
          },
        error: (e) => reject(e)
      })
    })
  }


  createRecipeFromSQL(recipeSQL:Array<any>):Recipe{
    let stepArray=new Array<Stepable>()
    for(let d of recipeSQL){
      let ingredientArray=new Map<Ingredient,number>()
      if(d.INGREDIENT && d.INGREDIENT[0].ID!=null) {
        for (let ingredient of d.INGREDIENT) {
          if (ingredient.ALLERGEN.ID == null) {
            ingredientArray.set(new Ingredient(ingredient.ID, ingredient.NAME, ingredient.UNIT, ingredient.UNIT_PRICE, ingredient.ID_Category, ingredient.STOCK), ingredient.QUANTITY)
          } else {
            ingredientArray.set(new Ingredient(ingredient.ID, ingredient.NAME, ingredient.UNIT, ingredient.UNIT_PRICE, ingredient.ID_Category, ingredient.STOCK,
              new Allergen(ingredient.ALLERGEN.ID, ingredient.ALLERGEN.NAME, ingredient.ALLERGEN.ID_Category, ingredient.ALLERGEN.URL)), ingredient.QUANTITY)
          }
        }
        stepArray.push(new Step(d.ID_STEP,d.NAMES,d.DESCRIPTION,d.DURATION,ingredientArray));
      }else if(d.RECIPE) {
        stepArray.push(this.createRecipeFromSQL(d.RECIPE as Array<any>))
      }else {
        stepArray.push(new Step(d.ID_STEP,d.NAMES,d.DESCRIPTION,d.DURATION,ingredientArray));
      }
    }
    return new Recipe(recipeSQL[0].ID_RECIPE,recipeSQL[0].NAMER,recipeSQL[0].NB_COUVERT,recipeSQL[0].COUT_ASSAISONNEMENT,recipeSQL[0].ISPERCENT,recipeSQL[0].AUTHOR,recipeSQL[0].ID_Category,stepArray)


  }
}

