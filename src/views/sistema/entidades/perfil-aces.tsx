import ZohoFrame from '@/components/shared/ZohoFrame'

const PerfilAces = () => {
    const zohoURL =
        'https://analytics.zoho.com/open-view/1704802000019613569/41bab37c9bc44a8187f2370897774472'

    return (
        <div>
            <h2 className='mb-4'>Entidades - Perfil das ACEs</h2>
            <ZohoFrame url={zohoURL} />
        </div>
    )
}

export default PerfilAces
