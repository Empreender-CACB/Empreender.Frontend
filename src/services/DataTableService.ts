import ApiService from './ApiService'

export type TableConfigType = {
    skip: number
    limit: number
    filename: string
    exportExcel: boolean
    groupBy?: any
    sortInfo: string
    filterBy: string
}

export const apiDataTable = (url: string, config: TableConfigType) => {
    return ApiService.fetchData({
        url: url,
        method: 'get',
        params: { tableConfig: config },
    })
}
