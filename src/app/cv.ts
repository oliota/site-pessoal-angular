export class Benner {
    data!: string;
    icone!: string;
    cargoNome!: string;
    detalheIcone!: string;
    detalhe!: string;
    cor!: string;

    constructor(
        data: string,
        icone: string,
        cargoNome: string,
        detalheIcone: string,
        detalhe: string,
        cor: string,
    ) {
        this.data = data;
        this.icone = icone;
        this.cargoNome = cargoNome;
        this.detalheIcone = detalheIcone;
        this.detalhe = detalhe;
        this.cor = cor;
    }

}

export class Empresa {
    data: string;
    icone: string;
    ultimoCargo: string;
    nome: string;
    logo: string;
    cor:string;
    cargos!: Array<Cargo>;

    constructor(
        data: string,
        icone: string,
        ultimoCargo: string,
        nome: string,
        logo: string,
        cor:string,
        cargos: Array<Cargo>
    ) {
        this.data = data;
        this.icone = icone;
        this.ultimoCargo = ultimoCargo;
        this.nome = nome;
        this.logo = logo;
        this.cor = cor;
        this.cargos = cargos;
    }

}

export class Cargo {
    data: string;
    nome: string;
    atividades!: Array<AtividadeItem>;
    atividadesParalelas!: Array<AtividadeParalelaGrupo>;
    constructor(
        data: string,
        nome: string,
        atividades: Array<AtividadeItem>, 
        atividadesParalelas: Array<AtividadeParalelaGrupo>
    ) {
        this.data = data;
        this.nome = nome;
        this.atividades = atividades;
        this.atividadesParalelas = atividadesParalelas;
    }

}


export class AtividadeParalelaGrupo {
    data: string;
    atividades: Array<AtividadeItem>;
    constructor(
        data: string,
        atividades: Array<AtividadeItem>
    ) {
        this.data = data;
        this.atividades = atividades;
    }

}


export class AtividadeItem {
    nome: string;
    icone: string;
    detalhes: Array<string>;
    constructor(
        nome: string,
        icone: string,
        detalhes: Array<string>
    ) {
        this.nome = nome;
        this.icone = icone;
        this.detalhes = detalhes;
    }

}