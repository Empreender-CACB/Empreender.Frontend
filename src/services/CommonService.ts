import ApiService from './ApiService'

export async function apiGetNotificationCount() {
    return ApiService.fetchData<{
        count: number
    }>({
        url: '/notifications/count',
        method: 'get',
    })
}

export async function apiGetNotificationList() {
    return ApiService.fetchData<
        {
            id: number
            nucpf: string
            titulo: string
            mensagem: string
            lida: boolean
            data_criacao: string
            entidade: string
            id_entidade: string

        }[]
    >({
        url: '/notifications',
        method: 'get',
    })
}

export async function apiGetSearchResult<T>(data: { query: string }) {
    return ApiService.fetchData<T>({
        url: '/search/query',
        method: 'post',
        data,
    })
}
