import '@inovua/reactdatagrid-community/index.css'
import moment from 'moment'
import 'moment/locale/pt-br'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros'

moment.locale('pt-br')

type Props = {
    idnucleo: number
}

const activeValue = [
    { name: 'Ativo', value: 'S' },
    { name: 'Inativo', value: 'N' },
]

const columns = [
    {
        name: 'iduf',
        header: 'UF',
        type: 'select',
        value: '',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: estadosBrasileiros.map((state) => {
                return { id: state.sigla, label: state.sigla }
            }),
        },
    },
    {
        name: 'nmcidade',
        header: 'Cidade',
        type: 'string',
    },
    {
        name: 'nucnpjcpf',
        header: 'CNPJ',
        defaultFlex: 1.5,
        type: 'string',
    },
    {
        name: 'nmfantasia',
        header: 'Nome fantasia',
        type: 'string',
        value: '',
    },
    {
        name: 'lista_contatos',
        header: 'Empresario/Diretor',
        type: 'string',
    },
    {
        name: 'empresa.flativo',
        header: 'Status',
        type: 'select',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: activeValue.map((option) => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ value }: any) => (
            <div className="flex items-center justify-center">
                <TagActiveInative value={value} activeText="S" />
            </div>
        ),
    },
    {
        name: 'data_alteracao',
        header: 'Data Vínculo',
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
        name: 'empresa_ativa',
        header: 'Vínculo',
        type: 'select',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: activeValue.map((option) => {
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

const NucleosEmpresas = ({ idnucleo }: Props) => {
    return (
        <div className="mt-4">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Empresas Vinculadas</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Link
                        download
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/data/product-list.csv"
                        target="_blank"
                    >
                        <Button block size="xs" icon={<HiDownload />}>
                            Exportar
                        </Button>
                    </Link>
                </div>
            </div>
            <CustomReactDataGrid
                filename={`Empresas Vinculadas - Núcleo ${idnucleo}`}
                columns={columns}
                url={`${
                    import.meta.env.VITE_API_URL
                }/nucleos/empresas-vinculadas/${idnucleo}`}
            />
        </div>
    )
}

export default NucleosEmpresas
