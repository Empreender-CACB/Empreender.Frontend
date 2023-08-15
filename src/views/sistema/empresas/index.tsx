/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import '@inovua/reactdatagrid-community/theme/green-light.css'
import '@inovua/reactdatagrid-community/theme/blue-light.css'
import Radio from '@/components/ui/Radio'

import {
    HiDownload,
    HiOutlineReply,
    HiPlusCircle,
} from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

moment.locale('pt-br')

const columns = [
    { name: 'idempresa', header: 'ID', type: 'string' },
    {
        name: 'nmfantasia',
        header: 'Nome',
        defaultFlex: 1.5,
        type: 'Nome',
        render: ({ data }: any) => (
            <div>
                <Link to={`/sistema/empresas/${data.idempresa}`}>
                    {data.nmfantasia}
                </Link>
            </div>
        ),
    },
    { name: 'nucnpjcpf', header: 'CNPJ', defaultFlex: 1 },
    {
        name: 'dtultimaalteracao',
        header: 'Última Alteração',
        defaultFlex: 1,
        dateFormat: 'MM-DD-YYYY',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'MM-DD-YYYY',
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
    { name: 'nmramoativ', header: 'Ramo', defaultFlex: 1 },
]

const defaultFilterValue = [
    {
        name: 'idempresa',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    {
        name: 'nmfantasia',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    { name: 'nucnpjcpf', operator: 'contains', type: 'string', value: '' },
    { name: 'dtultimaalteracao', operator: 'after', type: 'date', value: '' },
    {
        name: 'nmramoativ',
        operator: 'contains',
        type: 'string',
        value: '',
    },
    { name: 'valor_antigo', operator: 'contains', type: 'string', value: '' },
]

const Empresas = () => {

    const radioGroup = (
        <Radio.Group className="pb-4 lg:mb-0">
            <span className="pr-2">Nome: </span>
            <Radio value={'nmfantasia'}>Fantasia</Radio>
            <Radio value={'nurazaosocial'}>Razão Social </Radio>
        </Radio.Group>
    );

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Empresas</h3>
                {/* <div style={{ height: 80 }} >Current filterValue: {filterValue ? <code>{JSON.stringify(filterValue, null, 2)}</code>: 'none'}.</div> */}
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_API_URL}/sistema/empresa/`}
                        >
                            Visualizar versão antiga
                        </Link>
                    </Button>
                    <Link
                        download
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/data/product-list.csv"
                        target="_blank"
                    >
                        <Button block size="sm" icon={<HiDownload />}>
                            Exportar
                        </Button>
                    </Link>
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
                            Adicionar empresa
                        </Button>
                    </Link>
                </div>
            </div>

            <CustomReactDataGrid
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/empresas`}
                options={radioGroup}
            />
            
        </AdaptableCard>
    )
}

export default Empresas
