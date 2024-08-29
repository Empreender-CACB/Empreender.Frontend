import ZohoFrame from '@/components/shared/ZohoFrame'
import { useParams } from 'react-router-dom'

const QuadroAcompanhamentoGeral = () => {
    const { idquadro } = useParams()

    let zohoURL = ''
    let title = ''

    zohoURL = 'https://analytics.zoho.com/open-view/1704802000042251076/ef10104707112713a54e0f6e1642627a'
    title = 'Conta Especial'


    return (
        <div>
            <h2 className="mb-4">Acompanhamento Financeiro - {title}</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default QuadroAcompanhamentoGeral
