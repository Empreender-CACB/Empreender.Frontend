import ApiService from './ApiService';

const ParametrosGeraisService = {

    async index<T>() {
        return ApiService.fetchData<T>({
            url: '/parametros-gerais',
            method: 'get',
        })
    },

    async show<T>(id: number) {
        return ApiService.fetchData<T>({
            url: `/parametros-gerais/${id}`,
            method: 'get',
        })
    },

    async store<T, U extends Record<string, unknown>>(data: U) {
        return ApiService.fetchData<T>({
            url: '/parametros-gerais',
            method: 'post',
            data,
        })
    },

    async  update<T, U extends Record<string, unknown>>(id: string, data: U) {
        return ApiService.fetchData<T>({
            url: `/parametros-gerais/${id}`,
            method: 'put', 
            data,
        })
    },

    async destroy<T>(id: string) {
        return ApiService.fetchData<T>({
            url: `/parametros-gerais/${id}`,
            method: 'delete',
        })
    },

};

export default ParametrosGeraisService;
