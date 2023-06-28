import { parseCookies } from 'nookies'
import { createContext, useEffect, useState } from 'react'
import { api } from 'services/api'

type User = {
  nucpf: string
  nmusuario: string
  nmlogin: string
  dsemail: string
  dtultimaalteracao: Date
}

export const AuthContext = createContext<{ user: User | undefined }>({
  user: undefined as User | undefined
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | undefined>()

  useEffect(() => {
    const { '@empreender:token': token } = parseCookies()

    async function fetchUser() {
      const { data } = await api.get('/auth/me')

      setUser(data)
    }

    if (token) {
      console.log('entrou aqui, fetchUser')
      fetchUser()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}
