import 'semantic-ui-css/semantic.min.css'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import PageSection from 'components/PageSection'
import moment from 'moment'
import { useAPI } from 'hooks/useApi'
import Loading from 'components/Loading'
import { userInfo } from 'os'
import { api } from 'services/api'

window.moment = moment

const downloadBlob = (blob, fileName = 'Empresas.csv') => {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.position = 'absolute'
  link.style.visibility = 'hidden'

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)
}
const SEPARATOR = ','

const columns = [
  { name: 'idempresa', header: 'ID', type: 'string' },
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
  { name: 'nucnpjcpf', header: 'CNPJ', defaultFlex: 1 },
  {
    name: 'ramoAtividade',
    header: 'Ramo',
    defaultFlex: 1,
    render: ({ data }) => (
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {data.ramoAtividade?.nmramoativ}
      </div>
    )
  },
  {
    name: 'dtinicioatividade',
    header: 'Inicio da Atividade',
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
      moment(value).format(dateFormat) === 'Invalid date'
        ? '-'
        : moment(value).format(dateFormat)
  }
]
const defaultFilterValue = [
  {
    name: 'idempresa',
    operator: 'contains',
    type: 'string',
    value: ''
  },
  {
    name: 'nmfantasia',
    operator: 'contains',
    type: 'string',
    value: ''
  },
  { name: 'nucnpjcpf', operator: 'contains', type: 'string', value: '' },
  {
    name: 'ramoAtividade',
    operator: 'contains',
    type: 'string',
    value: ''
  },
  { name: 'valor_antigo', operator: 'contains', type: 'string', value: '' },
  { name: 'dtinicioatividade', operator: 'after', type: 'date', value: '' }
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

const loadData = ({ skip, limit, sortInfo, groupBy, filterValue }) => {
  return fetch(
    'https://cacbempreenderapp.org.br/api/empresas' +
      '?skip=' +
      skip +
      '&limit=' +
      limit +
      (groupBy && groupBy.length ? '&groupBy=' + groupBy : '') +
      '&sortInfo=' +
      JSON.stringify(sortInfo) +
      '&filterBy=' +
      JSON.stringify(filterValue)
  ).then((response) => {
    const totalCount = response.headers.get('X-Total-Count')
    return response.json().then((data) => {
      return { data: data.data, count: data.meta.total }
    })
  })
}

export default function Empresas() {
  const [gridRef, setGridRef] = useState(null)

  const exportCSV = () => {
    const columns = gridRef.current.visibleColumns

    const header = columns.map((c) => c.name).join(SEPARATOR)
    const rows = gridRef.current.data.map((data) =>
      columns.map((c) => data[c.id]).join(SEPARATOR)
    )

    const contents = [header].concat(rows).join('\n')
    const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' })

    downloadBlob(blob)
  }

  const [filterValue, setFilterValue] = useState(defaultFilterValue)
  const dataSource = useCallback(loadData, [])
  const [sortInfo, setSortInfo] = useState([])

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
            onClick={exportCSV}
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
                handle={setGridRef}
                i18n={i18n}
                enableFiltering={true}
                defaultFilterValue={defaultFilterValue}
                idProperty="idempresa"
                columns={columns}
                paginante
                pagination
                dataSource={dataSource}
                onSortInfoChange={setSortInfo}
                onFilterValueChange={setFilterValue}
                style={gridStyle}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
