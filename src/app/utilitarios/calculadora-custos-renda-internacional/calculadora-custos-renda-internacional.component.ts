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


  chave_itens: any = "listaItens";
  chave_rendas: any = "valoresRendas";
  chave_renda_principal: any = "rendaPrincipal";
  chave_cotacao: any = "cotacaoAtual";
  valorInicial: number = 0
  simbolo:any="R$"
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
  item: any = {}

  oliotaUtils!: OliotaUtils
  constructor(oliota: OliotaUtils,
    private cotacaoService: CotacaoMonetariaService
  ) {
    this.oliotaUtils = oliota
  }

  ngOnInit(): void {


    this.cotacaoService.getCotacaoes().subscribe((data: {}) => {
      this.cotacoes = data;
      console.log("cotação obtida online", this.cotacoes)

      localStorage.setItem(this.chave_cotacao, JSON.stringify(this.cotacoes));
      

    }, (error: {}) => {


      this.cotacoes = JSON.parse(localStorage.getItem(this.chave_cotacao) + "");
      console.warn("erro em obter cotação online, obtedo a ultima cotação salva", this.cotacoes);

    }, () => {
      console.log("Apos obter as cotações, deve recuperar o localStorage",this.cotacoes);

      this.recuperarLocalStorage()
       
      this.changeRenda(this.rendas.real.value)

    });

  }


  recuperarLocalStorage() {

    this.itens = JSON.parse(localStorage.getItem(this.chave_itens) + "");
    if (!this.itens) {
      this.itens = [];
      localStorage.setItem(this.chave_itens, JSON.stringify(this.itens));
    }
    console.log("itens recuperados", this.itens);

    this.rendas = JSON.parse(localStorage.getItem(this.chave_rendas) + "");
    if (!this.rendas) {
      this.rendas = {
        real: { disabled: false, value: this.valorInicial },
        euro: { disabled: true, value: this.valorInicial },
        dolar: { disabled: true, value: this.valorInicial },
        conversoes: {
          real: 0,
          euro: 0,
          dolar: 0
        }
      }

      localStorage.setItem(this.chave_rendas, JSON.stringify(this.rendas));
    } 
    
    this.rendas.real.disabled = false;
    this.rendas.euro.disabled = true;
    this.rendas.dolar.disabled = true;
    console.log("rendas recuperadas",JSON.parse(JSON.stringify(this.rendas)) );

    // this.rendaPrincipal = JSON.parse(localStorage.getItem(this.chave_renda_principal) + "");
    
    // console.log("renda principal localStorage", this.rendaPrincipal);
    // if (!this.rendaPrincipal) {
    //   this.rendaPrincipal = "real";
    //   localStorage.setItem(this.chave_renda_principal, JSON.stringify(this.rendaPrincipal));
    // }
    // console.log("renda principal recuperada", this.rendaPrincipal);

    // this.changeRadioRenda(this.rendaPrincipal)


  }


  changeRadioRenda(event: any) {
    this.rendaPrincipal = (event.target?.value)?(event.target?.value):event
    console.log("changeRadioRenda", this.rendaPrincipal);

    localStorage.setItem(this.chave_renda_principal, JSON.stringify(this.rendaPrincipal));
    // let valor: any = {
    //   target: {
    //     value: this.rendas[this.rendaPrincipal]
    //   }
    // }
    this.changeRenda(this.rendas[this.rendaPrincipal].value)
    switch (this.rendaPrincipal) {
      case "real":
        this.simbolo="R$"
        this.rendas.real.disabled = false;
        this.rendas.euro.disabled = true;
        this.rendas.dolar.disabled = true;

        break;
      case "euro":
        
      this.simbolo="€"
        this.rendas.real.disabled = true;
        this.rendas.euro.disabled = false;
        this.rendas.dolar.disabled = true;
        break;
      case "dolar":
        this.simbolo="US$"
        this.rendas.real.disabled = true;
        this.rendas.euro.disabled = true;
        this.rendas.dolar.disabled = false;
        break;

      default:
        break;
    }

    localStorage.setItem(this.chave_rendas, JSON.stringify(this.rendas));


  }





  changeRenda(event: any) {
    let valor: any = (event.target?.value?.value) ? event.target.value.value : event

    console.log("changeRenda", valor)
    let conversoes = this.converterValor(valor)
    this.rendas.conversoes.real = conversoes.real
    this.rendas.conversoes.euro = conversoes.euro
    this.rendas.conversoes.dolar = conversoes.dolar


    localStorage.setItem(this.chave_rendas, JSON.stringify(this.rendas));
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

  adicionar() {



    let conversao: any = this.converterValor(this.item.value);

    this.item.real = this.calcularPercentual(this.rendas.real, conversao.real)
    this.item.euro = this.calcularPercentual(this.rendas.euro, conversao.euro)
    this.item.dolar = this.calcularPercentual(this.rendas.dolar, conversao.dolar)

    this.itens.push(Object.assign({}, this.item))
    console.log("itens", this.itens);

    this.item = {
      value: 0
    }

    
    localStorage.setItem(this.chave_itens, JSON.stringify(this.itens));

  }

  calcularPercentual(renda: any, valorConvertido: any) {
    console.log("calcularPercentual", renda, valorConvertido)
    renda = Number(renda.value)
    valorConvertido = Number(valorConvertido)


    if (renda && renda > 0) {
      let calculo = (valorConvertido / renda) * 100
      console.log("calcularPercentual", valorConvertido, "/", renda, "*", 100, "=", calculo);
      return {
        conversao: valorConvertido.toFixed(2),
        percentual: calculo.toFixed(2)
      }
    } else {
      return {
        conversao: 0,
        percentual: 0
      }
    }

  }


}
