import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { UtilitariosComponent } from './utilitarios/utilitarios.component';
import { CalculadoraCustosRendaInternacionalComponent } from './utilitarios/calculadora-custos-renda-internacional/calculadora-custos-renda-internacional.component';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    decimal: ",",
    precision: 2,
    prefix: "R$ ",
    suffix: "",
    thousands: "."
};
 registerLocaleData(localePt, 'pt');


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CvComponent,
    CursosComponent,
    CursoDetalheComponent,
    DicasComponent,
    UtilitariosComponent,
    CalculadoraCustosRendaInternacionalComponent
   // Nl2BrPipeModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt'
  },{ provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
