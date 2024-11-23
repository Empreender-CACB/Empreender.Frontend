import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DownloadAnexo = () => {
    const { id } = useParams<string>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await ApiService.fetchData({
                    url: `/teste/download/`,
                    method: 'get',
                });
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setError('Erro 404: Recurso não encontrado.');
                } else if (err.response?.status === 401) {
                    setError('Erro 401: Acesso não autorizado.');
                } else {
                    setError('Ocorreu um erro inesperado.');
                }
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            {error && 
                <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>
            }
        </div>
    );
};

export default DownloadAnexo;
