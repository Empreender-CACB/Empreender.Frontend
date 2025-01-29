import { useEffect } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import CustomerProfile from './components/CustomerProfile'
import PaymentHistory from './components/PaymentHistory'
import CurrentSubscription from './components/CurrentSubscription'
import PaymentMethods from './components/PaymentMethods'

import { Button } from '@/components/ui';
import {

  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineExclamationCircle,

} from 'react-icons/ai';

const CustomerDetail = () => {


    return (
        <Container className="h-full">

<div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Detalhes da inscrição - #0077b5</h1>
          <div className="flex space-x-2">
          <Button className="mb-2 flex items-center"  size="sm" variant="solid" color="green-600">
              <AiOutlineCheck className="mr-2" /> Aprovar Candidatura
            </Button>

            <Button className="mb-2 flex items-center" size="sm"  variant="solid" color="yellow-600">
              <AiOutlineExclamationCircle className="mr-2" /> Informar Pendência
            </Button>
            <Button className="mb-2 flex items-center" size="sm"  variant="solid" color="red-600">
              <AiOutlineClose className="mr-2" /> Recusar Candidatura
            </Button>


          </div>
        </div>
                    <div className="flex flex-col xl:flex-row gap-4">
                        <div>
                            <CustomerProfile/>
                        </div>
                        <div className="w-full">
                            <AdaptableCard>
                                <CurrentSubscription />
                                <PaymentMethods />
                                <PaymentHistory />
                            </AdaptableCard>
                        </div>
                    </div>

        </Container>
    )
}

export default CustomerDetail
