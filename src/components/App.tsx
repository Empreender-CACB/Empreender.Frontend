import Avatar from 'components/Avatar'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Banner from 'components/Banner'
import Login from 'components/Login'
import Main from 'pages/Main'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Main />}>
          <Route path="" element={<Banner />} />
          <Route path="about" element={<Banner />} />
        </Route>
        <Route path="/settings" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
