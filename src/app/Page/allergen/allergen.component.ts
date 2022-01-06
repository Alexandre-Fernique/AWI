import {Component, ViewContainerRef} from '@angular/core';
import {Category} from "../../class/category";
import {AllergenService} from "../../Service/allergen.service";
import {Allergen} from "../../class/allergen";
import {AlertComponent} from "../../Component/alert/alert.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../Component/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-allergen',
  templateUrl: './allergen.component.html',
  styleUrls: ['./allergen.component.css'],
  animations:[
    trigger('outIngredient', [
      state('in', style({ transform: 'translateX(0)' })),

      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ]),

    ])
  ]
})
export class AllergenComponent {

  category: Array<Category>;
  allergen:Array<Allergen>
  editMode=false;
  selecteCategory:Category|undefined;
  selecteAllergen:Allergen|undefined

  constructor(private request:AllergenService,public viewContainerRef: ViewContainerRef ,public dialogRef:MatDialog) {
    this.category=request.getCategory();
    this.allergen=request.getAllergen();



  }

  updateCategory(event:Category){
    this.selecteCategory=event
  }
  updateAllergen(event:Allergen){
    this.selecteAllergen=event
  }
  updateEmitCategory(event:Category){
    let category=this.category.findIndex((value) => value.id==event.id)
    if(category!=undefined){
      this.category[category]=event
    }
  }
  updateEmitAllergen(event:Allergen){
    let allergen=this.allergen.findIndex((value) => value.id==event.id)
    if(allergen!=undefined){
      this.allergen[allergen]=event
    }
  }
  deleteCategory(event:Category){
    let dialog=this.dialogRef.open(ConfirmDialogComponent,{
      width:'25%',
      data:"Voulez-vous supprimer "+event.name+"?",
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.request.deleteCategory(event.id).subscribe({
        error:(err)=>{
          if(err.status == 405){
            AlertComponent.alert("Erreur la catégorié contient des allergène", "danger",this.viewContainerRef)
          }else {
            AlertComponent.alert("Erreur au niveau du back", "danger",this.viewContainerRef)
            console.log(err)
          }
        },
        complete:()=>{
          this.category.splice(this.category.indexOf(event), 1)
          AlertComponent.alert("Catégorie " + event.name + " a bien été supprimé", "success",this.viewContainerRef)

        }
      })
      }
    })

  }
  delete(item:Allergen){
    let dialog=this.dialogRef.open(ConfirmDialogComponent,{
      width:'25%',
      data:"Voulez-vous supprimer "+item.name+"?",
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.request.deleteAllergen(item.id).subscribe({
            error: (e) => {
              console.error(e)
            },
            complete:()=> {

              this.allergen.splice(this.allergen.indexOf(item), 1)
              AlertComponent.alert("L'ingrédient " + item.name + " a bien été supprimé", "success",this.viewContainerRef)

            }

          }
        )
      }
    })


  }
  addC(category:Category){
    this.category.push(category)
  }
  addA(allergen:Allergen){
    this.allergen.push(allergen)
  }

}
