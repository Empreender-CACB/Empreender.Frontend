import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { Link } from 'react-router-dom'

export const UsuariosCard = ({ data }) => {
    return (
        <Link
            to={`./${data.nucpf}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.nmusuario} </h5>
                <TagActiveInative value={data.flativo} activeText="S" />
            </div>

            <span>{data.nucpf || '-'}</span>
            <p className="mt-2">
                {data.nmcidade} - {data.iduf}
            </p>
        </Link>
    )
}
