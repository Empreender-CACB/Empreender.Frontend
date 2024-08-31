import '@inovua/reactdatagrid-community/index.css'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import Radio from '@/components/ui/Radio'
import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import { OcorrenciaCard } from '@/components/shared/TableCards/OcorrenciaCard'

moment.locale('pt-br')
const activeValue = [
    { name: 'Ativa', value: 'S' },
    { name: 'Inativa', value: 'N' },
]

const columns = [
    { name: 'id', header: 'ID', type: 'string', value: '', defaultFlex: 0.1, },
    { name: 'tipo', header: 'Tipo', type: 'string', value: '', defaultFlex: 0.2, },
    { name: 'grupo', header: 'Grupo', type: 'string', value: '', defaultFlex: 0.2, },
    { name: 'usuario', header: 'Usuário', type: 'string', value: '', defaultFlex: 0.2, },
    {
        name: 'data',
        header: 'Data',
        defaultFlex: 0.35,
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
    { name: 'descricao', header: 'Descrição', type: 'string', value: '', defaultFlex: 0.75, },
]

const defaultFilterValue = [
    {
        name: 'id',
        type: 'string',
        value: '',
    },
    {
        name: 'tipo',
        type: 'string',
        value: '',
    },
    {
        name: 'grupo',
        type: 'string',
        value: '',
    },
    {
        name: 'usuario',
        type: 'string',
        value: '',
    },
    { name: 'data', operator: 'after', type: 'date', value: '' },
    {
        name: 'descricao',
        type: 'string',
        value: '',
    },
    {
        name: 'texto',
        type: 'string',
        value: '',
    },
]

const Ocorrencias = () => {
    const [nameValue, setNameValue] = useState('tipo')

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
                <h3 className="mb-4 lg:mb-0">Ocorrências</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">

                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/ocorrencia/`}
                        >
                            Versão antiga
                        </Link>
                    </Button>
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to="/app/sales/product-new"
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Adicionar Ocorrência
                        </Button>
                    </Link>
                </div>
            </div>
            <CustomReactDataGrid
                filename='Ocorrencias'
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/ocorrencia`}
                options={radioGroup}
                CardLayout={OcorrenciaCard}
            />
            
        </AdaptableCard>
    )
}

export default Ocorrencias
