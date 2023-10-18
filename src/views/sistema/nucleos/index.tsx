import '@inovua/reactdatagrid-community/index.css'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import Radio from '@/components/ui/Radio'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

import  estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros'
import { NucleosCard } from '@/components/shared/TableCards/NucleosCard'

moment.locale('pt-br')
const activeValue = [
    { name: 'Ativa', value: 'S' },
    { name: 'Inativa', value: 'N' },
]

const columns = [
    { name: 'idnucleo', header: 'ID', type: 'string' },
    {
        name: 'iduf', header: 'UF', type: 'select',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: estadosBrasileiros.map(state => {
                return { id: state.sigla, label: state.sigla }
            }),
        }
    },
    {
        name: 'nmcidade', header: 'Cidade', type: 'string'
    },
    {
        name: 'nmnucleo',
        header: 'Núcleo',
        defaultFlex: 1.5,
        type: 'string',
        render: ({ data }: any) => (
            <div>
                <Link to={`/sistema/nucleos/${data.idnucleo}`}>
                    {data.nmnucleo}
                </Link>
            </div>
        ),
    },
    {
        name: 'dssegmento',
        header: 'Segmento',
        type: 'string',
    },
    {
        name: 'dtultimaalteracao',
        header: 'Última Alteração',
        defaultFlex: 1,
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
        name: 'nucleo.flativo', header: 'Ativa', type: 'select',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: activeValue.map(option => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ value }: any) => (
            <div className="flex items-center justify-center">
               <TagActiveInative value={value} activeText="S" />
            </div>
        ),
    },
]

const defaultFilterValue = [
    {
        name: 'idnucleo',
        type: 'string',
        value: '',
    },
    {
        name: 'iduf',
        operator: 'equals',
        type: 'select',
        value: '',
    },
    {
        name: 'nmcidade',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'nmnucleo',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'dssegmento',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    { name: 'dtultimaalteracao', operator: 'after', type: 'date', value: '' },
    {
        name: 'nucleo.flativo',
        operator: 'equals',
        type: 'select',
        value: 'S',
    },
]

const Nucleos = () => {
    const [nameValue, setNameValue] = useState('nmnucleo')
    const [nucleoType, setNucleoType] = useState('todas')

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
                <h3 className="mb-4 lg:mb-0">Núcleos</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">

                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/nucleo/`}
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
                            Adicionar núcleo
                        </Button>
                    </Link>
                </div>
            </div>
            <CustomReactDataGrid
                filename='Nucleos'
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/nucleos?nameValue=${nameValue}&nucleoType=${nucleoType}`}
                options={radioGroup}
                CardLayout={NucleosCard}
            />
            
        </AdaptableCard>
    )
}

export default Nucleos
