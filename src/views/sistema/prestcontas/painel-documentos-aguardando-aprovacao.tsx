import ZohoFrame from '@/components/shared/ZohoFrame'

const PainelGestaoFinanceira = () => {
    const zohoURL =
        'https://analytics.zoho.com/open-view/1704802000030321019/ae1158354ab5f3ea88e41d4a88a9f872'

    return (
        <div>
            <h2 className='mb-4'>Documentos Aguardando Aprovação</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )   
}

export default PainelGestaoFinanceira
