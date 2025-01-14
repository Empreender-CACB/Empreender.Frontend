import ZohoFrame from '@/components/shared/ZohoFrame'

const QuadroMalaDireta = () => {

    let zohoURL = ''
    let title = ''

    zohoURL = 'https://analytics.zoho.com/open-view/1704802000037626444/672afaea9791569bbece5e64f725ebea'
    title = 'Mala Direta'


    return (
        <div>
            <h2 className="mb-4">Contatos - {title}</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default QuadroMalaDireta
