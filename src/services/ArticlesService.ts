import ApiService from './ApiService';

const ArticleService = {
    async listArticles<T>() {
        return ApiService.fetchData<T>({
            url: '/articles',
            method: 'get',
        });
    },

    async fetchArticle<T>(articleId: number) {
        return ApiService.fetchData<T>({
            url: `/articles/${articleId}`,
            method: 'get',
        });
    },

    async updateArticle<T>(articleId: number, articleData: any) {
        return ApiService.fetchData<T>({
            url: `/articles/${articleId}`,
            method: 'put',
            data: articleData,
        });
    },

    async deleteArticle<T>(articleId: number) {
        return ApiService.fetchData<T>({
            url: `/articles/${articleId}`,
            method: 'delete',
        });
    },
};

export default ArticleService;
