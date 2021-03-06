import { Injectable } from '@angular/core';
import { AtividadeItem, AtividadeParalelaGrupo, Benner, Cargo, Empresa } from './cv';

@Injectable({
  providedIn: 'root'
})
export class CvService {

  cargos_benner: Array<Benner> = [];
  carreira_profisional: Array<Empresa> = [];
  formacao: Array<Empresa> = [];

  constructor() {


  }

  getCargosBenner() {
    this.cargos_benner.push(new Benner(
      "Agosto.2019",
      "fas fa-baby-carriage bg-purple",
      "Programa coruja",
      "fas fa-star",
      "Efetivo",
      "bg-purple")
    );

    this.cargos_benner.push(new Benner(
      "Novembro.2019",
      "fas fa-file-code bg-red",
      "Programador Pleno",
      "fas fa-star",
      "Efetivo",
      "bg-red")
    );

    this.cargos_benner.push(new Benner(
      "Outubro.2020",
      "fas fa-file-code bg-red",
      "Analista Pleno",
      "fas fa-medal",
      "Promoção",
      "bg-red")
    );


    this.cargos_benner.push(new Benner(
      "Abril.2021",
      "fas fa-file-code bg-red",
      "Analista Sênior",
      "fas fa-medal",
      "Promoção",
      "bg-red")
    );

    return this.cargos_benner;
  }
  getCarreiraProfissional() {


    this.carreira_profisional =
      [

        new Empresa(
          "Setembro / 2021", "dev",
          "Consultor de soluções customizadas IV",
          "Capgemini",
          "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/064eff7aab72cb84fbb7f92b82f6ac4a",
          "bg-primary",
          [
            new Cargo(
              "Setembro / 2021",
              "Consultor de soluções customizadas IV",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    "Arquitetando, analisando e desenvolvendo em Java, Javascript, tecnologias Angular com aplicação das melhores práticas de desenvolvimento e testes, incluindo validações de segurança e Sonar",
                    "Nivelando a equipe no conhecimento de backend e frontend.",
                    "Proporcionando melhorias contínuas nos processos internos com as mesmas tecnologias utilizadas para o projeto.",
                    "Fora do horário comercial, trabalho como instrutor multistack.",
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "Abril / 2022",
                  [

                    new AtividadeItem(
                      "Instrutor ENTRA21", "fas fa-graduation-cap",
                      [
                        "Lógica de Programação",
                      ]
                    ),
                    new AtividadeItem(
                      "Instrutor ENTRA21", "fas fa-graduation-cap",
                      [
                        "Metodologias ágeis",
                      ]
                    )
                  ]
                )
                ,
                new AtividadeParalelaGrupo(
                  "Dezembro / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Lógica de programação e algoritmos 2",
                      ]
                    ),
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Lógica de programação e algoritmos 1",
                      ]
                    )
                  ]
                )
                ,
                new AtividadeParalelaGrupo(
                  "Novembro / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "ReactJs (SUPERDEV)",
                      ],

                    ),
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Typescript ",
                      ]
                    )
                  ]
                )
                ,
                new AtividadeParalelaGrupo(
                  "Outubro / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Vue (SUPERDEV)",
                      ]
                    ),
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Fundamentos em Css",
                      ]
                    )
                  ]
                )
                ,

                new AtividadeParalelaGrupo(
                  "Setembro / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Angular (SUPERDEV)",
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
        ,

        new Empresa(
          "Janeiro / 2021", "dev",
          "Instrutor Multi-Stack",
          "Proway - Treinamentos em tecnologia",
          "https://www.proway.com.br/img/proway-logotipo.svg",
          "bg-warning",
          [
            new Cargo(
              "Janeiro / 2021",
              "Instrutor Multi-Stack",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    "Aplicar treinamento em tecnologia com foco em desenvolvimento na prática.",
                    "As aulas tem o objetivo de capacitar o aluno para as espectativas do mercado."
                  ]
                ),

                new AtividadeItem(
                  "Conteúdo adicional", "",
                  [
                    "Desenvolvi uma área no meu site pessoal, para que os alunos tenham acesso prévio ao conteúdo das próximas aulas",
                    "Dessa forma o aluno também pode revisar os assuntos já ministrados em aulas anteriores ou em outros cursos."
                  ]
                )
              ],
              [



                new AtividadeParalelaGrupo(
                  "Dezembro / 2021",
                  [
                    new AtividadeItem(
                      "Lógica de programação e algoritmos 2", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/logica-de-programacao-e-algoritmos-ii",
                      ]
                    ),
                    new AtividadeItem(
                      "Lógica de programação e algoritmos 1", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/logica-de-programacao-e-algoritmos-i",
                      ]
                    )
                  ]
                )
                ,
                new AtividadeParalelaGrupo(
                  "Novembro / 2021",
                  [
                    new AtividadeItem(
                      "Typescript", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/typescript",
                      ]
                    ),
                    new AtividadeItem(
                      "ReactJs (SUPERDEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/trabalhando-em-reactjs",
                      ],

                    )

                  ]
                )
                ,
                new AtividadeParalelaGrupo(
                  "Outubro / 2021",
                  [
                    new AtividadeItem(
                      "Vue (SUPERDEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/trabalhando-com-vuejs",
                      ]
                    ),
                    new AtividadeItem(
                      "Fundamentos em Css", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/fundamentos-em-css",
                      ]
                    )
                  ]
                )
                ,

                new AtividadeParalelaGrupo(
                  "Setembro / 2021",
                  [
                    new AtividadeItem(
                      "Angular (SUPERDEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/angular",
                      ]
                    )
                  ]
                ),

                new AtividadeParalelaGrupo(
                  "Agosto / 2021",
                  [

                    new AtividadeItem(
                      "Typescript (SUPER DEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/typescript",
                      ]
                    )
                    ,

                    new AtividadeItem(
                      "Javascript AVANÇADO (SUPER DEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/javascript-avancado",
                      ]
                    )
                  ]
                ),

                new AtividadeParalelaGrupo(
                  "Julho / 2021",
                  [
                    new AtividadeItem(
                      "Javascript, Jquery e Ajax (SUPER DEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/javascript-jquery-e-ajax",
                      ]
                    )
                  ]
                ),
                new AtividadeParalelaGrupo(
                  "Junho / 2021",
                  [

                    new AtividadeItem(
                      "HTML/CSS Avançado (SUPER DEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/html-css-avancado",
                      ]
                    )
                    ,

                    new AtividadeItem(
                      "Lógica de programação e algoritmos 2", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/logica-de-programacao-e-algoritmos-ii",
                      ]
                    )
                  ]
                ),

                new AtividadeParalelaGrupo(
                  "Maio / 2021",
                  [

                    new AtividadeItem(
                      "Fundamentos em Css (SUPER DEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/fundamentos-em-css",
                      ]
                    )
                    ,
                    new AtividadeItem(
                      "Javascript, Jquery e Ajax", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/javascript-jquery-e-ajax",
                      ]
                    )
                    ,

                    new AtividadeItem(
                      "Lógica de programação e algoritmos 1", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/logica-de-programacao-e-algoritmos-i",
                      ]
                    )
                  ]
                ),


                new AtividadeParalelaGrupo(
                  "Abril / 2021",
                  [
                    new AtividadeItem(
                      "TypeScript", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/typescript",
                      ]
                    )
                    ,

                    new AtividadeItem(
                      "Fundamentos de Html 5 (SUPER DEV)", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/fundamentos-de-html5",
                      ]
                    )
                  ]
                ),


                new AtividadeParalelaGrupo(
                  "Março / 2021",
                  [
                    new AtividadeItem(
                      "Linguagem de programação Java", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/linguagem-de-programacao-em-java",
                      ]
                    )
                  ]
                ),

                new AtividadeParalelaGrupo(
                  "Fevereiro / 2021",
                  [
                    new AtividadeItem(
                      "Java Fundamentos", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/java-fundamentos",
                      ]
                    )
                  ]
                ),

                new AtividadeParalelaGrupo(
                  "Janeiro / 2021",
                  [
                    new AtividadeItem(
                      "Fundamentos em C#", "fas fa-graduation-cap",
                      [
                        "https://www.proway.com.br/curso/fundamentos-c-9-0",
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
        ,
        new Empresa(
          "Agosto / 2019", "dev",
          "Analista de sistemas sênior",
          "Benner sistemas",
          "https://media.glassdoor.com/sql/827281/benner-solution-squarelogo-1572267053127.png",
          "bg-red",
          [
            new Cargo(
              "Abril / 2021",
              "Analista de sistemas - sênior",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    "Além das atividades de desenvolvimento e liderança de uma célula de desenvolvimento",
                  ]
                )
                ,
                new AtividadeItem(
                  "Atuando com projetos em paralelo para customização especifica", "",
                  [
                    "Integrações",
                    "Fechamento contábil",
                    "Parametrizações",
                    "Relatórios contábeis"
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "Agosto / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Typescript (SUPER DEV)",
                      ]
                    ),

                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Javascript AVANÇADO (SUPER DEV)",
                      ]
                    )
                  ]
                ),
                new AtividadeParalelaGrupo(
                  "Julho / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Javascript, Jquery e Ajax (SUPER DEV)",
                      ]
                    )
                  ]
                ),

                new AtividadeParalelaGrupo(
                  "Junho / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "HTML/CSS Avançado (SUPER DEV)",
                      ]
                    ),
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Lógica de programação e algoritmos 2",
                      ]
                    )
                  ]
                )
                ,

                new AtividadeParalelaGrupo(
                  "Maio / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Fundamentos em Css (SUPER DEV)",
                      ]
                    ),
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Javascript, Jquery e Ajax",
                      ]
                    ),
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Lógica de programação e algoritmos 1",
                      ]
                    )
                  ]
                )
                ,

                new AtividadeParalelaGrupo(
                  "Abril / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "TypeScript",
                      ]
                    ),
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Fundamentos de Html 5 (SUPER DEV)",
                      ]
                    )
                  ]
                )
              ]
            ),

            new Cargo(
              "Outubro / 2020",
              "Analista de sistemas - pleno",
              [
                new AtividadeItem(
                  "Além das atividades de desenvolvimento também estou responsável por liderar uma célula de desenvolvimento", "",
                  [
                    "Participação na tomada de decisão e refinamento das soluções antes do desenvolvimento",
                    "Analisar a melhor forma de entregar valor ao cliente com base no escopo",
                    "Apoiar equipe de desenvolvimento",
                    "Manter o desenvolvimento de atividades mais criticas ou complexas",
                    "Delegar atividades",
                    "Capacitar e nivelar a equipe compartilhando conhecimento",
                    "Garantir qualidade das entregas",
                  ]
                )
                ,
                new AtividadeItem(
                  "Atividades extras", "",
                  [
                    "Promover melhorias internas",
                    "Aplicativo Roda Ágil, para uso interno dos colaboradores que permite interatividade remota em um processo onde precisávamos nos reunir",
                    "Assinatura de e-mail com html para detalhar os valores da #atitudeBenner",
                    "Tutoriais de rotinas importantes",
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "Março / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Linguagem de programação Java",
                      ]
                    )
                  ]
                ),
                new AtividadeParalelaGrupo(
                  "Fevereiro / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Java Fundamentos",
                      ]
                    )
                  ]
                ),
                new AtividadeParalelaGrupo(
                  "Janeiro / 2021",
                  [
                    new AtividadeItem(
                      "Instrutor na PROWAY", "fas fa-graduation-cap",
                      [
                        "Fundamentos em C#",
                      ]
                    )
                  ]
                )
              ]
            ),

            new Cargo(
              "Agosto / 2019",
              "Desenvolvedor pleno",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    "Desenvolvendo e customizando nas linguagens C#, Java, Javascript e Pyhton , sistemas da tecnologia Benner nas ferramentas IDE Visual Studio, e ferramentas da tecnologia Benner como:",
                  ]
                )
                ,
                new AtividadeItem(
                  "Builder", "",
                  [
                    "Plataforma que abstrai as entidades gerando script para objetos de banco de dados.",
                  ]
                ),
                new AtividadeItem(
                  "Runner", "",
                  [
                    "Plataforma que abstrai a arquitetura do sistema facilitando o acesso a funções e rotinas do negócio.",
                  ]
                ),
                new AtividadeItem(
                  "WES", "",
                  [
                    "Plataforma que abstrai os funções para desenvolvimento front-end facilitando a manutenção da camada de visão.",
                  ]
                ),
                new AtividadeItem(
                  "AOL", "",
                  [
                    "Plataforma de atualização on line que mantém as versões do sistema no repositório e libera para o cliente baixar as atualizações necessárias em sua totalidade ou atualizações parciais.",
                  ]
                ),
                new AtividadeItem(
                  "Stimulsoft", "",
                  [
                    "Plataforma de criação de relatórios com múltiplas fontes de dados e recursos de apresentações e formatos.",
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "Novembro / 2019",
                  [
                    new AtividadeItem(
                      "Inovação para melhoria interna de processos", "fas fa-mobile-alt",
                      [
                        "Aplicativo - Roda Ágil",
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
        ,
        new Empresa(
          "Abril / 2017", "dev",
          "Analista de sistemas junior",
          "Accenture",
          "https://www.accenture.com/t20190530T062513Z__w__/br-pt/_acnmedia/Accenture/Dev/Redesign/Acc_GT_Dimensional_Purple_RGB_REV.svg",
          "bg-purple",
          [
            new Cargo(
              "Abril / 2017",
              "Analista de sistemas junior",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    "Atuando no setor de faturamento da Oi",
                    "Mantendo atualizações nas bases de dados",
                    "Mantendo e criando programas em C",
                    "Liderança, capacitação da equipe e formação de novos funcionários",
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "Projetos android / web",
                  [
                    new AtividadeItem(
                      "Freelancer", "",
                      [
                        "Desenvolvimento de aplicativos e sites",
                        "Apps de delivery, jogos e ferramentas utilitárias"
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
        ,


        new Empresa(
          "Outubro / 2015", "dev",
          "Desenvolvedor mobile - pleno",
          "Stefanini",
          "data:image/png;base64,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",
          "bg-info",
          [
            new Cargo(
              "Outubro / 2015",
              "Desenvolvedor mobile - pleno",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    "Desenvolvimento Android nativo para o cliente Banco do Brasil Aplicativo de investimento. "
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "Capacitação de novos funcionários",
                  [
                    new AtividadeItem(
                      "Instrutor", "fas fa-graduation-cap ",
                      [
                        "Treinamento de novos funcionários durante o periodo de efetivação",
                      ]
                    ),

                    new AtividadeItem(
                      "Elaborador do desafio -Hackathon", "fas fa-graduation-cap ",
                      [
                        "Projeto a ser desenvolvido para nivelar novos candidatos.",
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
        ,

        new Empresa(
          "Janeiro / 2013", "dev",
          "Desenvolvedor mobile - pleno",
          "Novetech",
          "https://play-lh.googleusercontent.com/ynhuSaLvLoVRNfo3gQfDU5KJK4wi4rRKoM-YxGOTYhIinJ1e0Q2GIK8EFw2IvNjVNiO8=w288-h288-n-rw",
          "bg-red",
          [
            new Cargo(
              "Janeiro / 2013",
              "Desenvolvedor mobile - pleno",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    "Mantendo, desenvolvendo e implantando o sistema web mobile E-sus atende saúde solicitado via licitação em todo Brasil. Sistema de saúde utilizado pelos agentes comunitários de saúde",
                    "Desenvolvendo, customizando e analisando projetos para plataforma android. Design ,navegação, recursos de hardware, gps, conectividade, persistência em BANCO DE DADOS, acesso à web service utilizando as ferramentas Ecplise, Android Studio."
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "Janeiro / 2013",
                  [
                    new AtividadeItem(
                      "Instrutor de desenvolvimento android - PRONATEC", "fas fa-graduation-cap ",
                      [
                        "Capacitação profissional em orientação a objetos e desenvolvimento nativo Android na linguagem Java",
                      ]
                    ),

                    new AtividadeItem(
                      "Instrutor de informática básica para jovens e adultos - SENAC", "fas fa-graduation-cap ",
                      [
                        "Capacitação profissional em orientação a objetos e desenvolvimento nativo Android na linguagem Java",
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
        ,

        new Empresa(
          "Abril / 2012", "dev",
          "Analista de sistemas - junior",
          "Diretoria de tecnologia e cultura - Prefeitura de João Pessoa",
          "https://projeto-cdn.infra.grancursosonline.com.br/thumbnail-carrossel/prefeitura-municipal-de-joao-pessoa-pb.png",
          "bg-dark",
          [
            new Cargo(
              "Abril / 2012",
              "Analista de sistemas - junior",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    `Criando e otimizando rotinas em JAVA para o sistema web S.A.M - Sistema acadêmico municipal que gerencia todas as informações das escolas e creches do município de João Pessoa`
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "7ª a 8ª Periodo da faculdade",
                  [
                    new AtividadeItem(
                      "Estudante", "fas fa-graduation-cap ",
                      [
                        "Monografia para melhoria interna do curso",
                        "Robótica educacional aplicada a disciplina de introdução a programação com linguagem C",
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )
        ,
        new Empresa(
          "Outubro / 2009", "dev",
          "Analista de sistemas sênior",
          "Rava",
          "https://seeklogo.com/images/R/rava-embalagens-logo-3CC0E2EAC7-seeklogo.com.gif",
          "bg-green",
          [
            new Cargo(
              "Outubro / 2009",
              "Desenvolvedor ADVPJ - junior",
              [
                new AtividadeItem(
                  "Atividades", "",
                  [
                    `Mantendo e desenvolvendo rotinas no ERP da TOTVS na linguagem ADVPL `,
                    `Desenvolvendo consultas e relatórios com acesso a base de dados SQL SERVER`
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "4ª a 6ª Periodo da faculdade",
                  [
                    new AtividadeItem(
                      "Monitor de programação", "fas fa-graduation-cap ",
                      [
                        "Introdução a programação",
                        "Java, C, Robocode e Lego mindstorms",
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )



      ];


    return this.carreira_profisional;

  }
  getFormacao() {


    this.formacao =
      [

        new Empresa(
          "2008 até 2013", "dev",
          "Bacharel em sistemas de informação",
          "IESP",
          "https://www.iesp.edu.br/images/logo-iesp.jpg",
          "bg-red",
          [
            new Cargo(
              "2008 até 2013",
              "Bacharel em sistemas de informação",
              [
                new AtividadeItem(
                  "Sobre o curso", "",
                  [
                    "O Bacharel em Sistemas de Informação possui uma formação profissional em análise e programação para o desenvolvimento de softwares aplicativos, sendo capaz de identificar e solucionar os problemas acarretados pelo fluxo constante de informações dentro das organizações.",
                    "Neste curso o aluno será capacitado a administrar redes, gerenciar bancos de dados, criar projetos de software, implementar sistemas web, fazer manutenção em sistemas para qualquer tipo de instituição que necessite de um trabalho com dados e informações, quer sejam da iniciativa privada ou do setor público, dentre outras atribuições.",
                  ]
                )
                ,
                new AtividadeItem(
                  "Mercado de Trabalho", "",
                  [
                    "Mercado de Trabalho Apontado sistematicamente por veículos de comunicação como uma área com postos de trabalhos ociosos, o mercado de trabalho em Tecnologia da Informação oferece uma vasta gama de possibilidades.",
                    "Vale salientar que esses mesmos meios de comunicação também vêm informando que as empresas da área de TI têm crescido e contratado nestes últimos anos. Além disso, Tecnologia da Informação é uma das melhores áreas para se empreender e existem editais de incentivo e financiamento de Startups. Aos concurseiros de plantão, anualmente são lançados editais com diversos cargos com ótimos salários.",
                    "Também é possível trabalhar de forma autônoma como freelancer, captando e atendendo clientes e trabalhar presencialmente ou home office para empresas de qualquer lugar do Brasil ou do mundo, pois a computação não esta limitada as barreira impostas pela distância. Na prática, grande parte dos nossos alunos começa a trabalhar na área antes mesmo de formados."
                  ]
                )
              ],
              [
                new AtividadeParalelaGrupo(
                  "7ª a 8ª Periodo da faculdade",
                  [
                    new AtividadeItem(
                      "Estudante", "fas fa-graduation-cap",
                      [
                        "Monografia para melhoria interna do curso",
                        "Robótica educacional aplicada a disciplina de introdução a programação com linguagem C",
                      ]
                    )
                  ]
                ),
                new AtividadeParalelaGrupo(
                  "4ª a 6ª Periodo da faculdade",
                  [
                    new AtividadeItem(
                      "Monitor de programação", "fas fa-graduation-cap",
                      [
                        "Introdução a programação",
                        "Java, C, Robocode, Lego mindstorms",
                      ]
                    )
                  ]
                )
              ]
            )
          ]
        )


      ];


    return this.formacao;

  }
}
