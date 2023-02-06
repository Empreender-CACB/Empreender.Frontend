import { DotsVerticalIcon } from '@heroicons/react/solid'

const classes = [
  {
    name: 'Métodos de Programação',
    initials: 'MP',
    href: '#',
    members: 20,
    bgColor: 'bg-pink-600'
  },
  {
    name: 'Regressão Logística',
    initials: 'RL',
    href: '#',
    members: 12,
    bgColor: 'bg-purple-600'
  },
  {
    name: 'Projeto e Análise de Algorítimos',
    initials: 'PAA',
    href: '#',
    members: 16,
    bgColor: 'bg-yellow-500'
  },
  {
    name: 'Rust pipi popopo ',
    initials: 'RPP',
    href: '#',
    members: 8,
    bgColor: 'bg-green-500'
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Class() {
  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Minhas Turmas
      </h2>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
      >
        {classes.map((team) => (
          <li key={team.name} className="col-span-1 flex rounded-md shadow-sm">
            <div
              className={classNames(
                team.bgColor,
                'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'
              )}
            >
              {team.initials}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <a
                  href={team.href}
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {team.name}
                </a>
                <p className="text-gray-500">{team.members} alunos</p>
              </div>
              <div className="shrink-0 pr-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                ></button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
