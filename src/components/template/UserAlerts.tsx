import {
    HiExclamation,
    HiCake,
    HiMail,
    HiBell,
    HiLockClosed,
} from 'react-icons/hi'
import { Alert, Button, Dialog } from '../ui'
import { useEffect, useState } from 'react'
import ApiService from '@/services/ApiService'
import { AxiosResponse } from 'axios'
import { TypeAttributes } from '../ui/@types/common'

interface DataResponse {
    dadosIncompletosNaoObrigatorios: boolean
    dadosIncompletosObrigatorios: boolean
    aniversario: boolean
    foiAniversario: boolean
    atualizarEmail: boolean
    temNovidade: boolean
    atualizarSenha: boolean
    [key: string]: boolean
}

const alertsConfig = [
    {
        key: 'dadosIncompletosNaoObrigatorios',
        type: 'warning',
        icon: <HiExclamation />,
        message: 'Dados não obrigatórios incompletos.',
    },
    {
        key: 'dadosIncompletosObrigatorios',
        type: 'danger',
        icon: <HiExclamation />,
        message: 'Faltam dados obrigatórios. Por favor, complete seu perfil.',
    },
    {
        key: 'aniversario',
        type: 'success',
        icon: <HiCake />,
        message: 'Feliz Aniversário!',
    },
    {
        key: 'foiAniversario',
        type: 'info',
        icon: <HiCake />,
        message:
            'Esperamos que tenha tido uma ótima celebração de aniversário.',
    },
    {
        key: 'atualizarEmail',
        type: 'warning',
        icon: <HiMail />,
        message:
            'Várias contas foram detectadas com seu e-mail. Por favor, atualize.',
    },
    {
        key: 'temNovidade',
        type: 'success',
        icon: <HiBell />,
        message: 'Você tem novas atualizações ou notificações.',
    },
    {
        key: 'atualizarSenha',
        type: 'warning',
        icon: <HiLockClosed />,
        message: 'Alerta de segurança: Por favor, atualize sua senha.',
    },
]

const UserAlerts = () => {
    const [data, setData] = useState<DataResponse | null>(null)
    const [showModal, setShowModal] = useState(false)
    const activeAlerts = alertsConfig.filter(
        (alert) => data && Boolean(data[alert.key])
    )

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

    const renderAlertsInModal = () => {
        return alertsConfig
            .map((alert) => {
                if (data && data[alert.key]) {
                    return (
                        <Alert
                            key={alert.key}
                            showIcon
                            type={alert.type as TypeAttributes.Status}
                            className="mb-1"
                            customIcon={alert.icon}
                        >
                            {alert.message}
                        </Alert>
                    )
                }
                return null
            })
            .filter(Boolean)
    }

    return (
        <div className="relative flex items-center space-x-4">
            {activeAlerts.length > 0 && (
                <Alert
                    key={activeAlerts[0].key}
                    showIcon
                    type={activeAlerts[0].type as TypeAttributes.Status}
                    className="mb-1 alert-small"
                    customIcon={activeAlerts[0].icon}
                >
                    {activeAlerts[0].message}
                </Alert>
            )}
            {activeAlerts.length > 1 && (
                <Button
                    size="xs"
                    variant='solid'
                    className="absolute top-10 right-0"
                    onClick={() => setShowModal(true)}
                >
                    +
                </Button>
            )}
            <Dialog isOpen={showModal} onClose={() => setShowModal(false)}>
                <h5 className="mb-4">Seus avisos</h5>
                {renderAlertsInModal()}
            </Dialog>
        </div>
    )
}

export default UserAlerts
