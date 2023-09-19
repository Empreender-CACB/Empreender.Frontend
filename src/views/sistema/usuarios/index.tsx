/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { GoSignIn } from 'react-icons/go'

import { Link } from 'react-router-dom'
import moment from 'moment'
import { Button, Tag } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import classNames from 'classnames'
import { setUser, signInSuccess, useAppDispatch } from '@/store'
import axios from 'axios'

moment.locale('pt-br')

const defaultFilterValue = [
    { name: 'iduf', operator: 'contains', type: 'string', value: '' },
    { name: 'nmcidade', operator: 'contains', type: 'string', value: '' },
    { name: 'nucpf', operator: 'contains', type: 'string', value: '' },
    { name: 'nmusuario', operator: 'contains', type: 'string', value: '' },
    { name: 'nmlogin', operator: 'contains', type: 'string', value: '' },
    { name: 'nome', operator: 'contains', type: 'string', value: '' },
    { name: 'flativo', operator: 'contains', type: 'string', value: '' },
]

type StatusType = 'S' | 'N'

const statusMapping: Record<StatusType, { label: string; class: string }> = {
    S: {
        label: 'Ativo',
        class: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100',
    },
    N: {
        label: 'Inativo',
        class: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100',
    },
}

const Usuarios = () => {
    const dispatch = useAppDispatch()

    const handleEntrarComo = (userData: any) => {
        const cpf = userData.nucpf.replace(/[.-]/g, '');

        axios
            .post(`${import.meta.env.VITE_API_URL}/entrar-como`, { nucpf: cpf })
            .then((response) => {
                const newToken = response.data.token.token
                const adaptedUser = {
                    nucpf: response.data.user.nucpf,
                    nmusuario: response.data.user.nmusuario,
                    dsemail: response.data.user.dsemail,
                    perfil: response.data.user.perfil,
                    cod_perfil: response.data.user.cod_perfil,
                    fotouser: response.data.user.fotouser,
                    recursos: response.data.user.recursos,
                    preferencias: response.data.user.preferencias,
                }
                dispatch(signInSuccess(newToken))
                dispatch(setUser(adaptedUser))

                const encodedCredentials = btoa(`${adaptedUser.nucpf}:${adaptedUser.nmusuario}`);
                window.location.href = `${import.meta.env.VITE_PHP_URL}/sistema/adminutils/trocar-usuario?credentials=${encodedCredentials}`;
            })
            .catch((error) => {
                console.error('Erro ao tentar entrar como outro usuário', error)
            })
    }

    const columns = [
        { name: 'iduf', header: 'UF', type: 'string', flex: 0.4 },
        { name: 'nmcidade', header: 'Cidade', defaultFlex: 1 },
        { name: 'nucpf', header: 'CPF', defaultFlex: 1 },
        {
            name: 'nmusuario',
            header: 'Nome Usuário',
            defaultFlex: 1.5,
            render: ({ data }: any) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {data.nmusuario}
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleEntrarComo(data)}
                    >
                        <GoSignIn size={20} title="Entrar como" />
                    </button>
                </div>
            ),
        },
        { name: 'nmlogin', header: 'Login', defaultFlex: 1 },
        { name: 'nome', header: 'Perfil', defaultFlex: 1 },
        {
            name: 'flativo',
            header: 'Ativo',
            defaultFlex: 0.6,
            render: ({ value }: any) => (
                <div className="flex items-center justify-center">
                    <Tag
                        className={classNames(
                            'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                            statusMapping[value as StatusType]?.class || ''
                        )}
                    >
                        {statusMapping[value as StatusType]?.label || ''}
                    </Tag>
                </div>
            ),
        },
    ]

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Usuários</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <Link
                        download
                        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                        to="/data/user-list.csv"
                        target="_blank"
                    >
                        <Button block size="sm" icon={<HiDownload />}>
                            Exportar
                        </Button>
                    </Link>
                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to="/app/users/user-new"
                    >
                        <Button
                            block
                            variant="solid"
                            size="sm"
                            icon={<HiPlusCircle />}
                        >
                            Adicionar usuário
                        </Button>
                    </Link>
                </div>
            </div>

            <CustomReactDataGrid
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/usuarios`}
            />
        </AdaptableCard>
    )
}

export default Usuarios
