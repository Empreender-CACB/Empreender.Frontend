import { useRef, useState, useEffect } from 'react'
import useAuth from 'hooks/useAuth'
import { XCircleIcon } from '@heroicons/react/solid'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import axios from 'api/axios'
const LOGIN_URL = '/auth/login'

export default function Login() {
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const userRef = useRef()
  const errRef = useRef()

  const [email, setEmail] = useState('')
  const [password, setpassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    userRef.current.focus()
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = JSON.stringify({ email, password })
      const options = {
        headers: { 'content-type': 'application/json' }
      }
      const response = await axios.post(LOGIN_URL, data, options)

      console.log(JSON.stringify(response?.data))
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken
      const roles = response?.data?.roles
      setAuth({ email, password, roles, accessToken })
      setEmail('')
      setpassword('')
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('Sem resposta do servidor')
      } else if (err.response?.status === 400) {
        setErrMsg('Digite o usuário e senha')
      } else if (err.response?.status === 401) {
        setErrMsg('Falha ao logar')
      } else {
        setErrMsg('Falha ao logar')
      }
      errRef.current.focus()
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 22 22"
              strokeWidth={2}
              stroke="black"
              className="h-6 w-6"
            >
              {' '}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />{' '}
            </svg>

            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Acessar UnBase
            </h2>

            <div
              className={errMsg ? 'mt-5 rounded-md bg-red-50 p-4' : 'invisible'}
            >
              <div className="flex">
                <div className="shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p
                    ref={errRef}
                    aria-live="assertive"
                    className="text-sm font-medium text-red-800"
                  >
                    {errMsg}
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' caso não tenha conta, '}
              <a
                href="#"
                className="font-medium text-blue-700 hover:text-blue-500"
              >
                cadastre-se
              </a>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      ref={userRef}
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => setpassword(e.target.value)}
                      value={password}
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Lembrar acesso
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-700 hover:text-blue-500"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://picsum.photos/900?random=7"
          alt=""
        />
      </div>
    </div>
  )
}
