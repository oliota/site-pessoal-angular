import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Curso } from './cursos';

@Injectable({
  providedIn: 'root'
})
export class CursosService {


  hoje!: Date;
  cursos!: Array<Curso>;

  private baseUrl = "https://oliota.herokuapp.com";
  //private baseUrl = "http://127.0.0.1:4000";

  constructor(private http: HttpClient) { }

  getCursos() {
    this.cursos = new Array<Curso>();
    this.hoje = new Date();
    let dataFormatada = ((this.hoje.getDate())) + "/" + ((this.hoje.getMonth() + 1)) + "/" + this.hoje.getFullYear();
    //console.log(dataFormatada);

    this.cursos = new Array<Curso>(); 

    return this.http.get<Curso>(`${this.baseUrl}/cursos/all`);
 
 
  }

  getCursoDetalhe(id: string) {


    return this.http.get(`${this.baseUrl}/curso-detalhe/${id}`);


  }


  date(data: string) {
    var date_components = data.split("/");
    var day = date_components[0];
    var month = date_components[1];
    var year = date_components[2];
    return new Date(`${month}/${day}/${year}`);
  }

}


