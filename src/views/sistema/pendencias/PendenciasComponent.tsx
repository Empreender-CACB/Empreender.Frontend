/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css';

import { Link } from 'react-router-dom';
import moment from 'moment';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { Button, Tag, Tooltip } from '@/components/ui';
import { AdaptableCard } from '@/components/shared';
import { useState } from 'react';
import 'moment/locale/pt-br';
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid';
import { HiPlusCircle } from 'react-icons/hi';
import { APP_PREFIX_PATH } from '@/constants/route.constant';
import { FaQuestion } from 'react-icons/fa';
import PendenciaModal from './pendencia-modal';

moment.locale('pt-br');

const statusOptions = [
    { name: 'Aberta', value: 'aberta', color: 'bg-blue-600' },
    { name: 'Em andamento', value: 'andamento', color: 'bg-yellow-600' },
    { name: 'Concluída', value: 'concluida', color: 'bg-green-600' },
];

interface PendenciasProps {
    idVinculo: string | undefined;
    tipoVinculo: string;
    idVinculoAux?: string;
    tipoVinculoAux?: string;
}

const PendenciasComponent: React.FC<PendenciasProps> = ({ idVinculo, tipoVinculo, idVinculoAux, tipoVinculoAux }) => {
    const [selectedPendenciaId, setSelectedPendenciaId] = useState<number | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = (id: number) => {
        setSelectedPendenciaId(id);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedPendenciaId(null);
        setModalIsOpen(false);
    };


    const columns = [
        {
            name: 'id',
            header: 'ID',
            type: 'number',
            defaultFlex: 0.2,
            filterEditor: SelectFilter,
        },
        {
            name: 'titulo',
            header: 'Título',
            defaultFlex: 1.5,
            render: ({ value, data }: any) => (
                <button
                    className="menu-item-link max-w-md text-blue-600 underline"
                    onClick={() => openModal(data.id)}
                >
                    {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                </button>
            ),
        },
        {
            name: 'nmusuario',
            header: 'Autor',
            defaultFlex: 1,
        },
        {
            name: 'data_inclusao',
            header: 'Criação',
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            filterEditor: DateFilter,
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'data_prevista',
            header: 'Data Prevista',
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            filterEditor: DateFilter,
            render: ({ value, cellProps: { dateFormat } }: any) =>
                moment(value).format(dateFormat) === 'Invalid date'
                    ? '-'
                    : moment(value).format(dateFormat),
        },
        {
            name: 'status',
            header: 'Status',
            defaultFlex: 0.5,
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: statusOptions.map(option => ({
                    id: option.value,
                    label: option.name,
                })),
            },
            render: ({ value }: any) => {
                const selectedOption = statusOptions.find(option => option.value === value);
                return (
                    <div className="flex justify-center">
                        <Tag className={`text-white ${selectedOption ? selectedOption.color : 'bg-gray-500'} border-0 rounded`}>
                            {selectedOption ? selectedOption.name : value}
                        </Tag>
                    </div>
                );
            },
        },
    ];

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h3 className="mb-4 lg:mb-0">Pendências</h3>
                    <Tooltip title="Para saber mais sobre o módulo de pendências, clique aqui" placement="right-end">
                        <Button
                            shape="circle"
                            size="xs"
                            icon={<FaQuestion />}
                            className="ml-2"
                            onClick={() => {
                                window.open('https://www.empreender.org.br/sistema/pendencias');
                            }}
                        />
                    </Tooltip>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`${APP_PREFIX_PATH}/pendencias/adicionar/${tipoVinculo}/${idVinculo}?redirectUrl=${encodeURIComponent(window.location.href)}${tipoVinculoAux && idVinculoAux ? `&tipoVinculoAux=${encodeURIComponent(tipoVinculoAux)}&idVinculoAux=${encodeURIComponent(idVinculoAux)}` : ''
                            }`}
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Nova Pendência
                        </Button>
                    </Link>
                </div>
            </div>

            <CustomReactDataGrid
                filename="Pendências"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/pendencias/lista/${tipoVinculo}/${idVinculo}${tipoVinculoAux && idVinculoAux ? `/${tipoVinculoAux}/${idVinculoAux}` : ''
                    }`}
            />

            {selectedPendenciaId && (
                <PendenciaModal
                    idPendencia={selectedPendenciaId}
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                />
            )}
        </AdaptableCard>

    );
};

export default PendenciasComponent;
