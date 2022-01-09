import {Component, Input} from '@angular/core';
import {Recipe} from "../../class/recipe";

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent  {
  @Input()recipe:Recipe|undefined
  @Input()cout_fluide:number=0
  @Input()cout_personnel:number=0
  @Input()costCharge:boolean=false
  @Input()marge:number=0
  @Input()impresionCout:boolean=false

  convertNumber(item:number,decimal:number){

    return Number(item.toFixed(decimal))
  }




}
