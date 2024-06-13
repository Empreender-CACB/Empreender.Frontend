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
  
  const columns = [
    {
      name: 'prlancamento.idlanc',
      header: 'ID Lancamento',
      columnName: 'prlancamento.idlanc',
      type: 'number',
      defaultFlex: 0.6,
      filterEditor: NumberFilter,
    },
    {
      name: 'prlancamento.idprojeto',
      header: 'ID Projeto',
      columnName: 'prlancamento.idprojeto',
      type: 'number',
      defaultFlex: 0.6,
      filterEditor: NumberFilter,
    },
    {
      name: 'prprojeto.nmprojeto',
      header: 'Nome Projeto',
      columnName: 'prprojeto.nmprojeto',
      type: 'string',
      operator: 'contains',
      value: '',
    },
    {
      name: 'pracao.nmacao',
      header: 'Nome Ação',
      columnName: 'pracao.nmacao',
      type: 'string',
      operator: 'contains',
      value: '',
    },
    {
      name: 'prlancamento.dtlanc',
      header: 'Data Lançamento',
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
      name: 'prlancamento.tplanc',
      header: 'Tipo Lançamento',
      columnName: 'prlancamento.tplanc',
      type: 'string',
      operator: 'contains',
      value: '',
    },
    {
      name: 'prlancamento.stlancamento',
      header: 'Status Lançamento',
      columnName: 'prlancamento.stlancamento',
      type: 'select',
      operator: 'equals',
      value: '',
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
      name: 'prlancamento.vllanc',
      header: 'Valor Lançamento',
      columnName: 'prlancamento.vllanc',
      type: 'number',
      defaultFlex: 1,
      filterEditor: NumberFilter,
    },
    {
      name: 'prlancamento.flecofin',
      header: 'Econômico Financeiro',
      columnName: 'prlancamento.flecofin',
      type: 'string',
      operator: 'contains',
      value: '',
    },
    {
      name: 'prprojeto.id_projeto_base',
      header: 'ID Projeto Base',
      columnName: 'prprojeto.id_projeto_base',
      type: 'number',
      defaultFlex: 0.6,
      filterEditor: NumberFilter,
    },
    {
      name: 'prprojeto.tipo_projeto',
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
      type: 'select',
      operator: 'equals',
      value: '',
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
            />
        </AdaptableCard>
    )
}

export default Empresas
