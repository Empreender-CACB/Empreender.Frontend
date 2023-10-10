import { GrupoDocumento, NavigationTree } from "@/@types/navigation";
import ApiService from "./ApiService";

export const apiGetNavigationConfig = () => {
    return ApiService.fetchData<NavigationTree[]>({
        url: '/navigation',
        method: 'get',
    });
};

export const apiGetDocumentos = () => {
    return ApiService.fetchData<GrupoDocumento[]>({
        url: '/documentos',
        method: 'get',
    })
}