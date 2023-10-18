import {
    HiExclamation,
    HiCake,
    HiMail,
    HiBell,
    HiLockClosed,
} from 'react-icons/hi'
import { Alert, Button, Dialog } from '../ui' // Certifique-se de que os imports estão corretos.
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

    const getFirstAlert = () => {
        const firstAlert = alertsConfig.find(
            (alert) => data && Boolean(data[alert.key])
        )
        console.log(firstAlert, data)
        if (!firstAlert) return null

        return (
            <Alert
                showIcon
                type={firstAlert.type as TypeAttributes.Status}
                className="mb-1"
                customIcon={firstAlert.icon}
            >
                {firstAlert.message}
            </Alert>
        )
    }

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
            {' '}
            {/* This will make them side by side */}
            {activeAlerts.length > 0 && (
                <Alert
                    key={activeAlerts[0].key}
                    showIcon
                    type={activeAlerts[0].type as TypeAttributes.Status}
                    className="mb-1 alert-small" // Assuming "alert-small" reduces the size. Adjust as necessary.
                    customIcon={activeAlerts[0].icon}
                >
                    {activeAlerts[0].message}
                </Alert>
            )}
            {activeAlerts.length > 1 && (
                <Button
                    size="xs"
                    variant='solid'
                    className="absolute top-10 right-0" // This will position the button at the top right corner of the parent div.
                    onClick={() => setShowModal(true)}
                >
                    +
                </Button>
            )}
            <Dialog isOpen={showModal} onClose={() => setShowModal(false)}>
                {renderAlertsInModal()}
            </Dialog>
        </div>
    )
}

export default UserAlerts
