var fs = require("fs");

var path = require("path");
var userName = process.env["USERPROFILE"].split(path.sep)[2];

const arquivo_pincipal = `C:\\Users\\${userName}\\AppData\\Roaming\\Code\\User\\settings.json`;

console.log(
  `Passo 1: Localizar as linhas que mencionam actionButtons no arquivo:`
);
console.log(`${arquivo_pincipal}`);

fs.readFile(arquivo_pincipal, "utf8", function (err, conteudo) {
  if (err) {
    return console.log(`Erro ao ler o arquivo ${arquivo_pincipal} : ${err}`);
  }

  let conteudo_original = JSON.parse(conteudo);
  let conteudo_original_text = JSON.stringify(conteudo_original, null, 2);
  //console.log(conteudo_original_text);

  let conteudo_relevante_original = conteudo_original.actionButtons;
  //console.log(conteudo_relevante_original);
 

  let commands = {
    defaultColor: "#ff0034", 
    loadNpmCommands: false,  
    commands:[
    {
      name: "Especific Buttons",
      color: "aqua", 
      singleInstance: false, 
      useVsCodeApi :false,
      command: "npm run especific-buttons",
    } 
    ,
    {
      name: "$(code)Run Start",
      color: "#00ff00", 
      singleInstance: false, 
      useVsCodeApi :false,
      command: "npm run start",
    },
    {
      name: "$(code)Run Build",
      color: "#ff00ff", 
      singleInstance: false, 
      useVsCodeApi :false,
      command: "ng build",
    },
    {
      name: "$(debug-step-out) Run firebase",
      color: "#ff1f00", 
      singleInstance: false, 
      useVsCodeApi :false,
      command: "firebase deploy",
    }
  ]};

let conteudo_novo=JSON.parse(conteudo_original_text)

 conteudo_novo.actionButtons=commands

 let conteudo_novo_text=JSON.stringify(conteudo_novo, null, 2)
console.log();

  if (conteudo_novo_text.length > 0) {
      fs.writeFile(arquivo_pincipal, conteudo_novo_text, "utf8", function (err) {
        if (err) return console.log(err); 
        console.log(colorir('IMPORTANTE : É necessário ter a extensão para ',"BgYellow")+colorir("VsCode Action Buttons","BgRed")+colorir(' do autor ', 'BgYellow')+colorir("Seun LanLege","BgRed"));
        console.log(colorir('Caso não tenha, instale e tente novamente',"BgYellow"));
        console.log("");
        console.log(colorir('ATENÇÂO : Botões especificos para o ',"BgYellow")+colorir("SITE PESSOAL OLIOTA","BgRed")+colorir(' realizado com sucesso ', 'BgYellow'));
        console.log("Agora clique no icone "+colorir('↻', 'DarkRed')+" localizado na barra inferior do VSCode");
      });
    } else {
      return `Houve um erro ao fazer o replace no ${arquivo_pincipal} , veja o conteudo que seria escrito : ${conteudo_novo_text}`;
    }

 
});



function colorir(text, ...styles) {
  let number = 0;
  let colors = [
    { name: "White", number: "1" },
    { name: "Italic", number: "3" },
    { name: "Underscore", number: "4" },
    { name: "Reverse", number: "7" },
    { name: "Hidden", number: "8" },
    { name: "Dashed", number: "9" },

    { name: "Gray ", number: "30" },
    { name: "Red", number: "31" },
    { name: "Green", number: "32" },
    { name: "Yellow", number: "33" },
    { name: "Purple", number: "34" },
    { name: "Magenta", number: "35" },
    { name: "Cyan", number: "36" },

    { name: "BgRed", number: "41" },
    { name: "BgGreen", number: "42" },
    { name: "BgYellow", number: "43" },
    { name: "BgBlue", number: "44" },
    { name: "BgMagenta", number: "45" },
    { name: "BgCyan", number: "46" },
    { name: "BgWhite", number: "47" },

    { name: "DarkGray ", number: "90" },
    { name: "DarkRed", number: "91" },
    { name: "DarkGreen", number: "92" },
    { name: "DarkYellow", number: "93" },
    { name: "DarkPurple", number: "94" },
    { name: "DarkMagenta", number: "95" },
    { name: "DarkCyan", number: "96" },

    { name: "DarkBgGray", number: "100" },
    { name: "DarkBgRed", number: "101" },
    { name: "DarkBgGreen", number: "102" },
    { name: "DarkBgYellow", number: "103" },
    { name: "DarkBgBlue", number: "104" },
    { name: "DarkBgMagenta", number: "105" },
    { name: "DarkBgCyan", number: "106" },
    { name: "DarkBgWhite", number: "107" },
  ];

  let retorno=text;
  styles.forEach(style => {
    let config = colors.filter(
      (dado) => dado.name == String(style) || dado.number == String(style)
    );
    if (config.length == 0) {
      config.push(colors[0]); 
    }
    retorno=retorno.replace(retorno,`\x1b[${config[0].number}m${retorno}\x1b[0m`)
  });
 

  return retorno; 
}
