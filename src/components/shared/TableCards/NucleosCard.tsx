import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { Link } from 'react-router-dom'

export const NucleosCard = ({ data }) => {
    return (
        <Link
            to={`./${data.idnucleo}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.nmfantasia} </h5>
                <TagActiveInative value={data["nucleo.flativo"]} activeText="S" />
            </div>

            <span>{data.idnucleo+' - '+data.nmnucleo  || '-'}</span>
            <p className="mt-2">
                {data.nmcidade} - {data.iduf}
            </p>
        </Link>
    )
}
