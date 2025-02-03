/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Tabs from '@/components/ui/Tabs';
import Loading from '@/components/shared/Loading';

import { useParams } from 'react-router-dom';
import LayoutDetailSimple from '@/components/layouts/LayoutDetailSimple';
import ApiService from '@/services/ApiService';
import { Associacao } from '@/@types/generalTypes';
import AnexosComponent from '../../anexos/AnexosComponent';
import AnotacoesComponent from '../../anotacao/AnotacoesComponent';
import PendenciasComponent from '../../pendencias/PendenciasComponent';
import { useAppSelector } from '@/store';
import CogecomActions from './cogecomActions';
import { VscFile } from 'react-icons/vsc';
import { Tooltip } from '@/components/ui';

const { TabNav, TabList, TabContent } = Tabs;

const cogecomStatusTags = {
    Novo: {
        label: 'Novo',
        class: 'bg-purple-500 text-white dark:bg-purple-600 dark:text-purple-50',
    },
    Solicitada: {
        label: 'Solicitada',
        class: 'bg-blue-500 text-white dark:bg-blue-600 dark:text-blue-50',
    },
    'Em avaliação': {
        label: 'Em Avaliação',
        class: 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-yellow-50',
    },
    Pendente: {
        label: 'Pendente',
        class: 'bg-orange-500 text-white dark:bg-orange-600 dark:text-orange-50',
    },
    Cancelada: {
        label: 'Cancelada',
        class: 'bg-red-500 text-white dark:bg-red-600 dark:text-red-50',
    },
    Vinculada: {
        label: 'Vinculada',
        class: 'bg-green-500 text-white dark:bg-green-600 dark:text-green-50',
    },
    Desvinculada: {
        label: 'Desvinculada',
        class: 'bg-gray-500 text-white dark:bg-gray-600 dark:text-gray-50',
    },
};


const CogecomEntidade = () => {
    const params = useParams();
    const [detalhes, setDetalhes] = useState<Associacao>();
    const [arquivos, setArquivos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [dadosCogecom, setDadosCogecom] = useState<any>(null);
    const [status, setStatus] = useState<string>('Novo');

    const fetchDetalhes = async () => {
        try {
            setLoading(true);

            const response = await ApiService.fetchData({
                url: `entidade/${params.id}`,
                method: 'get',
            });
            setDetalhes(response.data);

            const listaNome = encodeURIComponent('Cogecom - Adesão de Entidades');
            const listaResponse = await ApiService.fetchData({
                url: `getArquivosListaByNome/${listaNome}`,
                method: 'get',
                params: {
                    idVinculo: params.id,
                    tipoVinculo: 'entidade',
                },
            });
            setArquivos(listaResponse.data);

            const cogecomResponse = await ApiService.fetchData({
                url: `cogecom-entidade/${params.id}`,
                method: 'get',
            });

            if (cogecomResponse.data.id) {
                setDadosCogecom(cogecomResponse.data);
                setStatus(cogecomResponse.data.status);
            }

            setLoading(false);
        } catch (error) {
            console.error('Erro na requisição', error);
            setLoading(false);
        }
    };

    const user = useAppSelector((state) => state.auth.user);
    
    const [isGestor, setIsGestor] = useState(true);
    const [isAnalista, setIsAnalista] = useState(true);

    // useEffect(() => {
    //     async function isGestorOrAnalista() {
    //         setIsGestor(user.associacoes.some((entidade) => detalhes?.idassociacao === entidade.idassociacao));
    //         setIsAnalista(user.recursos?.includes('analista-cogecom'));
    //     }

    //     isGestorOrAnalista();
    // }, [detalhes]);

    useEffect(() => {
        fetchDetalhes();
    }, [params.id]);

    return (
        <Loading loading={loading}>
            <LayoutDetailSimple
                title={`${detalhes?.nmrazao}`}
                titleLink={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/detalhe/aid/${btoa(String(detalhes?.idassociacao))}`}
                status={status}
                statusTags={cogecomStatusTags}
                subtitle={`${detalhes?.cidade.nmcidade} - ${detalhes?.cidade.iduf}`}
                actions={
                    <CogecomActions 
                        status={status}
                        isGestor={isGestor}
                        isAnalista={isAnalista}
                        idEntidade={Number(params.id)}
                        idCogecom={dadosCogecom?.id}
                        fetchDetalhes={fetchDetalhes}
                    />
                }
            >
                <Tabs defaultValue="detalhes">
                    <TabList>
                        <TabNav value="detalhes">Detalhes</TabNav>
                        <TabNav value="anotacoes">Anotações</TabNav>
                        <TabNav value="documentos">Documentos</TabNav>
                        <TabNav value="pendencias">Pendências</TabNav>
                    </TabList>

                    <div className="p-4">
                        <TabContent value="detalhes">
                            <div className="mb-8">
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-2xl overflow-hidden w-full">
                                        <img
                                            src="/img/cogecom.png"
                                            alt="Banner do projeto COGECOM"
                                            className="w-full max-h-[200px] object-contain rounded-2xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5">
                                <h3 className="text-lg font-bold mb-3">Termo de adesão</h3>
                                <div 
                                    className="upload-file cursor-pointer"
                                    onClick={() => window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTQxNDY3', '_blank')}
                                >
                                    <div className="flex">
                                        <div className="upload-file-thumbnail">
                                            <span className="text-4xl rounded-lg"><VscFile /></span>
                                        </div>
                                        <div className="upload-file-info">
                                            <h6 className="upload-file-name">Termo de adesão para entidades</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lista de arquivos */}
                            <div className="mt-5">
                                <h3 className="text-lg font-bold mb-3">Documentos necessários para adesão</h3>
                                {arquivos.length > 0 ? (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
                                        {arquivos.map((arquivo) => (
                                            <Tooltip className='w-full' title={arquivo.tipoArquivo ? `Esse documento deve ser do tipo "${arquivo.tipoArquivo.tipo}"` : "Não há um tipo definido para esse documento."}>
                                                <div
                                                    key={arquivo.id}
                                                    className={`p-4 w-full border rounded-md ${
                                                        arquivo.temArquivoAssociado ? 'bg-green-100' : 'bg-gray-100'
                                                    }`}
                                                >
                                                    <strong>{arquivo.nome}</strong>
                                                    {arquivo.temArquivoAssociado ? (
                                                        <p className="text-green-600 mt-2 font-semibold">Arquivo já anexado</p>
                                                    ) : (
                                                        <p className="text-red-600 mt-2 font-semibold">Arquivo pendente</p>
                                                    )}
                                                </div>
                                            </Tooltip>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Nenhum arquivo encontrado.</p>
                                )}
                            </div>
                        </TabContent>

                        <TabContent value="anotacoes">
                            {dadosCogecom?.id && params.id ? (
                                <AnotacoesComponent
                                    idVinculo={params.id}
                                    tipoVinculo="entidade"
                                    idVinculoAux={dadosCogecom.id}
                                    tipoVinculoAux="cogecom"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p>Nenhum dado encontrado para exibir anotações relacionadas ao COGECOM.</p>
                                </div>
                            )}
                        </TabContent>

                        <TabContent value="documentos">
                            {dadosCogecom?.id && params.id ? (
                                <AnexosComponent
                                    url={`${import.meta.env.VITE_API_URL}/anexo-vinculado`}
                                    idVinculo={params.id}
                                    tipoVinculo="entidade"
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p>Nenhum dado encontrado para exibir documentos relacionadas ao COGECOM.</p>
                                </div>
                            )}

                        </TabContent>

                        <TabContent value="pendencias">
                            {dadosCogecom?.id && params.id ? (
                                <PendenciasComponent
                                    idVinculo={params.id}
                                    tipoVinculo="entidade"
                                    idVinculoAux={dadosCogecom.id}
                                    tipoVinculoAux="cogecom"
                                    temBloqueio={false}
                                />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p>Nenhum dado encontrado para exibir pendencias relacionadas ao COGECOM.</p>
                                </div>
                            )}

                        </TabContent>
                    </div>
                </Tabs>
            </LayoutDetailSimple>

        </Loading>
    );
};

export default CogecomEntidade;
