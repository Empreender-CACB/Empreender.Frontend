import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { setUser, signInSuccess, useAppDispatch, useAppSelector } from '@/store'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'
import { GoSignIn } from 'react-icons/go'
import axios from 'axios'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'Perfil',
        path: '/app/account/settings/profile',
        icon: <HiOutlineUser />,
    },
    {
        label: 'Preferências',
        path: '/app/account/settings/profile',
        icon: <HiOutlineCog />,
    },
]

const _UserDropdown = ({ className }: CommonProps) => {
    const { dsemail, nmusuario, fotouser } = useAppSelector(
        (state) => state.auth.user
    )

    const { token } = useAppSelector((state) => state.auth.session)
    const originalToken = localStorage.getItem('originalToken')

    const dispatch = useAppDispatch()

    const signOutEntrarComo = () => {

        if (originalToken) {
            dispatch(signInSuccess(originalToken))
            axios
                .get(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${originalToken}`,
                    },
                })
                .then((response) => {
                    const user = response.data

                    const adaptedUser = {
                        nucpf: user.nucpf,
                        nmusuario: user.nmusuario,
                        dsemail: user.dsemail,
                        perfil: user.perfil,
                        cod_perfil: user.cod_perfil,
                        fotouser: user.fotouser,
                        recursos: user.recursos,
                        preferencias: user.preferencias,
                    }

                    dispatch(setUser(adaptedUser))
                    window.location.href = `${import.meta.env.VITE_PHP_URL}/sistema/adminutils/retornar-sessao-usuario?isExternal=true`;
                })
                .catch((error) => {
                    console.error(
                        'Erro ao atualizar informações do usuário',
                        error
                    )
                })
        } else {
            console.error('Nenhum token original encontrado')
        }
    }

    const { signOut } = useAuth()

    const UserAvatar = (
        <div className={classNames(className, 'flex items-center gap-2')}>
            <Avatar
                size={32}
                shape="circle"
                src={
                    fotouser
                        ? `https://www.empreender.org.br/` + fotouser
                        : '/img/avatars/user-icon.png'
                }
            />
            <div className="hidden md:block">
                <div className="font-bold">{nmusuario}</div>
            </div>
        </div>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        <Avatar
                            shape="circle"
                            src={
                                fotouser
                                    ? `https://www.empreender.org.br/` +
                                      fotouser
                                    : '/img/avatars/user-icon.png'
                            }
                        />
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                {nmusuario}
                            </div>
                            <div className="text-xs">{dsemail}</div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link
                            className="flex h-full w-full px-2"
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}
                <Dropdown.Item variant="divider" />
                {token !== originalToken && 
                    <Dropdown.Item
                        eventKey="Sign Out Entrar como"
                        className="gap-2"
                        onClick={signOutEntrarComo}
                    >
                        <span className="text-xl opacity-50">
                            <GoSignIn title="Entrar como" />
                        </span>
                        <span>Sair do modo &quot;Entrar como&quot;</span>
                    </Dropdown.Item>
                }
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={signOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Sair</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
