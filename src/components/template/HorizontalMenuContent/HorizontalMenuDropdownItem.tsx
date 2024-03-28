import Dropdown from '@/components/ui/Dropdown'
import HorizontalMenuNavLink from './HorizontalMenuNavLink'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import { fetchRfbVersion } from '@/views/sistema/adminutils/outros/versao-rfb'


export type HorizontalMenuItemProps = {
    nav: {
        key: string
        title: string
        translateKey?: string
        icon: string
        path: string
    }
}

const handleVersionButtonClick = async () => {
    try {
        const rfbVersion = await fetchRfbVersion()
        const toastNotification = (

            <Notification>
                {rfbVersion}
            </Notification>
        )
        toast.push(toastNotification)
    } catch (error) {
        const toastErrorNotification = (

            <Notification>
                Não foi possível completar a operação. Por favor, tente novamente.
            </Notification>
        )
        console.error('Erro ao obter a versão da RFB:', error)
        toast.push(toastErrorNotification)
    }
};

const HorizontalMenuDropdownItem = ({ nav }: HorizontalMenuItemProps) => {
    const { title, translateKey, path, key } = nav

    const { t } = useTranslation()

    const itemTitle = translateKey ? t(translateKey, title) : title;

    return (
        <Dropdown.Item 
            eventKey={key} 
            className={
                classNames(
                    path && 'px-0'
                )
            }
        >
            {path ? (
                <HorizontalMenuNavLink 
                    path={path}
                    className={
                        classNames(
                            path && 'px-2'
                        )
                    }
                >
                    {itemTitle}
                </HorizontalMenuNavLink>
            ) : (
                    <>
                        {key == 'appVersaoRfb' ? <span onClick={handleVersionButtonClick}>{itemTitle}</span> : <span>{itemTitle}</span>}
                    </>
                )
            }
        </Dropdown.Item>
    )
}

export default HorizontalMenuDropdownItem
