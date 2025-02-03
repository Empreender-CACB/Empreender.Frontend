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
import { AdaptableCard } from '@/components/shared';
import { APP_PREFIX_PATH } from '@/constants/route.constant';
import { HiPlusCircle } from 'react-icons/hi';

moment.locale('pt-br');

const tipoValue = [
    { name: 'Aguardando aprovação', value: 'aa', color: 'yellow-600' },
    { name: 'Aprovado', value: 'ap', color: 'green-600' },
    { name: 'Não se aplica', value: 'null', color: 'orange-600' },
    { name: 'Não se aplica', value: 'nao_aplica', color: 'orange-600' },
    { name: 'Recusado', value: 'rc', color: 'red-600' },
];

const columns = [
    {
        name: 'nome',
        header: 'Nome',
        type: 'string',
        operator: 'contains',
        defaultFlex: 0.7,
        render: ({ value, data }: any) => (
            <Link
                className="menu-item-link max-w-md text-blue-500 underline"
                to={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/detalhe/bid/${btoa(data.id)}`}
                target='_blank'
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
        defaultFlex: 0.7,
        render: ({ value, data }: any) => (
            <Link
                className="menu-item-link max-w-md text-blue-500 underline"
                to={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/download-anexo/aid/${btoa(data.id)}`}
                target='_blank'
            >
                {value}
            </Link>
        ),
    },
    {
        name: 'data_inclusao',
        header: 'Carga',
        defaultFlex: 0.4,
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
        defaultFlex: 0.8,
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
        name: 'arquivos_tipos.tipo',
        header: 'Tipo',
        type: 'string',
        operator: 'contains',
        value: '',
        defaultFlex: 0.7,
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
    tipoVinculo: string;
    idVinculo: string | undefined;
    tipoVinculoAux?: string;
    idVinculoAux?: string;
}

const AnexosComponent: React.FC<AnexosProps> = ({
    url,
    title = 'Anexos',
    minHeight,
    tipoVinculo,
    idVinculo,
    tipoVinculoAux,
    idVinculoAux,
}) => {
    const [filtroVencimento, setFiltroVencimento] = useState('todos');

    const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroVencimento(event.target.value);
    };

    const generateUrl = (
        baseUrl: string,
        tipoVinculo: string,
        idVinculo: string,
        tipoVinculoAux?: string,
        idVinculoAux?: string,
        queryParams?: Record<string, string | undefined>
    ) => {
        let url = `${baseUrl}/${tipoVinculo}/${idVinculo}`;
    
        if (tipoVinculoAux && idVinculoAux) {
            url += `/${tipoVinculoAux}/${idVinculoAux}`;
        }
    
        if (queryParams) {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams)
                    .filter(([_, v]) => v !== undefined && v !== '')
                    .map(([key, value]) => [key, value || ''])
            );
    
            const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();
    
            if (queryString) {
                url += `?${queryString}`;
            }
        }
    
        return url;
    };    


    const radioGroup = (
        <div className="flex items-center pt-2">
            <span className="font-black mr-2">Arquivos: </span>

            <label className="mr-4 flex items-center">
                <input
                    type="radio"
                    name="filtroVencimento"
                    value="todos"
                    className='mr-1'
                    checked={filtroVencimento === 'todos'}
                    onChange={handleFiltroChange}
                />
                Todos
            </label>

            <label className="mr-4 flex items-center">
                <input
                    type="radio"
                    name="filtroVencimento"
                    value="vencidos"
                    className='mr-1'
                    checked={filtroVencimento === 'vencidos'}
                    onChange={handleFiltroChange}
                />
                Somente vencidos
            </label>

            <label className="mr-4 flex items-center">
                <input
                    type="radio"
                    name="filtroVencimento"
                    value="nao_vencidos"
                    className='mr-1'
                    checked={filtroVencimento === 'nao_vencidos'}
                    onChange={handleFiltroChange}
                />
                Somente não vencidos
            </label>
        </div>
    );

    return (
        <AdaptableCard>
            <div className="lg:flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <h3 className="mb-4 lg:mb-0">{title}</h3>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={generateUrl(
                            `${APP_PREFIX_PATH}/anexos/adicionar`,
                            tipoVinculo,
                            idVinculo || '',
                            tipoVinculoAux,
                            idVinculoAux,
                            { redirectUrl: window.location.href }
                        )}
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Adicionar documento
                        </Button>
                    </Link>
                </div>
            </div>
            <CustomReactDataGrid
                filename={title}
                columns={columns}
                options={radioGroup}
                url={generateUrl(
                    url,
                    tipoVinculo,
                    idVinculo || '',
                    tipoVinculoAux || '',
                    idVinculoAux || '',
                    { filtroVencimento: filtroVencimento }
                )}
                CardLayout={AnexoCard}
                minHeight={minHeight}
            />
        </AdaptableCard>
    );
};

export default AnexosComponent;
