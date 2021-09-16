import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso, Data } from '../cursos';
import { CursosService } from '../cursos.service'

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  
  hoje!: Date;
  cursos!: Array<Curso>;

  constructor(
    private cursoService: CursosService,
    private router: Router
  ) { }
  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    var hoje = new Date();
    let dataFormatada = ((hoje.getDate())) + "/" + ((hoje.getMonth() + 1)) + "/" + hoje.getFullYear();
    console.log(dataFormatada);
    //this.cursos = this.cursoService.getCursos(); 

    this.cursoService.getCursos().forEach(curso => {
      //console.log(curso)

      let json = JSON.stringify(curso)
      let dado = JSON.parse(json);

      let cursos=new Array<Curso>();
      dado.forEach(
        function (item: any) { 
          let datas = new Array<Data>();
          


          item.datas.forEach(
            function (data: any) { 
              console.log(data)
              datas.push(new Data(data.id,data.data)) 
            }
          )
           
          cursos.push(new Curso(item.id,item.nome, datas, item.link))

        }
      );
 
      this.cursos=cursos;

      this.cursos.forEach(curso => {

        let progresso = 0;
        curso.datas.forEach(
          function (param:Data) {
  
            let data=new Date(param.data) 
        //    console.log(hoje +" --- "+ data)
          if (hoje >= data) {
            progresso += 100 / curso.datas.length
            // console.log(
              // ((hoje.getDate())) + "/" + ((hoje.getMonth() + 1)) + "/" + hoje.getFullYear()
              // + " comparando " +
              // ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear()
              // + " acrescentar " + (100 / curso.datas.length) + "%")
          } else {
            // console.log(
            //   ((hoje.getDate())) + "/" + ((hoje.getMonth() + 1)) + "/" + hoje.getFullYear()
            //   + " comparando " +
            //   ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear()
            //   + " não acrescentar")
          }
        });
  
  
        curso.progresso = progresso;
        curso.quantidade = curso.datas.length;
        if (progresso <= 0) {
          curso.situacao = "Não iniciado";
          curso.cor = "danger"
        } else if (progresso < 99) {
          curso.situacao = "Em andamento";
          curso.cor = "warning"
        } else {
          curso.situacao = "Concluído";
          curso.cor = "success"
        }
  
      //  console.log(curso.datas[0] +" até "+curso.datas[curso.datas.length-1])
  
  
      });

      console.log("aqui")
      console.log(this.cursos)
   
 
    });


  }

}
