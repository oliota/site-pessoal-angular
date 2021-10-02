import { Component, NgModule, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Curso } from 'src/app/cursos';
import { CursosService } from 'src/app/cursos.service';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';



@Component({
  selector: 'app-curso-detalhe',
  templateUrl: './curso-detalhe.component.html',
  styleUrls: ['./curso-detalhe.component.css']
})
export class CursoDetalheComponent implements OnInit {

  curso: any;
  id: any;
  detalhe!:Curso;

  constructor(
    private cursoService: CursosService,
    private _Activatedroute: ActivatedRoute,
    private _router:Router
    ) {

     }

  sub!: Subscription;
  ngOnInit() {
    this.sub=this._Activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.curso = params.get('curso')?.toString();
      this.id = params.get('id')?.toString();


      this.cursoService.getCursoDetalhe(this.id).forEach(retorno => {

         let json = JSON.stringify(retorno)
        let dado = JSON.parse(json);
         this.detalhe=new Curso(this.id,dado.nome,dado.datas,dado.link);

         console.log(this.detalhe);
         console.log(this.detalhe.datas);//TODO erro pq os outros cursos velhos nao tem os campos resumos, assuntos
      });

   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  apartirDeHoje(data:Date){
    console.log( new Date().toDateString() +" comparando "+ new Date(data) )
    return new Date(new Date().toDateString()) >=new Date(data)

  }

}


