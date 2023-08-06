/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import Tabs from '@/components/ui/Tabs'
import Loading from '@/components/shared/Loading'
import Button from '@/components/ui/Button'

import { useParams } from 'react-router-dom'
import LayoutDetailSimple from '@/components/layouts/LayoutDetailSimple'
import isEmpty from 'lodash/isEmpty'
import {
    HiOutlineDocumentAdd,
    HiOutlineInformationCircle,
    HiOutlinePencil,
    HiOutlineUserAdd,
    HiOutlineViewList,
} from 'react-icons/hi'
import dayjs from 'dayjs'
import { noEmpty } from '@/utils/noEmpty'
import ContatosEmpresa from './contatos'
import { Empresa } from '@/@types/generalTypes'

const { TabNav, TabList, TabContent } = Tabs

const EmpresaDetalhes = () => {
    const { idempresa } = useParams()

    const [empresa, setEmpresa] = useState<Empresa | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEmpresa() {
            const response = await fetch(
                `http://localhost:3333/empresas/${idempresa}`
            )

            if (response.ok) {
                const data = await response.json()
                setEmpresa(data)
                setLoading(false)
            } else {
                console.error(
                    'Erro na requisição:',
                    response.status,
                    response.statusText
                )
            }
        }

        fetchEmpresa()
    }, [])

    return (
        <Loading loading={loading}>
            {!isEmpty(empresa) && (
                <LayoutDetailSimple
                    title={empresa.nmfantasia}
                    status={empresa.flativo}
                    subtitle={`Cód. #${empresa.idempresa}`}
                    paymentStatus={{
                        S: {
                            label: 'Ativo',
                            class: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100',
                        },
                        N: {
                            label: 'Inativo',
                            class: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100',
                        },
                    }}
                    actions={
                        <div className="flex-wrap inline-flex xl:flex items-center gap-2">
                            <Button
                                size="xs"
                                variant="solid"
                                icon={<HiOutlineUserAdd />}
                            >
                                <span>Adicionar contato</span>
                            </Button>
                            <Button
                                size="xs"
                                variant="solid"
                                icon={<HiOutlinePencil />}
                            >
                                <span>Alterar Dados</span>
                            </Button>
                            <Button
                                size="xs"
                                variant="solid"
                                icon={<HiOutlineDocumentAdd />}
                            >
                                <span>Anexar Arquivo</span>
                            </Button>
                            <Button
                                size="xs"
                                variant="solid"
                                icon={<HiOutlineInformationCircle />}
                            >
                                <span>Informações para o AL Invest</span>
                            </Button>
                            <Button
                                size="xs"
                                variant="plain"
                                icon={<HiOutlineViewList />}
                            >
                                <span>Lista de Empresas</span>
                            </Button>
                        </div>
                    }
                >
                    {/* Aqui o conteúdo específico de cada página, pode ser qualquer coisa */}
                    <Tabs defaultValue="tab1">
                        <TabList>
                            <TabNav value="tab1">Detalhes</TabNav>
                            <TabNav value="tab2">Contatos Vinculados</TabNav>
                            <TabNav value="tab3">Núcleos Vinculados</TabNav>
                            <TabNav value="tab4">Projetos Vinculados</TabNav>
                            <TabNav value="tab5">Reuniões</TabNav>
                            <TabNav value="tab6">Documentos</TabNav>
                        </TabList>
                        <div className="p-4">
                            <TabContent value="tab1">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {empresa.nmfantasia}
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        {empresa.cidadeEmpresa.nmcidade +
                                            ' - ' +
                                            empresa.cidadeEmpresa.iduf}
                                    </p>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Filiada ACE
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {empresa.flfiliadoace === 'S'
                                                    ? 'Sim'
                                                    : 'Não'}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Formal
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {empresa.cdformalinformal ===
                                                'F'
                                                    ? 'Sim'
                                                    : 'Não'}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Razão Social
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {empresa.nurazaosocial}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                {empresa.nucnpjcpf.length > 11
                                                    ? 'CNPJ'
                                                    : 'CPF'}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {empresa.nucnpjcpf}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Nome Fantasia
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {empresa.nmfantasia}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Fundação
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {dayjs(
                                                    empresa.dtinicioatividade
                                                ).format('DD/MM/YYYY')}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Gestor
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.gestorEmpresa
                                                        ?.nmusuario
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                CPF do Gestor
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.gestorEmpresa
                                                        ?.nucpf
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Email do Gestor
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.gestorEmpresa
                                                        ?.dsemail
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Endereço
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(empresa?.dsendereco)}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Número
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(empresa?.nunumero)}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                CEP
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(empresa?.idcep)}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Endereço / Complemento
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(empresa?.dsendereco)}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Bairro
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(empresa?.dsbairro)}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Estado
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.cidadeEmpresa?.iduf
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                E-mail
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(empresa?.dsemail)}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Telefone
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(empresa?.nufone)}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Fax
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(empresa?.nufax)}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Banco
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                Banco do Brasil
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Agência
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.contaCorrente
                                                        ?.dsagencia
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Conta
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.contaCorrente
                                                        ?.dsconta
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Tipo
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.contaCorrente
                                                        ?.conta_tipo
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Tipo PIX
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.contaCorrente
                                                        ?.pix_tipo
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Chave PIX
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {noEmpty(
                                                    empresa?.contaCorrente
                                                        ?.pix_chave
                                                )}
                                            </dd>
                                        </div>

                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Última alteração
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {dayjs(
                                                    empresa.dtultimaalteracao
                                                ).format('DD/MM/YYYY')}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </TabContent>
                            <TabContent value="tab2">
                                <ContatosEmpresa
                                    idEmpresa={empresa.idempresa}
                                />
                            </TabContent>
                            <TabContent value="tab3">
                                <p>
                                    In C++ its harder to shoot yourself in the
                                    foot, but when you do, you blow off your
                                    whole leg. (Bjarne Stroustrup)
                                </p>
                            </TabContent>
                        </div>
                    </Tabs>
                </LayoutDetailSimple>
            )}
        </Loading>
    )
}

export default EmpresaDetalhes
