import {
    HiExclamation,
    HiCake,
    HiMail,
    HiBell,
    HiLockClosed,
} from 'react-icons/hi'
import { Alert, Card } from '../ui'
import { useEffect, useState } from 'react'
import ApiService from '@/services/ApiService'
import { AxiosResponse } from 'axios'

interface DataResponse {
    dadosIncompletosNaoObrigatorios: boolean
    dadosIncompletosObrigatorios: boolean
    aniversario: boolean
    foiAniversario: boolean
    atualizarEmail: boolean
    temNovidade: boolean
    atualizarSenha: boolean
}

const UserAlerts = () => {
    const [data, setData] = useState<DataResponse | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<DataResponse> =
                    await ApiService.fetchData({
                        url: '/user-data',
                        method: 'get',
                    })
                setData(response.data)
            } catch (error) {
                console.error('Não foi possível carregar os dados:', error)
            }
        }
        fetchData()
    }, [])
    return (
        <Card>
            {data?.dadosIncompletosNaoObrigatorios || true && (
                <Alert showIcon type="warning" className='mb-1' customIcon={<HiExclamation />}>
                    Dados não obrigatórios incompletos.
                </Alert>
            )}

            {data?.dadosIncompletosObrigatorios || true && (
                <Alert showIcon type="danger" className='mb-1' customIcon={<HiExclamation />}>
                    Faltam dados obrigatórios. Por favor, complete seu perfil.
                </Alert>
            )}

            {data?.aniversario || true && (
                <Alert showIcon type="success" className='mb-1' customIcon={<HiCake />}>
                    Feliz Aniversário!
                </Alert>
            )}

            {data?.foiAniversario || true && (
                <Alert showIcon type="info" className='mb-1' customIcon={<HiCake />}>
                    Esperamos que tenha tido uma ótima celebração de
                    aniversário.
                </Alert>
            )}

            {data?.atualizarEmail || true && (
                <Alert showIcon type="warning" className='mb-1' customIcon={<HiMail />}>
                    Várias contas foram detectadas com seu e-mail. Por favor,
                    atualize.
                </Alert>
            )}

            {data?.temNovidade || true && (
                <Alert showIcon type="success" className='mb-1' customIcon={<HiBell />}>
                    Você tem novas atualizações ou notificações.
                </Alert>
            )}

            {data?.atualizarSenha || true && (
                <Alert showIcon type="warning" className='mb-1' customIcon={<HiLockClosed />}>
                    Alerta de segurança: Por favor, atualize sua senha.
                </Alert>
            )}
        </Card>
    )
}

export default UserAlerts
