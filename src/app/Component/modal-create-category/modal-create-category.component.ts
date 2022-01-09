import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewContainerRef} from '@angular/core';
import {Category} from "../../class/category";
import {FormBuilder} from "@angular/forms";
import {IngredientService} from "../../Service/ingredient.service";
import {AllergenService} from "../../Service/allergen.service";
import {AlertComponent} from "../alert/alert.component";
import {RecipeService} from "../../Service/recipe.service";

@Component({
  selector: 'app-modal-create-category',
  templateUrl: './modal-create-category.component.html',
  styleUrls: ['./modal-create-category.component.css']
})
export class ModalCreateCategoryComponent implements OnChanges {
  @Input() type = "None";
  @Input() updateModal = false;
  @Input() inputCategory: Category | undefined;
  @Output() newCategory = new EventEmitter<Category>();
  fb = new FormBuilder()
  form = this.fb.group({
    name: [""],
    url: [""],
  });


  constructor(private iHttp: IngredientService, private aHttp: AllergenService,private rHttp:RecipeService ,public viewContainerRef: ViewContainerRef) {


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.form.get("name")?.setValue(this.inputCategory?.name)
    this.form.get("url")?.setValue(this.inputCategory?.url)
  }




  validate(){

    var category=new Category(0,this.form.get("name")?.value,this.form.get("url")?.value);
    if(!this.updateModal){
      if(this.type=="Ingrédient"){
        this.iHttp.createCategory(category).subscribe({
          next: (res) => {
            category.id=(res as {ID:number}).ID;
            AlertComponent.alert("Catégorie "+category.name+" créer","success",this.viewContainerRef);
            this.newCategory.emit(category);
          },
          error: (e) => {
            console.error(e)
            AlertComponent.alert("Erreur pour la création de catégorie","danger",this.viewContainerRef);
          }
        })
      }else if(this.type=="Allergène"){
        this.aHttp.createCategory(category).subscribe({
          next: (res) => {
            category.id=(res as {ID:number}).ID;
            AlertComponent.alert("Catégorie "+category.name+" créer","success",this.viewContainerRef);
            this.newCategory.emit(category);
          },
          error: (e) => {
            console.error(e)
            AlertComponent.alert("Erreur pour la création de catégorie","danger",this.viewContainerRef);
          }
        })
      }else if(this.type=="Recette") {
        this.rHttp.createCategory(category).subscribe({
          next: (res) => {
            category.id=(res as {ID:number}).ID;
            AlertComponent.alert("Catégorie "+category.name+" créer","success",this.viewContainerRef);
            this.newCategory.emit(category);
          },
          error: (e) => {
            console.error(e)
            AlertComponent.alert("Erreur pour la création de catégorie","danger",this.viewContainerRef);
          }
        })


      }else {
        AlertComponent.alert("Erreur","danger",this.viewContainerRef);
      }
    }else{
      if(this.type=="Ingrédient"){
        this.iHttp.updateCategory(this.inputCategory!.id,category).subscribe({
          error: (e) => {
            console.error(e)
            AlertComponent.alert("Erreur pour la mise à jour de la catégorie","danger",this.viewContainerRef);
          },complete:()=>{
            category.id=this.inputCategory!.id
            AlertComponent.alert("Catégorie "+category.name+" mise à jour","success",this.viewContainerRef);
            this.newCategory.emit(category);

          }
        })
      }else if(this.type=="Allergène"){
        this.aHttp.updateCategory(this.inputCategory!.id,category).subscribe({
          error: (e) => {
            console.error(e)
            AlertComponent.alert("Erreur pour la mise à jour de la catégorie","danger",this.viewContainerRef);
          },complete:()=>{
            category.id=this.inputCategory!.id
            AlertComponent.alert("Catégorie "+category.name+" mise à jour","success",this.viewContainerRef);
            this.newCategory.emit(category);
        }})
      }else if(this.type=="Recette") {
        this.rHttp.updateCategory(this.inputCategory!.id,category).subscribe({
          error: (e) => {
            console.error(e)
            AlertComponent.alert("Erreur pour la mise à jour de la catégorie","danger",this.viewContainerRef);
          },complete:()=>{
            category.id=this.inputCategory!.id
            AlertComponent.alert("Catégorie "+category.name+" mise à jour","success",this.viewContainerRef);
            this.newCategory.emit(category);
          }})


      }else {
        AlertComponent.alert("Erreur","danger",this.viewContainerRef);
      }

    }


  }

}
