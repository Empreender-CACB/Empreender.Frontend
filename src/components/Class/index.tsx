import { useState, useEffect } from 'react'
import axios from 'api/axios'
import { PlusIcon } from '@heroicons/react/outline'
import useAuth from 'hooks/useAuth'
import { Link } from 'react-router-dom'

const getRandomHexColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  if (color === '#FFFFFF') {
    return getRandomHexColor()
  }
  return color
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Class() {
  const { auth } = useAuth()
  const [courses, setCourses] = useState('')

  useEffect(() => {
    axios({
      method: 'get',
      url: auth.role != 'ADMINISTRATOR' ? '/auth/me/courses' : '/courses',
      headers: { Authorization: 'Bearer ' + auth.accessToken }
    })
      .then((res) => {
        // Update state

        if (auth.role == 'ADMINISTRATOR') {
          setCourses(res.data.data)
        }
        if (auth.role == 'TEACHER') {
          setCourses(res.data.data.teaching)
        }
        if (auth.role == 'STANDARD') {
          setCourses(res.data.data.courses)
        }
      })
      .catch((error) => {
        // handle any rejected Promises or errors, etc...
      })
  }, [auth])

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 className="text-md font-medium uppercase tracking-wide text-gray-600">
            Lista de Turmas
          </h2>
          {auth.role == 'ADMINISTRATOR' ? (
            <Link to="/courses/insert">
              {' '}
              <button
                type="button"
                className="hover:bg-blue-700focus:ring-1 inline-flex items-center rounded-full border border-transparent bg-blue-600 p-3 text-white shadow-sm"
              >
                {auth.name}
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </Link>
          ) : null}
        </div>
        {courses && courses[0] ? (
          <ul
            role="list"
            className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          >
            {courses.map((course) => (
              <li
                key={course.name}
                className="col-span-1 flex rounded-md shadow-sm"
              >
                <div
                  style={{ backgroundColor: getRandomHexColor() }}
                  className={classNames(
                    'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'
                  )}
                >
                  {course.slug}
                </div>
                <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                    <Link
                      to={`/course/${course.id}`}
                      className="font-medium text-gray-900 hover:text-gray-600"
                    >
                      {course.name}
                    </Link>
                    <p className="text-gray-500">Visualizar </p>
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
        ) : null}
      </div>
    </main>
  )
}
