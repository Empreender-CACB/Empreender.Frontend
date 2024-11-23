import { Link } from 'react-router-dom'

export const ContatoCard = ({ data }) => {
    return (
        <Link
            to={`./${data.idcontato}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.nmcontato} </h5>
            </div>

            <span>{data.cargo+' - '+data.entidade_vinculada  || '-'}</span>
            <p className="mt-2">
                {data.nmcidade} - {data.iduf}
            </p>
        </Link>
    )
}
