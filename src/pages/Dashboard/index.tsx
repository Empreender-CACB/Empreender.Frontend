import '@inovua/reactdatagrid-community/index.css'
import Navbar from 'components/Navbar'
//import Moment from 'react-moment'
import moment from 'moment'
import { Outlet } from 'react-router-dom'
import Footer from 'components/Footer'
import CookiesAlert from 'components/CookiesAlert'
import GlobalLoading from 'components/GlobalLoading'
window.moment = moment
export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl pt-5 sm:px-6 lg:px-8">
        <Outlet />{' '}
      </div>
      <Footer />
      {/*       <CookiesAlert />
       */}{' '}
    </>
  )
}
