import ApiService from './ApiService'

export type TableConfigType = {
    skip: number
    limit: number
    filename: string
    exportInfo?: any
    exportExcel: boolean
    groupBy?: any
    sortInfo: string
    filterBy: string
    columns?: any
}

export const apiDataTable = (url: string, config: TableConfigType) => {
    return ApiService.fetchData({
        url: url,
        method: 'get',
        params: { tableConfig: config},
    })
}
