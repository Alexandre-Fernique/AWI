import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {Category} from "../../class/category";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IngredientService} from "../../Service/ingredient.service";
import {Ingredient} from "../../class/ingredient";

import {Allergen} from "../../class/allergen";
import {AllergenService} from "../../Service/allergen.service";
import {AlertComponent} from "../alert/alert.component";


@Component({
  selector: 'app-modal-create-ingredient',
  templateUrl: './modal-create-ingredient.component.html',
  styleUrls: ['./modal-create-ingredient.component.css'],
})
export class ModalCreateIngredientComponent implements  OnChanges {
  @Input() category: Array<Category>|undefined;
  @Input() inputIngredient: Ingredient | undefined;
  @Input() updateModal:boolean=false;
  @Output() newIngredient= new EventEmitter<Ingredient>();

  fb: FormBuilder= new FormBuilder();
  form: FormGroup=this.fb.group({
    name: ["",[Validators.required]],
    unit: ["",[Validators.required]],
    unit_price: ["",[Validators.required,Validators.min(0)]],
    stock: ["",[Validators.required,Validators.min(0)]],
    id: ["",[Validators.required]],
    allergen: [""]
  });
  allergenList: Array<Allergen>;
  selectAllergen: FormControl;


  constructor(private requestI: IngredientService, private requestA: AllergenService,public viewcontainer:ViewContainerRef) {
    if(this.category==undefined){
      this.category = requestI.getIcategory();
    }
    this.allergenList = requestA.getAllergen();
    this.selectAllergen = new FormControl();

  }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.inputIngredient != undefined) {
      this.form.get("name")?.setValue(this.inputIngredient.name)
      this.form.get("unit")?.setValue(this.inputIngredient.unit)
      this.form.get("unit_price")?.setValue(this.inputIngredient.unit_price)
      this.form.get("id")?.setValue(this.inputIngredient.id_category)
      this.form.get("stock")?.setValue(this.inputIngredient.stock)
      if(this.inputIngredient.allergen!=undefined){
        this.form.get("allergen")?.setValue(this.inputIngredient.allergen.id)
      }
    }
  }


  getUnit(){
    return this.form.get("unit")!;
  }

  validate(){
    let allergenValue:Allergen|undefined=undefined;
    this.allergenList.forEach((allergen)=>{
      if(allergen.id==this.form.get("allergen")?.value){
        allergenValue=allergen
      }
    })
    var ingredient=new Ingredient(0,this.form.get("name")?.value,this.form.get("unit")?.value,this.form.get("unit_price")?.value,this.form.get("id")?.value,this.form.get("stock")?.value,allergenValue);

    if(!this.updateModal){
      this.requestI.createIngredient(ingredient).subscribe({
        next: (res) => {
          ingredient.id=(res as {ID:number}).ID;
          AlertComponent.alert("Ingrédient "+ingredient.name+" créer","success",this.viewcontainer);
          this.newIngredient.emit(ingredient);
        },
        error: (e) => {
          console.error(e)
          AlertComponent.alert("Erreur pour la création d'ingrédient","danger",this.viewcontainer);

        }
      })
    }else {
      if (this.inputIngredient != undefined && this.inputIngredient.id!=undefined) {
        let ID=this.inputIngredient.id;
        this.requestI.updateIngredient(this.inputIngredient.id, ingredient).subscribe({
          error: (e) => {
            console.error(e)
            AlertComponent.alert("Erreur pour la création d'ingrédient", "danger",this.viewcontainer);
          },
          complete: () => {
            AlertComponent.alert("Ingrédient " + ingredient.name + " mis à jour", "success",this.viewcontainer);
            ingredient.id=ID;
            this.newIngredient.emit(ingredient);
          }
        })
      }
    }

  }

}
