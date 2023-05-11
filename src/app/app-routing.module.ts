import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { InicioComponent } from './inicio/inicio.component';
import { CvComponent } from './cv/cv.component';
import { CursosComponent } from './cursos/cursos.component';
import { CursoDetalheComponent } from './crud/curso-detalhe/curso-detalhe.component';
import { DicasComponent } from './dicas/dicas.component';
import { UtilitariosComponent } from './utilitarios/utilitarios.component';
import { CalculadoraCustosRendaInternacionalComponent } from './utilitarios/calculadora-custos-renda-internacional/calculadora-custos-renda-internacional.component';

const routes: Routes = [

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'cv', component: CvComponent },
  { path: 'cursos', component: CursosComponent } ,
  { path: 'curso_detalhe/:curso/:id', component: CursoDetalheComponent },
  { path: 'dicas', component: DicasComponent },
  { path: 'utilitarios', component: UtilitariosComponent },
  { path: 'utilitarios/calculadora_renda_custos_internacional', component: CalculadoraCustosRendaInternacionalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
