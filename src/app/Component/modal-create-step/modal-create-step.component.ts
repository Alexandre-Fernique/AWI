import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {Ingredient} from "../../class/ingredient";
import {IngredientService} from "../../Service/ingredient.service";
import {Category} from "../../class/category";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StepService} from "../../Service/step.service";
import {Step} from "../../class/step";
import {AlertComponent} from "../alert/alert.component";

@Component({
  selector: 'app-modal-create-step',
  templateUrl: './modal-create-step.component.html',
  styleUrls: ['./modal-create-step.component.css'],
  animations: [
    trigger('animation', [
      // ...
      state('show', style({
        opacity: 1,
      })),
      state('hidden', style({
        opacity: 0,
      })),
      transition('show => hidden', [
        animate('1s')
      ]),
    ]),
  ],
})
export class ModalCreateStepComponent implements  OnChanges {
  @Input() ingredientDonne: Array<Ingredient>|undefined;
  @Output() newStepEmiter = new EventEmitter<Step>();
  @Input() inputStep: Step | undefined;
  @Input() updateModal: boolean = false;

  liste: Array<number>;
  cpt: number;
  i_Category: Array<Category>;
  fb: FormBuilder = new FormBuilder();
  form: FormGroup = this.fb.group({
    name: ["",[Validators.required]],
    description: [""],
    duration: ["",[Validators.required]],

  });

  constructor(private requestI: IngredientService, private requestS: StepService,public viewcontainer:ViewContainerRef) {

    this.i_Category = requestI.getIcategory()
    if(this.ingredientDonne==undefined){
      this.ingredientDonne=requestI.getAllIngredient()
    }
    this.liste = new Array<number>()
    this.cpt = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (this.inputStep != undefined) {
        this.form.get("name")?.setValue(this.inputStep.name)
        this.form.get("description")?.setValue(this.inputStep.description)
        this.form.get("duration")?.setValue(this.inputStep.duration)
        for(let item of this.liste){
          this.form.removeControl(item.toString()+"ID")
          this.form.removeControl(item.toString() + "Q");
        }
        this.liste=new Array<number>();

        for (let item of this.inputStep.ingredient) {
          this.form.addControl(this.cpt.toString() + "ID", new FormControl("", Validators.required));
          this.form.addControl(this.cpt.toString() + "Q", new FormControl("", Validators.required));
          if(item[0] instanceof Ingredient){
            this.form.get(this.cpt.toString() + "ID")?.setValue(item[0].id)
          }
          this.form.get(this.cpt.toString() + "Q")?.setValue(item[1])
          this.liste.push(this.cpt)
          this.cpt++;
        }
      }
    }


  ajoutIngredient() {
    this.form.addControl(this.cpt.toString() + "ID", new FormControl("",Validators.required));
    this.form.addControl(this.cpt.toString() + "Q", new FormControl("",Validators.required));
    this.liste.push(this.cpt)
    this.cpt++;
  }

  deleteIngredient(item: number) {
    this.liste.splice(this.liste.indexOf(item), 1)
    this.form.removeControl(item.toString()+"ID")
    this.form.removeControl(item.toString() + "Q");
  }
  getValidform(input:string){
    if(this.form.get(input)!.untouched){
      return ""
    }else {
      return this.form.get(input)!.valid?"is-valid":"is-invalid";

    }
  }

  validate() {
    let ingredient=new Map<Ingredient,number>()
    for (let item of this.liste){
      ingredient.set(new Ingredient(this.form.get(item+"ID")?.value,"","",0,0) ,this.form.get(item+"Q")?.value as number)
    }

    let newStep=new Step(0,this.form.get("name")?.value,this.form.get("description")?.value,this.form.get("duration")?.value,ingredient);
    if(!(this.updateModal)){
      this.requestS.createStep(newStep).subscribe({
        next: (res) => {
          newStep.id=(res as {ID:number}).ID;
          AlertComponent.alert("Étape "+newStep.name+" créer","success",this.viewcontainer)

          this.newStepEmiter.emit(newStep);
        },
        error: (e) => {
          console.error(e)
          AlertComponent.alert("Erreur pour la création d'étape","danger",this.viewcontainer)
        }

      })

    }else {
      if(this.inputStep?.id!=undefined){
        this.requestS.updateStep(this.inputStep.id,newStep).subscribe({
          next: (res) => {
            newStep.id=(res as {ID:number}).ID;
            AlertComponent.alert("Étape "+newStep.name+" mis à jour","success",this.viewcontainer)
            this.newStepEmiter.emit(newStep);
          },
          error: (e) => {
            console.error(e)
            AlertComponent.alert("Erreur pour la mise à jour de l'étape","danger",this.viewcontainer)
          }

        })
      }else {
        AlertComponent.alert("Erreur pour la mise à jour de l'étape","danger",this.viewcontainer)

      }

    }


  }
  getUnit(id:number):string{
    let res:string="";
    if(this.form.get(id.toString()+"ID")!.value!=null){
      let researchid:number=this.form.get(id.toString()+"ID")!.value
      this.ingredientDonne?.forEach((value) => {
        if (researchid==value.id){
          res=value.unit;
        }
      })
      return res;
    }
    else {
      return "";
    }
  }

}
