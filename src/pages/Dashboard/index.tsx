import ReactDataGrid from '@inovua/reactdatagrid-community'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import '@inovua/reactdatagrid-community/index.css'
import { useEffect, useState } from 'react'
import Navbar from 'components/Navbar'
import axios from 'api/axios'
//import Moment from 'react-moment'
import moment from 'moment'
import { Outlet } from 'react-router-dom'
import Footer from 'components/Footer'
import CookiesAlert from 'components/CookiesAlert'
window.moment = moment

const breadcrumbs = [{ name: 'Sistema', href: '#', current: true }]

const columns = [
  { name: 'idfaq', header: 'ID', maxWidth: 60, type: 'number' },
  { name: 'cdsistema', header: 'Módulo', defaultFlex: 1 },
  { name: 'cdmodulo', header: 'Submódulo', defaultFlex: 1 },
  { name: 'txpergunta', header: 'Pergunta', maxWidth: 1000, defaultFlex: 2 },
  {
    name: 'dtcadastro',
    header: 'Cadastro',
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
  { name: 'cdsistema', operator: 'contains', type: 'string', value: '' },
  { name: 'cdmodulo', operator: 'contains', type: 'string', value: '' },
  { name: 'txpergunta', operator: 'contains', type: 'string', value: '' },
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
  empty: 'Vazio',
  lt: 'Menor que',
  lte: 'Menor ou igual a',
  gt: 'Maior que',
  gte: 'Maior ou igual a',
  calendar: {
    todayButtonText: 'Hoje',
    clearButtonText: 'Limpar',
    okButtonText: 'OK',
    cancelButtonText: 'Cancelar'
  }
})
const gridStyle = { minHeight: 750 }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [faqList, setFaqList] = useState([])

  useEffect(() => {
    axios({
      method: 'get',
      url: '/faq'
    })
      .then((res) => {
        // Update state

        setFaqList(res.data.data)
        console.log(res.data.data)
      })
      .catch((error) => {
        // handle any rejected Promises or errors, etc...
      })
  }, [])

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl pt-5 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Footer />
      {/*       <CookiesAlert />
       */}{' '}
    </>
  )
}
