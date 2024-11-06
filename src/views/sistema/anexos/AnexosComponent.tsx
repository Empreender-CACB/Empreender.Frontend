/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css';

import { Link } from 'react-router-dom';
import moment from 'moment';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { Button } from '@/components/ui';
import { useState } from 'react';
import 'moment/locale/pt-br';
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid';
import { AnexoCard } from '@/components/shared/TableCards/AnexoCard';

moment.locale('pt-br');

const tipoValue = [
    { name: 'Aguardando aprovação', value: 'aa', color: 'yellow-600' },
    { name: 'Aprovado', value: 'ap', color: 'green-600' },
    { name: 'Não se aplica', value: 'null', color: 'orange-600' },
    { name: 'Recusado', value: 'rc', color: 'red-600' },
];

const columns = [
    {
        name: 'nome',
        header: 'Nome',
        type: 'string',
        operator: 'contains',
        defaultFlex: 1.5,
        render: ({ value, data }: any) => (
            <Link
                className="menu-item-link max-w-md"
                to={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/detalhe/bid/${btoa(data.id)}`}
            >
                {value}
            </Link>
        ),
    },
    {
        name: 'nome_arquivo',
        header: 'Arquivo',
        type: 'string',
        operator: 'contains',
        value: '',
        render: ({ value }: any) => (
            <div style={{ whiteSpace: 'normal', wordWrap: 'break-word', height: 'auto', lineHeight: '1.5' }}>
                {value}
            </div>
        ),
    },
    {
        name: 'data_inclusao',
        header: 'Carga',
        defaultFlex: 0.5,
        dateFormat: 'DD-MM-YYYY',
        type: 'date',
        operator: 'after',
        value: '',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => ({
            dateFormat: 'DD-MM-YYYY',
            placeholder: 'DD-MM-AAAA',
        }),
        render: ({ value, cellProps: { dateFormat } }: any) =>
            moment(value).format(dateFormat) === 'Invalid date' ? '-' : moment(value).format(dateFormat),
    },
    {
        name: 'status',
        header: 'Status',
        type: 'select',
        operator: 'equals',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: tipoValue.map(option => ({ id: option.value, label: option.name })),
        },
        defaultFlex: 1,
        render: ({ value }: any) => {
            const selectedOption = tipoValue.find(option => option.value === value);
            return (
                <div className="flex items-center justify-center">
                    {selectedOption && (
                        <Button variant="solid" color={selectedOption.color} size="xs">
                            {selectedOption.name}
                        </Button>
                    )}
                </div>
            );
        },
    },
    {
        name: 'vencimento',
        header: 'Vencimento',
        defaultFlex: 0.5,
        dateFormat: 'DD-MM-YYYY',
        type: 'date',
        operator: 'after',
        value: '',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => ({
            dateFormat: 'DD-MM-YYYY',
            placeholder: index === 1 ? 'A data é anterior à...' : 'A data é posterior à',
        }),
        render: ({ value, cellProps: { dateFormat } }: any) =>
            moment(value).format(dateFormat) === 'Invalid date' ? '-' : moment(value).format(dateFormat),
    },
];

interface AnexosProps {
    url: string;
    title?: string;
    minHeight?: number;
}

const AnexosComponent: React.FC<AnexosProps> = ({ url, title = 'Anexos', minHeight }) => {
    const [filtroVencimento, setFiltroVencimento] = useState('todos');

    const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroVencimento(event.target.value);
    };

    const radioGroup = (
        <div className="flex items-center">
            <span className="font-black mr-2 ml-4">Arquivos: </span>

            <label className="mr-4">
                <input
                    type="radio"
                    name="filtroVencimento"
                    value="todos"
                    checked={filtroVencimento === 'todos'}
                    onChange={handleFiltroChange}
                />
                Todos
            </label>

            <label className="mr-4">
                <input
                    type="radio"
                    name="filtroVencimento"
                    value="vencidos"
                    checked={filtroVencimento === 'vencidos'}
                    onChange={handleFiltroChange}
                />
                Somente vencidos
            </label>

            <label>
                <input
                    type="radio"
                    name="filtroVencimento"
                    value="nao_vencidos"
                    checked={filtroVencimento === 'nao_vencidos'}
                    onChange={handleFiltroChange}
                />
                Somente não vencidos
            </label>
        </div>
    );

    return (
        <CustomReactDataGrid
            filename={title}
            columns={columns}
            options={radioGroup}
            url={`${url}?filtroVencimento=${filtroVencimento}`}
            CardLayout={AnexoCard}
            minHeight={minHeight}
        />
    );
};

export default AnexosComponent;
