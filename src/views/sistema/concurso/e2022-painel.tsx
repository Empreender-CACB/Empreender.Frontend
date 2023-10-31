import ZohoFrame from '@/components/shared/ZohoFrame'
import { useParams } from 'react-router-dom'

const E2022Painel = () => {
    const { idconcurso } = useParams()

    let zohoURL = ''
    let title = ''

    switch (idconcurso) {
        case '2':
            zohoURL = `https://analytics.zoho.com/open-view/1704802000018839634/d315ec0f3a7ace74af8d63003f13af2f?ZOHO_CRITERIA="Propostas%20-%20E2022%20-%20Demandas"."Concurso"=${idconcurso}`
            title = "Apoio a Demandas"
            break
        case '3':
            zohoURL = `https://analytics.zoho.com/open-view/1704802000029267292/a6917ffe557c2a4c35c92a7a55d42cf3?ZOHO_CRITERIA="Propostas%20-%20E2022%20-%20Demandas"."Concurso"=${idconcurso}`
            title = "ENEM"
            break
        case '4':
            zohoURL = `https://analytics.zoho.com/open-view/1704802000029267480/a10bc64be469d1806ffb066900fd9863?ZOHO_CRITERIA="Propostas%20-%20E2022%20-%20Demandas"."Concurso"=${idconcurso}`
            title = "AL Invest Verde"
            break
        default:
            break
    }

    return (
        <div>
            <h2 className="mb-4">Painel Geral - {title}</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default E2022Painel
