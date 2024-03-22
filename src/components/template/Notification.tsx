import { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import ApiService from '@/services/ApiService';
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import Switcher from '@/components/ui/Switcher'

import {
    HiOutlineBell,
    HiNewspaper,
    HiOutlineClipboardCheck,
    HiOutlineBan,
    HiOutlineMailOpen,
} from 'react-icons/hi'
import {
    apiGetNotificationList,
    apiGetNotificationCount,
} from '@/services/CommonService'
import { Link } from 'react-router-dom'
import isLastChild from '@/utils/isLastChild'
import useTwColorByName from '@/utils/hooks/useTwColorByName'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useAppSelector } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import acronym from '@/utils/acronym'
type NotificationList = {
    id: number
    nucpf: string
    titulo: string
    mensagem: string
    url: string
    lida: boolean
    data_criacao: string
    entidade: string
    id_entidade: string
}

const notificationHeight = 'h-72'
const imagePath = '/img/avatars/'

const GeneratedAvatar = ({ target }: { target: string }) => {
    const color = useTwColorByName()
    return (
        <Avatar shape="circle" className={`${color(target)}`}>
            {acronym(target)}
        </Avatar>
    )
}

const notificationTypeAvatar = (data: {
    entidade: any
    target: string
    image: string
    status: string
}) => {
    const { entidade, target, image, status } = data
    switch (entidade) {
        case 0:
            if (image) {
                return <Avatar shape="circle" src={`${imagePath}${image}`} />
            } else {
                return <GeneratedAvatar target={target} />
            }
        case 'blog_pde':
            return (
                <Avatar
                    shape="circle"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100"
                    icon={<HiNewspaper />}
                />
            )
        case 'lancamentos':
            return (
                <Avatar
                    shape="circle"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100"
                    icon={<HiNewspaper />}
                />
            )
        case 2:
            return (
                <Avatar
                    shape="circle"
                    className={
                        status === 'succeed'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100'
                            : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100'
                    }
                    icon={
                        status === 'succeed' ? (
                            <HiOutlineClipboardCheck />
                        ) : (
                            <HiOutlineBan />
                        )
                    }
                />
            )
        default:
            return <Avatar />
    }
}

const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    return (
        <div className={classNames('text-2xl', className)}>
            {dot ? (
                <Badge badgeStyle={{ top: '3px', right: '6px' }}>
                    <HiOutlineBell />
                </Badge>
            ) : (
                <HiOutlineBell />
            )}
        </div>
    )
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<
        NotificationList[]
    >([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [viewAll, setViewAll] = useState(true)
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [currentNotification, setCurrentNotification] = useState('');

    const { bgTheme } = useThemeClass()

    const { larger } = useResponsive()

    const direction = useAppSelector((state) => state.theme.direction)

    const getNotificationCount = useCallback(async () => {
        const resp = await apiGetNotificationCount()
        if (resp.data.count > 0) {
            setNoResult(false)
            setUnreadNotification(true)
        } else {
            setNoResult(true)
            setUnreadNotification(false)
        }
    }, [setUnreadNotification])

    useEffect(() => {
        getNotificationCount()
    }, [location.pathname, getNotificationCount])

    const onNotificationOpen = useCallback(async () => {
        if (notificationList.length === 0) {
            setLoading(true)
            const resp = await apiGetNotificationList()
            setLoading(false)
            setNotificationList(resp.data)
        }
    }, [notificationList, setLoading])

    const onMarkAllAsRead = useCallback(async () => {
        const list = notificationList.map((item: NotificationList) => {
            if (!item.lida) {
                item.lida = true
            }
            return item
        })
        await ApiService.fetchData({
            url: `/notifications/markAllAsRead`,
            method: 'get'
        });
        setNotificationList(list)
        setUnreadNotification(false)
    }, [notificationList])

    // Filtrar o objeto no switcher
    // const filterReadNotification = useCallback((reads: boolean) => {
    //     if (reads) {
    //         setNotificationList(notificationList.filter(item => !item.lida))
    //     }
    //     onNotificationOpen()
    // }, [notificationList])

    const onMarkAsRead = useCallback(async (id: any) => {
        // Atualiza o estado primeiro para uma resposta rápida na UI
        setNotificationList(currentList => currentList.map(item => {
            if (Number(item.id) === id) {
                return { ...item, lida: !item.lida };
            }
            return item;
        }));

        return await updateNotificationStatus(id);

    }, []);

    const onSwitcherToggle = (val: boolean) => {
        //filterReadNotification(val)
        setViewAll(val)
    }

    const updateNotificationStatus = async (id: any) => {
        try {
            await ApiService.fetchData({
                url: `/notifications/swapStatus/${id}`,
                method: 'get'
            });
            //console.log('Notificação atualizada:', response);
            //return response.data.data;
        } catch (error) {
            console.error('Erro ao mudar status da notificação:', error);
            return null;
        }
    };

    const openModalWithNotification = (notification: string) => {
        setCurrentNotification(notification);
        setIsOpen(true);
    };

    const hasNotificationsToShow = viewAll ? notificationList.length > 0 : notificationList.some(item => !item.lida);

    return (
        <>

            <Dialog
                isOpen={dialogIsOpen}
                width={700}
                onClose={() => setIsOpen(false)}

            >
                <div dangerouslySetInnerHTML={{__html: currentNotification}} />
                <div className="text-right mt-6">

                    <Button variant="solid" onClick={() => setIsOpen(false)}>
                        Ok
                    </Button>
                </div>
            </Dialog>

            <Dropdown
                renderTitle={
                    <NotificationToggle
                        dot={unreadNotification}
                        className={className}
                    />
                }
                menuClass="p-0 min-w-[280px] md:min-w-[440px]"
                placement={larger.md ? 'bottom-end' : 'bottom-center'}
                onOpen={onNotificationOpen}
            >
                <Dropdown.Item variant="header">
                    <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center justify-between">
                        <h6>Notificações e avisos</h6>

                        <div className="text-sx flex center items-center space-x-1">
                            <p>Apresentar lidas </p> <Switcher defaultChecked onChange={onSwitcherToggle} />
                        </div>
                        <Tooltip title="Marcar todas como lida">
                            <Button
                                variant="plain"
                                shape="circle"
                                size="sm"
                                icon={<HiOutlineMailOpen className="text-xl" />}
                                onClick={onMarkAllAsRead}
                            />
                        </Tooltip>
                    </div>
                </Dropdown.Item>
                <div className={classNames('overflow-y-auto', notificationHeight)}>
                    <ScrollBar direction={direction}>

                        {notificationList.length > 0 && (
                            (viewAll ? notificationList : notificationList.filter(item => !item.lida))
                                .map((item, index) => (
                                    <div key={index}>
                                        <div
                                            className={`relative flex px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20  ${!isLastChild(notificationList, index)
                                                ? 'border-b border-gray-200 dark:border-gray-600'
                                                : ''
                                                }`}
                                            onClick={() => onMarkAsRead(item.id)}
                                        >
                                            <div onClick={() => openModalWithNotification(item.mensagem)}>{notificationTypeAvatar(item)}</div>
                                            <div onClick={() => openModalWithNotification(item.mensagem)} className="ltr:ml-3 rtl:mr-3">
                                                <div>
                                                    {item.target && (
                                                        <span className="font-semibold heading-text">
                                                            {item.target}{' '}
                                                        </span>
                                                    )}
                                                    <span onClick={() => openModalWithNotification(item.mensagem)}>{item.titulo}</span>
                                                </div>
                                                <span onClick={() => openModalWithNotification(item.mensagem)}  className="text-xs">{item.data_criacao}</span>
                                            </div>
                                            <Badge
                                                className={`absolute top-4 ltr:right-4 rtl:left-4 mt-1.5 ${item.lida ? 'bg-gray-300' : bgTheme
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                ))
                        )}
                        {loading && (
                            <div
                                className={classNames(
                                    'flex items-center justify-center',
                                    notificationHeight
                                )}
                            >
                                <Spinner size={40} />
                            </div>
                        )}

                        {
                            !hasNotificationsToShow && (
                                <div
                                    className={classNames(
                                        'flex items-center justify-center',
                                        notificationHeight // Certifique-se de que `notificationHeight` está definido corretamente
                                    )}
                                >
                                    <div className="text-center">
                                        <img
                                            className="mx-auto mb-2 max-w-[150px]"
                                            src="/img/others/no-notification.png"
                                            alt="no-notification"
                                        />
                                        <h6 className="font-semibold">
                                            Sem novas notificações!
                                        </h6>
                                        {/* <p className="mt-1">Volte depois ;)</p> */}
                                    </div>
                                </div>
                            )
                        }
                    </ScrollBar>
                </div>
                <Dropdown.Item variant="header">
                    <div className="flex justify-center border-t border-gray-200 dark:border-gray-600 px-4 py-2">
                        <Link
                            to="/app/account/activity-log"
                            className="font-semibold cursor-pointer p-2 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                        >
                            Visualizar todas as notificações
                        </Link>
                    </div>
                </Dropdown.Item>
            </Dropdown>
        </>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
