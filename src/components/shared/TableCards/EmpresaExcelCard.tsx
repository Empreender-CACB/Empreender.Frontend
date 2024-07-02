import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { Link } from 'react-router-dom'

export const EmpresaExcelCard = ({ data }) => {
    return (
        <Link
            to={`./${data.id}`}
            smooth={true}
            duration={500}
            offset={-80}
        >
            <div className="w-full flex justify-between">
                <h5>{data.nmcontato} </h5>
            </div>

            <span>{data.cnpj || '-'}</span>
            <p className="mt-2">
                {data.idassociacao} - {data.nmrazao}
            </p>
        </Link>
    )
}
