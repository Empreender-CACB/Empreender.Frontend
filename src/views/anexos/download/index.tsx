import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorPage from './error';

const DownloadAnexo = () => {
    const { id } = useParams<string>(); // Parâmetro 'id' da URL
    const [error, setError] = useState<string | null>(null);
    const [code, setCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('ID do anexo não foi fornecido.');
                setLoading(false);
                return;
            }

            try {
                // Solicita a assinatura do anexo
                const response = await ApiService.fetchData({
                    url: `/anexo/${id}/sign`,
                    method: 'get',
                });

                const token = response.data?.token;
                if (!token) {
                    throw new Error('Token não foi retornado pela API.');
                }

                await window.open(
                    `${import.meta.env.VITE_API_URL}/anexo/${id}/download?token=${token}`,
                    '_blank'
                );

                window.close();
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setError('Erro 404: Anexo não encontrado.');
                    setCode('404');
                } else if (err.response?.status === 401) {
                    setError('Erro 401: Acesso não autorizado.');
                    setCode('401');
                } else {
                    setError(err.message || 'Ocorreu um erro inesperado.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return (
            <div>
                <ErrorPage errorCode={code || '500'} title={error} />
            </div>
        );
    }

    return <div>Verificando...</div>;
};

export default DownloadAnexo;