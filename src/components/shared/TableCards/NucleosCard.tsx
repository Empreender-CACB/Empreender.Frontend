import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { Link } from 'react-router-dom'

export const NucleosCard = ({ data }) => {
    const link = `${import.meta.env.VITE_PHP_URL}/sistema/nucleo/detalhe/nid/${btoa(String(data.idnucleo))}`

    return (
        <Link
            to={link}
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
