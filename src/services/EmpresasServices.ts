import { Segmento } from "@/@types/generalTypes";
import ApiService from "./ApiService";


export const apiGetSegmentos = () => {
    return ApiService.fetchData<Segmento[]>({
        url: '/segmentos',
        method: 'get',
    });
};