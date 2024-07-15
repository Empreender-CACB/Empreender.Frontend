import ZohoFrame from '@/components/shared/ZohoFrame'

const PainelInscrições = () => {
    const zohoURL = `https://analytics.zoho.com/open-view/1704802000045008185/862aff329a8285119d52916659eacc87`

    return (
        <div>
            <h2 className="mb-4">Painel de inscrições</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default PainelInscrições
