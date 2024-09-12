import { Associacao } from '@/@types/generalTypes'
import { noEmpty } from '@/utils/noEmpty'
import dayjs from 'dayjs'


type DataProps = {
    data: Associacao
}

const Detalhes = ({ data }: DataProps) => {
    const details = [
        { label: 'Nome', value: noEmpty(data.nmrazao) },
        { label: 'Sigla', value: noEmpty(data.sigla) },
        { label: 'ID tipo Entidade', value: noEmpty(data.id_tipo_entidade) },
        { label: 'CNPJ', value: noEmpty(data.nucnpj) },
        { label: 'Email', value: noEmpty(data.dsemail) },
        { label: 'Fundação', value: noEmpty(data.dtfundacao) },
        { label: 'Endereço', value: noEmpty(data.dsendereco) },
        { label: 'Bairro', value: noEmpty(data.dsbairro) },
        {
            label: 'Cidade / UF',
            value: `${noEmpty(data.cidade?.nmcidade)} - ${noEmpty(data.cidade?.iduf)}`
        },
        { label: 'Gestor', value: noEmpty(data.gestor?.nmusuario) },
        { label: 'Gestor - CPF', value: noEmpty(data.gestor?.nucpf) },
        { label: 'Gestor - E-mail', value: noEmpty(data.gestor?.dsemail) },
        {
            label: 'Data de criação',
            value: noEmpty(dayjs(data.data_inclusao).format('DD/MM/YYYY')),
        },
        {
            label: 'Última alteração',
            value: noEmpty(dayjs(data.data_alteracao).format('DD/MM/YYYY')),
        },
        { label: 'Status', value: data.flativo === 'S' ? 'Ativo' : 'Inativo' },
        { label: 'Homepage', value: noEmpty(data.dshomepage) },
    ]

    return (
        <div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                    {details.map(({ label, value }, index) => (
                        <div className="sm:col-span-1" key={index}>
                            <dt className="text-sm font-extrabold text-black dark:text-white">{label}</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

        </div>
    )
}

export default Detalhes
