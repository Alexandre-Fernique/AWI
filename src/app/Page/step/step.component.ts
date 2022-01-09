import {AfterViewInit, Component, ViewContainerRef} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Step} from "../../class/step";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {StepService} from "../../Service/step.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AlertComponent} from "../../Component/alert/alert.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../Component/confirm-dialog/confirm-dialog.component";
import {Ingredient} from "../../class/ingredient";
import {IngredientService} from "../../Service/ingredient.service";



@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StepComponent implements AfterViewInit {
  dataSource: MatTableDataSource<Step> = new MatTableDataSource<Step>();
  columnsToDisplay = [{label: 'Id', field: 'id'}, {label: 'Nom', field: 'name'}, {label: 'Durée', field: 'duration'}];
  columnsHeader = ['id', 'name', 'duration'];
  expandedElement: Step | null | undefined;
  finish: boolean=false;
  data:Step[]=[]
  steptoUpdate:Step|undefined;
  listeIngredient:Array<Ingredient>;


  constructor(private request: StepService,private requestIngre:IngredientService, public view:ViewContainerRef,public dialogRef:MatDialog) {
    this.data=request.getAllStep()
    this.listeIngredient =requestIngre.getAllIngredient()
  }

  buildtable(){
    this.dataSource.data=this.data

 }
  newIngredient(event:Ingredient){
    this.listeIngredient.push(event)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  updateStep(item:Step){
    this.steptoUpdate=item
  }
  updateEmitter(){
    this.data=this.request.getAllStep();
    setTimeout(()=> {
      this.buildtable()
    }, 100)
  }
  deleteStep(event:Step){

    let dialog=this.dialogRef.open(ConfirmDialogComponent,{
      width:'25%',
      data:"Voulez-vous supprimer "+event.name+"?",
    })
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.request.deleteStep(event).subscribe({
            error: (err: HttpErrorResponse) => {
              if (err.status == 405) {
                AlertComponent.alert("Erreur étape présent dans d'autre recette", "danger",this.view)
              } else {
                AlertComponent.alert("Erreur au niveau du back", "danger",this.view)
                console.log(err)
              }

            },
            complete: () => {
              this.data.splice(this.data.indexOf(event), 1)
              this.dataSource.data=this.data;
              AlertComponent.alert("L'étape " + event.name + " a bien été supprimé", "success",this.view);

            }

          }
        )
      }
    })


  }

  ngAfterViewInit(): void {
    setTimeout(()=> {
      this.buildtable()
    }, 100)

  }
  getTime(time:number):string{
    if(time>=60){
      return Math.floor(time/60)+"h"+time%60+"m"
    }else {
      return time+"m"
    }
  }


}

