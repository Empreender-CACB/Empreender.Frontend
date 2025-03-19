import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import AnotacoesComponent from './AnotacoesComponent';

const ListarAnotacoes = () => {
    const { tipoVinculo, idVinculo, tipoVinculoAux, idVinculoAux } = useParams();
    const [breadcrumbItems, setBreadcrumbItems] = useState<{ label: string; link: string }[]>([]);
    const [searchParams] = useSearchParams();

    const temAnexos = searchParams.get('temAnexos') === 'true';

    useEffect(() => {
        const fetchVinculo = async () => {
            try {
                const vinculoResponse = await ApiService.fetchData({
                    url: `anexos/getVinculo/${tipoVinculo}/${idVinculo}${tipoVinculoAux && idVinculoAux ? `/${tipoVinculoAux}/${idVinculoAux}` : ''}`,
                    method: 'get',
                });

                const { breadcrumb } = vinculoResponse.data;

                setBreadcrumbItems([
                    { label: 'Início', link: '/' },
                    ...breadcrumb.map((item: any) => ({
                        label: item.label,
                        link: item.url,
                    })),
                    { label: 'Anotações', link: '#' },
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
                <AnotacoesComponent
                    idVinculo={idVinculo}
                    tipoVinculo={tipoVinculo || ''}
                    idVinculoAux={idVinculoAux}
                    tipoVinculoAux={tipoVinculoAux}
                    temAnexos={temAnexos}
                />
            ) : (
                <div className="text-center text-gray-500">
                    <p>Nenhum dado encontrado para exibir anotações relacionadas.</p>
                </div>
            )}
        </Container>
    );
};

export default ListarAnotacoes;
