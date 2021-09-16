export class Curso{
    nome:string;
    datas:Array<Data>;
    link:string;
    progresso!: number;
    quantidade!: number;
    situacao!:string;
    cor!:string;
    id!:string;

    constructor( 
    id:string,
    nome:string,
    datas:Array<Data>,
    link:string
    ){
        this.id=id;
        this.nome=nome;
        this.datas=datas;
        this.link=link;

    }
}

export class Data{
    data: Date; 
    id!:string;
    resumos!:Array<Assunto>;
    assuntos!:Array<Assunto>;

    constructor( 
    id:string,
    data:Date,
    ){
        this.id=id;
        this.data=data;

    }
}


export class Assunto{ 
    titulo!:string;
    paragrafo!:string;

    constructor( 
        titulo:string,
        paragrafo:string
    ){
        this.titulo=titulo;
        this.paragrafo=paragrafo;

    }
}
 