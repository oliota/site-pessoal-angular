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
  mobile!:boolean;

  constructor(
    private cursoService: CursosService,
    private _Activatedroute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private _router: Router
  ) {

  }

  sub!: Subscription;
  ngOnInit() {
    
    this.mobile=window.screen.width <= 700
    this.sub = this._Activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.curso = params.get('curso')?.toString();
      this.id = params.get('id')?.toString();


      this.cursoService.getCursoDetalhe(this.id).forEach(retorno => {

        let json = JSON.stringify(retorno)
        let dado = JSON.parse(json);
        this.detalhe = new Curso(this.id, dado.nome, dado.datas, dado.link);

        console.log(this.detalhe);
        console.log(this.detalhe.datas);//TODO erro pq os outros cursos velhos nao tem os campos resumos, assuntos
     
        this.detalhe.datas.forEach(aula => {
          aula.resumos.forEach(resumo => {
            if(resumo.paragrafo.includes('iframe')){
              resumo.paragrafo=this.sanitizer.bypassSecurityTrustHtml(resumo.paragrafo) as string
            }
            console.log(resumo.paragrafo)
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

}



