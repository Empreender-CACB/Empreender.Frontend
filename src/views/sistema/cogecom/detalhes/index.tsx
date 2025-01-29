import { useEffect } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import CustomerProfile from './components/CustomerProfile'
import PaymentHistory from './components/PaymentHistory'
import CurrentSubscription from './components/CurrentSubscription'
import PaymentMethods from './components/PaymentMethods'
import isEmpty from 'lodash/isEmpty'
import useQuery from '@/utils/hooks/useQuery'


const CustomerDetail = () => {


    return (
        <Container className="h-full">

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
