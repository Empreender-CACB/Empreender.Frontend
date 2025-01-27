/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Tabs from '@/components/ui/Tabs';
import Loading from '@/components/shared/Loading';
import Button from '@/components/ui/Button';

import { useParams } from 'react-router-dom';
import LayoutDetailSimple from '@/components/layouts/LayoutDetailSimple';
import ApiService from '@/services/ApiService';
import { Associacao } from '@/@types/generalTypes';
import ConfirmarInscricao from './modalConfirmarInscricao';
import AnexosComponent from '../../anexos/AnexosComponent';
import AnotacoesComponent from '../../anotacao/AnotacoesComponent';
import PendenciasComponent from '../../pendencias/PendenciasComponent';
import { useAppSelector } from '@/store';
import CogecomActions from './cogecomActions';
import { VscFile } from 'react-icons/vsc';

const { TabNav, TabList, TabContent } = Tabs;

const cogecomStatusTags = {
    Novo: {
        label: 'Novo',
        class: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100',
    },
    Solicitada: {
        label: 'Solicitada',
        class: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100',
    },
    'Em avaliação': {
        label: 'Em Avaliação',
        class: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100',
    },
    Pendente: {
        label: 'Pendente',
        class: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100',
    },
    Cancelada: {
        label: 'Cancelada',
        class: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100',
    },
    Vinculada: {
        label: 'Vinculada',
        class: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100',
    },
    Desvinculada: {
        label: 'Desvinculada',
        class: 'bg-gray-300 text-gray-700 dark:bg-gray-600/20 dark:text-gray-200',
    },
};


const CogecomEntidade = () => {
    const params = useParams();
    const [detalhes, setDetalhes] = useState<Associacao>();
    const [arquivos, setArquivos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            });
            setArquivos(listaResponse.data);

            const cogecomResponse = await ApiService.fetchData({
                url: `cogecom/${params.id}`,
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
    
    const [isGestor, setIsGestor] = useState(false);
    const [isAnalista, setIsAnalista] = useState(false);

    useEffect(() => {

        async function isGestorOrAnalista() {
            setIsGestor(user.associacoes.some((entidade) => detalhes?.idassociacao === entidade.idassociacao));
            setIsAnalista(user.recursos?.includes('analista-cogecom'));
        }

        isGestorOrAnalista();
    }, []);


    useEffect(() => {
        fetchDetalhes();
    }, [params.id]);

    return (
        <Loading loading={loading}>
            <LayoutDetailSimple
                title={`${detalhes?.nmrazao} - COGECOM`}
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
                                <img
                                    src="/img/cogecom.png"
                                    alt="Banner do projeto COGECOM"
                                    className="w-full h-72 max-h-[400px] object-contain rounded-lg"
                                />
                                <h1 className="mb-4 text-xl font-bold">Projeto COGECOM</h1>
                                <p className="mb-5 text-justify">
                                    Bem-vindo ao projeto COGECOM! Este projeto inovador tem como objetivo conectar entidades e transformar o setor por meio de soluções colaborativas e tecnológicas. Participar do COGECOM significa fazer parte de uma iniciativa que busca promover a eficiência e a sustentabilidade no setor de eletricidade, enquanto fortalece a integração entre as partes envolvidas.
                                </p>
                            </div>

                            {/* Lista de arquivos */}
                            <div className="mt-5">
                                <h3 className="text-lg font-bold mb-3">Documentos necessários para adesão</h3>
                                {arquivos.length > 0 ? (
                                    <ul className="list-none p-0">
                                        {arquivos.map((arquivo) => (
                                            <li
                                                key={arquivo.id}
                                                className="p-3 mb-3 border border-gray-300 rounded-md bg-gray-100"
                                            >
                                                <strong>{arquivo.nome}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Nenhum arquivo encontrado.</p>
                                )}
                            </div>

                            <div className="mt-5">
                                <h3 className="text-lg font-bold mb-3">Termo de adesão</h3>
                                <div 
                                    className="upload-file cursor-pointer"
                                    onClick={() => window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTQxNDY3', '_blank')}
                                >
                                    <div className="flex">
                                        <div className="upload-file-thumbnail">
                                            <span className="text-4xl"><VscFile /></span>
                                        </div>
                                        <div className="upload-file-info">
                                            <h6 className="upload-file-name">Termo de adesão para entidades</h6>
                                        </div>
                                    </div>
                                </div>
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
                                    idVinculoAux={dadosCogecom.id}
                                    tipoVinculoAux="cogecom"
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

            <ConfirmarInscricao
                isOpen={isModalOpen}
                idEntidade={params.id}
                onClose={() => setIsModalOpen(false)}
                onConfirm={fetchDetalhes}
            />

        </Loading>
    );
};

export default CogecomEntidade;
