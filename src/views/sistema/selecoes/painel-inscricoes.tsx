import ZohoFrame from '@/components/shared/ZohoFrame'
import { Button } from '@/components/ui'
import { HiOutlineReply } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const PainelInscrições = () => {
    const zohoURL = `https://analytics.zoho.com/open-view/1704802000045008185/862aff329a8285119d52916659eacc87`

    return (
        <div>
            <div className="lg:flex items-center justify-between mb-4">
                <h2 className="mb-4">Painel de inscrições</h2>
                <Button size="sm" icon={<HiOutlineReply />}>
                    <Link
                        className="menu-item-link"
                        to={`/sistema/selecoes/e2022-consultores`}
                    >
                        Voltar
                    </Link>
                </Button>
            </div>
            
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default PainelInscrições
