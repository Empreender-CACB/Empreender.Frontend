import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

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
    fotouser?: string
    recursos: string[]
    associacoes?: any[]
    preferencias?: Preferencias
}

const initialState: UserState = {
    nucpf: '',
    nmusuario: '',
    dsemail: '',
    perfil: '',
    cdsexo: '',
    cod_perfil: 0,
    fotouser: '',
    recursos: [],
    associacoes: [],
    preferencias: {},
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
            state.recursos = action.payload?.recursos
            state.preferencias = action.payload?.preferencias
            state.associacoes = action.payload?.associacoes
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
