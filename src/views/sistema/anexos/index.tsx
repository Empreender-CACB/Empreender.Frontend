/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import { Button } from '@/components/ui'
import { HiOutlineReply } from 'react-icons/hi'
import { AdaptableCard } from '@/components/shared'
import { useState } from 'react'
import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { AnexoCard } from '@/components/shared/TableCards/AnexoCard'

moment.locale('pt-br')

const tipoValue = [
    { name: 'Aguardando aprovação', value: 'aa', color: 'yellow-600' },
    { name: 'Aprovado', value: 'ap', color: 'green-600' },
    { name: 'Não se aplica', value: 'null', color: 'orange-600' },
    { name: 'Recusado', value: 'rc', color: 'red-600' },
]

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
        render: ({ value, data }: any) => {
            return (
                <Link
                    className="menu-item-link max-w-md"
                    to={`${import.meta.env.VITE_PHP_URL
                        }/sistema/anexo/detalhe/bid/${btoa(data.id)}`}
                >
                    {value}
                </Link>
            )
        }
    },
    {
        name: 'nome_arquivo',
        header: 'Arquivo',
        type: 'string',
        operator: 'contains',
        value: '',
        render: ({ value, data }: any) => (
            <Link

                className="menu-item-link max-w-md text-blue-500 underline"
                to={`${import.meta.env.VITE_API_URL}/anexo/${data.id}/download`}
                target='_blank'
            >
                {value}
            </Link>
        )
    },
    {
        name: 'tipo_vinculo',
        header: 'Tipo Vinculo',
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'id_vinculo',
        header: 'ID vínculo',
        type: 'string',
        operator: 'eq',
        defaultFlex: 0.6,
        value: '',
    },
    {
        name: 'id_vinculo_aux',
        header: 'ID auxiliar',
        type: 'string',
        operator: 'eq',
        defaultFlex: 0.6,
        value: '',
    },
    {
        name: 'data_inclusao',
        header: 'Carga',
        defaultFlex: 1,
        dateFormat: 'DD/MM/YYYY',
        type: 'date',
        operator: 'eq',
        value: '',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'DD/MM/YYYY',
                placeholder: 'dia/mês/ano'
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
        type: 'select',
        operator: 'equals',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: tipoValue.map((option) => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ value }: any) => {
            const selectedOption = tipoValue.find(option => option.value === value);
            return (
                <div className="flex items-center justify-center">
                    {selectedOption && (
                        <Button
                            variant="solid"
                            color={selectedOption.color}
                            size="xs"
                        >
                            {selectedOption.name}
                        </Button>
                    )}
                </div>
            )
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
        name: 'acesso',
        header: 'Acesso',
        type: 'string',
        operator: 'contains',
        value: '',
        defaultFlex: 0.7,
    },
    {
        name: 'vencimento',
        header: 'Vencimento',
        defaultFlex: 1,
        dateFormat: 'DD/MM/YYYY',
        type: 'date',
        operator: 'eq',
        value: '',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'DD/MM/YYYY',
                placeholder: 'dia/mês/ano'
            } 
            
        },
        render: ({ value, cellProps: { dateFormat } }: any) =>
            moment(value).format(dateFormat) === 'Invalid date'
                ? '-'
                : moment(value).format(dateFormat),
    },
]

const Anexos = () => {
    const [filtroVencimento, setFiltroVencimento] = useState('todos')

    const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroVencimento(event.target.value)
    }

    const radioGroup = (
        <div>
            <div className="flex items-center">
                <Button variant='solid' size='sm'
                    onClick={() => {
                        window.open('https://www.empreender.org.br/sistema/adminutils/acompanhamento-geral/quadro/cXVhZHJvMg==')
                    }}
                >Painel</Button>
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
        </div>
    )

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Anexos</h3>

                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Button size="sm" icon={<HiOutlineReply />} className='mr-4'>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL
                                }/sistema/anexo/`}
                        >
                            Versão antiga
                        </Link>
                    </Button>
                    <Button 
                        variant='solid' 
                        size='sm' 
                        onClick={() => {
                            window.open(`${import.meta.env.VITE_PHP_URL}/sistema/adminutils/acompanhamento-geral/quadro/cXVhZHJvMg==`)
                        }}
                    >
                        Painel
                    </Button>
                </div>
            </div>
            <CustomReactDataGrid
                filename="Anexos"
                columns={columns}
                options={radioGroup}
                url={`${import.meta.env.VITE_API_URL
                    }/anexo?filtroVencimento=${filtroVencimento}`}
                CardLayout={AnexoCard}
            />
        </AdaptableCard>
    )
}

export default Anexos
