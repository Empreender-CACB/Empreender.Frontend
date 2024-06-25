/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'

import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'
import { LancamentosCard } from '@/components/shared/TableCards/LancamentosCard'

moment.locale('pt-br')

// const statusStyles: any = {
//     'inici': { label: 'A iniciar', class: 'bg-purple-500 text-white' },
//     'cadas': { label: 'Em cadastramento', class: 'bg-yellow-400 text-white', style: {backgroundColor: '#990099'} },
//     'andam': { label: 'Em andamento', class: 'bg-blue-500 text-white' },
//     'concl': { label: 'Concluído', class: 'bg-green-500 text-white' },
//     'cance': { label: 'Cancelado', class: 'bg-red-500 text-white' },
//     'desco': { label: 'Descartado', class: 'bg-gray-400 text-white' },
//     'bloqu': { label: 'Bloqueado', class: 'bg-gray-500 text-white' },
//     'nselc': { label: 'Não Selecionado', class: 'bg-gray-300 text-white' },
// };

const lancamentoStatusStyles: any = {
    'apr': { label: 'Aprovado', class: 'bg-teal-500 text-white' },
    'nov': { label: 'Novo', class: 'text-white', style: {backgroundColor: '#990099'}},
    'pen': { label: 'Pendente', class: 'bg-gray-500 text-white' },
    'ana': { label: 'Análise', class: 'text-white', style: {backgroundColor: '#3072B1'} },
    'rea': { label: 'Reanálise', class: 'text-white', style: {backgroundColor: '#3072B1'} },
    'lib': { label: 'Liberado', class: 'text-white', style: {backgroundColor: '#FF9900'} },
    'pag': { label: 'Encerrado', class: 'text-white', style: {backgroundColor: '#009B56'}}
};


// const projetoStatusValue = [
//     { name: 'A iniciar', value: 'inici' },
//     { name: 'Em cadastramento', value: 'cadas' },
//     { name: 'Em andamento', value: 'andam' },
//     { name: 'Concluído', value: 'concl' },
//     { name: 'Cancelado', value: 'cance' },
//     { name: 'Descartado', value: 'desco' },
//     { name: 'Bloqueado', value: 'bloqu' },
// ]

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

// const tipoProjetoValue = [
//     { name: 'Apoiado', value: 'APOIADO' },
//     { name: 'Base', value: 'BASE' }
// ]

const tipoEcoFinValue = [
    { name: 'Econômico', value: 'eco' },
    { name: 'Financeiro', value: 'fin' }
]

// const StatusTag: React.FC<{ statusKey: string }> = ({ statusKey }) => {
//     const statusInfo = statusStyles[statusKey] || { label: 'Indefinido', class: 'bg-gray-200 text-black' }
//     return (
//         <div style={statusInfo.style} className={`border-0 rounded-md text-center px-2 py-1 ${statusInfo.class}`}>
//             {statusInfo.label}
//         </div>
//     )
// }

export const LancamentoStatusTag: React.FC<{ statusKey: string }> = ({ statusKey }) => {
    const statusInfo = lancamentoStatusStyles[statusKey] || { label: 'Indefinido', class: 'bg-gray-200 text-black' }
    return (
        <div style={statusInfo.style} className={`border-0 rounded-md text-center px-2 py-1 ${statusInfo.class}`}>
            {statusInfo.label}
        </div>
    )
}


const columns = [
    {
        name: 'idlanc',
        header: 'ID Lanc.',
        columnName: 'idlanc',
        type: 'number',
        defaultFlex: 0.4,
        operator: 'eq',
        value: "",
        render: ({ data }: any) => {
            const idLanc = data.idlanc;
            const idProjeto = data['prlancamento.idprojeto'];
            
            if (data.tplanc == 'recei') {
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
        header: 'ID Proj.',
        columnName: 'prlancamento.idprojeto',
        type: 'string',
        defaultFlex: 0.4,
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
        defaultFlex: 1,

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
        defaultFlex: 1,
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'dtlanc',
        header: 'Data',
        columnName: 'prlancamento.dtlanc',
        defaultFlex: 0.4,
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
        defaultFlex: 0.4,
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
        defaultFlex: 0.4,
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
        defaultFlex: 0.4,
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
        operator: 'equals',
        defaultFlex: 0.4,
        value: '',
        filterEditor: SelectFilter,
        filterEditorProps: {
            dataSource: tipoEcoFinValue.map((option) => {
                return { id: option.value, label: option.name }
            }),
        },
        render: ({ data }: any) => data.flecofin == 'fin' ? "Financeiro" : "Econômico",
    },
    {
        name: 'idprojeto_projeto_base',
        header: 'PJ Base',
        columnName: 'prprojeto.id_projeto_base',
        type: 'currency',
        numbersOnly: false,
        defaultFlex: 0.4,
        operator: 'eq',
        value: "",
    },
    // {
    //     name: 'tipo_projeto',
    //     header: 'Tipo Projeto',
    //     columnName: 'prprojeto.tipo_projeto',
    //     type: 'select',
    //     operator: 'equals',
    //     value: '',
    //     filterEditor: SelectFilter,
    //     filterEditorProps: {
    //         dataSource: tipoProjetoValue.map((option) => {
    //             return { id: option.value, label: option.name }
    //         }),
    //     },        
    // },
    // {
    //     name: 'prprojeto.flstatus',
    //     header: 'Status Projeto',
    //     columnName: 'prprojeto.flstatus',
    //     defaultFlex: 1,
    //     type: 'select',
    //     operator: 'equals',
    //     value: '',
    //     filterEditor: SelectFilter,
    //     filterEditorProps: {
    //         dataSource: projetoStatusValue.map((option) => {
    //             return { id: option.value, label: option.name }
    //         }),
    //     },
    //     render: ({ data }: any) => <StatusTag statusKey={data.flstatus} />,
    // },
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
                CardLayout={LancamentosCard}
                defaultSortInfo={{ "dir": -1, "id": "idlanc", "name": "idlanc", "columnName": "idlanc", "type": "string" }}
            />
        </AdaptableCard>
    )
}

export default Empresas
