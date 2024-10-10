/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'

import { AdaptableCard } from '@/components/shared'
import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { Button, Dialog, Tooltip } from '@/components/ui'
import { useState } from 'react'
import { FaClipboardCheck, FaEye, FaFileSignature, FaHistory, FaPaperclip, FaQuestion } from 'react-icons/fa'
import ApiService from '@/services/ApiService'
import EditMarcoCriticoForm from './editMarcoCriticoForm'
import AnexoMarcoCriticoForm from './anexoMarcoCriticoForm'
import StatusChangeModal from './statusChangeModal'
import HistoryMarcoCriticoModal from './historyMarcoCriticoModal'
import AnalysisModal from './analysisMarcoCriticoModal'
import { AcompanhamentoCard } from '@/components/shared/TableCards/AcompanhamentoCard'
import { MdDashboard } from 'react-icons/md'
import ZohoFrame from '@/components/shared/ZohoFrame'
import { useAppSelector } from '@/store'

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

const congeladoStatusStyles: any = {
    'true': { label: 'Congelado', class: 'bg-blue-500 text-white' },
    'false': { label: 'Não Congelado', class: 'bg-gray-500 text-white' }
};

export const CongeladoStatusTag: React.FC<{ statusKey: string }> = ({ statusKey }) => {
    const statusInfo = congeladoStatusStyles[statusKey]
    return (
        <div style={statusInfo.style} className={`border-0 rounded-md text-center px-2 py-1 ${statusInfo.class}`}>
            {statusInfo.label}
        </div>
    )
}

const congeladoValue = [
    { name: 'Congelado', value: true },
    { name: 'Não Congelado', value: false },
];


const AcompanhamentoGeralMarcosCriticos = () => {
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
            name: 'sigla',
            header: 'Entidade',
            columnName: 'sigla',
            type: 'string',
            defaultFlex: 0.5,
            operator: 'contains',
            value: '',
            render: ({ data }: any) => (
                <div>
                    <Link className='text-blue-500' to={`/sistema/representatividade/acompanhamento/${data.idassociacao}`}>
                        {data.sigla ?? data.nmrazao}
                    </Link>
                </div>
            ),
        },
        {
            name: 'iduf',
            header: 'UF',
            columnName: 'iduf',
            type: 'string',
            defaultFlex: 0.5,
            operator: 'contains',
            value: '',
        },
        {
            name: 'nmcidade',
            header: 'Cidade',
            columnName: 'nmcidade',
            type: 'string',
            defaultFlex: 0.6,
            operator: 'contains',
            value: '',
        },
        {
            name: 'marcos_criticos.nome',
            header: 'Nome',
            columnName: 'marcos_criticos.nome',
            type: 'string',
            defaultFlex: 0.6,
            operator: 'contains',
            value: '',
        },
        {
            name: 'nmusuario',
            header: 'Consultor',
            columnName: 'nmusuario',
            type: 'string',
            defaultFlex: 0.6,
            operator: 'contains',
            value: '',
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
            name: 'congelado',
            header: 'Congelado',
            columnName: 'congelado',
            defaultFlex: 0.6,
            type: 'select',
            operator: 'equals',
            value: '',
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: congeladoValue.map((option) => {
                    return { id: option.value, label: option.name }
                }),
            },
            render: ({ data }: any) => <CongeladoStatusTag statusKey={data.congelado} />,
        },
        {
            name: 'actions',
            header: 'Ações',
            defaultFlex: 1,
            columnName: 'actions',
            render: ({ data }: any) => renderButtons(data),
        }
    ];

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMarco, setSelectedMarco] = useState<{ marcoId: number | null, idassociacao: number | null, data_termino?: Date | null }>({ marcoId: null, idassociacao: null });
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isAnexoModalOpen, setIsAnexoModalOpen] = useState(false);
    const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [isConsultor, setIsConsultor] = useState(false);
    const [isGestor, setIsGestor] = useState(false);
    const [idAssociacaoGestor, setIdAssociacaoGestor] = useState<number | null>(null);


    const handleOpenEditModal = (marcoId: any, idassociacao: any) => {
        setSelectedMarco({ marcoId, idassociacao });
        setIsEditModalOpen(true);
    };

    const handleOpenAnalysisModal = (marcoId: any, idassociacao: any, data_termino: any) => {
        setSelectedMarco({ marcoId, idassociacao, data_termino });
        setIsAnalysisModalOpen(true);
    };

    const handleOpenAnexoModal = (marcoId: any, idassociacao: any) => {
        setSelectedMarco({ marcoId, idassociacao });
        setIsAnexoModalOpen(true);
    };

    const handleOpenHistoricoModal = (marcoId: any, idassociacao: any) => {
        setSelectedMarco({ marcoId, idassociacao });
        setIsHistoricoModalOpen(true);
    };

    const handleStatusChange = (marcoId: any, idassociacao: any) => {
        setSelectedMarco({ marcoId, idassociacao });
        setIsStatusModalOpen(true);
    };

    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleCloseAnalysisModal = () => setIsAnalysisModalOpen(false);
    const handleCloseAnexoModal = () => setIsAnexoModalOpen(false);
    const handleCloseStatusModal = () => setIsStatusModalOpen(false);
    const handleCloseHistoricoModal = () => setIsHistoricoModalOpen(false);

    const handleUpdate = async () => {
        setReload(!reload);
    };

    const handleSaveStatusChange = async (status: string, comentario: string, dataTermino?: Date) => {
        try {
            await ApiService.fetchData({
                url: `/representatividade/alterar-status-marco-critico/${selectedMarco.marcoId}`,
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

    const renderButtons = (data: any) => {
        setIsConsultor(data.consultorAssociacoes.includes(String(data.idassociacao)));
        
        if (data.consultorAssociacoes.includes(String(data.idassociacao))) {
            setIsConsultor(true);
            setIsGestor(false); 
            setIdAssociacaoGestor(null);
        } else if (data.userAssociacoes.includes(data.idassociacao)) {
            setIsGestor(true);
            setIsConsultor(false); 
            setIdAssociacaoGestor(data.idassociacao);
        } else {
            setIsConsultor(false);
            setIsGestor(false);
            setIdAssociacaoGestor(null);
        }

        return (
            <div className="flex space-x-2">
                <Tooltip title="Ver">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<FaEye />}
                        onClick={() => handleOpenEditModal(data['acompanhamento.id'], data.idassociacao)}
                    />
                </Tooltip>

                {data.status === "Em análise" && (isGestor || isConsultor) && (
                    <Tooltip title="Analisar">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaFileSignature />}
                            onClick={() => handleStatusChange(data['acompanhamento.id'], data.idassociacao)}
                        />
                    </Tooltip>
                )}

                {data.status === "Não atingido" && data.congelado && (isGestor || isConsultor) && (
                    <Tooltip title="Remeter para análise">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaClipboardCheck />}
                            onClick={() => handleOpenAnalysisModal(data['acompanhamento.id'], data.idassociacao, data.data_encerramento)}
                        />
                    </Tooltip>
                )}

                {(isGestor || isConsultor) && (
                    <Tooltip title="Anexar/retirar documentos">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaPaperclip />}
                            onClick={() => handleOpenAnexoModal(data['acompanhamento.id'], data.idassociacao)}
                        />
                    </Tooltip>
                )}

                <Tooltip title="Histórico">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<FaHistory />}
                        onClick={() => handleOpenHistoricoModal(data['acompanhamento.id'], data.idassociacao)}
                    />
                </Tooltip>
            </div>
        );
    };

    // Função para definir a URL do painel Zoho com base no tipo de usuário
    const getZohoURL = (isConsultor: boolean, isGestor: boolean, userName?: string) => {
        if (isConsultor) {
            return `https://analytics.zoho.com/open-view/1704802000048065118?ZOHO_CRITERIA=%22AC%20-%20rep%22.%22Consultor%22%3D'${userName}'`;
        } else if (isGestor) {
            return `https://analytics.zoho.com/open-view/1704802000048065118/68c91bb4a9d53fefab075c66c702bab7?ZOHO_CRITERIA=%22AC%20-%20rep%22.%22ID%20entidade%22%3D${idAssociacaoGestor}`;
        } else {
            return `https://analytics.zoho.com/open-view/1704802000048065118/68c91bb4a9d53fefab075c66c702bab7`;
        }
    };
    
    const { nmusuario } = useAppSelector(
        (state) => state.auth.user
    )

    const zohoURL = getZohoURL(isConsultor, isGestor, nmusuario);
    
    const [showPanel, setShowPanel] = useState(false);
    const handleToggle = () => {
        setShowPanel(!showPanel);
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h3 className="mb-4 lg:mb-0">Acompanhamento Geral - Marcos Críticos</h3>
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

                <div className="flex flex-col lg:flex-row lg:items-center">
                {!showPanel ? (
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<MdDashboard />}
                        onClick={handleToggle}
                    >
                        Painel de acompanhamento
                    </Button>
                ) : (
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<MdDashboard />}
                        onClick={handleToggle}
                    >
                        Quadro geral
                    </Button>
                )}
                </div>
            </div>


            <div className="mt-4">
                {showPanel ? (
                    <ZohoFrame url={zohoURL} />
                ) : (
                    <CustomReactDataGrid
                        filename="Marcos_Criticos"
                        columns={columns}
                        url={`${import.meta.env.VITE_API_URL}/representatividade/acompanhamento-geral/marco_critico?reload=${reload}`}
                        CardLayout={AcompanhamentoCard}
                        defaultSortInfo={{ dir: 1, id: 'nova_data_prevista', name: 'nova_data_prevista', columnName: 'nova_data_prevista', type: 'date' }}
                    />
                )}
            </div>

            {selectedMarco.marcoId && (
                <>
                    <Dialog isOpen={isEditModalOpen} onClose={handleCloseEditModal} width={800}>
                        <EditMarcoCriticoForm entidadeId={selectedMarco.idassociacao} isConsultor={isConsultor} marcoId={selectedMarco.marcoId} onClose={handleCloseEditModal} onUpdate={handleUpdate} />
                    </Dialog>
                    <Dialog isOpen={isAnalysisModalOpen} onClose={handleCloseAnalysisModal} width={500}>
                        <AnalysisModal isOpen={isAnalysisModalOpen} onClose={handleCloseAnalysisModal} onSave={handleSaveStatusChange} dataTerminoInicial={selectedMarco?.data_termino} />
                    </Dialog>
                    <Dialog isOpen={isAnexoModalOpen} onClose={handleCloseAnexoModal} width={500}>
                        <AnexoMarcoCriticoForm marcoId={selectedMarco.marcoId} onClose={handleCloseAnexoModal} onUpdate={handleUpdate} />
                    </Dialog>
                    <StatusChangeModal
                        isOpen={isStatusModalOpen}
                        onClose={handleCloseStatusModal}
                        onSave={handleSaveStatusChange}
                    />
                    <HistoryMarcoCriticoModal isOpen={isHistoricoModalOpen} onClose={handleCloseHistoricoModal} marcoId={selectedMarco.marcoId} />
                </>
            )}
        </AdaptableCard>
    )
}

export default AcompanhamentoGeralMarcosCriticos
