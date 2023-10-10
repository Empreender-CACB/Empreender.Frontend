import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { Link } from 'react-router-dom'

export const EmpresasCard = ({ data }) => {
    return (
        <Link
            to={`./${data.idempresa}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.nmfantasia} </h5>
                <TagActiveInative value={data.empresa_ativa} activeText="S" />
            </div>

            <span>{data.nucnpjcpf || '-'}</span>
            <p className="mt-2">
                {data.nmcidade} - {data.nmuf}
            </p>
        </Link>
    )
}
