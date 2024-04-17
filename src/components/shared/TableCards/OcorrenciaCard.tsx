import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { Link } from 'react-router-dom'

export const OcorrenciaCard = ({ data }) => {
    return (
        <Link
            to={`./${data.id}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.tipo} </h5>
            </div>

            <span>{data.idn+' - '+data.tipo  || '-'}</span>
        </Link>
    )
}
