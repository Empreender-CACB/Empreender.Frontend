import { useParams, useNavigate } from 'react-router-dom'
import Loading from 'components/Loading'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Label, Button, Dropdown } from 'semantic-ui-react'
import { useAPI } from 'hooks/useApi'

const DetalhesEmpresa = () => {
  const navigate = useNavigate()
  const { empresaId } = useParams()

  const { data: empresa } = useAPI({
    url: `/empresas/${empresaId}`
  })

  const tabs = [
    { name: 'Detalhes', href: '#', current: true },
    { name: 'Núcleos Vinculados', href: '#', current: false },
    { name: 'Projetos Vinculados', href: '#', current: false },
    { name: 'Documentos', href: '#', current: false }
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  if (!empresa) {
    return <Loading />
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:px-8">
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
          <div className="pt-1">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {empresa.nurazaosocial}
                {'  '}
              </h1>
              <div className="ml-2">
                <Label
                  size="tiny"
                  color={empresa.flativo === 'S' ? 'green' : 'yellow'}
                >
                  {empresa.flativo === 'S' ? 'ATIVA' : 'INATIVA'}
                </Label>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-500">
              {empresa.nucnpjcpf}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
          <Dropdown
            text="Opções"
            primary
            floating
            button
            className="blue shadow"
          >
            <Dropdown.Menu>
              <Dropdown.Item icon="pencil" text="Editar" />
              <Dropdown.Item icon="plus" text="Gerenciar Gestores" />
            </Dropdown.Menu>
          </Dropdown>
          {/*           <DropDownSection menuItems={menuItems} title="Opções" />
           */}{' '}
          <Button
            onClick={() => navigate(-1)}
            content="Voltar"
            icon="left arrow"
            labelPosition="left"
          />
        </div>
      </div>

      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm'
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className=" mt-10 overflow-hidden border-t-4 border-blue-500 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Detalhes
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Subtítulo</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
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
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900">{empresa.nufone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Endereço</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {empresa.dsendereco}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Bairro</dt>
              <dd className="mt-1 text-sm text-gray-900">{empresa.dsbairro}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{empresa.dsemail}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Ramo de Atividade
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {empresa.ramoAtividade.nmramoativ}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900">
                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                consequat sint. Sit id mollit nulla mollit nostrud in ea officia
                proident. Irure nostrud pariatur mollit ad adipisicing
                reprehenderit deserunt qui eu.
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Attachments</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 rounded-md border border-gray-200"
                >
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 w-0 flex-1 truncate">
                        resume_back_end_developer.pdf
                      </span>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-2 w-0 flex-1 truncate">
                        coverletter_back_end_developer.pdf
                      </span>
                    </div>
                    <div className="ml-4 shrink-0">
                      <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default DetalhesEmpresa
