# Projeto web para o apresentação Devs2Blu
 
 

## Objetivo

> Projeto web (Colabore)
>
> - O projeto tem o objetivo de criar uma rede colaborativa que auxilie na doação de dinheiro ou materiais para instituições que precisem de ajuda.
>
> - Cada usuário poderá realizar sua doação e dessa forma ser informado quando sua doação for destinada a uma instiruição.
>
> - As instituições poderão se cadastrar para receber as doações e sempre que uma doação for resgatada por uma instituição o doador será avisado qual instituição foi ajudada com sua doação.
>
> - A aplicação poderá ser utilizada por doadores e instituições: 

## Tecnologia

- A aplicação foi desenvolvida com HTML, CSS e JavaScript. 
- IDE - Visual Studio Code (FRONTEND)
- Armazenamento - Postgres
  - Os dados serão salvos em banco de dados
- Backend - Eclipse para o API desenvolvida em java 

## Equipe - SEM-NOME-AINDA

Definir o papel de cada membro de acordo com o conhecimento individual

Número| Membro| Discord | Organização
------|---------|-------|------
01| André Felipe Schwanz|   André Felipe Schwanz#2261|   ---
02| Eliane Henrique Oliota| Eliane Oliota#5537| ---
03| Luan Lordello Guimarães Lima|   Luan Lordello#1751|  ---
04| Maria Eduarda Krutzsch| mariazinha#8145|  ---
05| Paula Adriana da Costa| paula_costa#2011|   --- 


## Funcionalidades

### Login

>Capturar email e senha para autenticar a entrada
>
>Guardar dados do usuário logado em sessão
>
>Alertar caso dê erro ao entrar
>
>[Ver detalhes técnicos]()

### Registrar

>Capturar nome, email, tipo de usuario e senha para autenticar o cadastro
>
>Guardar dados do usuário logado em sessão
>
>Alertar caso encontre outro usuário com mesmo e-mail
>
>[Ver detalhes técnicos]()

### Sair

>Retornar ao login
>
>Remover dados do usuário da sessão

### Página Principal

>Tela inicial agrega as principais funções e resumo de informações importantes como:
>
>- Menu superior(dependendo do perfil - Instituição ou doador):
>   - <b>Instituição</b>
>     - Cadastrar despesas que serão convertidas em captura de doação
>       - Adicionar
>       - Editar
>       - Deletar
>       - Listar 
>     - <b>Doador</b>
>       - Cadastrar doações
>         - Adicionar
>         - Editar
>         - Deletar
>         - Listar 
>      - Ver lista de instituições
>        - Detalhes
>        - Entrar em contato com a instituição
>        - Fazer uma doação direta
>      - Ver as doações resgatadas pelas instituições
>   - Tratamento
>   - Isolamento
>   - Botão de sair
>
>- Conteúdo principal:
>   - Saudação ao usuário logado
>   - tabela com o cadastro das principais informações
>     - <b>Instituição</b>
>       - Tabela de despesas 
>       - Tabela de doações disponiveis para resgatar  
>     - <b>Doador</b>
>       - Tabela de doações 
>       - Tabela de doações resgatadas   
>   - Proteção contra acesso sem login
>
> [Ver detalhes técnicos](/doc/Modulo_prevencao/doc_tela_principal.md)

### A tela inicial terá um comportamento diferente dependendo do usuário logado
> [Ver detalhes técnicos](/doc/Modulo_isolamento/documentacao_locais.md)