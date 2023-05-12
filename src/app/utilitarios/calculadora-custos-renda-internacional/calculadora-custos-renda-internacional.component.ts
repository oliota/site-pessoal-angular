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

  valorInicial: number = 10000
  rendas: any = {
    real: { disabled: false, value: this.valorInicial },
    euro: { disabled: true, value: this.valorInicial },
    dolar: { disabled: true, value: this.valorInicial },
    conversoes: {
      real: 0,
      euro: 0,
      dolar: 0
    }

  }
  cotacoes!: any
  rendaPrincipal: any = "real"

  itens: any = []
  item:any={}

  oliotaUtils!: OliotaUtils
  constructor(oliota: OliotaUtils,
    private cotacaoService: CotacaoMonetariaService
  ) {
    this.oliotaUtils = oliota
  }

  ngOnInit(): void {

    this.cotacaoService.getCotacaoes().subscribe((data: {}) => {
      this.cotacoes = data;
      ClassConsole.log("getCotacaoes", this.cotacoes)
      console.log("this.rendas.real.value", this.rendas.real.value);

      this.changeRenda(this.rendas.real.value)
    }, (error: {}) => {

    });

  }


  changeRadioRenda(event: any) {
    console.log("changeRadioRenda", event.target.value);
    this.rendaPrincipal = event.target.value

    // let valor: any = {
    //   target: {
    //     value: this.rendas[this.rendaPrincipal]
    //   }
    // }
    this.changeRenda(this.rendas[this.rendaPrincipal].value)
    switch (this.rendaPrincipal) {
      case "real":
        this.rendas.real.disabled = false;
        this.rendas.euro.disabled = true;
        this.rendas.dolar.disabled = true;

        break;
      case "euro":
        this.rendas.real.disabled = true;
        this.rendas.euro.disabled = false;
        this.rendas.dolar.disabled = true;
        break;
      case "dolar":
        this.rendas.real.disabled = true;
        this.rendas.euro.disabled = true;
        this.rendas.dolar.disabled = false;
        break;

      default:
        break;
    }



  }





  changeRenda(event: any) {
    let valor: any = (event.target?.value?.value) ? event.target.value.value : event

    console.log("changeRenda", valor)
    let conversoes = this.converterValor(valor)
    this.rendas.conversoes.real = conversoes.real
    this.rendas.conversoes.euro = conversoes.euro
    this.rendas.conversoes.dolar = conversoes.dolar


  }

  converterValor(valor: any) {
    let retorno: any = {};
    console.log("converterValor", valor);

    valor = Number(valor.toString().replace(".", "").replace(",", "."))

    console.log("converterValor", valor);

    console.log("valor", valor);
    console.log("this.rendaPrincipal", this.rendaPrincipal);

    switch (this.rendaPrincipal) {
      case "real":
        retorno.real = (valor).toFixed(2);
        retorno.euro = (valor / this.cotacoes["EURBRL"]["ask"]).toFixed(2);
        retorno.dolar = (valor / this.cotacoes["USDBRL"]["ask"]).toFixed(2);
        break;
      case "euro":
        retorno.real = (valor * this.cotacoes["EURBRL"]["ask"]).toFixed(2);
        retorno.euro = (valor).toFixed(2);
        retorno.dolar = (retorno.real / this.cotacoes["USDBRL"]["ask"]).toFixed(2);
        break;
      case "dolar":
        retorno.real = (valor * this.cotacoes["USDBRL"]["ask"]).toFixed(2);
        retorno.euro = (retorno.real / this.cotacoes["EURBRL"]["ask"]).toFixed(2);
        retorno.dolar = (valor).toFixed(2);
        break;

      default:
        break;
    }
    console.log("converterValor", retorno)
    return retorno

  }

  adicionar(){


    
    let conversao:any = this.converterValor(this.item.value );

    this.item.real=this.calcularPercentual(this.rendas.real,conversao.real)
    this.item.euro=this.calcularPercentual(this.rendas.euro,conversao.euro)
    this.item.dolar=this.calcularPercentual(this.rendas.dolar,conversao.dolar) 

    this.itens.push(Object.assign({}, this.item) )
    console.log("itens",this.itens);
    
    this.item={}

  }

  calcularPercentual(renda:any,valorConvertido:any){
    console.log("calcularPercentual",renda,valorConvertido)
    renda=Number(renda.value.toString().replace(".","").replace(",","."))
    valorConvertido=Number(valorConvertido.toString().replace(".","").replace(",","."))

    
    if(renda && renda>0){
      let calculo=(valorConvertido/renda)*100
      console.log("calcularPercentual",valorConvertido,"/",renda,"*",100,"=",calculo);
      return {
        conversao:valorConvertido.toFixed(2),
        percentual:calculo.toFixed(2)
      }
    }else{ 
      return null
    }

  }


}
