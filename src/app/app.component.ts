import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

import { Benner, Empresa } from './cv';
import { CvService } from './cv.service';
import { CursosService } from './cursos.service';
import { Router } from '@angular/router';
import { ClassConsole } from './easterEggs/ClassConsole';
import { ClassSessionStorage } from './easterEggs/ClassSessionStorage';
import { ClassLocalStorage } from './easterEggs/ClassLocalStorage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'oliota-angular';


  cargos_benner: Array<Benner> = [];
  carreira_profisional: Array<Empresa> = [];
  empresas!: number;
  cursos!: number;
  mensagem!: string;

  constructor(
    private cvService: CvService,
    private cursosService: CursosService,
    private router: Router,
    private el: ElementRef, private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.reloadData();

    return;
    ClassConsole.initClass()
    ClassSessionStorage.initClass()
    ClassLocalStorage.initClass()






  }



  reloadData() {
    this.cargos_benner = this.cvService.getCargosBenner();
    this.carreira_profisional = this.cvService.getCarreiraProfissional();
    this.empresas = this.carreira_profisional.length

    let cursos = this.cursosService.getCursos();
    cursos.forEach(lista => {

      let json = JSON.stringify(lista)
      let dado = JSON.parse(json);
      this.cursos = dado.length;
    });

    this.mensagem = this.mensagens();
  }



  mensagens() {

    var mensagens = []

    mensagens.push("Orgulho não é o oposto da vergonha, mas sua fonte. Somente a verdadeira humildade é o antídoto para a vergonha")
    mensagens.push("Quando nós atingimos nosso ponto mais fraco, estamos suscetíveis à mudança mais profunda")
    mensagens.push("A mente verdadeira é capaz de resistir todas as mentiras e ilusões sem se perder. O coração verdadeiro pode resistir o veneno do ódio sem ser ferido")
    mensagens.push("Está na hora de você olhar para dentro e começar a se fazer as grandes perguntas. Quem é você? E o que você quer?")
    mensagens.push("Instinto é uma mentira, contada por um corpo temeroso, esperando estar errado")
    mensagens.push("Livre-se da corrente terrena. Entre no vazio. Esvazie-se e se torne o vento")
    mensagens.push("Quando você baseia suas expectativas apenas no que consegue ver, você se limita a não enxergar as possibilidades de uma nova realidade")
    mensagens.push("O único lugar onde sucesso vem antes do trabalho é no dicionário")
    mensagens.push("Um sonho é apenas um desejo, até o momento em que você começa a atuar sobre ele, e propõe-se a transformá-lo em uma meta")
    mensagens.push("Coloque seu coração, mente e alma até mesmo nas menores coisas que você fizer. Esse é o segredo para o sucesso")
    mensagens.push("O homem não teria alcançado o possível se, repetidas vezes, não tivesse tentado o impossível")
    mensagens.push("Determinação, coragem e autoconfiança são fatores decisivos para o sucesso. Se estamos possuídos por uma inabalável determinação, conseguiremos superá-los. Independentemente das circunstâncias, devemos ser sempre humildes, recatados e despidos de orgulho")
    mensagens.push("Suba o primeiro degrau com fé. Não é necessário que você veja toda a escada. Apenas dê o primeiro passo")
    mensagens.push("O sucesso é atingido duas vezes: a primeira na mente e a segunda no mundo real")

    let min = Math.ceil(0);
    let max = Math.floor(mensagens.length);
    return mensagens[Math.floor(Math.random() * (max - min)) + min];
  }


}
