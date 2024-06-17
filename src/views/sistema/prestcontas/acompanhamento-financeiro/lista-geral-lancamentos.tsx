/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'

import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { EmpresasCard } from '@/components/shared/TableCards/EmpresasCard'

moment.locale('pt-br')


const activeValue = [
    { name: 'Ativa', value: 'S' },
    { name: 'Inativa', value: 'N' },
]

const statusStyles: any = {
    'cadas': { label: 'Cadastrado', class: 'bg-yellow-400 text-white' },
    'inici': { label: 'Iniciado', class: 'bg-purple-500 text-white' },
    'andam': { label: 'Em Andamento', class: 'bg-blue-500 text-white' },
    'concl': { label: 'Concluído', class: 'bg-green-500 text-white' },
    'cance': { label: 'Cancelado', class: 'bg-red-500 text-white' },
    'desco': { label: 'Descartado', class: 'bg-gray-400 text-white' },
    'bloqu': { label: 'Bloqueado', class: 'bg-gray-500 text-white' },
    'nselc': { label: 'Não Selecionado', class: 'bg-gray-300 text-white' },
}

const lancamentoStatusStyles: any = {
    'nov': { label: 'Novo', class: 'bg-blue-400 text-white' },
    'lib': { label: 'Liberado', class: 'bg-green-400 text-white' },
    'apr': { label: 'Aprovado', class: 'bg-purple-400 text-white' },
    'pag': { label: 'Encerrado', class: 'bg-green-500 text-white' },
    'pen': { label: 'Pendente', class: 'bg-yellow-400 text-white' },
    'ana': { label: 'Análise', class: 'bg-orange-400 text-white' },
    'rea': { label: 'Reanálise', class: 'bg-red-400 text-white' },
}


const projetoStatusValue = [
    { name: 'Cadastrado', value: 'cadas' },
    { name: 'Iniciado', value: 'inici' },
    { name: 'Em Andamento', value: 'andam' },
    { name: 'Concluído', value: 'concl' },
    { name: 'Cancelado', value: 'cance' },
    { name: 'Descartado', value: 'desco' },
    { name: 'Bloqueado', value: 'bloqu' },
]

const lancamentoStatusValue = [
    { name: 'Novo', value: 'nov' },
    { name: 'Liberado', value: 'lib' },
    { name: 'Aprovado', value: 'apr' },
    { name: 'Encerrado', value: 'pag' },
    { name: 'Pendente', value: 'pen' },
    { name: 'Análise', value: 'ana' },
    { name: 'Reanálise', value: 'rea' },
]

const tipoLancValue = [
    { name: 'Receita', value: 'recei' },
    { name: 'Despesa', value: 'despe' }
]

const StatusTag: React.FC<{ statusKey: string }> = ({ statusKey }) => {
    const statusInfo = statusStyles[statusKey] || { label: 'Indefinido', class: 'bg-gray-200 text-black' }
    return (
        <div className={`border-0 rounded-md text-center px-2 py-1 ${statusInfo.class}`}>
            {statusInfo.label}
        </div>
    )
}

const LancamentoStatusTag: React.FC<{ statusKey: string }> = ({ statusKey }) => {
    const statusInfo = lancamentoStatusStyles[statusKey] || { label: 'Indefinido', class: 'bg-gray-200 text-black' }
    return (
        <div className={`border-0 rounded-md text-center px-2 py-1 ${statusInfo.class}`}>
            {statusInfo.label}
        </div>
    )
}


const columns = [
    {
        name: 'idlanc',
        header: 'ID Lancamento',
        columnName: 'idlanc',
        type: 'string',
        defaultFlex: 0.6,
        operator: 'contains',
        value: "",
        render: ({ data }: any) => {
            const idLanc = data['prlancamento.idlanc'];
            const idProjeto = data['prlancamento.idprojeto'];

            if (data['prlancamento.tplanc'] == 'recei') {
                return (
                    <div>
                        <Link target='_blank' to={`${import.meta.env.VITE_PHP_URL}/sistema/prestcontas/lancamento-receita-detalhe/pid/${btoa(String(idProjeto))}/lid/${btoa(String(idLanc))}`}>
                            {data.idlanc}
                        </Link>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Link target='_blank' to={`${import.meta.env.VITE_PHP_URL}/sistema/prestcontas/lancamento-despesa-detalhe/pid/${btoa(String(idProjeto))}/lid/${btoa(String(idLanc))}`}>
                            {data.idlanc}
                        </Link>
                    </div>
                )
            }
           
        },
    },
    {
        name: 'prlancamento.idprojeto',
        header: 'ID Projeto',
        columnName: 'prlancamento.idprojeto',
        type: 'string',
        defaultFlex: 0.6,
        operator: 'contains',
        value: "",
        render: ({ data }: any) => {
            const idProjeto = data['prlancamento.idprojeto'];
            return (
                <div>
                    <Link target='_blank' to={`${import.meta.env.VITE_PHP_URL}/sistema/prestcontas/projeto-detalhe/pid/${btoa(String(idProjeto))}`}>
                        {idProjeto}
                    </Link>
                </div>
            )
        },
    },
    {
        name: 'nmprojeto',
        header: 'Projeto',
        columnName: 'prprojeto.nmprojeto',
        type: 'string',
        operator: 'contains',
        value: '',
        render: ({ data }: any) => {
            const idProjeto = data['prlancamento.idprojeto'];
            return (
                <div>
                    <Link target='_blank' to={`${import.meta.env.VITE_PHP_URL}/sistema/prestcontas/projeto-detalhe/pid/${btoa(String(idProjeto))}`}>
                        {data.nmprojeto}
                    </Link>
                </div>
            )
        },
    },
    {
        name: 'nmacao',
        header: 'Ação',
        columnName: 'pracao.nmacao',
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'dtlanc',
        header: 'Data',
        columnName: 'prlancamento.dtlanc',
        defaultFlex: 1,
        dateFormat: 'DD-MM-YYYY',
        type: 'date',
        operator: 'after',
        value: '',
        filterEditor: DateFilter,
        filterEditorProps: ({ index }: any) => {
            return {
                dateFormat: 'DD-MM-YYYY',
                placeholder: index === 1 ? 'A data é anterior à...' : 'A data é posterior à',
            }
        },
        render: ({ value, cellProps: { dateFormat } }: any) =>
            moment(value).format(dateFormat) === 'Invalid date'
                ? '-'
                : moment(value).format(dateFormat),
    },
    {
        name: 'tplanc',
        header: 'Tipo',
        columnName: 'prlancamento.tplanc',
        type: 'select',
        operator: 'equals',
        value: '',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: tipoLancValue.map((option) => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ data }: any) => data['tplanc'] == 'recei' ? "Receita" : "Despesa",

    },
    {
        name: 'prlancamento.stlancamento',
        header: 'Status Lançamento',
        columnName: 'prlancamento.stlancamento',
        defaultFlex: 1,
        type: 'select',
        operator: 'equals',
        value: '',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: lancamentoStatusValue.map((option) => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ data }: any) => <LancamentoStatusTag statusKey={data.stlancamento} />,
    },
    {
        name: 'prlancamento.vllanc',
        header: 'Valor',
        columnName: 'prlancamento.vllanc',
        type: 'number',
        defaultFlex: 1,
        operator: 'eq',
        value: '',
        filterEditor: NumberFilter,
        style: { textAlign: 'right' },
        render: ({ data }: any) => {
            const formattedValue = new Intl.NumberFormat('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(data.vllanc);
            const color = data.vllanc < 0 ? 'red' : 'black';
            return <div style={{ textAlign: 'right', color }}>{formattedValue}</div>;
        },
    },
    {
        name: 'flecofin',
        header: 'E/F',
        columnName: 'prlancamento.flecofin',
        type: 'string',
        operator: 'contains',
        value: '',
        render: ({ data }: any) => data == 'fin' ? "Financeiro" : "Econômico",
    },
    {
        name: 'idprojeto_projeto_base',
        header: 'PJ Base',
        columnName: 'prprojeto.id_projeto_base',
        type: 'string',
        defaultFlex: 0.6,
        operator: 'contains',
        value: "",
    },
    {
        name: 'tipo_projeto',
        header: 'Tipo Projeto',
        columnName: 'prprojeto.tipo_projeto',
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'prprojeto.flstatus',
        header: 'Status Projeto',
        columnName: 'prprojeto.flstatus',
        defaultFlex: 1,
        type: 'select',
        operator: 'equals',
        value: '',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: projetoStatusValue.map((option) => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ data }: any) => <StatusTag statusKey={data.flstatus} />,
    },
]

const Empresas = () => {

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Lista geral de lançamentos</h3>
            </div>
            <CustomReactDataGrid
                filename="Lançamentos"
                columns={columns}
                url={`${import.meta.env.VITE_API_URL}/prestcontas/lista-geral-lancamentos`}
                CardLayout={EmpresasCard}
                defaultSortInfo={{ "dir": -1, "id": "idlanc", "name": "idlanc", "columnName": "idlanc", "type": "string" }}
            />
        </AdaptableCard>
    )
}

export default Empresas
