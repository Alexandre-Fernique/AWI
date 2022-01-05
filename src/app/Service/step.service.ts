import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Step} from "../class/step";
import {Ingredient} from "../class/ingredient";
import {Allergen} from "../class/allergen";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StepService {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) {

  }
  createStep(step:Step) {
    var data = {
      NAME: step.name,
      DESCRIPTION: step.description,
      DURATION: step.duration,
      INGREDIENT: ([] as Array<{ ID: number | null, QUANTITY: number | null }>)
    }
    step.ingredient.forEach((value, key) => {
      if (key instanceof Ingredient) {
        data.INGREDIENT.push({
          ID: key.id,
          QUANTITY: value,
        });
      } else {
        data.INGREDIENT.push({
          ID: key,
          QUANTITY: value,
        });

      }
    })
    console.log(data);
    return this.http.post(environment.api+"/step/createStep", data, this.httpOptions);

  }
  updateStep(id:number,step:Step){
    var data = {
      ID:id,
      NAME: step.name,
      DESCRIPTION: step.description,
      DURATION: step.duration,
      INGREDIENT: ([] as Array<{ ID: number | null, QUANTITY: number | null }>)
    }
    step.ingredient.forEach((value, key) => {
      if (key instanceof Ingredient) {
        data.INGREDIENT.push({
          ID: key.id,
          QUANTITY: value,
        });
      } else {
        data.INGREDIENT.push({
          ID: key,
          QUANTITY: value,
        });

      }
    })
    return this.http.put(environment.api+"/step/updateStep", data, this.httpOptions);

  }
  getAllStep() {
    let allStep = this.http.get<any>(environment.api+"/step/getStep", {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
    let res: Array<Step>=new Array<Step>();

    allStep.subscribe({
      next: (data) => {
        for(let d of data){
          let ingredientMap=new Map<Ingredient,number>()
          if(d.INGREDIENT[0].ID!=null){
            for (let ingredient of d.INGREDIENT){
              if(ingredient.ALLERGEN.ID==null){
                ingredientMap.set(new Ingredient(ingredient.ID,ingredient.NAME,ingredient.UNIT,ingredient.UNIT_PRICE,ingredient.ID_Category,ingredient.STOCK),ingredient.QUANTITY)
              }else {
                ingredientMap.set(new Ingredient(ingredient.ID,ingredient.NAME,ingredient.UNIT,ingredient.UNIT_PRICE,ingredient.ID_Category,ingredient.STOCK,
                  new Allergen(ingredient.ALLERGEN.ID,ingredient.ALLERGEN.NAME,ingredient.ALLERGEN.ID_Category,ingredient.ALLERGEN.URL)),ingredient.QUANTITY)
              }
            }
          }

          res.push(new Step(d.ID_STEP,d.NAME,d.DESCRIPTION,d.DURATION,ingredientMap));
        }
      },
      error: (e) => console.log(e)
    })
    return res;
  }
  deleteStep(event:Step){
      let data={
        ID:event.id,
      }
      return this.http.post(environment.api+"/step/deleteStep",data,this.httpOptions)
  }


}
