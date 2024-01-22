import { Link } from 'react-router-dom'

export const CandidaturaCard = ({ data }) => {
    return (
        <Link
            to={`./${data.id}`}
            smooth={true}
            duration={500}  
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.nome} </h5>
                <h6>{data.uf}</h6>
            </div>

            <span>{data.email || '-'}</span>
            <p className="mt-2">
                {data.telefone} - {data.cidade}
            </p>
        </Link>
    )
}
