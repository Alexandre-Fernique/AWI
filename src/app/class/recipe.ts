import {Step} from "./step";
import {Stepable} from "./stepable";
import {Ingredient} from "./ingredient";


export class Recipe implements Stepable{
  id: number;
  name: string;
  nb_couvert: number;
  cout_assaisonnement: number;
  coutAssaisonnementIsPercent: boolean;
  author: string;
  id_category: number;
  step: Array<Stepable>


  constructor(id: number, name="None", nb_couvert=0, cout_assaisonnement=0, coutAssaisonnementIsPercent=false, author="none", id_category=-1, step:Array<Stepable>=new Array<Step>() ) {
    this.id = id;
    this.name = name;
    this.nb_couvert = nb_couvert ;
    this.cout_assaisonnement = cout_assaisonnement;
    this.coutAssaisonnementIsPercent = coutAssaisonnementIsPercent;
    this.author = author;
    this.id_category = id_category;
    this.step = step;
  }
  getStep(): Array<Step> {
    let array=new Array<Step>()
    if(this.step==undefined){
      return array
    }
    this.step.forEach(((value) => {
      array=array.concat(value.getStep())
    }))
    return array;
  }
  getType(): string {
    return "Recipe"
  }
  getCoutIngredient(nbTable=this.nb_couvert):number{
    let sum=0;
    if(this.step==undefined){
      return sum
    }
    this.step.forEach((value) => {
      sum+=value.getCoutIngredient(nbTable)
    })
    return this.convertNumber(sum,3)

  }
  getTotalDuration(): number {
    let sum=0;
    if(this.step==undefined){
      return sum
    }
    this.step.forEach((value) => {
      sum+=value.getTotalDuration();
    })
    return sum
  }
  stockAvailableForRecipe(nbCouvert=this.nb_couvert):boolean{
    let step=this.getStep();
    let result=true;
    for(let i = 0;i<step.length && result;i++){
      step[i].ingredient.forEach((value, key) => {
        if(key.stock<value*nbCouvert){
          result=false;
        }
      })
    }
      return result;
  }
  getTime():string{
    let duration=this.getTotalDuration();
    if(duration>=60){
      if(duration%60<10){
        return Math.floor(duration/60)+"h0"+duration%60+"m"
      }else {
        return Math.floor(duration / 60) + "h" + duration % 60 + "m"
      }
    }else {
      if(duration<10){
        return "0"+duration+"m"
      }else {
        return duration+"m"
      }

    }
  }
  getIngredient():Map<Ingredient,number>{
    let array=this.getStep()
    const mapIngredient=new Map<Ingredient,number>();
    array.forEach(((value, index) => {
      value.ingredient.forEach(((value1, key) => {

        var ingredient:Ingredient|undefined;
        for(let item of mapIngredient.keys()){
          if (item.id==key.id){
            ingredient=item;
          }
        }
        if(ingredient){

            mapIngredient.set(ingredient,mapIngredient.get(ingredient)!+value1)

        }else{
          mapIngredient.set(key,value1)
        }
      }))
    }))
    return mapIngredient;

  }
  getCoutMatiere(nbCouvert=this.nb_couvert,typeAssaisonement=this.coutAssaisonnementIsPercent,cout_Assaisonment=this.cout_assaisonnement):number{
      if(typeAssaisonement) {
        return this.convertNumber(this.getCoutIngredient(nbCouvert) * (cout_Assaisonment + 100) / 100,2)
      }
      else {
        return this.convertNumber(this.getCoutIngredient(nbCouvert) + cout_Assaisonment,2)
      }
  }
  convertNumber(item:number,decimal:number){
    return Number(item.toFixed(decimal))
  }

  getCoutPersonnel(chargeCost:boolean,cout_personnel:number){
    if(chargeCost){
      return this.convertNumber(this.getTotalDuration()/60*cout_personnel,2)
    }else{
      return 0
    }
  }
  getCoutFluide(chargeCost:boolean,cout_fluide:number){
    if(chargeCost){
      return this.convertNumber((this.getTotalDuration()/60*cout_fluide),2)
    }else{
      return 0
    }
  }
  getVente(marge:number,chargeCost:boolean,cout_fluide:number,cout_personnel:number){
    return this.convertNumber((this.getCoutMatiere()+this.getCoutFluide(chargeCost,cout_fluide)+this.getCoutPersonnel(chargeCost,cout_personnel))*marge,2)
  }
  getBenefice(marge:number,chargeCost:boolean,cout_fluide:number,cout_personnel:number){
    return this.getVente(marge,chargeCost,cout_fluide,cout_personnel)/1.1 -(this.getCoutMatiere()+this.getCoutFluide(chargeCost,cout_fluide)+this.getCoutPersonnel(chargeCost,cout_personnel))
  }


}
