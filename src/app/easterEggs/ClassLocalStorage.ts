export class ClassLocalStorage{

   
  

    public static  initClass(){ 

      localStorage.setItem("===============INICIO==============================","OLIOTA.COM");
     
      localStorage.setItem("Curioso sobre oque é armazenado no meu localStorage?","Então aproveite que as informações armazenadas aqui são para explicar como utilizar o localStorage");
      localStorage.setItem("O que é o localStorage e para que serve?","É um espaço reservado apenas no seu navegador para armazenar informações, que mesmo após fechar o navegador e retornar a página as informações continuarão aqui até que alguma ação as remova");
      localStorage.setItem("O que está salvo nessa armazenamento interfere em informações?","Sim , cada informação é armazenada em uma chave e se essa mesma chave for utilizada o valor sera atualizado, onde é possivel perder informação.");
      localStorage.setItem("Qual o comando para limpar o localStorage?","localStorage.clear()");
      localStorage.setItem("Como salvar informações no localStorage?","localStorage.setItem('nome_da_chave','valor_a_ser_armazenado')");
      localStorage.setItem("Como obter informações salvas no localStorage?","localStorage.getItem('nome_da_chave')");
      
      localStorage.setItem("Posso salvar qualquer informação aqui?",`Sim, mas apenas no formato de string`); 
      localStorage.setItem("sintaxe_salvando_string",`localStorage.setItem('string_salva','estou salva na sessão e sou uma string') `); 
      localStorage.setItem('string_salva','estou salva na sessão e sou uma string')

      localStorage.setItem("sintaxe_salvando_number",`localStorage.setItem('number_salvo','33') `); 
      localStorage.setItem('number_salvo','"33"')
       

      localStorage.setItem("sintaxe_salvando_boolean",`localStorage.setItem('boolean_salvo','true') `); 
      localStorage.setItem('boolean_salvo','"true"')

      localStorage.setItem("Teria outra forma de salvar qualquer tipo de informação e manter o tipo original?",`Sim, porém temos que respeitar a forma que o localStorage sava as informações.`); 
      localStorage.setItem("A sintaxe para isso exige 2 etapas:",``); 
      localStorage.setItem("1º - Salvar normalmente a variavel como string",`localStorage.setItem('salvando_number_como_texto',33) `); 
      localStorage.setItem('salvando_number_como_texto',JSON.stringify(33));
      localStorage.setItem("2º - utilizar o Number(variavel) para converter o texto em number",`Number(localStorage.getItem('salvando_number_como_texto')) `); 
      localStorage.setItem("Number(localStorage.getItem('salvando_number_como_texto'))",'33')
      
 
      localStorage.setItem("Essas 2 etapas funcionam para todos os tipos primitivos como: ",`string,number,boolean`); 
      localStorage.setItem("Porém para objetos as 2 etapas são executadas de uma forma diferente",``); 
      localStorage.setItem("1º - utilizar o JSON.stringify(objeto) para converter o objeto em string",`localStorage.setItem('salvando_objeto_como_texto',JSON.stringify({nome:'rubem',idade:33})) `); 
      localStorage.setItem('salvando_objeto_como_texto',JSON.stringify({nome:'rubem',idade:33}))
      localStorage.setItem("2º - utilizar o JSON.parse(objeto_recuperado_da_session) para converter a string em objeto",`JSON.parse(localStorage.getItem('salvando_objeto_como_texto')) `); 
      localStorage.setItem("JSON.parse(localStorage.getItem('salvando_objeto_como_texto'))","{nome:'rubem',idade:33}")
      
      localStorage.setItem("===============FIM==============================","OLIOTA.COM");
       
  }
}