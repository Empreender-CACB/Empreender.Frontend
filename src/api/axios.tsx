import axios from 'axios'
import useLoadingStore from 'stores/loading'

useLoadingStore.getState().setLoading(true)

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

axios.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setLoading(false)
    return response
  },
  (error) => {
    useLoadingStore.getState().setLoading(false)
    return Promise.reject(error)
  }
)

export default axios.create({
  baseURL: 'http://localhost:5173/api'
})
