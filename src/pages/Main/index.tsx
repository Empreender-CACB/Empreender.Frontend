import { Outlet } from 'react-router-dom'
import Footer from 'components/Footer'

function Main() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}

export default Main
