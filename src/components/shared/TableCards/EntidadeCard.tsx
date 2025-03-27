import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { Link } from 'react-router-dom'

export const EntidadeCard = ({ data }) => {
    return (
        <Link
            to={`${import.meta.env.VITE_PHP_URL}/sistema/associacao/detalhe/aid/${btoa(String(data.idassociacao))}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.sigla + "-" + data.nmrazao} </h5>
                <TagActiveInative value={data.flativo} activeText="S" />
            </div>

            <p className="mt-2">
                {data.nmcidade} - {data.iduf}
            </p>
        </Link>
    )
}
