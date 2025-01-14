/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import Tabs from '@/components/ui/Tabs'
import Loading from '@/components/shared/Loading'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'

import { Link, useParams } from 'react-router-dom'
import LayoutDetailSimple from '@/components/layouts/LayoutDetailSimple'

import isEmpty from 'lodash/isEmpty'
import {
    HiOutlinePencil,
    HiOutlineReply,
} from 'react-icons/hi'
import LayoutWithMenus from '@/components/layouts/LayoutWithMenus'
import { Associacao } from '@/@types/generalTypes'
import { noEmpty } from '@/utils/noEmpty'
import Detalhes from './detalhes'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import ApiService from '@/services/ApiService'


import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

import moment from 'moment'

moment.locale('pt-br')
const columns = [

    {
        name: 'idbanco',
        header: 'ID Banco',
        type: 'string',
        operator: 'contains',
        defaultFlex: 1.5,
    },
    {
        name: 'dsagencia',
        header: 'Agência',
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'pix_tipo',
        header: 'Tipo PIX',
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'pix_chave',
        header: 'Chave PIX',
        type: 'string',
        operator: 'contains',
        value: '',
    },
    {
        name: 'apelido',
        header: 'Apelido',
        type: 'string',
        operator: 'contains',
        defaultFlex: 0.6,
        value: '',
    },
]

const { TabNav, TabList, TabContent } = Tabs

const NucleoDetalhes = () => {
    const { id } = useParams()

    const [associacao, setAssociacao] = useState<Associacao | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiService.fetchData({
                    url: `/entidades/${id}`,
                    method: 'get',
                });

                if (response) {
                    setAssociacao(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }

        fetchData();
    }, [id]);

    const optionsList = [
        {
            value: 'detalhes',
            label: 'Detalhes',
            isActive: !['reunioes', 'acoes', 'documentos', 'anotacoes'].some(
                (route) => location.pathname.includes(route)
            ),
            href: `${APP_PREFIX_PATH}/nucleos/${id}`,
        },
        {
            value: 'al_invest',
            label: 'AL Invest',
            isActive: location.pathname.includes('reunioes'),
            href: `${APP_PREFIX_PATH}/nucleos/reunioes/${id}`,
        },
        {
            value: 'diagnosticos',
            label: 'Diagnósticos',
            isActive: location.pathname.includes('diagnosticos'),
            href: '#',
        },
        {
            value: 'e_2022_al_invest',
            label: 'E2022 & AL Invest',
            isActive: location.pathname.includes('numsei'),
            href: '#',
        },
        {
            value: 'empresas_vinculadas',
            label: 'Empresas Vinculadas',
            isActive: location.pathname.includes('empresas_vinculadas'),
            href: '#',
        },
        {
            value: 'entidades_vinculadas',
            label: 'Entidades Vinculadas',
            isActive: location.pathname.includes('entidades_vinculadas'),
            href: '#',
        },
        {
            value: 'nucleos_vinculados',
            label: 'Núcleos Vinculados',
            isActive: location.pathname.includes('nucleos_vinculados'),
            href: '#',
        },
        {
            value: 'perfil',
            label: 'Perfil',
            isActive: location.pathname.includes('perfil'),
            href: '#',
        },
        {
            value: 'projetos',
            label: 'Projetos',
            isActive: location.pathname.includes('projetos'),
            href: '#',
        },
    ]

    const OptionsButton = (
        <Button size="xs" variant="solid" icon={<HiOutlinePencil />}>
            Opções da Entidade
        </Button>
    )

    return (
        <Loading loading={loading}>
            {!isEmpty(associacao) && (
                <LayoutWithMenus
                    title={'Categorias'}
                    groupList={optionsList}
                >
                    <LayoutDetailSimple
                        title={associacao.nmrazao}
                        status={associacao.flativo}
                        subtitle={`Cód. ${associacao.idassociacao}`}
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
                                <Button size="xs" icon={<HiOutlineReply />}>
                                    <Link
                                        className="menu-item-link"
                                        to={`${import.meta.env.VITE_PHP_URL}/sistema/nucleo/detalhe/nid/${btoa(String(associacao.id))}`}
                                    >
                                        Versão antiga
                                    </Link>
                                </Button>
                                <Dropdown renderTitle={OptionsButton}>
                                    <Dropdown.Item eventKey="f">
                                        Vincular Entidades
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="a">
                                        Alterar dados
                                    </Dropdown.Item>

                                </Dropdown>

                            </div>
                        }
                    >
                        {/* Aqui o conteúdo específico de cada página, pode ser qualquer coisa */}
                        <Tabs defaultValue="tab1">
                            <TabList>
                                <TabNav value="tab1">Detalhes</TabNav>
                                <TabNav value="banco">
                                    Dados Bancários
                                </TabNav>
                                <TabNav value="contatos">
                                    Diretoria e Contatos
                                </TabNav>
                                <TabNav value="anotacoes">
                                    Anotações
                                </TabNav>
                                <TabNav value="pendencia">
                                    Pendências
                                </TabNav>
                                <TabNav value="documentos">
                                    Documentos
                                </TabNav>
                            </TabList>
                            <div className="p-4">
                                <TabContent value="tab1">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {associacao.nmnucleo}
                                        </h3>
                                        <p className="flex mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">
                                            {noEmpty(
                                                associacao.cidade
                                                    .nmcidade
                                            ) +
                                                ' - ' +
                                                noEmpty(
                                                    associacao.cidade
                                                        .iduf
                                                )}
                                                            
            <img
              className="h-5 ml-2"
              src={`/img/estados/rounded/png-200/${noEmpty(
                associacao.cidade
                    .iduf
            )}.png`}
              alt="CACB"
            />
                                        </p>
                                    </div>
                                    <Detalhes data={associacao} />
                                </TabContent>
                                <TabContent value="banco">
                                    


<CustomReactDataGrid
filename={`Contas Bancárias - ${associacao.nmrazao}`}
columns={columns}
url={`${import.meta.env.VITE_API_URL
    }/entidades/accounts/${id}`}
/>
                                </TabContent>
                                <TabContent value="tab3"></TabContent>
                            </div>
                        </Tabs>
                    </LayoutDetailSimple>
                </LayoutWithMenus>
            )}
        </Loading>
    )
}

export default NucleoDetalhes
