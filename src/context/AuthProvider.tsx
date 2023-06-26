import axios from 'api/axios'
import { createContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const isAuthenticated = !!user

  useEffect(() => {
    const { '@empreender:token': cookie } = parseCookies()

    const searchParams = new URLSearchParams(window.location.search)

    const token = searchParams.get('token')
    console.log(token)

    async function fetchUser() {
      axios.defaults.headers.common['Authorization'] = token

      axios({
        method: 'get',
        url: '/auth/me'
      })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          // handle any rejected Promises or errors, etc...
        })

      // setUser(data)
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
