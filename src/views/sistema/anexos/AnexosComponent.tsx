/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css';

import { Link } from 'react-router-dom';
import moment from 'moment';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter';
import { Button } from '@/components/ui';
import { AdaptableCard } from '@/components/shared';
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
        name: 'id',
        header: 'ID',
        columnName: 'empresa.idempresa',
        type: 'number',
        defaultFlex: 0.6,
        operator: 'eq',
        filterEditor: NumberFilter,
    },
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
        name: 'id_vinculo',
        header: 'ID vínculo',
        type: 'string',
        operator: 'contains',
        defaultFlex: 0.6,
        value: '',
    },
    {
        name: 'id_vinculo_aux',
        header: 'ID auxiliar',
        type: 'string',
        operator: 'contains',
        defaultFlex: 0.6,
        value: '',
    },
    {
        name: 'tipo_vinculo',
        header: 'Tipo Vinculo',
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'data_inclusao',
        header: 'Carga',
        defaultFlex: 1,
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
        defaultFlex: 1,
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
}

const AnexosComponent: React.FC<AnexosProps> = ({ url, title = 'Anexos' }) => {
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
        <AdaptableCard className="h-full" bodyClass="h-full">
            <CustomReactDataGrid
                filename={title}
                columns={columns}
                options={radioGroup}
                url={`${url}?filtroVencimento=${filtroVencimento}`}
                CardLayout={AnexoCard}
            />
        </AdaptableCard>
    );
};

export default AnexosComponent;
