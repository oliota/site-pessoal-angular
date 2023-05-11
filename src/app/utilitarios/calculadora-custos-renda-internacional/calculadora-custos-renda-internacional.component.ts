import { Component, OnInit } from '@angular/core';
import { OliotaUtils } from 'src/app/utils';
import { CotacaoMonetariaService } from './cotacao-monetaria.service';
import { ClassConsole } from 'src/app/easterEggs/ClassConsole';


@Component({
  selector: 'app-calculadora-custos-renda-internacional',
  templateUrl: './calculadora-custos-renda-internacional.component.html',
  styleUrls: ['./calculadora-custos-renda-internacional.component.css']
})
export class CalculadoraCustosRendaInternacionalComponent implements OnInit {

  rendas: any = { 
    conversoes:{}
  }

  oliotaUtils!: OliotaUtils
  constructor(oliota: OliotaUtils,
    private cotacaoService:CotacaoMonetariaService
    ) {
    this.oliotaUtils = oliota
  }

  ngOnInit(): void {

     this.cotacaoService.getCotacaoes( ).subscribe((data: {}) => {
      const response: any = data;
       ClassConsole.log("getCotacaoes",response)
    }, (error: {}) => {
      
    }); 

  }

  changeRenda(target:any){
console.log("changeRenda",target.value)

  }
   

}
