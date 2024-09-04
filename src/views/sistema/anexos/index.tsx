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

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { EmpresasCard } from '@/components/shared/TableCards/EmpresasCard'

moment.locale('pt-br')

const tipoValue = [
    { name: 'Aguardando aprovação', value: 'aa', color: 'yellow-600' },
    { name: 'Aprovado', value: 'ap', color: 'green-600' },
    { name: 'Não se aplica', value: null, color: 'orange-600' },
    { name: 'Recusado', value: 'rc', color: 'red-600' },
]

const columns = [
    {
        name: 'id',
        header: 'ID',
        columnName: 'empresa.idempresa',
        type: 'number',
        defaultFlex: 0.6,
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
                    to={`${
                        import.meta.env.VITE_PHP_URL
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
        render: ({ value }) => (
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
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'DD-MM-YYYY',
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
        name: 'status',
        header: 'Status',
        type: 'select',
        operator: 'equals',
        value: '',
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
        name: 'vencimento',
        header: 'Vencimento',
        defaultFlex: 1,
        dateFormat: 'DD-MM-YYYY',
        type: 'date',
        operator: 'after',
        value: '',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'DD-MM-YYYY',
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
]

const Anexos = () => {

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Anexos</h3>
                {/* <div style={{ height: 80 }} >Current filterValue: {filterValue ? <code>{JSON.stringify(filterValue, null, 2)}</code>: 'none'}.</div> */}
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${
                                import.meta.env.VITE_PHP_URL
                            }/sistema/anexo/`}
                        >
                            Versão antiga
                        </Link>
                    </Button>
                    <Link
                        download
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/data/product-list.csv"
                        target="_blank"
                    ></Link>
                    {/* <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to="/app/sales/product-new"
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Adicionar Anexo
                        </Button>
                    </Link> */}
                </div>
            </div>
            <CustomReactDataGrid
                filename="Anexos"
                columns={columns}
                //defaultFilterValue={defaultFilterValue}
                url={`${
                    import.meta.env.VITE_API_URL
                }/anexo`}
                CardLayout={EmpresasCard}
            />
        </AdaptableCard>
    )
}

export default Anexos
