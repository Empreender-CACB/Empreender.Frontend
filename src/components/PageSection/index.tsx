import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

type PageSectionProps = {
  title: string
  description?: string
  children?: React.ReactNode
}

export default function PageSection({
  title,
  description = 'Componente sem descrição',
  children
}: PageSectionProps) {
  return (
    <div>
      <div>
        <nav className="sm:hidden" aria-label="Back">
          <a
            href="#"
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ChevronLeftIcon
              className="-ml-1 mr-1 h-5 w-5 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Voltar
          </a>
        </nav>
        <nav className="hidden sm:flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <a
                  href="#"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Início
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <a
                  href="#"
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Em Desenvolvimento
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-5 w-5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <a
                  href="#"
                  aria-current="page"
                  className="ml-4 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-700"
                >
                  {title}
                </a>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
          <p className="text-sm font-medium text-gray-500">{description}</p>
        </div>
        <div className="mt-4 flex shrink-0 md:ml-4 md:mt-0">{children}</div>
      </div>
    </div>
  )
}
