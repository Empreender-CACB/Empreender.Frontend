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

const AcompanhamentoGeralNucleo = () => {
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
            name: 'nmnucleo',
            header: 'Núcleo',
            columnName: 'nmnucleo',
            type: 'string',
            defaultFlex: 0.5,
            operator: 'contains',
            value: '',
            render: ({ data }: any) => (
                <div>
                    <Link className='text-blue-500' to={`/sistema/representatividade/acompanhamento-nucleo/${data.relacao_2}`}>
                        {data.nmnucleo}
                    </Link>
                </div>
            ),
        },
        {
            name: 'iduf',
            header: 'UF',
            columnName: 'iduf',
            type: 'string',
            defaultFlex: 0.3,
            operator: 'contains',
            value: '',
        },
        {
            name: 'nmcidade',
            header: 'Cidade',
            columnName: 'nmcidade',
            type: 'string',
            defaultFlex: 0.7,
            operator: 'contains',
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

    const { recursos } = useAppSelector((state) => state.auth.user)

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMarco, setSelectedMarco] = useState<{ marcoId: number | null, idnucleo: number | null, data_termino?: Date | null }>({ marcoId: null, idnucleo: null });
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isAnexoModalOpen, setIsAnexoModalOpen] = useState(false);
    const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [isConsultor, setIsConsultor] = useState(false);
    const [isGestor, setIsGestor] = useState(false);

    const [reload, setReload] = useState(false);

    const handleOpenEditModal = (marcoId: any, idnucleo: any) => {
        setSelectedMarco({ marcoId, idnucleo });
        setIsEditModalOpen(true);
    };

    const handleOpenAnalysisModal = (marcoId: any, idnucleo: any, data_termino: any) => {
        setSelectedMarco({ marcoId, idnucleo, data_termino });
        setIsAnalysisModalOpen(true);
    };

    const handleOpenAnexoModal = (marcoId: any, idnucleo: any) => {
        setSelectedMarco({ marcoId, idnucleo });
        setIsAnexoModalOpen(true);
    };

    const handleOpenHistoricoModal = (marcoId: any, idnucleo: any) => {
        setSelectedMarco({ marcoId, idnucleo });
        setIsHistoricoModalOpen(true);
    };

    const handleStatusChange = (marcoId: any, idnucleo: any) => {
        setSelectedMarco({ marcoId, idnucleo });
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
                url: `/representatividade/alterar-status-marco-critico/nucleo/${selectedMarco.marcoId}`,
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

    const user = useAppSelector((state) => state.auth.user);

    // Função para renderizar os botões
    const renderButtons = (data: any) => {
        setIsConsultor(recursos.includes('analista_acompanhamento_nucleo'));
        setIsGestor(user.nucleos.some((nucleo) => nucleo.idnucleo === data.idnucleo));

        return (
            <div className="flex space-x-2">
                <Tooltip title="Ver">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<FaEye />}
                        onClick={() => handleOpenEditModal(data['acompanhamento.id'], data.idnucleo)}
                    />
                </Tooltip>

                {data.status === "Em análise" && isConsultor && (
                    <Tooltip title="Analisar">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaFileSignature />}
                            onClick={() => handleStatusChange(data['acompanhamento.id'], data.idnucleo)}
                        />
                    </Tooltip>
                )}

                {data.status === "Não atingido" && data.congelado && isGestor && (
                    <Tooltip title="Remeter para análise">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaClipboardCheck />}
                            onClick={() => handleOpenAnalysisModal(data['acompanhamento.id'], data.idnucleo, data.data_encerramento)}
                        />
                    </Tooltip>
                )}

                {isGestor && (
                    <Tooltip title="Anexar/retirar documentos">
                        <Button
                            variant="solid"
                            size="xs"
                            icon={<FaPaperclip />}
                            onClick={() => handleOpenAnexoModal(data['acompanhamento.id'], data.idnucleo)}
                        />
                    </Tooltip>
                )}

                <Tooltip title="Histórico">
                    <Button
                        variant="solid"
                        size="xs"
                        icon={<FaHistory />}
                        onClick={() => handleOpenHistoricoModal(data['acompanhamento.id'], data.idnucleo)}
                    />
                </Tooltip>
            </div>
        );
    };


    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h3 className="mb-4 lg:mb-0">Acompanhamento Geral de Núcleos - Marcos Críticos</h3>
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
            </div>

            <CustomReactDataGrid
                filename="Marcos_Criticos"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/representatividade/acompanhamento-geral/marco_critico_nucleo?reload=${reload}`}
                CardLayout={AcompanhamentoCard}
                defaultSortInfo={{ dir: 1, id: 'nova_data_prevista', name: 'nova_data_prevista', columnName: 'nova_data_prevista', type: 'date' }}
            />

            {selectedMarco.marcoId && (
                <>
                    <Dialog isOpen={isEditModalOpen} onClose={handleCloseEditModal} width={800}>
                        <EditMarcoCriticoForm tipoRelacao="nucleo" entidadeId={selectedMarco.idnucleo} marcoId={selectedMarco.marcoId} onClose={handleCloseEditModal} onUpdate={handleUpdate} />
                    </Dialog>
                    <Dialog isOpen={isAnalysisModalOpen} onClose={handleCloseAnalysisModal} width={500}>
                        <AnalysisModal isOpen={isAnalysisModalOpen} onClose={handleCloseAnalysisModal} onSave={handleSaveStatusChange} dataTerminoInicial={selectedMarco?.data_termino} />
                    </Dialog>
                    <Dialog isOpen={isAnexoModalOpen} onClose={handleCloseAnexoModal} width={500}>
                        <AnexoMarcoCriticoForm tipo="nucleo" marcoId={selectedMarco.marcoId} onClose={handleCloseAnexoModal} onUpdate={handleUpdate} />
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

export default AcompanhamentoGeralNucleo
