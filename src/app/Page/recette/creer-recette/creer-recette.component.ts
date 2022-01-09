import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {IngredientService} from "../../../Service/ingredient.service";
import {Ingredient} from "../../../class/ingredient";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {StepService} from "../../../Service/step.service";
import {Step} from "../../../class/step";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {animate, style, transition, trigger} from "@angular/animations";
import {ConstantCostService} from "../../../Service/constant-cost.service";
import {Recipe} from "../../../class/recipe";
import {Category} from "../../../class/category";
import {RecipeService} from "../../../Service/recipe.service";

import {AlertComponent} from "../../../Component/alert/alert.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Etiquette} from "../../../class/etiquette";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-creer-recette',
  templateUrl: './creer-recette.component.html',
  styleUrls: ['./creer-recette.component.css'],
  animations:[trigger("newStepAnim",[
    transition(':enter', [
      style({
        transform: 'translateY(1000px)',
        filter:"blur(40px)"
      }),
      animate(500, style({
        transform: 'translateY(0%)',
        filter:"blur(0)"
      }))
    ]),
    transition('* => void', [
      animate(500, style({
        transform: 'translateX(100%)',
        filter:"blur(40px)"
      }))
    ]),
  ])
  ]
})
export class CreerRecetteComponent implements OnInit{
  ingredient:Array<Ingredient>
  listeStep:Array<number>=new Array<number>()
  stepList:Array<Step>
  recipeList:Array<Etiquette>
  RCategory:Array<Category>
  cpt=0;
  f=new FormBuilder();
  form:FormGroup=this.f.group({
    name: [""],
    nbTable: [""],
    author:[""],
    category:[""],
    coutAssaisonement:[""],
    typeAssaisonement:[""]

  });
  id:number|null

  constructor(private route: ActivatedRoute,private http:IngredientService,private requestS:StepService,private cost:ConstantCostService,private requestR:RecipeService,public viewRef:ViewContainerRef,private router:Router) {
    this.ingredient=http.getAllIngredient();
    this.stepList=requestS.getAllStep();
    this.RCategory=requestR.getCategory()
    this.recipeList=requestR.getAllRecipe()
    this.cost.getCost().subscribe({
        next:(data)=>{
          this.form.get("coutAssaisonement")?.setValue(data.COUT_ASSAISONNEMENT);
          this.form.get("typeAssaisonement")?.setValue(data.ISPERCENT)
        }
      }
    )
    this.id=null;
  }
  ngOnInit() {
    if(this.route.snapshot.paramMap.get('id')!=null){
        this.id=Number(this.route.snapshot.paramMap.get('id'));
    }
    if(this.id!=null){
      this.requestR.getRecipeById(this.id).then(value => {
        this.form.get("name")?.setValue(value.name)
        this.form.get("nbTable")?.setValue(value.nb_couvert)
        this.form.get("category")?.setValue(value.id_category)
        this.form.get("coutAssaisonement")?.setValue(value.cout_assaisonnement)
        this.form.get("typeAssaisonement")?.setValue(value.coutAssaisonnementIsPercent)
        this.form.get("author")?.setValue(value.author)
        value.step.forEach((step, index) =>{
          if(step instanceof Step){
            this.listeStep.push(this.cpt)
            this.form.addControl(this.cpt.toString() + "ID", new FormControl('S'+step.id,Validators.required));
            this.cpt++;
          }else if(step instanceof Recipe){
            this.listeStep.push(this.cpt)
            this.form.addControl(this.cpt.toString() + "ID", new FormControl('R'+step.id,Validators.required));
            this.cpt++;
          }else {
            console.log("Erreur type sur étape "+index)
          }
        })
        this.form.get("author")?.setValue(value.author)
      })
    }

  }

  createIngredient(event:Ingredient) {
    this.ingredient.push(event);
  }
  createStep(event:Step){
    this.stepList.push(event)
  }

  add(){
    this.listeStep.push(this.cpt)
    this.form.addControl(this.cpt.toString() + "ID", new FormControl("",Validators.required));
    this.cpt++;
  }
  delete(item:number){
    this.listeStep.splice(this.listeStep.indexOf(item),1);
    this.form.removeControl(item.toString()+"ID")

  }
  drop(event: CdkDragDrop<number[]>) {
    moveItemInArray(this.listeStep, event.previousIndex, event.currentIndex);
  }
  validate(){
    let step=new Array<string>();
    this.listeStep.forEach(((value, index) => {
      step[index]=this.form.get(value+"ID")?.value

    }))
    let r=new Recipe(0,this.form.get("name")?.value,this.form.get("nbTable")?.value,this.form.get("coutAssaisonement")?.value,this.form.get("typeAssaisonement")?.value,
      this.form.get("author")?.value, this.form.get("category")?.value,new Array<Step>())
    if(this.id==null){
      this.requestR.createRecipe(r,step).subscribe({
        next:(result)=>{
          r.id=result.ID;
          AlertComponent.alert("Recette "+r.name+" créé","success",this.viewRef);
        },
        error:(err)=>{
          console.log(err)
          AlertComponent.alert("Erreur","danger",this.viewRef);
        }
      })
    }else {
      r.id=this.id;
      this.requestR.updateRecipe(r,step).subscribe({
        next:()=>{
          this.router.navigate(['/'])

        },
        error:(err:HttpErrorResponse)=>{
          console.log(err)
          if (err.status==409){
            AlertComponent.alert("Boucle infini de recette","danger",this.viewRef);
          }
          else
            AlertComponent.alert("Erreur","danger",this.viewRef);
        }
      })
    }




  }



}
