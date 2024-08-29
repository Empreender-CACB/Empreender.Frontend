/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { GoSignIn } from 'react-icons/go'

import { Link } from 'react-router-dom'
import moment from 'moment'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

import 'moment/locale/pt-br'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { setUser, signInSuccess, useAppDispatch } from '@/store'
import { UsuariosCard } from '@/components/shared/TableCards/UsuariosCard'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import { apiEntrarComo } from '@/services/MenuService'

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

const Usuarios = () => {
    const dispatch = useAppDispatch()

    const handleEntrarComo = async (userData: any) => {
        const cpf = userData.nucpf.replace(/[.-]/g, '')

        try {
            const response = await apiEntrarComo(cpf)
            const newToken = response.data.token.token
            const adaptedUser = {
                nucpf: response.data.user.nucpf,
                nmusuario: response.data.user.nmusuario,
                dsemail: response.data.user.dsemail,
                perfil: response.data.user.perfil,
                idobjeto: response.data.user.idobjeto,
                cod_perfil: response.data.user.cod_perfil,
                fotouser: response.data.user.fotouser,
                cdsexo: response.data.user.cdsexo,
                recursos: response.data.user.recursos,
                preferencias: response.data.user.preferencias,
                associacoes: response.data.user.associacoes,
                empresas: response.data.user.empresas,
                nucleos: response.data.user.nucleos,
                projetos: response.data.user.projetos,
            }
            dispatch(signInSuccess(newToken))
            dispatch(setUser(adaptedUser))

            const encodedCredentials = btoa(
                `${adaptedUser.nucpf}:${adaptedUser.nmusuario}`
            )
            window.location.href = `${
                import.meta.env.VITE_PHP_URL
            }/sistema/adminutils/trocar-usuario?credentials=${encodedCredentials}`
        } catch (error) {
            console.error('Erro ao tentar entrar como outro usuário', error)
        }
    }

    const columns = [
        { name: 'iduf', header: 'UF', type: 'string', flex: 0.4,minWidth: 80},
        { name: 'nmcidade', header: 'Cidade', defaultFlex: 1 },
        { name: 'nucpf', header: 'CPF', defaultFlex: 1 },
        {
            name: 'nmusuario',
            header: 'Nome do usuário',
            defaultFlex: 1.5,
            render: ({ data, value }: any) => (
                <Link
                    className="menu-item-link max-w-md text-blue-500"
                    to={`${
                        import.meta.env.VITE_PHP_URL
                    }/sistema/usuario/detalhe/uid/${btoa(data.id)}`}
                >
                    {value}
                </Link>
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
                    <TagActiveInative value={value} activeText="S" />
                </div>
            ),
        },
        {
            name: 'id',
            header: 'Ações',
            defaultFlex: 0.6,
            render: ({ data }: any) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
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
    ]

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Usuários</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">
                <Button size="sm" icon={<HiOutlineReply />}>
                        <Link
                            className="menu-item-link"
                            to={`${import.meta.env.VITE_PHP_URL}/sistema/usuario`}
                        >
                            Versão antiga
                        </Link>
                    </Button>

                    <Link
                        className="block lg:inline-block md:mb-0 mb-4"
                        to={`${import.meta.env.VITE_PHP_URL}/sistema/usuario/adicionar`}
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
                filename="Usuários"
                columns={columns}
                defaultFilterValue={defaultFilterValue}
                url={`${import.meta.env.VITE_API_URL}/usuarios`}
                CardLayout={UsuariosCard}
            />
        </AdaptableCard>
    )
}

export default Usuarios
