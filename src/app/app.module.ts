import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
//import {Nl2BrPipeModule} from 'nl2br-pipe';

import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { CvComponent } from './cv/cv.component';
import { CursosComponent } from './cursos/cursos.component';
import { CursoDetalheComponent } from './crud/curso-detalhe/curso-detalhe.component';


import {LOCALE_ID} from '@angular/core';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DicasComponent } from './dicas/dicas.component';
registerLocaleData(localePt, 'pt');


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CvComponent,
    CursosComponent,
    CursoDetalheComponent,
    DicasComponent,
   // Nl2BrPipeModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt'
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
