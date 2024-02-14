import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
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
                <h5>{data.idlanc} </h5>
                <TagActiveInative value={data["lancamento.flativo"]} activeText="S" />
            </div>

            <span>{data.idprojeto+' - '+data.idlanc  || '-'}</span>
            <p className="mt-2">
                {data.nmcidade} - {data.iduf}
            </p>
        </Link>
    )
}
