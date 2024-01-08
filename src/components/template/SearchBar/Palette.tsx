import { Fragment, useState, Dispatch, SetStateAction } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ExclamationTriangleIcon, FolderIcon, LifebuoyIcon } from '@heroicons/react/24/outline'
import ApiService from '@/services/ApiService'
import axios from 'axios'
import { Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

type PaletteProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Palette({ open, setOpen }: PaletteProps) {
      const [rawQuery, setRawQuery] = useState('')
      const [nucleos, setNucleos] = useState('')
      const [empresas, setEmpresas] = useState('')
      const [usuarios, setUsuarios] = useState('')

  const query = rawQuery.toLowerCase().replace(/^[#>]/, '')

      function reset() {
        setOpen(false)
        setNucleos('')
        setEmpresas('')
        setUsuarios('')
      }

      function searchQuery(query:any) {
        console.log(query)
        setRawQuery(query)
        if (query.startsWith('?')) {
          setNucleos('')
          setEmpresas('')
          setUsuarios('')
          return
        }
        axios
        .get(`${import.meta.env.VITE_API_URL}/searchbar?busca=${encodeURIComponent(query)}`)
        .then((response) => {

          if (query.startsWith('#')) {
            setNucleos(response.data.nucleos)
            setEmpresas('')
            setUsuarios('')
          }
          else if (query.startsWith('>')) {
            setEmpresas(response.data.empresas)
            setUsuarios('')
            setNucleos('')
          }
          else {
            setNucleos(response.data.nucleos)
            setEmpresas(response.data.empresas)
            setUsuarios(response.data.usuarios)
          }
            })
        .catch((error) => {
            console.error('Erro ao buscar dados da API:', error)
            setNucleos('')
            setEmpresas('')
            setUsuarios('')
        })

      }

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setRawQuery('')} appear>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              {/* <Combobox onChange={(item) => (window.location = "/empresas/10")}> */}
                <Combobox onChange={()=> reset()}>
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 sm:text-sm focus:border-none!important border-none no-border "
                    placeholder="Pesquisar..."
                    onChange={(event) => searchQuery(event.target.value)}
                  />
                </div>
                {(empresas.length > 0 || usuarios.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-10 scroll-py-10 scroll-pb-2 scroll-pb-2 space-y-4 overflow-y-auto p-4 pb-2"
                  >
                    {empresas.length > 0 && (
                      <li>
                        <h2 className="text-xs font-semibold text-gray-900">Empresas</h2>
                        <ul className="-mx-4 mt-2 text-sm text-gray-700">
                          {empresas.map((empresa) => (
                            <Link to={`/sistema/empresas/${empresa.idempresa}/`} key={empresa.idempresa}>
                            <Combobox.Option
                              key={empresa.idempresa}
                              value={empresa.idempresa}
                              className={({ active }) =>
                                classNames(
                                  'flex cursor-default select-none items-center px-4 py-2',
                                  active && 'bg-indigo-600 text-white'
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <FolderIcon
                                    className={classNames('h-6 w-6 flex-none', active ? 'text-white' : 'text-gray-400')}
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3 flex-auto truncate">{empresa.nmfantasia}</span>
                                </>
                              )}
                            </Combobox.Option>
                            </Link>

                          ))}
                        </ul>
                      </li>
                    )}
                    {usuarios.length > 0 && (
                      <li>
                        <h2 className="text-xs font-semibold text-gray-900">Usuários</h2>
                        <ul className="-mx-4 mt-2 text-sm text-gray-700">
                          {usuarios.map((usuario) => (
                            <Combobox.Option
                              key={usuario.id}
                              value={usuario}
                              className={({ active }) =>
                                classNames(
                                  'flex cursor-default select-none items-center px-4 py-2',
                                  active && 'bg-indigo-600 text-white'
                                )
                              }
                            >
                              <img src={'https://empreender.cacbempreenderapp.org.br/img/avatars/user-icon.png'} alt="" className="h-6 w-6 flex-none rounded-full" />
                              <span className="ml-3 flex-auto truncate">{usuario.nmusuario}</span>
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    )}
                  </Combobox.Options>
                )}


                {rawQuery === '?' && (
                  <div className="py-14 px-6 text-center text-sm sm:px-14">
                    <LifebuoyIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                    <p className="mt-4 font-semibold text-gray-900">Ajuda com a paleta de pesquisa</p>
                    <p className="mt-2 text-gray-500">
                    Use esta ferramenta para procurar rapidamente por informações em toda a nossa plataforma. Para fins de perfomance, os resultados são limitados a 5 itens por categoria.
                    Você também pode usar os modificadores de pesquisa encontrados no rodapé abaixo para limitar os resultados apenas a empresas ou nucleos. 
                    </p>
                  </div>
                )}

                {query !== '' && rawQuery !== '?' && usuarios.length === 0 && empresas.length === 0 && nucleos.length === 0 &&(
                  <div className="py-14 px-6 text-center text-sm sm:px-14">
                    <ExclamationTriangleIcon className="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                    <p className="mt-4 font-semibold text-gray-900">Nenhum resultado encontrado</p>
                    <p className="mt-2 text-gray-500">Não foi possível encontrar nenhum resultado com este termo. Tente novamente.</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center bg-gray-50 py-2.5 px-4 text-xs text-gray-700">
                  Digite{' '}
                  <kbd
                    className={classNames(
                      'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                      rawQuery.startsWith('#') ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900'
                    )}
                  >
                    #
                  </kbd>{' '}
                  <span className="sm:hidden">para nucleos,</span>
                  <span className="hidden sm:inline">para buscar nucleos,</span>
                  <kbd
                    className={classNames(
                      'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                      rawQuery.startsWith('>') ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900'
                    )}
                  >
                    &gt;
                  </kbd>{' '}
                  para empresas, e{' '}
                  <kbd
                    className={classNames(
                      'mx-1 flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold sm:mx-2',
                      rawQuery === '?' ? 'border-indigo-600 text-indigo-600' : 'border-gray-400 text-gray-900'
                    )}
                  >
                    ?
                  </kbd>{' '}
                  para ajuda.
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
