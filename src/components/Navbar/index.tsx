/* eslint-disable tailwindcss/migration-from-tailwind-2 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import SearchBar from 'components/SearchBar'
import useAuth from 'hooks/useAuth'
import NavigationOptions from './Navbar'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

import './navbar.css'

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)

  const { user } = useAuth()

  console.log('user ', user)

  const userNavigation = [
    { name: user?.nmusuario, href: '#' },
    { name: 'Seu Perfil', href: '#' },
    { name: 'Configurações', href: '#' },
    { name: 'Utilizar versão legado', href: '#' },
    { name: 'Sair', href: '#' }
  ]

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }
  useEffect(() => {
    console.log(searchOpen)
  }, [searchOpen])

  return (
    <Disclosure as="header" className="relative z-10 bg-white shadow">
      {({ open }) => (
        <>
          {searchOpen && (
            <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
          )}
          <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
            Empreender 5.0 - Versão BETA (Ambiente de testes)
          </p>
          <div className="mx-auto mb-4 max-w-8xl px-4 sm:px-6 md:px-8 lg:divide-y lg:divide-gray-200 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0">
                <div className="flex shrink-0 items-center">
                  <img
                    className="block h-8 w-auto"
                    src="https://www.empreender.org.br/css/sistema/login/images/empreender-unir-para-crescer.jpg"
                    alt="Portal Empreender"
                  />
                </div>
              </div>
              <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                <NavigationOptions />
              </div>
              <div className="relative z-10 flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                <button
                  type="button"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="mr-2 shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={
                          'https://digimedia.web.ua.pt/wp-content/uploads/2017/05/default-user-image.png'
                        }
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
                                'block py-2 px-4 text-sm text-gray-700'
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
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
