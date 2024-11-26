import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DownloadAnexo = () => {
    const { id } = useParams<string>();
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1: any = await ApiService.fetchData({
                    url: `/anexos/download-teste/`,
                    method: 'get',
                });

                const code = response1?.code;
                if (!code) {
                    throw new Error('Código não retornado pela API.');
                }

                const response2 = await ApiService.fetchData({
                    url: `/anexos/download/${code}`,
                    method: 'get',
                });

                setData(response2);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setError('Erro 404: Recurso não encontrado.');
                } else if (err.response?.status === 401) {
                    setError('Erro 401: Acesso não autorizado.');
                } else {
                    setError(err.message || 'Ocorreu um erro inesperado.');
                }
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            {loading ? (
                <div>Carregando...</div>
            ) : error && (
                <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>
            )}
        </div>
    );
};

export default DownloadAnexo;
