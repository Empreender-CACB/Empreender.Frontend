import { Nucleo } from '@/@types/generalTypes'
import { Table } from '@/components/ui'
import { noEmpty } from '@/utils/noEmpty'
import dayjs from 'dayjs'

type NucleoDetalhesProp = {
    nucleo: Nucleo
}

const { Tr, Th, Td, THead, TBody } = Table

const Detalhes = ({ nucleo }: NucleoDetalhesProp) => {
    return (
        <div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Entidade
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(nucleo.associacao.nmrazao)}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Cidade / UF
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {`${noEmpty(
                                nucleo.associacao.cidade.nmcidade
                            )} - ${noEmpty(nucleo.associacao.cidade.iduf)}`}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Gestor
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(nucleo.gestor?.nmusuario)}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Gestor - CPF
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(nucleo.gestor?.nucpf)}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Gestor - E-mail
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(nucleo.gestor?.dsemail)}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Data de criação
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(
                                dayjs(nucleo.dtcriacao).format('DD/MM/YYYY')
                            )}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Última alteração
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(
                                dayjs(nucleo.dtultimaalteracao).format(
                                    'DD/MM/YYYY'
                                )
                            )}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Segmento
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(nucleo?.segmento?.dssegmento)}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Status
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {nucleo.flativo === 'S' ? 'Ativo' : 'Inativo'}
                        </dd>
                    </div>

                    <div className="sm:col-span-3">
                        <dt className="text-sm font-medium text-gray-500">
                            Justificativa
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(nucleo.txcriacaojustificativa)}
                        </dd>
                    </div>

                    <div className="sm:col-span-3">
                        <dt className="text-sm font-medium text-gray-500">
                            Outras informações
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(nucleo.txoutrasinformacoes)}
                        </dd>
                    </div>

                    <div className="sm:col-span-3">
                        <dt className="text-sm font-medium text-gray-500">
                            Homepage
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {noEmpty(nucleo.dshomepage)}
                        </dd>
                    </div>
                </dl>
            </div>

            <Table compact className="border-2 mt-4">
                <THead>
                    <Tr>
                        <Th>Frequência das reuniões realizadas</Th>
                        <Th>Este ano</Th>
                        <Th>Último Ano</Th>
                        <Th>Últimos 3 anos</Th>
                        <Th>Geral</Th>
                    </Tr>
                </THead>
                <TBody>
                    <Tr>
                        <Td>Média mensal de Reuniões</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                    </Tr>
                    <Tr>
                        <Td>Média de Participantes</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                    </Tr>
                    <Tr>
                        <Td>Número de reuniões</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                        <Td>0,00</Td>
                    </Tr>
                </TBody>
            </Table>
        </div>
    )
}

export default Detalhes
