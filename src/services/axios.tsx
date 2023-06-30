import axios from 'axios'
import useLoadingStore from 'stores/loading'
import { parseCookies, destroyCookie, setCookie } from 'nookies'

export function getAPIClient() {
  const searchParams = new URLSearchParams(window.location.search)
  const urlToken = searchParams.get('token')

  const { '@empreender:token': token } = parseCookies()

  const api = axios.create({
    baseURL: 'https://cacbempreenderapp.org.br/api'
  })

  axios.interceptors.request.use(
    (config) => {
      useLoadingStore.getState().setLoading(true)
      return config
    },
    (error) => {
      useLoadingStore.getState().setLoading(false)
      return Promise.reject(error)
    }
  )

  if (token) {
    api.defaults.headers[
      'Authorization'
    ] = `Bearer MTY3.2-Kw9dJ_juTqYSQLK5W-_aQN3DmI7dykcx-2qKnOVSbEPMSAcx-m8d0jfdcO`
  } else {
    setCookie(
      undefined,
      '@empreender:token',
      'MQ.JVcu_6LErwtzU3rXGmvtIB8AU6ujFL3EOzwZ_tXlKlmA9oFADCiB5utK6oxD',
      {
        maxAge: 10 * 24 * 60 * 60 // 10 days
      }
    )

    api.defaults.headers[
      'Authorization'
    ] = `Bearer MQ.JVcu_6LErwtzU3rXGmvtIB8AU6ujFL3EOzwZ_tXlKlmA9oFADCiB5utK6oxD`
  }

  api.interceptors.response.use(
    async (response) => {
      useLoadingStore.getState().setLoading(false)

      return response
    },
    async (error) => {
      useLoadingStore.getState().setLoading(false)

      if (error.response.status === 401) {
        destroyCookie(undefined, '@empreender:token')

        api.defaults.headers['Authorization'] = null
      }

      return Promise.reject(error)
    }
  )

  return api
}
