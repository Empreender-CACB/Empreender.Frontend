
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import formatCPFCNPJ from '@/utils/MaskService'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import { Button, Tooltip } from '@/components/ui'
import { AiOutlineEye } from "react-icons/ai"
import { AdaptableCard } from '@/components/shared'
import { useState } from 'react'
import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { AnexoCard } from '@/components/shared/TableCards/AnexoCard'

moment.locale('pt-br')

const tipoValue = [
    { name: 'Em análise', value: 'analise', color: 'yellow-600' },
    { name: 'Aprovada', value: 'aprovada', color: 'green-600' },
    { name: 'Negada', value: 'recusada', color: 'orange-600' },
]

const columns = [
    {
        name: 'id',
        header: 'ID',
        type: 'string',
        defaultFlex: 0.6,
        operator: 'contains',
        value:'',
        },
    {
        name: 'nmfantasia',
        header: 'Nome Fantasia',
        type: 'string',
        operator: 'contains',
        defaultFlex: 1.5,
        render: ({ value }: any) => {
            return (
                <>
                {value}
                </>
                    
            )
        }
    },
    {
        name: 'cnpj',
        header: 'CNP / CPF',
        defaultFlex: 0.8,
        type: 'string',
        operator: 'contains',
        value: '',
        render: ({ value }: any) => {
            const formattedValue = formatCPFCNPJ(value);
            return (
                <div style={{ color: formattedValue ? 'inherit' : 'red' }}>
                    {formattedValue || value}
                </div>
            );
        },
    },
    {
        name: 'nmcidade',
        header: 'Cidade',
        type: 'string',
        operator: 'contains',
        value: '',
        defaultFlex: 0.7,
        render: ({ data }: any) => {
            const text = data.nmcidade
            return (
                <Tooltip
                    placement='left'
                    title={
                        <div>
                            {text}
                        </div>
                    }
                >
                    <span className="cursor-pointer">{text}</span>
                </Tooltip>
            );
        },
    },
    {
        name: 'iduf',
        header: 'UF',
        type: 'string',
        operator: 'contains',
        value: '',
        defaultFlex: 0.7,
    },
    {
        name: 'concessionaria_energia',
        header: 'Concessionária',
        defaultFlex: 0.8,
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'created_at',
        header: 'Data da candidatura',
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
        header: 'Situação',
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
        name: 'id',
        header: 'Ação',
        defaultFlex: 0.8,
        filterable: false,
        type: 'string',
        render: ({ value }: any) => {
            return (
                <div className="flex items-center justify-center">
                <Tooltip title="Gerenciar">

                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`/sistema/cogecom/detalhes/${value}`}
                    >
                        <AiOutlineEye />
                    </Link>
                    </Tooltip>
                </div>
            )
        },
        
    },

]

interface ListaAdesaoCogecomProps {
    entidade?: string

  }
  
  const Adesoes = ({ entidade }: ListaAdesaoCogecomProps) => {

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Poup Max - adesões</h3>
                <Button size="sm" variant='solid'>
                        <Link
                            className="menu-item-link"
                            to={`/sistema/selecoes/painel-inscricoes`}
                        >
                            Transferir Documentos
                        </Link>
                    </Button>

            </div>
            <CustomReactDataGrid
                filename="Poup Max - Inscrições"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/cogecom${entidade ? `?entidade=${entidade}` : ""}`}
                CardLayout={AnexoCard}
            />
        </AdaptableCard>
    )
}

export default Adesoes
