import {Component, ViewContainerRef} from '@angular/core';

import {RecipeService} from "./Service/recipe.service";
import {Category} from "./class/category";
import {Etiquette} from "./class/etiquette";
import {FormControl} from "@angular/forms";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {AlertComponent} from "./Component/alert/alert.component";
import {ConfirmDialogComponent} from "./Component/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  category:Array<Category>
  etiquetteArray:Array<Etiquette>
  filtre=new FormControl()
  editMode=false;
  selectedCategory:Category|undefined;
  constructor(private request:RecipeService,public view:ViewContainerRef,public dialogRef:MatDialog) {
    this.category=request.getCategory()
    this.etiquetteArray=request.getAllRecipe()
    this.filtre.valueChanges.subscribe(value => {
      this.etiquetteArray=this.request.getAllRecipe(value);
    })

  }

  addCategory(event:Category){
    this.category.push(event);
  }
  update(event:Category){
    this.selectedCategory=event;

  }
  updateEmit(event:Category){
    let category = this.category.findIndex((value) => value.id == event.id)

    if (category != undefined) {
      this.category[category] = event
    }
  }
  delete(event:Category){
    let dialog=this.dialogRef.open(ConfirmDialogComponent,{
      width:'25%',
      data:"Voulez-vous supprimer "+event.name+"?",
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.request.deleteCategory(event.id).subscribe({
          error: (err) => {
            if (err.status == 405) {
              AlertComponent.alert("Erreur la catégorié contient des recettes", "danger",this.view)
            } else {
              AlertComponent.alert("Erreur au niveau du back", "danger",this.view)
              console.log(err)
            }

          },
          complete: () => {
            this.category.splice(this.category.indexOf(event), 1)
            AlertComponent.alert("Catégorie " + event.name + " a bien été supprimé", "success",this.view)

          }
        })
      }
    })

  }


}
