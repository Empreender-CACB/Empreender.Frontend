/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'

import { AdaptableCard } from '@/components/shared'
import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { HiPlusCircle } from 'react-icons/hi'
import { Button, Dialog, Tooltip } from '@/components/ui'
import NewMarcoCriticoForm from './newMarcoCriticoForm'
import { useEffect, useState } from 'react'
import { FaClipboardCheck, FaEye, FaFileSignature, FaHistory, FaPaperclip, FaQuestion } from 'react-icons/fa'
import { GiIceCube } from "react-icons/gi";
import ApiService from '@/services/ApiService'
import EditMarcoCriticoForm from './editMarcoCriticoForm'
import AnexoMarcoCriticoForm from './anexoMarcoCriticoForm'
import StatusChangeModal from './statusChangeModal'
import HistoryMarcoCriticoModal from './historyMarcoCriticoModal'
import FreezeMarcosCriticosModal from './freezeMarcosCriticosModal'
import { Nucleo } from '@/@types/generalTypes'
import AnalysisModal from './analysisMarcoCriticoModal'
import { useAppSelector } from '@/store'
import { AcompanhamentoCard } from '@/components/shared/TableCards/AcompanhamentoCard'

moment.locale('pt-br')

const tarefaStatusStyles: any = {
    'Em análise': { label: 'Em Análise', class: 'bg-blue-500 text-white' },
    'Atingido': { label: 'Atingido', class: 'bg-green-500 text-white' },
    'Não atingido': { label: 'Não Atingido', class: 'bg-red-500 text-white' },
};

export const TarefaStatusTag: React.FC<{ statusKey: string }> = ({ statusKey }) => {
    const statusInfo = tarefaStatusStyles[statusKey] || { label: 'Indefinido', class: 'bg-gray-200 text-black' }
    return (
        <div style={statusInfo.style} className={`border-0 rounded-md text-center px-2 py-1 ${statusInfo.class}`}>
            {statusInfo.label}
        </div>
    )
}

const tarefaStatusValue = [
    { name: 'Em Análise', value: 'Em análise' },
    { name: 'Atingido', value: 'Atingido' },
    { name: 'Não Atingido', value: 'Não atingido' },
];

const AcompanhamentoNucleos = () => {
    const columns = [
        {
            name: 'acompanhamento.id',
            header: 'Id',
            columnName: 'acompanhamento.id',
            type: 'number',
            defaultFlex: 0.3,
            operator: 'eq',
            value: '',
        },
        {
            name: 'marcos_criticos.nome',
            header: 'Atividade',
            columnName: 'marcos_criticos.nome',
            type: 'string',
            defaultFlex: 1,
            operator: 'contains',
            value: '',
        },
        {
            name: 'subatividade',
            header: 'Subatividade',
            columnName: 'subatividade',
            type: 'string',
            defaultFlex: 1,
            operator: 'contains',
            value: '',
        },
        {
            name: 'data_prevista',
            header: 'Previsão',
            columnName: 'data_prevista',
            defaultFlex: 0.6,
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            operator: 'after',
            value: '',
            filterEditor: DateFilter,
            filterEditorProps: ({ index }: any) => {
                return {
                    dateFormat: 'DD-MM-YYYY',
                    placeholder:
                        index === 1
                            ? 'A data é anterior à...'
                            : 'A data é posterior à',
                }
            },
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'nova_data_prevista',
            header: 'Nova Previsão',
            columnName: 'nova_data_prevista',
            defaultFlex: 0.6,
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            operator: 'after',
            value: '',
            filterEditor: DateFilter,
            filterEditorProps: ({ index }: any) => {
                return {
                    dateFormat: 'DD-MM-YYYY',
                    placeholder:
                        index === 1
                            ? 'A data é anterior à...'
                            : 'A data é posterior à',
                }
            },
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'data_encerramento',
            header: 'Término',
            columnName: 'data_encerramento',
            defaultFlex: 0.6,
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            operator: 'after',
            value: '',
            filterEditor: DateFilter,
            filterEditorProps: ({ index }: any) => {
                return {
                    dateFormat: 'DD-MM-YYYY',
                    placeholder:
                        index === 1
                            ? 'A data é anterior à...'
                            : 'A data é posterior à',
                }
            },
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'status',
            header: 'Status',
            columnName: 'status',
            defaultFlex: 0.6,
            type: 'select',
            operator: 'equals',
            value: '',
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: tarefaStatusValue.map((option) => {
                    return { id: option.value, label: option.name }
                }),
            },
            render: ({ data }: any) => <TarefaStatusTag statusKey={data.status} />,
        },
        {
            name: 'actions',
            header: 'Ações',
            defaultFlex: 0.5,
            columnName: 'actions',
            render: ({ data }: any) => renderButtons(data),
        }
    ];

    const { recursos } = useAppSelector((state) => state.auth.user)

    const { id } = useParams<{ id: string }>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMarcoId, setSelectedMarcoId] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isAnexoModalOpen, setIsAnexoModalOpen] = useState(false);
    const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [nucleoDetails, setNucleoDetails] = useState<Nucleo>();
    const [isCongelado, setIsCongelado] = useState(false);
    const [selectedMarcoDetails, setSelectedMarcoDetails] = useState<any>(null);
    const [isConsultor, setIsConsultor] = useState(false);
    const [isGestor, setIsGestor] = useState<any>(false);


    const fetchMarcoDetails = async (marcoId: number) => {
        try {
            const response: any = await ApiService.fetchData({
                url: `/representatividade/marco-critico/${marcoId}`,
                method: 'get'
            });
            if (response.data) {
                setSelectedMarcoDetails(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes do marco crítico:', error);
        }
    };

    const user = useAppSelector((state) => state.auth.user);

    const [reload, setReload] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenEditModal = (marcoId: any) => {
        setSelectedMarcoId(marcoId);
        setIsEditModalOpen(true);
    };

    const handleOpenAnalysisModal = (marcoId: any) => {
        setSelectedMarcoId(marcoId);
        fetchMarcoDetails(marcoId);
        setIsAnalysisModalOpen(true);
    };

    const handleCloseAnalysisModal = () => setIsAnalysisModalOpen(false);

    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleCloseStatusModal = () => setIsStatusModalOpen(false);

    const handleOpenFreezeModal = () => setIsFreezeModalOpen(true);
    const handleCloseFreezeModal = () => setIsFreezeModalOpen(false);

    const handleOpenAnexoModal = (marcoId: any) => {
        setSelectedMarcoId(marcoId);
        setIsAnexoModalOpen(true);
    };

    const handleCloseAnexoModal = () => setIsAnexoModalOpen(false);

    const fetchNucleoDetails = async () => {
        try {
            const response: any = await ApiService.fetchData({
                url: `/representatividade/detalhes-nucleo/${id}`,
                method: 'get'
            });
            if (response.data) {
                setNucleoDetails(response.data);
                setIsCongelado(response.data.congelado);
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes do núcleo:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchNucleoDetails();
        };

        fetchData();
    }, [id]);

    const handleUpdate = async () => {
        setReload(!reload);
        await fetchNucleoDetails();
    };

    const handleSaveStatusChange = async (status: string, comentario: string, dataTermino?: Date) => {
        try {
            await ApiService.fetchData({
                url: `/representatividade/alterar-status-marco-critico/marco_critico_nucleo/${selectedMarcoId}`,
                method: 'put',
                data: {
                    status,
                    comentario,
                    dataTermino: dataTermino ? moment(dataTermino).format('YYYY-MM-DD') : null
                }
            });
            handleCloseStatusModal();
            handleUpdate();
        } catch (error) {
            console.error('Erro ao alterar o status:', error);
        }
    };

    const handleOpenHistoricoModal = (marcoId: any) => {
        setSelectedMarcoId(marcoId);
        setIsHistoricoModalOpen(true);
    };

    const handleCloseHistoricoModal = () => setIsHistoricoModalOpen(false);

    // Função para renderizar os botões
    const renderButtons = (data: any) => {
        setIsConsultor(recursos.includes('analista_acompanhamento_nucleo'));
        const isGestorBool = nucleoDetails && user?.nucleos && user?.nucleos.some(nuc => nuc.idnucleo === nucleoDetails.idnucleo);

        setIsGestor(isGestorBool);

        return (
            <div className="flex space-x-2">
                <Tooltip title="Ver">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<FaEye />}
                        onClick={() => handleOpenEditModal(data['acompanhamento.id'])}
                    />
                </Tooltip>

                {data.status == "Em análise" && isConsultor &&
                    <Tooltip title="Analisar">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaFileSignature />}
                            onClick={() => handleStatusChange(data['acompanhamento.id'])}
                        />
                    </Tooltip>
                }

                {data.status == "Não atingido" && isCongelado && isGestor &&
                    <Tooltip title="Remeter para análise">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaClipboardCheck />}
                            onClick={() => handleOpenAnalysisModal(data['acompanhamento.id'])}
                        />
                    </Tooltip>
                }

                {isGestor &&
                    <Tooltip title="Anexar/retirar documentos">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaPaperclip />}
                            onClick={() => handleOpenAnexoModal(data['acompanhamento.id'])}
                        />
                    </Tooltip>
                }

                <Tooltip title="Histórico">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<FaHistory />}
                        onClick={() => handleOpenHistoricoModal(data['acompanhamento.id'])}
                    />
                </Tooltip>
            </div>
        )
    };

    const handleStatusChange = (id: any) => {
        setSelectedMarcoId(id);
        setIsStatusModalOpen(true);
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center">
                        <h3 className="mb-4 lg:mb-0">Acompanhamento de Núcleo - Marcos Críticos</h3>
                        <Tooltip title="Clique aqui para saber mais sobre os acompanhamentos de marcos críticos" placement="right-end">
                            <Button
                                shape="circle"
                                size="xs"
                                icon={<FaQuestion />}
                                className="ml-2"
                                onClick={() => {
                                    window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTMzMDM0')
                                }}
                            />
                        </Tooltip>
                    </div>
                    <h5>
                        <Link target='_blank' to={`${import.meta.env.VITE_PHP_URL}/sistema/nucleo/detalhe/nid/${btoa(String(nucleoDetails?.idnucleo))}`}>
                            {nucleoDetails?.idnucleo} - {nucleoDetails?.nmnucleo}
                        </Link>
                    </h5>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                    {(isGestor || isConsultor) &&
                        <>
                            {isCongelado ? (
                                <>
                                    {/* Se o consultor está visualizando e o marco está congelado, ele pode descongelar */}
                                    {isConsultor && (
                                        <Button
                                            block
                                            variant="solid"
                                            size="sm"
                                            color="blue-600"
                                            icon={<GiIceCube />}
                                            onClick={handleOpenFreezeModal}
                                        >
                                            Descongelar marcos críticos
                                        </Button>
                                    )}

                                    {/* Se o gestor está visualizando e o marco está congelado, ele vê o botão de congelar desabilitado */}
                                    {isGestor && (
                                        <Tooltip title="Marcos críticos já congelados.">
                                            <Button
                                                block
                                                variant="solid"
                                                size="sm"
                                                color="blue-600"
                                                icon={<GiIceCube />}
                                                disabled
                                            >
                                                Congelar marcos críticos
                                            </Button>
                                        </Tooltip>
                                    )}
                                </>
                            ) : (
                                // Se não está congelado, permitir que o gestor congele os marcos críticos
                                isGestor && (
                                    <Tooltip title="O congelamento permite enviar os marcos críticos para análise dos consultores. Ao congelar, você ainda poderá alterar a data prevista, término e adicionar documentos aos marcos.">
                                        <Button
                                            block
                                            variant="solid"
                                            size="sm"
                                            color="blue-600"
                                            icon={<GiIceCube />}
                                            onClick={handleOpenFreezeModal}
                                        >
                                            Congelar marcos críticos
                                        </Button>
                                    </Tooltip>
                                )
                            )}
                        </>
                    }
                </div>
            </div>
            <CustomReactDataGrid
                filename="Marcos_Criticos"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/representatividade/acompanhamento/nucleo/${id}?reload=${reload}`}
                CardLayout={AcompanhamentoCard}
                defaultSortInfo={{ dir: 1, id: 'nova_data_prevista', name: 'nova_data_prevista', columnName: 'nova_data_prevista', type: 'date' }}
            />
            <Dialog isOpen={isModalOpen} onClose={handleCloseModal}>
                <NewMarcoCriticoForm relacao='nucleo' entidadeId={id ?? ''} onClose={handleCloseModal} onUpdate={handleUpdate} />
            </Dialog>
            <Dialog isOpen={isFreezeModalOpen} onClose={handleCloseFreezeModal}>
                <FreezeMarcosCriticosModal tipo="nucleo" isCongelado={isCongelado} entidadeId={id ?? ''} isOpen={isFreezeModalOpen} onClose={handleCloseFreezeModal} onUpdate={handleUpdate} />
            </Dialog>
            {selectedMarcoId && (
                <>
                    <Dialog isOpen={isEditModalOpen} onClose={handleCloseEditModal} width={800}>
                        <EditMarcoCriticoForm tipoRelacao="nucleo" entidadeId={nucleoDetails?.idnucleo} isGestor={isGestor} marcoId={selectedMarcoId} onClose={handleCloseEditModal} onUpdate={handleUpdate} />
                    </Dialog>
                    <Dialog isOpen={isAnalysisModalOpen} onClose={handleCloseAnalysisModal} width={500}>
                        <AnalysisModal isOpen={isAnalysisModalOpen} onClose={handleCloseAnalysisModal} onSave={handleSaveStatusChange} dataTerminoInicial={selectedMarcoDetails?.data_encerramento} />
                    </Dialog>
                    <Dialog isOpen={isAnexoModalOpen} onClose={handleCloseAnexoModal} width={500}>
                        <AnexoMarcoCriticoForm tipo="nucleo" marcoId={selectedMarcoId} onClose={handleCloseAnexoModal} onUpdate={handleUpdate} />
                    </Dialog>
                    <StatusChangeModal
                        isOpen={isStatusModalOpen}
                        onClose={handleCloseStatusModal}
                        onSave={handleSaveStatusChange}
                    />
                    <HistoryMarcoCriticoModal isOpen={isHistoricoModalOpen} onClose={handleCloseHistoricoModal} marcoId={selectedMarcoId} />
                </>
            )}
        </AdaptableCard>
    )
}

export default AcompanhamentoNucleos
