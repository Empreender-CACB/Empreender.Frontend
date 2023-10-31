import ZohoFrame from '@/components/shared/ZohoFrame'
import { useParams } from 'react-router-dom'

const PainelEntidade = () => {
    const { idconcurso, identidade } = useParams()

    const zohoURL = `https://analytics.zoho.com/open-view/1704802000026947378/65ef73ea99b6cd41077e3a34f26a7d43?ZOHO_CRITERIA="Propostas%20-%20E2022%20-%20Demandas"."ID%20entidade"=${identidade}%20and%20"Propostas%20-%20E2022%20-%20Demandas"."Concurso"=${idconcurso}`

    return (
        <div>
            <h2 className="mb-4">Painel da entidade</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default PainelEntidade
