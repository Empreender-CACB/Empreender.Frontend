import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import moment from 'moment'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'

import { AdaptableCard } from '@/components/shared'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { useState } from 'react'
import ListaCogecomActions from './listaCogecomActions'

moment.locale('pt-br')

const statusTags: any = {
    'Novo': { 
        label: 'Novo', 
        class: 'bg-purple-500 text-white dark:bg-purple-600 dark:text-purple-50' 
    },
    'Solicitada': { 
        label: 'Solicitada', 
        class: 'bg-blue-500 text-white dark:bg-blue-600 dark:text-blue-50' 
    },
    'Em avaliação': { 
        label: 'Em Avaliação', 
        class: 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-yellow-50' 
    },
    'Pendente': { 
        label: 'Pendente', 
        class: 'bg-orange-500 text-white dark:bg-orange-600 dark:text-orange-50' 
    },
    'Cancelada': { 
        label: 'Cancelada', 
        class: 'bg-red-500 text-white dark:bg-red-600 dark:text-red-50' 
    },
    'Habilitada': { 
        label: 'Habilitada', 
        class: 'bg-green-500 text-white dark:bg-green-600 dark:text-green-50' 
    },
    'Não habilitada': { 
        label: 'Não habilitada', 
        class: 'bg-gray-500 text-white dark:bg-gray-600 dark:text-gray-50' 
    },
};

const statusOptions = Object.keys(statusTags).map((key) => ({
    name: statusTags[key].label,
    value: key
}));

export const StatusTag: React.FC<{ statusKey: string }> = ({ statusKey }) => {
    const statusInfo = statusTags[statusKey] || { label: 'Indefinido', class: 'bg-gray-200 text-black' };
    return (
        <div className={`border-0 rounded-md text-center px-2 py-1 ${statusInfo.class}`}>
            {statusInfo.label}
        </div>
    );
};

const ListaCogecom = () => {
    const [reload, setReload] = useState(false);

    const columns = [
        {
            name: 'id',
            header: 'ID',
            columnName: 'id',
            type: 'number',
            defaultFlex: 0.3,
            operator: 'eq',
            value: '',
        },
        {
            name: 'iduf',
            header: 'UF',
            columnName: 'iduf',
            type: 'string',
            defaultFlex: 0.3,
            operator: 'eq',
            value: '',
        },
        {
            name: 'nmcidade',
            header: 'Cidade',
            columnName: 'nmcidade',
            type: 'string',
            defaultFlex: 0.5,
            operator: 'contains',
            value: '',
        },
        {
            name: 'nmrazao',
            header: 'Entidade',
            columnName: 'nmrazao',
            type: 'string',
            defaultFlex: 0.8,
            operator: 'contains',
            value: '',
            render: ({ data }: any) => (
                <Link className="text-blue-500" to={`/sistema/cogecom/entidade/${data.idassociacao}`}>
                    {data.nmrazao}
                </Link>
            ),
        },
        {
            name: 'sigla',
            header: 'Sigla',
            columnName: 'sigla',
            type: 'string',
            defaultFlex: 0.4,
            operator: 'contains',
            value: '',
        },
        {
            name: 'created_at',
            header: 'Data Criação',
            columnName: 'created_at',
            defaultFlex: 0.6,
            dateFormat: 'DD-MM-YYYY',
            type: 'date',
            operator: 'after',
            value: '',
            filterEditor: DateFilter,
            render: ({ value }: any) => moment(value).format('DD-MM-YYYY'),
        },
        {
            name: 'status',
            header: 'Status',
            columnName: 'status',
            defaultFlex: 0.7,
            type: 'select',
            operator: 'equals',
            value: '',
            filterEditor: SelectFilter,
            filterEditorProps: {
                dataSource: statusOptions.map((option) => ({
                    id: option.value,
                    label: option.name
                })),
            },
            render: ({ data }: any) => <StatusTag statusKey={data.status} />,
        },
        {
            name: 'actions',
            header: 'Ações',
            defaultFlex: 1,
            columnName: 'actions',
            render: ({ data }: any) => <ListaCogecomActions data={data} onUpdate={() => setReload(!reload)} />,
        }
    ];

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex items-center justify-between mb-4">
                <h3>Lista Geral - COGECOM</h3>
            </div>

            <CustomReactDataGrid
                filename="PoupMax"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/cogecom-entidade-lista?reload=${reload}`}
            />
        </AdaptableCard>
    );
};

export default ListaCogecom;
