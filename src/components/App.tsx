import Avatar from 'components/Avatar'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Banner from 'components/Banner'
import Login from 'components/Login'
import Main from 'pages/Main'
import NotFound from 'pages/404'
import { AuthProvider } from 'context/AuthProvider'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Main />}>
        <Route path="" element={<Banner />} />
        <Route path="about" element={<Banner />} />
      </Route>
      <Route path="/settings" element={<Login />} />
      {/* catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
