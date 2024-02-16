import { maskMoney } from '@/utils/MaskMoney'
import { Link } from 'react-router-dom'

export const TransferenciasPagamentosCard = ({ data }) => {
    return (
        <Link
            to={`./${data.idlanc}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{maskMoney(data.vllanc)} Lanc: {data.idlanc} </h5>
            </div>

            <span>Projeto: {data.idprojeto+' - Origem: '+data.tpfonterec  || '-'}</span>
            <p className="mt-2">
                {data.nmcredor}
            </p>
        </Link>
    )
}
