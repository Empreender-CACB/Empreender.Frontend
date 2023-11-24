import ZohoFrame from '@/components/shared/ZohoFrame'
import { useParams } from 'react-router-dom'

const QuadroAcompanhamentoGeral = () => {
    const { idquadro } = useParams()

    let zohoURL = ''
    let title = ''

    switch (idquadro) {
        case 'quadro2':
            zohoURL =
                'https://analytics.zoho.com/open-view/1704802000028727700/f5239f2ca9ef1bf78ac5a4f0ea5d9cfd'
            title = 'Documentos Empresas'
            break
        case 'quadro3':
            zohoURL =
                'https://analytics.zoho.com/open-view/1704802000026926269/76b8046fb03c8c953d2f899351358d2a'
            title = 'EAD - Acompanhamento'
            break
        case 'quadro4':
            zohoURL =
                'https://analytics.zoho.com/open-view/1704802000026747863/a801283eeaaef9d10965e1befe0f0e51'
            title = 'Portal - Acompanhamento'
            break
        default:
            zohoURL =
                'https://analytics.zoho.com/open-view/1704802000026548233/47185ae745502d0c064d5ea03d8ff767'
            title = 'Atualização de Dados'
            break
    }

    return (
        <div>
            <h2 className="mb-4">Acompanhamento Geral - {title}</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default QuadroAcompanhamentoGeral
