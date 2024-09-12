/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ReactNode } from 'react'
import classNames from 'classnames'
import Menu from '@/components/ui/Menu'
import ScrollBar from '@/components/ui/ScrollBar'
import Drawer from '@/components/ui/Drawer'
import useResponsive from '@/utils/hooks/useResponsive'
import { useNavigate } from 'react-router-dom'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Button from '@/components/ui/Button'
import { HiMenu, HiMenuAlt2 } from 'react-icons/hi'

const { MenuItem } = Menu

interface ToggleButtonProps {
    sideBarExpand: boolean
    setSideBarExpand: (value: boolean) => void
    mobileSideBarExpand: boolean
    setMobileSideBarExpand: (value: boolean) => void
    smaller: any
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
    sideBarExpand,
    setSideBarExpand,
    mobileSideBarExpand,
    setMobileSideBarExpand,
    smaller,
}) => {
    const onSideBarToggle = () => {
        setSideBarExpand(!sideBarExpand)
    }

    const onMobileSideBarToggle = () => {
        setMobileSideBarExpand(!mobileSideBarExpand)
    }

    return (
        <Button
            icon={
                smaller.xl ? (
                    mobileSideBarExpand ? (
                        <HiMenu />
                    ) : (
                        <HiMenuAlt2 />
                    )
                ) : sideBarExpand ? (
                    <HiMenu />
                ) : (
                    <HiMenuAlt2 />
                )
            }
            size="sm"
            variant="plain"
            shape="circle"
            onClick={smaller.xl ? onMobileSideBarToggle : onSideBarToggle}
        />
    )
}

interface MenuItem {
    value: string
    label: string | undefined
    isActive: boolean
    href: string
}

interface SideBarContentProps {
    title: string
    groupList: MenuItem[]
}

const SideBarContent: React.FC<SideBarContentProps> = ({
    title,
    groupList,
}) => {
    const navigate = useNavigate()

    const direction = 'ltr'

    const onMenuClick = (category: MenuItem): void => {
        navigate(category.href, { replace: true })
    }

    return (
        <ScrollBar direction={direction}>
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="my-8 mx-6">
                        <h3>{title}</h3>
                    </div>
                    <Menu variant="transparent" className="mx-2 mb-10">
                        {groupList.map((menu) => (
                            <MenuItem
                                key={menu.value}
                                eventKey={menu.value}
                                className={`mb-2 ${
                                    menu.isActive
                                        ? 'bg-gray-100 dark:bg-gray-700'
                                        : ''
                                }`}
                                onSelect={() => onMenuClick(menu)}
                            >
                                <span>{menu.label}</span>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </div>
        </ScrollBar>
    )
}

interface LayoutPageProps {
    title: string
    children: ReactNode
    groupList: MenuItem[]
}

export const LayoutWithMenus = ({
    title,
    children,
    groupList,
}: LayoutPageProps) => {
    const [sideBarExpand, setSideBarExpand] = useState(true)
    const [mobileSideBarExpand, setMobileSideBarExpand] = useState(false)

    const { smaller } = useResponsive()

    const currentOption = groupList.find(option => option.isActive);

    const onMobileSideBarClose = () => {
        setMobileSideBarExpand(false)
    }

    const direction = 'ltr'

    return (
        <AdaptableCard
            className="h-full overflow-hidden"
            bodyClass="p-0 h-full absolute inset-0 flex min-w-0 overflow-hidden"
        >
            {smaller.xl ? (
                <Drawer
                    bodyClass="p-0"
                    title={title}
                    isOpen={mobileSideBarExpand}
                    placement="left"
                    width={280}
                    onClose={onMobileSideBarClose}
                    onRequestClose={onMobileSideBarClose}
                >
                    <SideBarContent
                        title={title}
                        groupList={groupList}
                    />
                </Drawer>
            ) : (
                <div
                    className={classNames(
                        'w-[280px] absolute top-0 bottom-0 ease-in-out duration-300 bg-white dark:bg-gray-800 ltr:border-r rtl:border-l border-gray-200 dark:border-gray-600 z-10',
                        sideBarExpand
                            ? 'ltr:left-0 rtl:right-0'
                            : 'ltr:left-[-280px] rtl:right-[-280px]'
                    )}
                >
                    <SideBarContent
                        title={title}
                        groupList={groupList}
                    />
                </div>
            )}
            <div className="flex flex-auto w-full">
                <div
                    className={classNames(
                        'min-w-[360px] ease-in-out duration-300 relative flex flex-auto flex-col ltr:border-r rtl:border-l border-gray-200 dark:border-gray-600',
                        sideBarExpand && 'ltr:xl:ml-[280px] rtl:xl:mr-[280px]',
                        'xs:flex'
                    )}
                >
                    <div className="relative flex flex-0 items-center justify-between min-h-[55px] border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-1">
                            <ToggleButton
                                sideBarExpand={sideBarExpand}
                                setSideBarExpand={setSideBarExpand}
                                mobileSideBarExpand={mobileSideBarExpand}
                                setMobileSideBarExpand={setMobileSideBarExpand}
                                smaller={smaller}
                            />
                            <h6>{currentOption?.label}</h6>
                        </div>
                    </div>
                    <ScrollBar
                        autoHide
                        className="bg-[#F3F4F6] dark:bg-gray-800"
                        direction={direction}
                    >
                        <div className="p-4">{children}</div>
                    </ScrollBar>
                </div>
            </div>
        </AdaptableCard>
    )
}

export default LayoutWithMenus
