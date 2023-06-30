import 'semantic-ui-css/semantic.min.css'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PageSection from 'components/PageSection'
import moment from 'moment'
import { useAPI } from 'hooks/useApi'
import Loading from 'components/Loading'
import { userInfo } from 'os'
import { api } from 'services/api'

window.moment = moment

const columns = [
  { name: 'idempresa', header: 'ID', maxWidth: 60, type: 'number' },
  {
    name: 'nmfantasia',
    header: 'Nome Fantasia',
    defaultFlex: 2,
    type: 'Nome',
    render: ({ value, data }) => (
      <div>
        <Link to={'/empresas/' + data.idempresa}>{data.nmfantasia}</Link>
      </div>
    )
  },
  { name: 'valor_novo', header: '-', defaultFlex: 1 },

  {
    name: 'dtcadastro',
    header: 'Data',
    defaultFlex: 1,
    // need to specify dateFormat
    dateFormat: 'YYYY-MM-DD',
    filterEditor: DateFilter,
    filterEditorProps: (props, { index }) => {
      return {
        dateFormat: 'MM-DD-YYYY',
        placeholder:
          index == 1 ? 'A data é anterior à...' : 'A data é posterior à'
      }
    },
    render: ({ value, cellProps: { dateFormat } }) =>
      moment(value).format(dateFormat)
  }
]
const defaultFilterValue = [
  { name: 'nmfantasia', operator: 'contains', type: 'string', value: '' },
  { name: 'valor_novo', operator: 'contains', type: 'string', value: '' },
  { name: 'valor_antigo', operator: 'contains', type: 'string', value: '' },
  { name: 'dtcadastro', operator: 'after', type: 'date', value: '' }
]

const i18n = Object.assign({}, ReactDataGrid.defaultProps.i18n, {
  pageText: 'Página ',
  ofText: ' de ',
  perPageText: 'Resultados por página',
  showingText: 'Mostrando ',
  clearAll: 'Limpar tudo',
  clear: 'Limpar',
  showFilteringRow: 'Mostrar linha de filtragem',
  hideFilteringRow: 'Esconder linha de filtragem',
  dragHeaderToGroup: 'Arraste o cabeçalho para agrupar',
  disable: 'Desabilitar',
  enable: 'Habilitar',
  sortAsc: 'Ordenar em ordem ascendente',
  sortDesc: 'Ordenar em ordem descendente',
  unsort: 'Remover ordenação',
  group: 'Agrupar',
  ungroup: 'Desagrupar',
  lockStart: 'Fixar início',
  lockEnd: 'Fixar fim',
  unlock: 'Desafixar',
  columns: 'Colunas',
  contains: 'Contém',
  startsWith: 'Começa com',
  endsWith: 'Termina com',
  notContains: 'Não contém',
  neq: 'Diferente',
  eq: 'Igual',
  notEmpty: 'Não vazio',
  beforeOrOn: 'Antes de',
  afterOrOn: 'A partir de',
  after: 'Após',
  empty: 'Vazio',
  inrange: 'No intervalo',
  notinrange: 'Fora do intervalo',
  lt: 'Menor que',
  lte: 'Menor ou igual a',
  gt: 'Maior que',
  gte: 'Maior ou igual a',
  'calendar.todayButtonText': 'Hoje',
  calendar: {
    todayButtonText: 'Hoje1',
    clearButtonText: 'Limpar',
    okButtonText: 'OK',
    cancelButtonText: 'Cancelar'
  }
})
const gridStyle = { minHeight: 750 }

export default function Empresas() {
  const [filterValue, setFilterValue] = useState(defaultFilterValue)

  // const { data } = useAPI({
  //   url: '/empresas'
  // })

  const [empresas, setEmpresas] = useState([])

  useEffect(() => {
    async function fetchEmpresas() {
      const { data } = await api.get('/empresas')

      setEmpresas(data)
    }

    fetchEmpresas()
  }, [])

  if (!empresas) {
    return <Loading />
  }

  return (
    <>
      <PageSection title="Empresas">
        <>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Exportar Tabela
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Adicionar Empresa
          </button>
        </>
      </PageSection>
      <div className="min-h-full">
        <main className="py-10">
          <div className="pb-16">
            {' '}
            <div className="mx-auto max-w-full ">
              <ReactDataGrid
                i18n={i18n}
                enableFiltering={true}
                defaultFilterValue={defaultFilterValue}
                idProperty="idempresa"
                columns={columns}
                paginante
                pagination="local"
                defaultLimit={30}
                onFilterValueChange={setFilterValue}
                dataSource={empresas}
                style={gridStyle}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
