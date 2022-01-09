import {Component, Input} from '@angular/core';
import {Ingredient} from "../../class/ingredient";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input()ingredientMap:Map<Ingredient,number>=new Map<Ingredient, number>()
  @Input()nbTable:number|undefined;
  @Input()displayStock=false;
  constructor() {
    if(this.nbTable==undefined){
      this.nbTable=1;
    }
  }

  getPrice(){
    let sum=0;
    for(let item of this.ingredientMap){
      sum+=item[0].unit_price*item[1];
    }
    return sum;
  }
  convertNumber(item:number,decimal:number){
    return Number(item.toFixed(decimal))
  }

  getAllergen(){
  let allergen:Map<string,string>=new Map<string,string>()
    for (let item of this.ingredientMap){
      if(item[0].allergen!=undefined){
        if(allergen.get(item[0].allergen?.url)!=undefined){
          allergen.set(item[0].allergen.url,allergen.get(item[0].allergen.url)+" "+item[0].allergen?.name)
        }
        else {
          if (item[0].allergen?.url!=undefined){
            allergen.set(item[0].allergen.url,item[0].allergen.name)

          }
        }
      }
    }
    return allergen;
  }


}
