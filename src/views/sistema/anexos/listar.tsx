import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import AnexosComponent from '../anexos/AnexosComponent';

const ListarAnexos = () => {
    const { tipoVinculo, idVinculo, tipoVinculoAux, idVinculoAux } = useParams();
    const [nomeVinculo, setNomeVinculo] = useState('');
    const [nomeVinculoSecundario, setNomeVinculoSecundario] = useState('');
    const [breadcrumbItems, setBreadcrumbItems] = useState<{ label: string; link: string }[]>([]);

    useEffect(() => {
        const fetchVinculo = async () => {
            try {
                const vinculoResponse = await ApiService.fetchData({
                    url: `anexos/getVinculo/${tipoVinculo}/${idVinculo}${tipoVinculoAux && idVinculoAux ? `/${tipoVinculoAux}/${idVinculoAux}` : ''}`,
                    method: 'get',
                });
                const { nomeVinculo, nomeVinculoAux, breadcrumb } = vinculoResponse.data;

                setNomeVinculo(nomeVinculo);
                setNomeVinculoSecundario(nomeVinculoAux);

                setBreadcrumbItems([
                    { label: 'Início', link: '/' },
                    ...breadcrumb.map((item: any) => ({
                        label: item.label,
                        link: item.url,
                    })),
                    { label: 'Anexos', link: '#' },
                ]);
            } catch (error) {
                console.error('Erro ao buscar dados do vínculo:', error);
            }
        };

        fetchVinculo();
    }, [tipoVinculo, idVinculo, tipoVinculoAux, idVinculoAux]);

    return (
        <Container>
            <Breadcrumb items={breadcrumbItems} />
            {idVinculo ? (
                <AnexosComponent
                    url={`${import.meta.env.VITE_API_URL}/anexo-vinculado`}
                    idVinculo={idVinculo}
                    tipoVinculo={tipoVinculo || ''} 
                    idVinculoAux={idVinculoAux}
                    tipoVinculoAux={tipoVinculoAux}
                />
            ) : (
                <div className="text-center text-gray-500">
                    <p>Nenhum dado encontrado para exibir documentos relacionados.</p>
                </div>
            )}
        </Container>
    );
};

export default ListarAnexos;
