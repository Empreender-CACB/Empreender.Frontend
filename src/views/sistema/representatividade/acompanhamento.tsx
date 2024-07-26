/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { useParams } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'

import { AdaptableCard } from '@/components/shared'
import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { LancamentosCard } from '@/components/shared/TableCards/LancamentosCard'
import { HiPlusCircle } from 'react-icons/hi'
import { Button, Dialog, Tooltip } from '@/components/ui'
import NewMarcoCriticoForm from './NewMarcoCriticoForm'
import { useEffect, useState } from 'react'
import { FaEye, FaFileSignature, FaHistory, FaPaperclip } from 'react-icons/fa'
import { GiIceCube } from "react-icons/gi";
import ApiService from '@/services/ApiService'
import EditMarcoCriticoForm from './editMarcoCriticoForm'
import AnexoMarcoCriticoForm from './anexoMarcoCriticoForm'
import StatusChangeModal from './statusChangeModal'
import HistoryMarcoCriticoModal from './historyMarcoCriticoModal'
import FreezeMarcosCriticosModal from './freezeMarcosCriticosModal'

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


const AcompanhamentoMarcosCriticos = () => {

    const columns = [
        {
            name: 'sigla',
            header: 'Entidade',
            columnName: 'sigla',
            type: 'string',
            defaultFlex: 0.6,
            operator: 'contains',
            value: '',
        },
        {
            name: 'marco_nome',
            header: 'Nome',
            columnName: 'marco_nome',
            type: 'string',
            defaultFlex: 1.5,
            operator: 'contains',
            value: '',
        },
        {
            name: 'marco_descricao',
            header: 'Descrição do Marco',
            columnName: 'marco_descricao',
            type: 'string',
            defaultFlex: 1.5,
            operator: 'contains',
            value: '',
        },
        {
            name: 'nmusuario',
            header: 'Responsável',
            columnName: 'nmusuario',
            type: 'string',
            defaultFlex: 1,
            operator: 'contains',
            value: '',
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
            name: 'data_prevista',
            header: 'Data Prevista',
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
                    placeholder: index === 1 ? 'A data é anterior à...' : 'A data é posterior à',
                }
            },
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'nova_data_prevista',
            header: 'Nova Data Prevista',
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
                    placeholder: index === 1 ? 'A data é anterior à...' : 'A data é posterior à',
                }
            },
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'data_encerramento',
            header: 'Data de Encerramento',
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
                    placeholder: index === 1 ? 'A data é anterior à...' : 'A data é posterior à',
                }
            },
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'actions',
            header: 'Ações',
            defaultFlex: 1,
            columnName: 'actions',
            type: 'string',
            render: ({ data }: any) => renderButtons(data),
        }
    ];

    const { id } = useParams<{ id: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMarcoId, setSelectedMarcoId] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isAnexoModalOpen, setIsAnexoModalOpen] = useState(false);
    const [isHistoricoModalOpen, setIsHistoricoModalOpen] = useState(false);
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);

    const [reload, setReload] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenEditModal = (marcoId: any) => {
        setSelectedMarcoId(marcoId);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleCloseStatusModal = () => setIsStatusModalOpen(false);

    const handleOpenFreezeModal = () => setIsFreezeModalOpen(true);
    const handleCloseFreezeModal = () => setIsFreezeModalOpen(false);

    const handleOpenAnexoModal = (marcoId: any) => {
        setSelectedMarcoId(marcoId);
        setIsAnexoModalOpen(true);
    };

    const handleCloseAnexoModal = () => setIsAnexoModalOpen(false);

    const handleSaveStatusChange = async (status: string, comentario: string) => {
        try {
            await ApiService.fetchData({
                url: `/representatividade/alterar-status-marco-critico/${selectedMarcoId}`,
                method: 'put',
                data: { status, comentario }
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
    const renderButtons = (data: any) => (
        <div className="flex space-x-2">
            <Tooltip title="Ver">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaEye />}
                    onClick={() => handleOpenEditModal(data.id)}
                />
            </Tooltip>
            <Tooltip title="Analisar">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaFileSignature />}
                    onClick={() => handleStatusChange(data.id, 'Em análise')}
                />
            </Tooltip>
            <Tooltip title="Anexar/retirar documentos">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaPaperclip />}
                    onClick={() => handleOpenAnexoModal(data.id)}
                />
            </Tooltip>
            <Tooltip title="Histórico">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaHistory />}
                    onClick={() => handleOpenHistoricoModal(data.id)}
                />
            </Tooltip>
        </div>
    );

    // Funções de handler para os botões
    const handleStatusChange = (id: any, status: string) => {
        setSelectedMarcoId(id);
        setIsStatusModalOpen(true);
    };

    const handleUpdate = () => {
        setReload(!reload);
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Acompanhamento - Marcos Críticos</h3>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={handleOpenModal}
                    >
                        Adicionar Marco Crítico
                    </Button>
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        color="blue-600"
                        title='Ao congelar os marcos críticos, eles não poderão ser editados.'
                        icon={<GiIceCube />}
                        onClick={handleOpenFreezeModal}
                    >
                        Congelar marcos críticos
                    </Button>
                </div>
            </div>
            <CustomReactDataGrid
                filename="Marcos_Criticos"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/representatividade/acompanhamento/${id}?reload=${reload}`}
                CardLayout={LancamentosCard}
                defaultSortInfo={{ dir: -1, id: 'id', name: 'id', columnName: 'id', type: 'string' }}
            />
            <Dialog isOpen={isModalOpen} onClose={handleCloseModal}>
                <NewMarcoCriticoForm entidadeId={id ?? ''} onClose={handleCloseModal} onUpdate={handleUpdate} />
            </Dialog>
            <Dialog isOpen={isFreezeModalOpen} onClose={handleCloseFreezeModal}>
                <FreezeMarcosCriticosModal isOpen={isFreezeModalOpen} onClose={handleCloseFreezeModal} onUpdate={handleUpdate} />
            </Dialog>
            {selectedMarcoId && (
                <>
                    <Dialog isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                        <EditMarcoCriticoForm entidadeId={id ?? ''} marcoId={selectedMarcoId} onClose={handleCloseEditModal} onUpdate={handleUpdate} />
                    </Dialog>
                    <Dialog isOpen={isAnexoModalOpen} onClose={handleCloseAnexoModal}>
                        <AnexoMarcoCriticoForm marcoId={selectedMarcoId} onClose={handleCloseAnexoModal} onUpdate={handleUpdate} />
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

export default AcompanhamentoMarcosCriticos
