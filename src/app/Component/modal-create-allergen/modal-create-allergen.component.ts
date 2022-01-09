import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewContainerRef} from '@angular/core';
import {Category} from "../../class/category";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Allergen} from "../../class/allergen";
import {AllergenService} from "../../Service/allergen.service";
import {AlertComponent} from "../alert/alert.component";

@Component({
  selector: 'app-modal-create-allergen',
  templateUrl: './modal-create-allergen.component.html',
  styleUrls: ['./modal-create-allergen.component.css']
})
export class ModalCreateAllergenComponent implements OnChanges {
  @Input() category: Array<Category>;
  @Input() updateModal = false
  @Input() inputAllergen:Allergen|undefined;
  @Output() newAllergen: EventEmitter<Allergen>
  form: FormGroup;
  fb: FormBuilder;

  constructor(private requestA: AllergenService, public viewContainerRef: ViewContainerRef) {
    this.category = requestA.getCategory();
    this.fb = new FormBuilder()
    this.newAllergen = new EventEmitter<Allergen>();
    this.form = this.fb.group({
      name: [""],
      id: [""]
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.form.get("name")?.setValue(this.inputAllergen?.name)
    this.form.get("id")?.setValue(this.inputAllergen?.id_category)
  }




  validate(){
    var allergen=new Allergen(0,this.form.get("name")?.value,this.form.get("id")?.value);
    if(!this.updateModal){
      this.requestA.createAllergen(allergen).subscribe({
        next: (res) => {
          allergen.id=(res as {ID:number}).ID;
          AlertComponent.alert("Allergène "+allergen.name+" créer","success",this.viewContainerRef);
          this.newAllergen.emit(allergen);
          this.reInitializeForm()
        },
        error: (e) => {
          console.error(e)
          AlertComponent.alert("Erreur pour la création d'allergène","danger",this.viewContainerRef);

        }
      })
    }else {
      this.requestA.updateAllergen(this.inputAllergen!.id,allergen).subscribe({
        error: (e) => {
          console.error(e)
          AlertComponent.alert("Erreur pour la création d'allergène","danger",this.viewContainerRef);

        },
        complete:()=>{
          allergen.id=this.inputAllergen!.id
          AlertComponent.alert("Allergène "+allergen.name+" créer","success",this.viewContainerRef);
          this.newAllergen.emit(allergen);
          this.reInitializeForm()

        }
      })
    }

  }
  reInitializeForm(){
    this.form.get("name")?.setValue("")
    this.form.get("id")?.setValue("")

  }

}
