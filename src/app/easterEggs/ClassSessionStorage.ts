export class ClassSessionStorage{

   
  

    public static  initClass(){
      sessionStorage.clear();

      sessionStorage.setItem("===============INICIO==============================","OLIOTA.COM");
      sessionStorage.setItem("Curioso sobre oque é armazenado no meu sessionStorage?","Então aproveite que as informações armazenadas aqui são para explicar como utilizar o sessionStorage");
      sessionStorage.setItem("O que é o sessionStorage e para que serve?","É um espaço reservado apenas no seu navegador para armazenar informações relevantes a área logada");
      sessionStorage.setItem("O que está salvo nessa sessão interfere em outras sessões?","Sim , mas para que isso não aconteça, certifique-se de limpar a sessão na tela de login , em eventos de logout e ciclos de vida que configurem que a sessão acabou");
      sessionStorage.setItem("Qual o comando para limpar a sessão?","sessionStorage.clear()");
      sessionStorage.setItem("Como salvar informações na sessão?","sessionStorage.setItem('nome_da_chave','valor_a_ser_armazenado')");
      sessionStorage.setItem("Como obter informações salvas na sessão?","sessionStorage.getItem('nome_da_chave')");
      sessionStorage.setItem("Posso salvar qualquer informação aqui?",`Sim, mas apenas no formato de string`); 
      sessionStorage.setItem("sintaxe_salvando_string",`sessionStorage.setItem('string_salva','estou salva na sessão e sou uma string') `); 
      sessionStorage.setItem('string_salva','estou salva na sessão e sou uma string')

      sessionStorage.setItem("sintaxe_salvando_number",`sessionStorage.setItem('number_salvo','33') `); 
      sessionStorage.setItem('number_salvo','"33"')
       

      sessionStorage.setItem("sintaxe_salvando_boolean",`sessionStorage.setItem('boolean_salvo','true') `); 
      sessionStorage.setItem('boolean_salvo','"true"')

      sessionStorage.setItem("Teria outra forma de salvar qualquer tipo de informação e manter o tipo original?",`Sim, porém temos que respeitar a forma que o sessionStorage sava as informações.`); 
      sessionStorage.setItem("A sintaxe para isso exige 2 etapas:",``); 
      sessionStorage.setItem("1º - Salvar normalmente a variavel como string",`sessionStorage.setItem('salvando_number_como_texto',33) `); 
      sessionStorage.setItem('salvando_number_como_texto',JSON.stringify(33));
      sessionStorage.setItem("2º - utilizar o Number(variavel) para converter o texto em number",`Number(sessionStorage.getItem('salvando_number_como_texto')) `); 
      sessionStorage.setItem("Number(sessionStorage.getItem('salvando_number_como_texto'))",'33')
      
 
      sessionStorage.setItem("Essas 2 etapas funcionam para todos os tipos primitivos como: ",`string,number,boolean`); 
      sessionStorage.setItem("Porém para objetos as 2 etapas são executadas de uma forma diferente",``); 
      sessionStorage.setItem("1º - utilizar o JSON.stringify(objeto) para converter o objeto em string",`sessionStorage.setItem('salvando_objeto_como_texto',JSON.stringify({nome:'rubem',idade:33})) `); 
      sessionStorage.setItem('salvando_objeto_como_texto',JSON.stringify({nome:'rubem',idade:33}))
      sessionStorage.setItem("2º - utilizar o JSON.parse(objeto_recuperado_da_session) para converter a string em objeto",`JSON.parse(sessionStorage.getItem('salvando_objeto_como_texto')) `); 
      sessionStorage.setItem("JSON.parse(sessionStorage.getItem('salvando_objeto_como_texto'))","{nome:'rubem',idade:33}")
      
      sessionStorage.setItem("===============FIM==============================","OLIOTA.COM");
      
  
       
  }
}