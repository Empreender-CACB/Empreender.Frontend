import ApiService from "./ApiService";

export const apiGetImages = () => {
    return ApiService.fetchData({
        url: '/carousel/images',
        method: 'get',
    });
};

export const apiGetVideos = () => {
    return ApiService.fetchData({
        url: '/carousel/videos',
        method: 'get',
    });
};
