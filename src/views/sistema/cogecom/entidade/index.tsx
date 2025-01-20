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

const { TabNav, TabList, TabContent } = Tabs;

const CogecomEntidade = () => {
    const params = useParams();

    const [detalhes, setDetalhes] = useState<Associacao>();
    const [arquivos, setArquivos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInscrito, setIsInscrito] = useState(false);
    const [dadosCogecom, setDadosCogecom] = useState<any>([]);

    useEffect(() => {
        async function fetchDetalhes() {
            try {
                setLoading(true);
                const response = await ApiService.fetchData({
                    url: `entidade/${params.id}`,
                    method: 'get',
                });

                setDetalhes(response.data);

                const listaResponse = await ApiService.fetchData({
                    url: `getArquivosLista/10`,
                    method: 'get',
                });

                setArquivos(listaResponse.data);

                const cogecomResponse = await ApiService.fetchData({
                    url: `cogecom/${params.id}`,
                    method: 'get',
                });

                if (cogecomResponse.data.id) {
                    setIsInscrito(true);
                    setDadosCogecom(cogecomResponse.data);
                }

                setLoading(false);
            } catch (error) {
                console.error('Erro na requisição', error);
                setLoading(false);
            }
        }

        fetchDetalhes();
    }, [params.id]);

    const handleInscricaoConfirmada = async () => {
        try {
            const cogecomResponse = await ApiService.fetchData({
                url: `cogecom/${params.id}`,
                method: 'get',
            });

            if (cogecomResponse.data.id) {
                setIsInscrito(true);
                setDadosCogecom(cogecomResponse.data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao atualizar dados do COGECOM:', error);
        }
    };

    return (
        <Loading loading={loading}>
            <LayoutDetailSimple
                title={`${detalhes?.nmrazao} - COGECOM`}
                status={isInscrito ? 'Cadastrado' : 'Não cadastrado'}
                subtitle={`${detalhes?.cidade.nmcidade} - ${detalhes?.cidade.iduf}`}

                actions={
                    <div className="flex-wrap inline-flex xl:flex items-center gap-2">
                        {isInscrito ? (
                            <>
                                <Button type="button" size="md" variant="solid" color="blue-600">
                                    Acessar Materiais
                                </Button>
                                <Button type="button" size="md" variant="solid" color="gray-600">
                                    Ver Status
                                </Button>
                            </>
                        ) : (
                            <Button type="button" size="md" variant="solid" onClick={() => setIsModalOpen(true)}>
                                Inscreva-se no COGECOM
                            </Button>
                        )}
                    </div>
                }>

                <Tabs defaultValue="detalhes">
                    <TabList>
                        <TabNav value="detalhes">Detalhes</TabNav>
                        <TabNav value="anotacoes">Anotações</TabNav>
                        <TabNav value="documentos">Documentos</TabNav>
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
                                <h3 className="text-lg font-bold mb-3">Arquivos Relacionados:</h3>
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
                            <AnexosComponent 
                                url={`${import.meta.env.VITE_API_URL}/anexo-vinculado`}
                                idVinculo={params.id}
                                tipoVinculo="entidade"
                                idVinculoAux={dadosCogecom.id}
                                tipoVinculoAux="cogecom" 
                            />
                        </TabContent>
                    </div>
                </Tabs>
            </LayoutDetailSimple>

            <ConfirmarInscricao
                isOpen={isModalOpen}
                idEntidade={params.id}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleInscricaoConfirmada}
            />
        </Loading>
    );
};

export default CogecomEntidade;
