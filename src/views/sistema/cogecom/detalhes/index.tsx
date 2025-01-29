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
    AiOutlineDownload,
    AiOutlineClose,

} from 'react-icons/ai';

const CustomerDetail = () => {


    return (
        <Container className="h-full">

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Detalhes da adesão - #0077b5</h1>
                <div className="flex space-x-2">

                    <Button className="mb-2 flex items-center" size="sm" variant="solid" color="blue-800">
                        <AiOutlineDownload className="mr-2" /> Transferência de documentos
                    </Button>
                    <Button className="mb-2 flex items-center" size="sm" variant="solid" color="green-700">
                        <AiOutlineCheck className="mr-2" /> Aprovar Adesão
                    </Button>
                    <Button className="mb-2 flex items-center" size="sm" variant="solid" color="red-900">
                        <AiOutlineClose className="mr-2" /> Negar Adesão
                    </Button>
                </div>
            </div>
            <div className="flex flex-col xl:flex-row gap-4">
                <div>
                    <CustomerProfile />
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
