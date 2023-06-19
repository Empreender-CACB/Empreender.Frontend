import React, { useState, useEffect } from 'react'
import axios from 'api/axios'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from 'components/Loading'
import DropDownSection from 'components/Buttons/Dropdown/Section'
import PencilSquareIcon from '@heroicons/react/20/solid'

const DetalhesEmpresa = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [empresa, setEmpresa] = useState({})
  const { empresaId } = useParams()

  const menuItems = [
    { title: 'Editar', icon: 'null', url: '#' },
    { title: 'Gerir Gestores', icon: 'null', url: '#' }
  ]

  useEffect(() => {
    axios
      .get(`/empresas/${empresaId}`)
      .then((res) => {
        // Update state
        setEmpresa(res.data)
        setLoading(false)
      })
      .catch((error) => {
        // handle any rejected Promises or errors, etc...
      })
  }, [empresaId])

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div className="flex items-start space-x-5">
          <div className="shrink-0">
            <div className="relative">
              <img
                className="h-16 w-16 rounded-full"
                src="https://digimedia.web.ua.pt/wp-content/uploads/2017/05/default-user-image.png"
                alt=""
              />
              <span
                className="absolute inset-0 rounded-full shadow-inner"
                aria-hidden="true"
              />
            </div>
          </div>
          {/*
          Use vertical padding to simulate center alignment when both lines of text are one line,
          but preserve the same layout if the text wraps without making the image jump around.
        */}
          <div className="pt-1.5">
            <h1 className="text-2xl font-bold text-gray-900">
              {empresa.nmfantasia}
            </h1>
            <p className="text-sm font-medium text-gray-500">
              {empresa.nucnpjcpf}
            </p>
          </div>
        </div>
        <button onClick={() => navigate(-1)}>Voltar</button>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
          <DropDownSection menuItems={menuItems} title="Opções" />
        </div>
      </div>
      <div className=" overflow-hidden bg-white px-40    shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Informações
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Dados da Empresa
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="border-t-indigo-500 text-sm font-medium text-gray-500">
                Razão Social
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {empresa.nurazaosocial}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="border-t-indigo-500 text-sm font-medium text-gray-500">
                Razão Social
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {empresa.nurazaosocial}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{empresa.dsemail}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Número de Telefone
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{empresa.nufone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Número do Fax
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{empresa.nufax}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Descrição</dt>
              <dd className="mt-1 text-sm text-gray-900">
                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                proident. Irure nostrud pariatur mollit ad adipisicing
                reprehenderit deserunt qui eu.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default DetalhesEmpresa
