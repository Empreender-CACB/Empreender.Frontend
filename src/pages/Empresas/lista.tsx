import { Fragment } from 'react'
//import 'semantic-ui-css/semantic.min.css'
import { Menu, Popover, Transition } from '@headlessui/react'
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/20/solid'
import {
  ViewColumnsIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import '@inovua/reactdatagrid-community/index.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'api/axios'
import PageSection from 'components/PageSection'
import Loading from 'components/Loading'
//import Moment from 'react-momentsss'
import moment from 'moment'
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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Empresas() {
  const [faqList, setFaqList] = useState([])
  const [loading, setLoading] = useState([])
  const [gridRef, setGridRef] = useState(null)
  const [filterValue, setFilterValue] = useState(defaultFilterValue)

  useEffect(() => {
    axios({
      method: 'get',
      url: '/empresas'
    })
      .then((res) => {
        setFaqList(res.data)
        setLoading(false)
      })
      .catch((error) => {
        // handle any rejected Promises or errors, etc...
      })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div style={{ height: 80 }}>
        Current filterValue:{' '}
        {filterValue ? (
          <code>{JSON.stringify(filterValue, null, 2)}</code>
        ) : (
          'none'
        )}
        .
      </div>

      <PageSection title="Lista de Empresas">
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
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <ReactDataGrid
                i18n={i18n}
                handle={setGridRef}
                enableFiltering={true}
                defaultFilterValue={defaultFilterValue}
                idProperty="idempresa"
                columns={columns}
                paginante
                pagination="local"
                defaultLimit={30}
                onFilterValueChange={setFilterValue}
                dataSource={faqList}
                style={gridStyle}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
