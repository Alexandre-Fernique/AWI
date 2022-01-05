import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../class/category";
import {Allergen} from "../class/allergen";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class AllergenService {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };



  constructor(private http: HttpClient) {

  }

  getAllAllergen(){
    let allAllergen = this.http.get<any>(environment.api+"/allergen/getAll", {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
    let res: Array<Allergen>=new Array<Allergen>();
    allAllergen.subscribe({
      next: (data) => {
        for(let d of data){
          res.push(new Allergen(d.ID_ALLERGEN,d.NAME,d.ID_Category,d.URL));
        }
      },
      error: (e) => console.error(e)
    })
    return res;
  }

  createAllergen(allergen:Allergen):Observable<any>{
    let data={
      NAME:allergen.name,
      ID_Category: allergen.id_category
    }
    return this.http.post(environment.api+"/allergen/createAllergen",data,this.httpOptions);
  }
  updateAllergen(id:number,allergen:Allergen):Observable<any>{
    let data={
      ID:id,
      NAME:allergen.name,
      ID_Category: allergen.id_category
    }
    return this.http.put(environment.api+"/allergen/updateAllergen",data,this.httpOptions);
  }


  createCategory(category:Category):Observable<any>{
    let data={
      NAME:category.name,
      URL:category.url,
    }
    return this.http.post(environment.api+"/category/createCategory/A_Category",data,this.httpOptions);
  }
  updateCategory(id:number,category:Category){
    let data={
      ID:id,
      NAME:category.name,
      URL:category.url,
    }
    return this.http.put(environment.api+"/category/updateCategory/A_Category",data,this.httpOptions);
  }
  deleteCategory(id:number){
    let data={
      ID:id,
    }
    return this.http.post(environment.api+"/category/deleteCategory/A_Category",data,this.httpOptions);
  }


  delete(id:number):Observable<any>{
    let data={
      ID:id,
    }
    return this.http.post(environment.api+"/allergen/deleteAllergen",data,this.httpOptions)
  }

  getAcategory(){
    let category = this.http.get<any>(environment.api+"/category/getCategory/A_Category", {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
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
}



