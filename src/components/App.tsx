import Login from 'components/Login'
import Main from 'pages/Main'
import Dashboard from 'pages/Dashboard'
import NotFound from 'pages/404'
import { AuthProvider } from 'context/AuthProvider'
import RequireAuth from 'components/RequireAuth'
import {
  Routes,
  Route,
  useNavigate,
  BrowserRouter as Router
} from 'react-router-dom'
import Empresas from 'pages/Empresas/lista'
import DetalhesEmpresa from 'pages/Empresas/detalhes'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />}>
        <Route path="empresas/:empresaId" element={<DetalhesEmpresa />} />
        <Route path="empresas" element={<Empresas />} />
      </Route>{' '}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Main />}>
          <Route path="auth" element={<Empresas />} />
        </Route>{' '}
      </Route>
      {/* catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
