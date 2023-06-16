import { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/20/solid'
import {
  ViewColumnsIcon,
  BellIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import '@inovua/reactdatagrid-community/index.css'
import { useEffect, useState } from 'react'
import Navbar from 'components/Navbar'
import axios from 'api/axios'
//import Moment from 'react-moment'
import moment from 'moment'
import { Outlet } from 'react-router-dom'
window.moment = moment

const user = {
  name: 'César Augusto',
  email: 'cesarisadog@gmail.com',
  imageUrl:
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80'
}
const navigation = [
  { name: 'Início', href: '#' },
  { name: 'Empresas', href: '#' }
]
const breadcrumbs = [{ name: 'Sistema', href: '#', current: true }]
const userNavigation = [
  { name: 'Meu Perfil', href: '#' },
  { name: 'Configurações', href: '#' },
  { name: 'Sair', href: '#' }
]
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
      <Navbar></Navbar>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
            <Popover className="flex h-16 justify-between">
              <div className="flex px-2 lg:px-0">
                <div className="flex shrink-0 items-center">
                  <a href="#">
                    <img
                      className="h-8 w-auto"
                      src="https://www.empreender.org.br/css/sistema/login/images/empreender-unir-para-crescer.jpg"
                      alt="Empreender"
                    />
                  </a>
                </div>
                <nav
                  aria-label="Global"
                  className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4"
                >
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium text-gray-900"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Pesquisar
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 shadow-sm placeholder:text-gray-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:placeholder:text-gray-400 sm:text-sm"
                      placeholder="Pesquisar"
                      type="search"
                    />
                  </div>
                </div>
              </div>{' '}
              <div className="flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  <ViewColumnsIcon
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />
                </Popover.Button>
              </div>
              <Transition.Root as={Fragment}>
                <div className="lg:hidden">
                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay
                      className="fixed inset-0 z-20 bg-black bg-opacity-25"
                      aria-hidden="true"
                    />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Popover.Panel
                      focus
                      className="absolute top-0 right-0 z-30 w-full max-w-none origin-top p-2 transition"
                    >
                      <div className="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="pt-3 pb-2">
                          <div className="flex items-center justify-between px-4">
                            <div>
                              <img
                                className="h-8 w-auto"
                                src="https://teste.cacbempreenderapp.org.br/css/sistema/novo_css/img/logo-icon-empreender.png"
                                alt="Empreender"
                              />
                            </div>
                            <div className="-mr-2">
                              <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </Popover.Button>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1 px-2">
                            {navigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 pb-2">
                          <div className="flex items-center px-5">
                            <div className="shrink-0">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.imageUrl}
                                alt=""
                              />
                            </div>
                            <div className="ml-3">
                              <div className="text-base font-medium text-gray-800">
                                {user.name}
                              </div>
                              <div className="text-sm font-medium text-gray-500">
                                {user.email}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              <span className="sr-only">
                                View notifications
                              </span>
                              <BellIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                          <div className="mt-3 space-y-1 px-2">
                            {userNavigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800"
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
              <div className="hidden lg:ml-4 lg:flex lg:items-center">
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </Popover>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="border-t border-gray-200 py-3">
              <nav className="flex" aria-label="Breadcrumb">
                <div className="flex sm:hidden">
                  <a
                    href="#"
                    className="group inline-flex space-x-3 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeftIcon
                      className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600"
                      aria-hidden="true"
                    />
                    <span>Voltar</span>
                  </a>
                </div>
                <div className="hidden sm:block">
                  <ol role="list" className="flex items-center space-x-4">
                    <li>
                      <div>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <HomeIcon
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Home</span>
                        </a>
                      </div>
                    </li>
                    {breadcrumbs.map((item) => (
                      <li key={item.name}>
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 shrink-0 text-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                          </svg>
                          <a
                            href={item.href}
                            className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            </div>
          </div>
        </header>

        <main className="py-10">
          <Outlet />
        </main>
      </div>
    </>
  )
}
