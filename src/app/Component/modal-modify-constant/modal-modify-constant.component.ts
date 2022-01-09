import {Component, EventEmitter, Output, ViewContainerRef} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ConstantCostService} from "../../Service/constant-cost.service";
import {AlertComponent} from "../alert/alert.component";

@Component({
  selector: 'app-modal-modify-constant',
  templateUrl: './modal-modify-constant.component.html',
  styleUrls: ['./modal-modify-constant.component.css']
})
export class ModalModifyConstantComponent {
  @Output() newData: EventEmitter<{COUT_PERSONNEL:number,COUT_FLUIDE:number}>=new EventEmitter<{COUT_PERSONNEL: number; COUT_FLUIDE: number}>()
  fb=new FormBuilder();
  form=this.fb.group({
    coutPersonnel:["",[Validators.required]],
    coutFluide:["",[Validators.required]],
    coutAssaisonement:["",[Validators.required]],
    typeAssaisonement:["",[Validators.required]],
    marge:["",[Validators.required]]
  })

  constructor(private request:ConstantCostService,public viewcontain:ViewContainerRef) {
    request.getCost().subscribe({
      next:(data)=>{
        this.form.get("coutPersonnel")?.setValue(data.COUT_PERSONNEL);
        this.form.get("coutFluide")?.setValue(data.COUT_FLUIDE);
        this.form.get("coutAssaisonement")?.setValue(data.COUT_ASSAISONNEMENT);
        this.form.get("typeAssaisonement")?.setValue(data.ISPERCENT.valueOf());
        this.form.get("marge")?.setValue(data.MARGE);
      }
    }
    )

  }
  getValidform(input:string){
      return this.form.get(input)!.valid?"is-valid":"is-invalid";
  }

  validate(){

    this.request.setCost(this.form.get("coutFluide")?.value,this.form.get("coutPersonnel")?.value,this.form.get("coutAssaisonement")?.value,this.form.get("typeAssaisonement")?.value,this.form.get("marge")?.value).subscribe(
      {
        error:(e)=>{
          console.log(e);
          AlertComponent.alert("Erreur","danger",this.viewcontain);

        },complete:()=>{
          this.newData.emit({COUT_PERSONNEL: this.form.get("coutPersonnel")?.value, COUT_FLUIDE: this.form.get("coutFluide")?.value})
          AlertComponent.alert("Changement effectué","success",this.viewcontain);
        }
      }
    )


  }
}
