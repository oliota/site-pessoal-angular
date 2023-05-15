import { Component, NgModule, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Curso } from 'src/app/cursos';
import { CursosService } from 'src/app/cursos.service';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-curso-detalhe',
  templateUrl: './curso-detalhe.component.html',
  styleUrls: ['./curso-detalhe.component.css']
})
export class CursoDetalheComponent implements OnInit {

  curso: any;
  id: any;
  detalhe!: Curso;
  mobile!: boolean;
  cursoPadrao!: boolean;
  linkAvaliacao!: string;

  constructor(
    private cursoService: CursosService,
    private _Activatedroute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private _router: Router
  ) {

  }

  sub!: Subscription;
  ngOnInit() {

    this.mobile = window.screen.width <= 700

    this.cursoPadrao = !window.location.href.includes('entra21');

    this.linkAvaliacao = this.cursoPadrao ? 'https://www.proway.com.br/' : 'http://externo.proway.com.br/login-aluno';



    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      //console.log(params);
      this.curso = params.get('curso')?.toString();
      this.id = params.get('id')?.toString();


      this.cursoService.getCursoDetalhe(this.id).forEach(retorno => {

        let json = JSON.stringify(retorno)
        let dado = JSON.parse(json);
        this.detalhe = new Curso(this.id, dado.nome, dado.datas, dado.link);

        //console.log(this.detalhe);
        //console.log(this.detalhe.datas);


        this.detalhe.datas.forEach(aula => {
          aula.resumos.forEach(resumo => {
            if (resumo.paragrafo.includes('iframe')) {
              resumo.paragrafo = this.sanitizer.bypassSecurityTrustHtml(resumo.paragrafo) as string
            }
            // console.log(resumo.paragrafo)
          });
        });

      });

    });
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  apartirDeHoje(data: Date) {
    console.log(new Date().toDateString() + " comparando " + new Date(data))
    return new Date(new Date().toDateString()) >= new Date(data)

  }

  scrollTo(anchor: string) {
    (document.getElementById(anchor) as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

  }

  gerarTitle(aula: any) {
    //console.log(aula);
    var dataISODataHora = new Date(aula.data); 

    let title = this.dayOfWeek(dataISODataHora.getUTCDay())+": "+dataISODataHora.toLocaleDateString() +"\n▄ ▄ ▄ ▄ ▄ ▄ ▄ ▄ ▄\n\n";
    title += `Resumos:`;
    aula.resumos.forEach((resumo: { titulo: any; }) => {
      title += `
    ${resumo.titulo}`;
    });
    title += `\n▄ ▄ ▄ ▄ ▄ ▄ ▄ ▄ ▄\n\nAssuntos:`;
    aula.assuntos.forEach((assunto: { titulo: any; }) => {
      title += `
    ${assunto.titulo}`;
    });
    return title;
  }

  dayOfWeek(day:number) {

    switch (day) {
      case 0: 
        return "Domingo";
      case 1:
        return "Segunda-feira";
      case 2:
        return "Terça-feira";
      case 3:
        return "Quarta-feira";
      case 4:
        return "Quinta-feira";
      case 5:
        return "Sexta-feira";
      case 6:
        return "Sábado"; 
 
    } 
    return "";

  }

  isToday(aula:any){
return new Date(aula.data).toISOString().slice(0, 10)==new Date().toISOString().slice(0, 10);  

  }

  equilibrarDezena(i:any){
    return i+1<=9 ?' '+(i+1):i+1
  }

}



