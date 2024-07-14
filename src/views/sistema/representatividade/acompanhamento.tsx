/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link, useParams } from 'react-router-dom'
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
import { FaCheck, FaFileSignature, FaPaperclip, FaPlay, FaTimes } from 'react-icons/fa'
import ApiService from '@/services/ApiService'

moment.locale('pt-br')

const tarefaStatusStyles: any = {
    'em andamento': { label: 'Em Andamento', class: 'bg-teal-500 text-white' },
    'nao iniciado': { label: 'Não Iniciado', class: 'text-white', style: { backgroundColor: '#990099' } },
    'concluido': { label: 'Concluído', class: 'bg-gray-500 text-white' },
    'atrasado': { label: 'Atrasado', class: 'text-white', style: { backgroundColor: '#FF0000' } },
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
    { name: 'Em Análise', value: 'em_analise' },
    { name: 'Atingido', value: 'atingido' },
    { name: 'Não Atingido', value: 'nao_atingido' },
];



const AcompanhamentoMarcosCriticos = () => {
    const { id } = useParams<{ id: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Função para renderizar os botões
    const renderButtons = (data: any) => (
        <div className="flex space-x-2">
            <Tooltip title="Remeter para análise">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaFileSignature />}
                    onClick={() => handleStatusChange(data.id, 'em_analise')}
                />
            </Tooltip>
            <Tooltip title="Aprovar">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaCheck />}
                    onClick={() => handleStatusChange(data.id, 'atingido')}
                />
            </Tooltip>
            <Tooltip title="Executar">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaPlay />}
                    onClick={() => handleStatusChange(data.id, 'nao_atingido')}
                />
            </Tooltip>
            <Tooltip title="Anexar/retirar documentos">
                <Button
                    variant="solid"
                    size="xs"
                    icon={<FaPaperclip />}
                    onClick={() => handleAnexo(data.id)}
                />
            </Tooltip>
        </div>
    );

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
            header: 'Marco Crítico',
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
            name: 'responsavel',
            header: 'Responsável',
            columnName: 'responsavel',
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

    // Funções de handler para os botões
    const handleStatusChange = (id: number, status: string) => {
        // Lógica para alterar o status
        console.log(`Alterar status do marco crítico com ID ${id} para ${status}`);
    };

    const handleAnexo = (id: number) => {
        // Lógica para anexar ou retirar documentos
        console.log(`Anexar/retirar documentos para o marco crítico com ID ${id}`);
    };

    const [reload, setReload] = useState(false);

    const handleUpdate = () => {
        setReload(!reload); // Toggle the reload state to force reloading the data
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Acompanhamento - Marcos Críticos</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={handleOpenModal}
                    >
                        Adicionar Marco Crítico
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
        </AdaptableCard>
    )
}

export default AcompanhamentoMarcosCriticos
