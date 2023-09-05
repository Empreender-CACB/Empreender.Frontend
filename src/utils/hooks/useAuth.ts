/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const signIn = async (
        values: SignInCredential
    ): Promise<
        | {
            status: Status
            message: string
          }
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(signInSuccess(token.token))

                if (resp.data.user) {
                    const adaptedUser = {
                        nucpf: resp.data.user.nucpf,
                        nmusuario: resp.data.user.nmusuario,
                        dsemail: resp.data.user.dsemail,
                        perfil: resp.data.user.perfil,
                        cod_perfil: resp.data.user.cod_perfil,
                        fotouser: resp.data.user.fotouser,
                        recursos: resp.data.user.recursos,
                        preferencias: resp.data.user.preferencias,
                    }

                    localStorage.setItem('originalToken', token.token);
                    dispatch(setUser(adaptedUser))
                }

                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )

                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {}

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                nucpf: '',
                nmusuario: '',
                dsemail: '',
                perfil: '',
                cod_perfil: 0,
                fotouser: '',
                recursos: [],
                preferencias: [],
            })
        )
        localStorage.removeItem('originalToken');

        window.location.href = `${import.meta.env.VITE_PHP_URL}/sistema/adminutils/retornar-sessao-usuario?isExternal=true`;
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        // await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
