import { Link } from 'react-router-dom'

export const AnexoCard = ({ data }) => {
    return (
        <Link
            to={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/bid/${btoa(data.id)}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.nome_arquivo} </h5>
            </div>

            <p className="mt-2">
                {data.status} - {data.vencimento}
            </p>
        </Link>
    )
}
