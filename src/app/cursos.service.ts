import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Curso } from './cursos';

@Injectable({
  providedIn: 'root'
})
export class CursosService {


  hoje!: Date;
  cursos!: Array<Curso>;

  //private baseUrl = "https://oliota.herokuapp.com";
   private baseUrl = "http://127.0.0.1:4000";

  constructor(private http: HttpClient) { }

  getCursos() {

    this.hoje = new Date();
    let dataFormatada = ((this.hoje.getDate())) + "/" + ((this.hoje.getMonth() + 1)) + "/" + this.hoje.getFullYear();
    console.log(dataFormatada);

    this.cursos = new Array<Curso>();

    return this.http.get<Curso>(`${this.baseUrl}/cursos`);
  


    

    // this.cursos = [ 
    //   new Curso("Angular - SUPERDEV",
    //     [
    //       this.date('28/09/2021'),
    //       this.date('30/09/2021'),
    //       this.date('05/10/2021'),
    //       this.date('07/10/2021'),
    //       this.date('14/10/2021')
    //     ],
    //     "angular-superdev"
    //   ),
    //   new Curso("Typescript - SUPERDEV",
    //     [
    //       this.date('17/08/2021'),
    //       this.date('19/08/2021'),
    //       this.date('24/08/2021'),
    //       this.date('26/08/2021'),
    //       this.date('31/08/2021')
    //     ],
    //     "typescript-superdev"
    //   ),
    //   new Curso("Javascript avançado - SUPERDEV",
    //     [
    //       this.date('29/07/2021'),
    //       this.date('03/08/2021'),
    //       this.date('05/08/2021'),
    //       this.date('10/08/2021'),
    //       this.date('12/08/2021')
    //     ],
    //     "javascript-avancado-superdev"
    //   ),
    //   new Curso("Javascript, Jquery e Ajax - SUPERDEV",
    //     [
    //       this.date('13/07/2021'),
    //       this.date('15/07/2021'),
    //       this.date('20/07/2021'),
    //       this.date('22/07/2021'),
    //       this.date('27/07/2021')
    //     ],
    //     "javascript-jquery-ajax-superdev"
    //   ),
    //   new Curso("Html e Css avançado - SUPERDEV",
    //     [
    //       this.date('24/06/2021'),
    //       this.date('29/06/2021'),
    //       this.date('01/07/2021'),
    //       this.date('06/07/2021'),
    //       this.date('08/07/2021')
    //     ],
    //     "html-css-avancado-superdev"
    //   ),
    //   new Curso("Lógica de programação e algoritmos 2",
    //     [
    //       this.date('13/05/2021'),
    //       this.date('20/05/2021'),
    //       this.date('27/06/2021'),
    //       this.date('04/07/2021'),
    //       this.date('11/07/2021'),
    //       this.date('18/07/2021')
    //     ],
    //     "logica-algoritmos-2"
    //   ),
    //   new Curso("Lógica de programação e algoritmos 1",
    //     [
    //       this.date('16/05/2021'),
    //       this.date('23/05/2021'),
    //       this.date('30/05/2021'),
    //       this.date('06/06/2021')
    //     ],
    //     "logica-algoritmos-1"
    //   ),
    //   new Curso("Javascript, Jquery e Ajax",
    //     [
    //       this.date('15/05/2021'),
    //       this.date('22/05/2021'),
    //       this.date('29/05/2021'),
    //       this.date('05/06/2021')
    //     ],
    //     "javascript-jquery-ajax"
    //   ),
    //   new Curso("Fundamentos em Css - SUPERDEV",
    //     [
    //       this.date('13/05/2021'),
    //       this.date('18/05/2021'),
    //       this.date('20/05/2021'),
    //       this.date('25/05/2021'),
    //       this.date('27/05/2021')
    //     ],
    //     "fundamentos-css-superdev"
    //   ),
    //   new Curso("Fundamentos de Html 5 - SUPERDEV",
    //     [
    //       this.date('27/04/2021'),
    //       this.date('29/04/2021'),
    //       this.date('04/05/2021'),
    //       this.date('06/05/2021'),
    //       this.date('11/05/2021')
    //     ],
    //     "fundamentos-html-5-superdev"
    //   ),
    //   new Curso("TypeScript",
    //     [
    //       this.date('17/04/2021'),
    //       this.date('24/04/2021'),
    //       this.date('01/05/2021'),
    //       this.date('08/05/2021')
    //     ],
    //     "typescript"
    //   ),
    //   new Curso("Linguagem de programação Java",
    //     [
    //       this.date('19/03/2021'),
    //       this.date('22/03/2021'),
    //       this.date('24/03/2021'),
    //       this.date('26/03/2021'),
    //       this.date('29/03/2021'),
    //       this.date('31/03/2021'),
    //       this.date('02/04/2021'),
    //       this.date('05/04/2021'),
    //       this.date('07/04/2021'),
    //       this.date('09/04/2021'),
    //       this.date('12/04/2021'),
    //       this.date('14/04/2021'),
    //       this.date('16/04/2021'),
    //       this.date('19/04/2021'),
    //       this.date('21/04/2021'),
    //       this.date('23/04/2021'),
    //       this.date('26/04/2021')
    //     ],
    //     "linguagem-java"
    //   ),
    //   new Curso("Java Fundamentos",
    //     [
    //       this.date('24/02/2021'),
    //       this.date('26/02/2021'),
    //       this.date('01/03/2021'),
    //       this.date('03/03/2021'),
    //       this.date('05/03/2021'),
    //       this.date('08/03/2021'),
    //       this.date('10/03/2021'),
    //       this.date('12/03/2021'),
    //       this.date('15/03/2021'),
    //       this.date('17/03/2021')
    //     ],
    //     "java-fundamentos"
    //   ),
    //   new Curso("C# Fundamentos",
    //     [
    //       this.date('24/01/2021'),
    //       this.date('31/01/2021'),
    //       this.date('07/02/2021'),
    //       this.date('14/02/2021'),
    //       this.date('21/02/2021'),
    //       this.date('28/02/2021')
    //     ],
    //     "cs-fundamentos"
    //   ),
    // ];

  
  }

  getCursoDetalhe(id:string) {
  

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
  

