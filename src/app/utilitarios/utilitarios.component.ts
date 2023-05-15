import { Component, OnInit } from '@angular/core';
import { OliotaUtils } from '../utils';
import { Utilidade } from './utilidades';

@Component({
  selector: 'app-utilitarios',
  templateUrl: './utilitarios.component.html',
  styleUrls: ['./utilitarios.component.css']
})
export class UtilitariosComponent implements OnInit {

  utilidades: Array<Utilidade> = new Array<Utilidade>()
  oliotaUtils!: OliotaUtils
  constructor(oliota: OliotaUtils) {
    this.oliotaUtils = oliota
  }

  ngOnInit(): void {
    this.utilidades.push(new Utilidade(
      "Calculadora de custos percentual a renda internacional",
      "/utilitarios/calculadora_renda_custos_internacional",
      `Calcular quanto uma despesa representa em percentual a sua renda
-Converte o valor em outras moedas com base na cotação atual
-Calcula o valor da despesa convertido para todas as moedas e informa o percentual nas outras rendas

Converter moeda extrangeira para a moeda \local e decidir se esta caro ou barato, não é a melhor forma.
A forma ideal é saber quanto essa despesa representa em sua renda total.`))
  }

}
