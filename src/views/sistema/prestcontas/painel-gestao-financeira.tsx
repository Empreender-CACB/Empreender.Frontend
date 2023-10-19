import ZohoFrame from '@/components/shared/ZohoFrame'

const PainelGestaoFinanceira = () => {
    const zohoURL =
        'https://analytics.zoho.com/open-view/1704802000023173771/4c6a8729e9641115a37c7134f7f31f0a'

    return (
        <div>
            <h2 className='mb-4'>Painel de Gestão Financeira</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )   
}

export default PainelGestaoFinanceira
