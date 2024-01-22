import ApiService from './ApiService';
import { Cookie } from '@/@types/Cookies';

export async function apiGetPolitica<T = Cookie>() {
    return ApiService.fetchData<T>({
        url: `/cookies`,
        method: 'get',
    });
}
