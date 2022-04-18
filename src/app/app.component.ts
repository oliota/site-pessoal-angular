import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

import { Benner, Empresa } from './cv';
import { CvService } from './cv.service';
import { CursosService } from './cursos.service';
import { Router } from '@angular/router';


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
  negrito: string = "font-size: 20px;color: blue;font-weight: bold;"
  rainbowww: string = 'font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)';

  orange: string = 'color: tomato;   -webkit-text-stroke: 1px black; font-size:30px;';

  styleArray: any = [
    'background-image:    url("https://yt3.ggpht.com/ytc/AAUvwnh8uSXNsEBqViI4hmRIRGfdVngmV4Tc1r-sM4xqKQ=s176-c-k-c0x00ffffff-no-rj")',
    'background-size: cover',
    'color: #fff',
    'padding: 80px 100px',
    'line-height: 35px',
    'width : 80px',
    'height : 180px',
    'border : 1px solid black',
    'border-radius:8px'
  ];

  constructor(
    private cvService: CvService,
    private cursosService: CursosService,
    private router: Router,
    private el: ElementRef, private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.reloadData();

    // console.log('%c Bem vindo ao meu site!', rainbowww); 
    // console.debug('%c Bem vindo ao meu site!', rainbowww);
    // console.error('%c Bem vindo ao meu site!', rainbowww); 


    console.log('%c ', this.styleArray.join(';'));


    // const month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    //   "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


    // console.assert(new Date(new Date().getFullYear() + '/04/08') < new Date(),
    //   {
    //     dia: 8,
    //     mes: month[3],
    //     aviso: "Nesse ano ainda não fiz aniversário",
    //     importante: "Esteja pronto para essa data especial",
    //     idade: (new Date().getFullYear() - 1989)
    //   }
    // );
    // console.assert(new Date(new Date().getFullYear() + '/04/08') > new Date(),
    //   {
    //     dia: 8,
    //     mes: month[3],
    //     aviso: "Nesse ano já fiz aniversário",
    //     importante: "Esteja pronto para essa data especial"
    //   }
    // );

    console.groupCollapsed('%c<----- Clique aqui , para aprender mais sobre o log do console', this.orange)


    console.group();

    console.log("%cVeja os tipos de log e é bem possível que algum desses vc não conhecia 😋", this.orange);
    let dados = [
      { tipo: 'clear', explicacao: "Apaga todo o log" },
      { tipo: 'log', explicacao: "Mais utilizado para exibir informações no console do navegador" },
      { tipo: 'warn', explicacao: "Gera uma coloração amarela e um icone de aviso ❗ para destacar a informação" },
      { tipo: 'error', explicacao: "Gera uma coloração vermelha e um icone de erro ⛔ para destacar a informação" },
      { tipo: 'info', explicacao: "Só aparece se o nivel de log INFORMAÇÕES estiver configurado no navegador" },
      { tipo: 'debug', explicacao: "Só aparece se o nivel de log DETALHADO estiver configurado no navegador" },
      { tipo: 'count', explicacao: "Faz a contagem desse mesmo identificador de log" },
      { tipo: 'table', explicacao: "Exibe em formato de linhas e colunas" },
      { tipo: 'time / timeEnd ', explicacao: "Conta o tempo de execução " },
      { tipo: 'group', explicacao: "Agrupa logs e mantém os itens do grupo visiveis e permite ocultar ao clicar no cabeçalho " },
      { tipo: 'groupCollapsed', explicacao: "Agrupa logs e mantém os itens do grupo ocultos e permite visualizar ao clicar no cabeçalho " },
      { tipo: 'custom css', explicacao: "O céu é o limite, exercite sua criatividade e crie logs incriveis" },
    ]

    console.table(dados)




    console.groupCollapsed('%c<----- Clique aqui , para ver os exemplos', this.orange)
    //console.log("%cExemplos ", this.orange);


    console.group();
    console.log('%cconsole.clear();  não vou executar, pois apagaria esse tutorial', this.orange);
    console.groupEnd();

    console.group();
    this.exemploLog();
    console.groupEnd();

    console.group();
    console.warn('%cconsole.warn();', this.orange);
    console.warn("Faz tudo que o console.log() faz , porém tem um destaque amarelo e um icone especial");
    console.groupEnd();

    console.group();
    console.error('%cconsole.error();', this.orange);
    console.error("Faz tudo que o console.log() faz , porém tem um destaque vermelho e um icone especial");
    console.groupEnd();

    console.group();
    console.log('%cconsole.info();', this.orange);
    console.log("Faz tudo que o console.log() faz , porém exige que o nivel de log no navegador esteja habilitado e geralmente já está habilitado");
    console.log("Habilite o nivel de log caso não tenha uma mensagem de exemplo abaixo")
    console.info("EXEMPLO: SE VC ESTA LENDO ISSO É PORQUE O NIVEL DE LOG INFO ESTÁ HABILITADO")
    console.groupEnd();

    console.group();
    console.log('%cconsole.debug();', this.orange);
    console.log("Faz tudo que o console.log() faz , porém exige que o nivel de log no navegador esteja habilitado e geralmente não está habilitado");
    console.log("Habilite o nivel de log caso não tenha uma mensagem de exemplo abaixo")
    console.debug("EXEMPLO: SE VC ESTA LENDO ISSO É PORQUE O NIVEL DE LOG DEBUG ESTÁ HABILITADO")
    console.groupEnd();

    console.group();
    console.log('%cconsole.count();', this.orange);
    console.log("Faz a contagem de quantas vezes esse mesmo log executou, é muito util dentro de um laço de repetição");
    console.log(`console.count()`)
    console.count()


    console.log("%cFaz a contagem de quantas vezes aquela chave foi utilizada de forma individual", this.negrito);
    console.log(`%cconsole.count('teste')`, this.negrito)
    console.count('teste')
    console.log("");

    console.log(`%cconsole.count('outro')`, this.negrito)
    console.count('outro')
    console.log("");

    console.log(`%cconsole.count('teste')`, this.negrito)
    console.count('teste')
    console.log("");
    console.groupEnd();

    console.groupCollapsed('%c<----- Clique aqui , para aprender assuntos mais avançados sobre console', this.orange)

    this.exemploAvancado()


    console.groupEnd();





    console.groupEnd()



    // console.groupCollapsed('Saiba mais um pouco sobre mim ')
    // console.groupCollapsed('Pessoal')
    // console.log('Meu nome é Rubem Duarte Oliota')
    // console.log('Tenho ' + (new Date().getFullYear() - 1989) + ' anos');
    // console.log('Sou Casado ♥');
    // console.log('Esporte favorito : Basket🏀');
    // console.groupEnd()
    // console.groupCollapsed('Profissional')
    // console.log('Programador');
    // console.log('Analista');
    // console.log('Arquiteto');
    // console.log('Instrutor');
    // console.log('Artesão');
    // console.log('Inventor'); 
    // console.groupEnd()
    // console.groupEnd()

    console.groupCollapsed(' ')




  }


  exemploLog() {


    console.log('%cconsole.log();', this.orange);
    console.log('%cconsole.log();', this.negrito);
    console.log("");
    console.log("");

    console.log('%cconsole.log(1);', this.negrito);
    console.log(1);
    console.log("");

    console.log('%cconsole.log("usando aspas para textos");', this.negrito);
    console.log("usando aspas para textos");
    console.log("");

    console.log('%cconsole.log("concatenando"+" tem que controlar os espaços manualmente "+" senão fica"+"tudo"+"junto");', this.negrito);
    console.log("concatenando" + " tem que controlar os espaços manualmente " + " senão fica" + "tudo" + "junto");
    console.log("");

    console.log('%cconsole.log("texto","mais textos");', this.negrito);
    console.log("texto", "mais textos");
    console.log("");


    console.log('%cconsole.log("parametrizar %s frases com variaveis",variavel);', this.negrito);
    let qualquer: string = "QUALQUER";
    console.log("parametrizar %s frases com variaveis", qualquer);
    console.log("");
    console.log("\%c para classes CSS");
    console.log("\%s para strings");
    console.log("\%d ou %i para numeros");
    console.log("\%f para decimais");
    console.log("\%o para objetos");
    console.log("\%j para json");
    console.log("");



    console.log("%cconsole.log('usando \\\' plica ou aspas simples ');", this.negrito);
    console.log('usando \' plica ou aspas simples ');
    console.log("");

    console.log(`%cconsole.log(\`usando \\\` crase para texto 
      com 
      multiplas
       linhas \`);`, this.negrito);

    console.log(`usando \` crase para texto 
      com 
      multiplas
       linhas `);
    console.log("");

    console.log("%cconsole.log(`usando \\\` crase com chaves é possivel injetar ${variavel} sem interromper o texto `);", this.negrito);
    let variavel = "VALOR DE VARIAVEL"
    console.log(`usando \` crase com chaves é possivel injetar ${variavel} sem interromper o texto `);
    console.log("");


  }

  exemploAvancado() {
    console.group();
    console.log('%cconsole.table(variavelArray);', this.orange);
    console.log("Exibe um objeto de lista em formato de tabela com linha e colunas");

    console.log(`console.table([
      "lista",
      "bem",
      "simples"
    ]);`);
    console.table([
      "lista",
      "bem",
      "simples"
    ])
    console.log("");

    console.log(`console.table([
      {campoA:'valor texto', campoB:10},
      {campoA:'valor texto2', campoB:30},
      {campoA:'valor texto3', campoB:20},
    ]);`);
    console.table([
      { campoA: 'valor texto', campoB: 10 },
      { campoA: 'valor texto2', campoB: 30 },
      { campoA: 'valor texto3', campoB: 20 },
    ])
    console.log("");

    console.groupEnd();

    console.group();
    console.log('%cconsole.time("identificador");', this.orange);
    console.time("identificador");
    console.log("Inicia a contagem do tempo para esse identificador");
    console.log('console.timeEnd("identificador");');
    console.timeEnd("identificador");
    console.log("");
    console.groupEnd();


    console.group();
    console.log('%cconsole.group();', this.orange);
    console.log("Agrupa os logs e permite mais niveis internos de log");
    console.log("Por padrão os itens internos estão visiveis");

    console.log(`console.group();
    console.log("esse log esta agrupado");
    console.log("esse também");
    console.groupEnd();

    `);

    console.group();
    console.log("esse log esta agrupado");
    console.log("esse também");
    console.groupEnd();
    console.log("");

    console.log(`console.group();
    console.log("esse log esta agrupado no primeiro nivel");
    console.log("esse também");
    console.group();
    console.log("esse log esta agrupado no segundo nivel");
    console.log("esse também");
    console.groupEnd(); 
    console.log(""); 
    console.groupEnd(); 
    console.log(""); `);


    console.group();
    console.log("esse log esta agrupado no primeiro nivel");
    console.log("esse também");
    console.group();
    console.log("esse log esta agrupado no segundo nivel");
    console.log("esse também");
    console.groupEnd();
    console.log("");
    console.groupEnd();
    console.log("");


    console.groupEnd();


    console.group();
    console.log('%cconsole.groupCollapsed("titulo do group");', this.orange);
    console.log("Agrupa os logs e permite mais niveis internos de log");
    console.log("Por padrão os itens internos estão ocultos");

    console.log(`console.groupCollapsed("Para ver os itens agrupados, clique aqui");
    console.log("esse log esta agrupado");
    console.log("esse também");
    console.groupEnd();

    `);

    console.groupCollapsed("Para ver os itens agrupados, clique aqui");
    console.log("esse log esta agrupado");
    console.log("esse também");
    console.groupEnd();
    console.log("");

    console.log(`console.groupCollapsed("Para ver os itens agrupados, clique aqui");
    console.log("esse log esta agrupado no primeiro nivel");
    console.log("esse também");
    console.groupCollapsed("Para ver os itens agrupados no segundo nivel, clique aqui");
    console.log("esse log esta agrupado no segundo nivel");
    console.log("esse também");
    console.groupEnd(); 
    console.log(""); 
    console.groupEnd(); 
    console.log("");

     `);

    console.log("");

    console.groupCollapsed("Para ver os itens agrupados no primeiro nivel, clique aqui");
    console.log("esse log esta agrupado no primeiro nivel");
    console.log("esse também");
    console.groupCollapsed("Para ver os itens agrupados no segundo nivel, clique aqui");
    console.log("esse log esta agrupado no segundo nivel");
    console.log("esse também");
    console.groupEnd();
    console.log("");
    console.groupEnd();
    console.log("");


    console.groupEnd();


    console.groupCollapsed('%c<----- Clique aqui , para aprender assuntos AINDA MAIS AVANÇADOS sobre console😱', this.orange)

    this.exemploSuperAvancado()


    console.groupEnd();

    console.groupEnd();
  }
  exemploSuperAvancado() {

    console.group();
    console.log('%c log com CSS;', this.orange);

    console.log("%cEXIBINDO UMA MENSAGEM CUSTOMIZADA COM CSS", 'font-size:32px;color:purple;');
    console.log("console.log('%c LOG COM CSS','font-size:32px;color:purple;')")
    console.log("");
    let classe = `color:red;
    background-color:black;`
    console.log(`let classe = \`color:red;
    background-color:black;\`;
    console.log('%c LOG COM CSS',classe)`)
    console.log('%c LOG COM CSS', classe)
    console.log("");

    let estilo = [
      'background-image:    url("https://yt3.ggpht.com/ytc/AAUvwnh8uSXNsEBqViI4hmRIRGfdVngmV4Tc1r-sM4xqKQ=s176-c-k-c0x00ffffff-no-rj")',
      'background-size: cover',
      'color: #fff',
      'padding: 80px 100px',
      'line-height: 35px',
      'width : 80px',
      'height : 180px',
      'border : 1px solid black',
      'border-radius:8px'
    ];
    console.log(`let estilo = [
      'background-image:    url("https://yt3.ggpht.com/ytc/AAUvwnh8uSXNsEBqViI4hmRIRGfdVngmV4Tc1r-sM4xqKQ=s176-c-k-c0x00ffffff-no-rj")',
      'background-size: cover',
      'color: #fff',
      'padding: 80px 100px',
      'line-height: 35px',
      'width : 80px',
      'height : 180px',
      'border : 1px solid black',
      'border-radius:8px'
    ];

    console.log('%c ', estilo.join(';'));
    `);

    console.log('%c ', this.styleArray.join(';'));
    console.log("");
    console.groupEnd();


    console.group();
    console.log('%c Testar condições;', this.orange);

    let condicoes = `const month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


  console.assert(new Date(new Date().getFullYear() + '/04/08') < new Date(),
    {
      dia: 8,
      mes: month[3],
      aviso: "Nesse ano ainda não fiz aniversário",
      importante: "Esteja pronto para essa data especial",
      idade: (new Date().getFullYear() - 1989)
    }
  );
  console.assert(new Date(new Date().getFullYear() + '/04/08') > new Date(),
    {
      dia: 8,
      mes: month[3],
      aviso: "Nesse ano já fiz aniversário",
      importante: "Esteja pronto para essa data especial"
    }
  );`
    const month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];


    console.log(condicoes);


    console.assert(new Date(new Date().getFullYear() + '/04/08') < new Date(),
      {
        dia: 8,
        mes: month[3],
        aviso: "Nesse ano ainda não fiz aniversário",
        importante: "Esteja pronto para essa data especial",
        idade: (new Date().getFullYear() - 1989)
      }
    );
    console.assert(new Date(new Date().getFullYear() + '/04/08') > new Date(),
      {
        dia: 8,
        mes: month[3],
        aviso: "Nesse ano já fiz aniversário",
        importante: "Esteja pronto para essa data especial"
      }
    );


    console.log("");
    console.groupEnd();


    console.log("");
    console.log("");
    console.log("");
    console.log("");



    console.log('%c Parabéns, vc aprendeu CONSOLE lendo o console, que legal !!!', this.rainbowww);

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
