import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import PendenciasComponent from '../pendencias/PendenciasComponent';

const ListarPendencias = () => {
    const { tipoVinculo, idVinculo, tipoVinculoAux, idVinculoAux } = useParams();
    const [searchParams] = useSearchParams();
    const [breadcrumbItems, setBreadcrumbItems] = useState<{ label: string; link: string }[]>([]);

    const temAnexos = searchParams.get('temAnexos') === 'true';
    const temBloqueio = searchParams.get('temBloqueio') === 'true';

    useEffect(() => {
        const fetchVinculo = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (temAnexos) queryParams.append('temAnexos', 'true');
                if (temBloqueio) queryParams.append('temBloqueio', 'true');

                const vinculoResponse = await ApiService.fetchData({
                    url: `anexos/getVinculo/${tipoVinculo}/${idVinculo}${tipoVinculoAux && idVinculoAux ? `/${tipoVinculoAux}/${idVinculoAux}` : ''}?${queryParams.toString()}`,
                    method: 'get',
                });

                const { breadcrumb } = vinculoResponse.data;

                setBreadcrumbItems([
                    { label: 'Início', link: '/' },
                    ...breadcrumb.map((item: any) => ({
                        label: item.label,
                        link: item.url,
                    })),
                    { label: 'Pendências', link: '#' },
                ]);
            } catch (error) {
                console.error('Erro ao buscar dados do vínculo:', error);
            }
        };

        fetchVinculo();
    }, [tipoVinculo, idVinculo, tipoVinculoAux, idVinculoAux, temAnexos, temBloqueio]);

    return (
        <Container>
            <Breadcrumb items={breadcrumbItems} />
            {idVinculo ? (
                <PendenciasComponent
                    idVinculo={idVinculo}
                    tipoVinculo={tipoVinculo || ''}
                    idVinculoAux={idVinculoAux}
                    tipoVinculoAux={tipoVinculoAux}
                    temAnexos={temAnexos}
                    temBloqueio={temBloqueio}
                />
            ) : (
                <div className="text-center text-gray-500">
                    <p>Nenhum dado encontrado para exibir pendências relacionadas.</p>
                </div>
            )}
        </Container>
    );
};

export default ListarPendencias;
