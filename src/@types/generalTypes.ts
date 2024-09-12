export type Segmento = {
    idsegmento: number
    dssegmento: string
    ativo: boolean
}

export type Cidade = {
    idcidade: number
    nmcidade: string
    idceplocal: number
    iduf: string
    idicms: null | number
    idregiao: null | number
    idtse: null | number
    ibge: null | number
    estrangeira: boolean
}

export type Associacao = {
    idassociacao: number
    idfederacao: number
    nmrazao: string
    nucnpj: string
    dtfundacao: null | string
    idcidade: number
    nucep: number
    nunumero: string
    dscomplemento: string
    nufone: string
    nufax: string
    nufone2: string
    dsemail: string
    dshomepage: string
    flativo: string
    flvalidado: string
    dsendereco: string
    dsbairro: string
    idbanco: null | number
    dsagencia: null | string
    dsconta: null | string
    dtultimaatualizacao: string
    dtatualizacao: string
    idgestorassociacao: null | string
    gestor: Gestor | null
    id_tipo_entidade: number
    id_antigo: null | number
    sigla: string
    sigla_unica: null | string
    logoentidade: null | string
    usuario_inclusao: string
    usuario_alteracao: string
    data_inclusao: null | string
    data_alteracao: string
    dsestado: null | string
    idpais: number
    nmrassociados: null | number
    cidade: Cidade
    situacao: string
}

export type Nucleo = {
    idnucleo: number
    idassociacao: number
    idsegmento: number
    nmnucleo: string
    flestudoviabilidade: string
    flativo: string
    dtultimaalteracao: string
    flvalidado: string
    txcriacaojustificativa: string
    txestudoviabilidade: null | string
    txoutrasinformacoes: null | string
    dtatualizacao: null | string
    dshomepage: null | string
    idgestornucleo: null | string
    faceb: boolean
    segmento: Segmento
    associacao: Associacao
    gestor: Gestor | null
    dtcriacao: string
}

export type ContaCorrente = {
    id: number
    idbanco: string
    dsagencia: string
    dsconta: string
    data_inclusao: string
    usuario_inclusao: string
    data_atualizacao: string
    usuario_alteracao: string
    conta_tipo: string | null
    pix_tipo: string | null
    pix_chave: string | null
    apelido: string | null
}

export type Empresa = {
    idempresa: number
    idsetor: string
    idramoativ: string
    cdformalinformal: string
    nucnpjcpf: string
    nurazaosocial: string
    nmfantasia: string
    idcidade: number
    idcep: number
    nunumero: string
    nucomplemento: null | string
    nufone: string
    nufax: null | string
    dsemail: string
    dtinicioatividade: string
    flfiliadoace: string
    nufuncionario: number
    flativo: string
    dtultimaalteracao: string
    flvalidade: string
    dsendereco: string
    dsbairro: string
    dtatualizacao: null | string
    idgestorempresa: null | number
    id_conta_corrente: null | number
    faceb: boolean
    cpfusuario: null | string
    restrita: boolean
    escolhida: boolean
    duplicada: boolean
    excluir: boolean
    ramoAtividade: {
        idramoativ: string
        nmramoativ: string
    }
    gestorEmpresa: Gestor | null
    cidadeEmpresa: Cidade
    contaCorrente: ContaCorrente | null
}

export type Gestor = {
    nucpf: string
    nmusuario: string
    nmlogin: string
    dsemail: string
    dtultimaalteracao: string
    cod_perfil: number
}
