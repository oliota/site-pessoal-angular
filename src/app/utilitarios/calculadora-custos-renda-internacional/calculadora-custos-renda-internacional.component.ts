import { Component, OnInit } from '@angular/core';
import { OliotaUtils } from 'src/app/utils';


@Component({
  selector: 'app-calculadora-custos-renda-internacional',
  templateUrl: './calculadora-custos-renda-internacional.component.html',
  styleUrls: ['./calculadora-custos-renda-internacional.component.css']
})
export class CalculadoraCustosRendaInternacionalComponent implements OnInit {

  oliotaUtils!:OliotaUtils
  constructor(oliota:OliotaUtils) { 
  this.oliotaUtils=oliota
  }

  ngOnInit(): void {
  }

}
