import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {Ingredient} from "../class/ingredient";
import {Category} from "../class/category";
import {Observable} from "rxjs";
import {Allergen} from "../class/allergen";
import {environment} from "../../environments/environment";




@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


  constructor(private http: HttpClient) {

  }
  getAllIngredient(){
    let allIngredient = this.http.get<any>(environment.api+"/ingredient/getIngredient", {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
    let res: Array<Ingredient>=new Array<Ingredient>();
    allIngredient.subscribe({
      next: (data) => {
        for(let d of data){
          if(d.ID_ALLERGEN!=null){
            res.push(new Ingredient(d.ID_INGREDIENT,d.NAMEI,d.UNIT,d.UNIT_PRICE,d.Ingredient_ID_Category,d.STOCK,new Allergen(d.ID_ALLERGEN,d.NAMEA,d.Allergen_ID_Category,d.URL)));

          }else {
            res.push(new Ingredient(d.ID_INGREDIENT,d.NAMEI,d.UNIT,d.UNIT_PRICE,d.Ingredient_ID_Category,d.STOCK));
          }
        }
      },
      error: (e) => console.error(e)
    })
    return res;
  }

  createIngredient(ingredient:Ingredient):Observable<any>{
    let data:Object;
    if(ingredient.allergen!=undefined ){
      data={
        NAME:ingredient.name,
        UNIT:ingredient.unit,
        UNIT_PRICE:ingredient.unit_price,
        ID_Category:ingredient.id_category,
        ALLERGEN:ingredient.allergen.id,
        STOCK:ingredient.stock
      }

    }else {
      data={
        NAME:ingredient.name,
        UNIT:ingredient.unit,
        UNIT_PRICE:ingredient.unit_price,
        ID_Category:ingredient.id_category,
        ALLERGEN:null,
        STOCK:ingredient.stock
      }

    }
    return this.http.post(environment.api+"/ingredient/createIngredient",data,this.httpOptions);
  }
  updateIngredient(id:number,ingredient:Ingredient){
    let data:Object;
    if(ingredient.allergen!=undefined ){
      data={
        ID:id,
        NAME:ingredient.name,
        UNIT:ingredient.unit,
        UNIT_PRICE:ingredient.unit_price,
        ID_Category:ingredient.id_category,
        ALLERGEN:ingredient.allergen.id,
        STOCK:ingredient.stock
      }

    }else {
      data={
        ID:id,
        NAME:ingredient.name,
        UNIT:ingredient.unit,
        UNIT_PRICE:ingredient.unit_price,
        ID_Category:ingredient.id_category,
        ALLERGEN:null,
        STOCK:ingredient.stock
      }

    }
    return this.http.put(environment.api+"/ingredient/updateIngredient",data,this.httpOptions);

  }

  delete(id:number):Observable<any>{
    let data={
      ID:id,
    }
    return this.http.post(environment.api+"/ingredient/deleteIngredient",data,this.httpOptions)
  }
  createCategory(category:Category):Observable<any>{
    let data={
      NAME:category.name,
      URL:category.url,
    }
    return this.http.post(environment.api+"/category/createCategory/I_Category",data,this.httpOptions);
  }
  getIcategory(){
    let category = this.http.get<any>(environment.api+"/category/getCategory/I_Category", {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
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
  updateCategory(id:number,category:Category){
    let data={
      ID:id,
      NAME:category.name,
      URL:category.url,
    }
    return this.http.put(environment.api+"/category/updateCategory/I_Category",data,this.httpOptions);
  }
  deleteCategory(id:number){
    let data={
      ID:id,
    }
    return this.http.post(environment.api+"/category/deleteCategory/I_Category",data,this.httpOptions);
  }
  updateStock(value :Map<Ingredient,number>,nbCouvert:number){

    let array=new Array<{ID:number,QUANTITY:number}>()
    value.forEach(((value1, key) => {
      array.push({
        ID: key.id,
        QUANTITY: key.stock - nbCouvert * value1
      })
    }))

    return this.http.put(environment.api+"/ingredient/updateStock",array,this.httpOptions)
  }


}
