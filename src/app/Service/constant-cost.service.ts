import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ConstantCostService {

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  constructor(private http: HttpClient) {

  }

  setCost(coutFluide:number,coutPersonnel:number,coutAssaisonnement:number,type:boolean){

    var data = {
      COUT_FLUIDE:coutFluide ,
      COUT_PERSONNEL: coutPersonnel,
      COUT_ASSAISONEMENT: coutAssaisonnement,
      ISPERCENT:type,
    }

    return this.http.put(environment.api+"/recipe/setCost", data, this.httpOptions);

  }
  getCost(){
    return this.http.get<{
      COUT_FLUIDE:number ,
      COUT_PERSONNEL: number,
      COUT_ASSAISONNEMENT: number,
      ISPERCENT:boolean,
    }>(environment.api+"/recipe/getCost", {headers: new HttpHeaders({ 'Content-Type': 'application/json' }),observe: 'body', responseType: 'json'})
  }
}
