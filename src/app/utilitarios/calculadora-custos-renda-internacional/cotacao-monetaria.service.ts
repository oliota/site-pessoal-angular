import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CotacaoMonetariaService {

  constructor(private http: HttpClient) { }

  getCotacaoes(): Observable<any> {

    return this.http.get<any>('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');
  }
}
