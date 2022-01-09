import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Recipe} from "../../../class/recipe";
import {RecipeService} from "../../../Service/recipe.service";
import {FormControl} from "@angular/forms";
import {ConstantCostService} from "../../../Service/constant-cost.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../../Component/confirm-dialog/confirm-dialog.component";
import {AlertComponent} from "../../../Component/alert/alert.component";
import { jsPDF } from "jspdf"
import {IngredientService} from "../../../Service/ingredient.service";

@Component({
  selector: 'app-read-recipe',
  templateUrl: './read-recipe.component.html',
  styleUrls: ['./read-recipe.component.css']
})
export class ReadRecipeComponent implements OnInit {
  id:null|number;
  recipe:Recipe|undefined;
  nbCouvert=new FormControl()
  coutAssaisnment=new FormControl()
  marge=new FormControl()
  chargeCost=new FormControl()
  typeAssaisonement=new FormControl()
  printCost=new FormControl()
  cout_fluide:number
  cout_personnel:number



  constructor(private route: ActivatedRoute,private router:Router,private request:RecipeService,private cost:ConstantCostService,private dialogRef:MatDialog,private view:ViewContainerRef,private ingredientRequest :IngredientService) {
    this.id=null;
    this.cout_fluide=0
    this.cout_personnel=0
    cost.getCost().subscribe({
      next:(d)=>{
        this.cout_fluide=d.COUT_FLUIDE
        this.cout_personnel=d.COUT_PERSONNEL
        this.marge.setValue(d.MARGE)

      }
    })
    this.typeAssaisonement.valueChanges.subscribe({
      next:(e)=>{
        if(this.recipe && typeof e=="boolean")
          this.recipe.coutAssaisonnementIsPercent=e;
      }
    })
    this.coutAssaisnment.valueChanges.subscribe({
      next:(e)=>{
        if(this.recipe && typeof e=="number")
          this.recipe.cout_assaisonnement=e;
      }
    })
    this.nbCouvert.valueChanges.subscribe({
      next:(e)=>{
        if(this.recipe && typeof e=="number")
          this.recipe.nb_couvert=e;
      }
    })
  }

  ngOnInit(): void {
    this.id=Number(this.route.snapshot.paramMap.get('id'));

    if(this.id!=null){
      this.request.getRecipeById(this.id).then(value => {
        this.recipe=value;
        this.nbCouvert.setValue(this.recipe.nb_couvert)
        this.coutAssaisnment.setValue(this.recipe.cout_assaisonnement)
        this.typeAssaisonement.setValue(this.recipe.coutAssaisonnementIsPercent)

      })
    }
  }
  enregistrer(){
    if(this.recipe?.stockAvailableForRecipe()){
      AlertComponent.alert("Vente enrgistré","success",this.view)
      this.ingredientRequest.updateStock(this.recipe?.getIngredient(),this.recipe?.nb_couvert).subscribe({
        error:(err) => {
          console.log(err)
          AlertComponent.alert("Problème Back","danger",this.view)
        },
        complete:()=>{
          this.router.navigate(['/'])
        }
      })
    }else{
      AlertComponent.alert("Stock insuffisant","danger",this.view)
    }

  }


  async download(){

      var pdf = new jsPDF('p', 'pt', "a4");


      pdf.html(document.getElementById("pdfTable")!,{width:595,autoPaging:'text'}).then((doc) => {
        let taille=document.getElementById("pdfTable")
        if(taille!=null){
          let nb_page=Number.parseInt((taille.clientHeight/842).toString())+1
          while(pdf.getNumberOfPages()>nb_page){
            pdf.deletePage(nb_page+1);
          }
        }


        pdf.save("test.pdf")

      })

    }

  delete(){
    let dialog=this.dialogRef.open(ConfirmDialogComponent,{
      width:'25%',
      data:"Voulez-vous supprimer "+this.recipe!.name+"?",
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        if (this.recipe != undefined) {
          this.request.deleteRecipe(this.recipe.id).subscribe({
            next:(err)=>{
              let text=""
              for (let item of err){
                text+=item.NAME+" "
              }
              AlertComponent.alert("Erreur la recette est utilisé dans les recettes "+text, "danger", this.view)
            },
            error: (err) => {
              console.log(err)
              AlertComponent.alert("Erreur dans la suppresion", "danger", this.view)
            },
            complete: () => {
              this.router.navigate(['/'])
            }
          })
        }
      }
    })
  }
  changeCost(event:{COUT_PERSONNEL:number,COUT_FLUIDE:number}){
    this.cout_fluide=event.COUT_FLUIDE;
    this.cout_personnel=event.COUT_PERSONNEL;
  }

}

