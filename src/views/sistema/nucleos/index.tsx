import '@inovua/reactdatagrid-community/index.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import Radio from '@/components/ui/Radio'
import { FaQuestion } from "react-icons/fa"
import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button, Tooltip } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import { FcInfo } from 'react-icons/fc'
import  estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros'
import { NucleosCard } from '@/components/shared/TableCards/NucleosCard'

moment.locale('pt-br')
const activeValue = [
    { name: 'Ativo', value: 'S' },
    { name: 'Inativo', value: 'N' },
]

const columns = [
    { name: 'idnucleo',
      header: 'ID',
      type: 'number',
      defaultFlex: 0.3,
      render: ({ data }: any) => {
        const text = data.idnucleo
        
        const linkTo = `${import.meta.env.VITE_PHP_URL}/sistema/nucleo/detalhe/nid/${btoa(String(data.idnucleo))}`
        
        return (
            <div>
            <Link to={linkTo}>
                {text}
            </Link>
        </div>
    )}
    },
    {
        name: 'iduf',
        header: 'UF',
        type: 'select',
        value: '',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: estadosBrasileiros.map(state => {
                return { id: state.sigla, label: state.sigla }
            }),
        },
        defaultFlex: 0.3,
    },
    {
        name: 'nmcidade', header: 'Cidade', type: 'string', operator:'contains'
    },
    {
        name: 'nmnucleo',
        header: 'Núcleo',
        defaultFlex: 1.5,
        type: 'string',
        render: ({ data }: any) => {
            const text = data.nmnucleo
            
            const linkTo = `${import.meta.env.VITE_PHP_URL}/sistema/nucleo/detalhe/nid/${btoa(String(data.idnucleo))}`
            
            return (
                <div>
                <Link to={linkTo}>
                    {text}
                </Link>
            </div>
        )}
    },
    {
        name: 'dssegmento',
        header: 'Segmento',
        type: 'string',
        defaultFlex: 1,
    },
    {
        name: 'dtultimaalteracao',
        header: 'Última Alteração',
        defaultFlex: 0.5,
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
        name: 'nucleo.flativo', header: 'Status', type: 'select',
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
        defaultFlex: 0.4,
    },
]

const defaultFilterValue = [
    {
        name: 'idnucleo',
        type: 'number',
        operator: 'eq',
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
        <div className="flex items-center">
            <Radio.Group className="lg:mb-0 flex items-center" value={nameValue} onChange={onChange}>
                <span className="pr-2 font-black">Mostrar Todos</span>
                <Tooltip
                    placement="top"
                    title={
                        <div>
                            Assinale a caixa para apresentação de todos os núcleos cadastrados. Observe a situação do filtro Status.
                        </div>
                    }
                >
                    <FcInfo size={20}/>
                </Tooltip>
                <Radio value={'todos'} className="ml-2" />
            </Radio.Group>
        </div>
    );
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
            <div className="flex items-center">
                <h3 className="mb-4 lg:mb-0">Núcleos</h3>
                <Tooltip title="Para saber mais sobre o uso da Lista de Núcleos clique aqui" placement="right-end">
                <Button
                    shape="circle"
                    size="xs"
                    icon={<FaQuestion />}
                    className="ml-2"
                    onClick={() => {
                        window.open('https://www.empreender.org.br/sistema/anexo/download-anexo/aid/ODMz')
                    }}
                    />
                </Tooltip>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">

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
