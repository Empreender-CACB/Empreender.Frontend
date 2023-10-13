export interface NavigationTree {
    key: string
    path: string
    title: string
    translateKey?: string
    icon: string
    type: 'title' | 'collapse' | 'item'
    authority: string[]
    subMenu: NavigationTree[]
}

export interface Documento {
    nome: string
    id: number
    temNovidade: boolean
}

export interface GrupoDocumento {
    grupo: string
    temNovidade: boolean
    subMenu: Documento[]
}

export interface UserResponse {
    token: { token: string }
    user: {
        nucpf: string
        nmusuario: string
        dsemail: string
        perfil: string
        cod_perfil: string
        fotouser: string
        recursos: any
        preferencias: any
    }
}
