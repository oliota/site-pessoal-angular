export class ClassConsole {

    static negrito: string = "font-size: 20px;color: blue;font-weight: bold;"
    static rainbowww: string = 'font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)';

    static orange: string = 'color: tomato;   -webkit-text-stroke: 1px black; font-size:30px;';

    static styleArray: any = [
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


    public static initClass() {
        console.log('%c ', this.styleArray.join(';'));

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

        console.groupCollapsed(' ')


    }


    static exemploLog() {


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

    static exemploAvancado() {
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


        console.groupCollapsed(' ')
    }


    static exemploSuperAvancado() {

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
}