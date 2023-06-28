import '@inovua/reactdatagrid-community/index.css'
import Navbar from 'components/Navbar'
import moment from 'moment'
import { Outlet } from 'react-router-dom'
import Footer from 'components/Footer'

window.moment = moment

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-8xl px-4 sm:px-6 md:px-8">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
