import ZohoFrame from '@/components/shared/ZohoFrame'

const QuadroAcompanhamentoGeral = () => {

    let zohoURL = ''
    let title = ''

    zohoURL = 'https://analytics.zoho.com/open-view/1704802000030456046/957b96bc3b0c4779aac4155f323bca38'
    title = 'Acompanhamento'


    return (
        <div>
            <h2 className="mb-4">Entidade - {title}</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default QuadroAcompanhamentoGeral
