import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import moment from 'moment'
import Radio from '@/components/ui/Radio'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

import { TransferenciasPagamentosCard } from '@/components/shared/TableCards/TransferenciasPagamentosCard'


moment.locale('pt-br')

const columns = [
    { name: 'idprojeto', header: 'Projeto', type:'string', value: '', defaultFlex: 0.3,},
    { name: 'idlanc', header: 'Lançamento', type:'string'},
    { 
        name: 'dtliberacao', 
        header: 'Dt Liberação',
        dateFormat: 'DD/MM/YYYY',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'DD/MM/YYYY',
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
        name: 'dtpagamento', 
        header: 'Dt Pagamento',
        dateFormat: 'DD/MM/YYYY',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'DD/MM/YYYY',
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
    { name: 'nmcredor', header: 'Beneficiário', type:'string'},
    { name: 'tpfonterec', header: 'Origem', type:'string'},
    
]

const defaultFilterValue = [
    {
        name: 'idprojeto',
        type: 'string',
        value: ''
    },
    {
        name: 'idlanc',
        type: 'string',
        value: ''
    },
    {
        name: 'dtliberacao',
        operator: 'after', 
        type: 'date', 
        value: ''
    },
    {
        name: 'dtpagamento',
        operator: 'after', 
        type: 'date', 
        value: ''
    },
    {
        name: 'stlancamento',
        type: 'string',
        value: ''
    },
    {
        name: 'nmcredor',
        type: 'string',
        value: ''
    },
    {
        name: 'tpfonterec',
        type: 'string',
        value: ''
    },
]

const Lancamentos = () => {
    const [nameValue, setNameValue] = useState('transferenciaspagamentos')
    const [lancamentoType, setLancamentoType] = useState('todas')

    const onChange = (val: string) => {
        setNameValue(val)
    }

    const radioGroup = (
        <div>
            <Radio.Group className="lg:mb-0" value={nameValue} onChange={onChange}>
                <span className="pr-2 font-black">Mostrar Todos: </span>
                <Radio value={'todos'}></Radio>
            </Radio.Group>
        </div>
    );

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Transferências e Pagamentos</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">

                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/nucleo/`}
                        >
                            Versão antiga
                        </Link>
                    </Button>
                </div>
            </div>
            {<CustomReactDataGrid
                filename='TransferenciasPagamentos'
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/lancamentos/lista-transferencias-pagamentos?nameValue=${nameValue}&lancamentoType=${lancamentoType}`}
                options={radioGroup}
                CardLayout={TransferenciasPagamentosCard}
            />}
            
        </AdaptableCard>
    )
}

export default Lancamentos
