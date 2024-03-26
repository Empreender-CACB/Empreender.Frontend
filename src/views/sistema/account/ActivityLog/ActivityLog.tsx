import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Log from './components/Log'
import LogFilter from './components/LogFilter'
import reducer from './store'
import { injectReducer } from '@/store'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

injectReducer('accountActivityLog', reducer)

const columns = [
    { name: 'nmcidade', header: 'Cidade', defaultFlex: 1 },
    { name: 'nucpf', header: 'CPF', defaultFlex: 1 },
    { name: 'nucpf', header: 'CPF', defaultFlex: 1 },
    { name: 'nmlogin', header: 'Login', defaultFlex: 1 },
    { name: 'nome', header: 'Perfil', defaultFlex: 1 },
]

const ActivityLog = () => {
    return (
        <Container>
            <AdaptableCard>
                <div className="grid lg:grid-cols-5 gap-8 ">
                    <div className="col-span-4 order-last md:order-first">
                        <h3 className="mb-6">Notificações</h3>
                        <CustomReactDataGrid
                filename="Notificacoes"
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/notifications`}
            />                    </div>
                </div>
            </AdaptableCard>
        </Container>
    )
}

export default ActivityLog
