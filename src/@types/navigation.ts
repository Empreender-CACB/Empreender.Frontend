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
