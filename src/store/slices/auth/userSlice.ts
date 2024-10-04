import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { Associacao, Empresa, Nucleo } from '@/@types/generalTypes'

type Preferencias = {
    data_lancamentos?: string
    lista_lancamentos?: string
    pre_filtro_lancamentos?: string
    lista_geral?: string
    num_noticias?: string
}

export type UserState = {
    nucpf?: string
    nmusuario?: string
    dsemail?: string
    cdsexo?: string
    perfil?: string
    cod_perfil?: number
    idobjeto?: number
    fotouser?: string
    recursos: string[]
    preferencias?: Preferencias
    associacoes: Associacao[]
    empresas: Empresa[]
    nucleos: Nucleo[]
    projetos: any[]
}

const initialState: UserState = {
    nucpf: '',
    nmusuario: '',
    dsemail: '',
    perfil: '',
    cdsexo: '',
    cod_perfil: 0,
    idobjeto: 0,
    fotouser: '',
    recursos: [],
    associacoes: [],
    preferencias: {},
    empresas: [],
    nucleos: [],
    projetos: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.nucpf = action.payload?.nucpf
            state.nmusuario = action.payload?.nmusuario
            state.cdsexo = action.payload?.cdsexo
            state.dsemail = action.payload?.dsemail
            state.perfil = action.payload?.perfil
            state.fotouser = action.payload?.fotouser
            state.cod_perfil = action.payload?.cod_perfil
            state.idobjeto = action.payload?.idobjeto
            state.recursos = action.payload?.recursos
            state.preferencias = action.payload?.preferencias
            state.associacoes = action.payload?.associacoes
            state.empresas = action.payload?.empresas
            state.nucleos = action.payload?.nucleos
            state.projetos = action.payload?.projetos
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
