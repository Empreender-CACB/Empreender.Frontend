import { useEffect } from 'react'
import classNames from 'classnames'
import Menu from '@/components/ui/Menu'
import Badge from '@/components/ui/Badge'
import ScrollBar from '@/components/ui/ScrollBar'
import Drawer from '@/components/ui/Drawer'
import useResponsive from '@/utils/hooks/useResponsive'

import { useNavigate, useLocation } from 'react-router-dom'
import {
    updateSelectedCategory,
    toggleMobileSidebar,
    useAppDispatch,
    useAppSelector,
} from '@/store'

import {
    HiOutlineInbox,
    HiOutlinePaperAirplane,
    HiOutlinePencil,
    HiOutlineStar,
    HiOutlineTrash,
} from 'react-icons/hi'


const groupList: Group[] = [
    { value: 'inbox', label: 'Inbox', icon: <HiOutlineInbox /> },
    { value: 'sentItem', label: 'Sent Item', icon: <HiOutlinePaperAirplane /> },
    { value: 'draft', label: 'Draft', icon: <HiOutlinePencil /> },
    { value: 'starred', label: 'Starred', icon: <HiOutlineStar /> },
    { value: 'deleted', label: 'Deleted', icon: <HiOutlineTrash /> },
]

const labelList: Label[] = [
    { value: 'work', label: 'Work', dotClass: 'bg-blue-500' },
    { value: 'private', label: 'Private', dotClass: 'bg-indigo-500' },
    { value: 'important', label: 'Important', dotClass: 'bg-red-500' },
]


type MenuBase = {
    value: string
    label: string
}

type Group = MenuBase & {
    icon: JSX.Element
}

type Label = MenuBase & {
    dotClass: string
}

const { MenuItem, MenuGroup } = Menu

const MailSideBarContent = () => {
    useAppSelector
    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useAppDispatch()

    const selectedCategory = useAppSelector(
        (state) => state.crmMail.data.selectedCategory
    )

    const direction = useAppSelector((state) => state.theme.direction)

    const onMenuClick = (category: Group | Label) => {
        dispatch(updateSelectedCategory(getCategory(category.value)))
        navigate(`/app/crm/mail/${category.value}`, { replace: true })
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const selected = getCategory(path)
        dispatch(updateSelectedCategory(selected))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCategory = (value: string) => {
        const categories = [...groupList, ...labelList]
        let category = value
        if (category === 'mail') {
            category = 'inbox'
        }
        return {
            value: category,
            label: categories.find((cat) => cat.value === category)?.label,
        }
    }

    return (
        <ScrollBar direction={direction}>
            <div className="flex flex-col justify-between h-full">
                <div>
                    <div className="my-8 mx-6">
                        <h3>Mailbox</h3>
                    </div>
                    <Menu variant="transparent" className="mx-2 mb-10">
                        {groupList.map((menu) => (
                            <MenuItem
                                key={menu.value}
                                eventKey={menu.value}
                                className={`mb-2 ${
                                    selectedCategory.value === menu.value
                                        ? 'bg-gray-100 dark:bg-gray-700'
                                        : ''
                                }`}
                                onSelect={() => onMenuClick(menu)}
                            >
                                <span className="text-2xl ltr:mr-2 rtl:ml-2">
                                    {menu.icon}
                                </span>
                                <span>{menu.label}</span>
                            </MenuItem>
                        ))}
                    </Menu>
                    <Menu variant="transparent" className="mx-2 mb-6">
                        <MenuGroup label="Labels">
                            {labelList.map((label) => (
                                <MenuItem
                                    key={label.value}
                                    eventKey={label.value}
                                    className={`mb-2 ${
                                        selectedCategory.value === label.value
                                            ? 'bg-gray-100 dark:bg-gray-700'
                                            : ''
                                    }`}
                                    onSelect={() => onMenuClick(label)}
                                >
                                    <Badge
                                        className="ltr:mr-2 rtl:ml-2"
                                        innerClass={label.dotClass}
                                    />
                                    <span>{label.label}</span>
                                </MenuItem>
                            ))}
                        </MenuGroup>
                    </Menu>
                </div>
            </div>
        </ScrollBar>
    )
}

const MailSidebar = () => {
    const sideBarExpand = useAppSelector(
        (state) => state.crmMail.data.sideBarExpand
    )

    const mobileSideBarExpand = useAppSelector(
        (state) => state.crmMail.data.mobileSideBarExpand
    )

    const dispatch = useAppDispatch()

    const { smaller } = useResponsive()

    const onMobileSideBarClose = () => {
        dispatch(toggleMobileSidebar(false))
    }

    return smaller.xl ? (
        <Drawer
            bodyClass="p-0"
            title="Mail"
            isOpen={mobileSideBarExpand}
            placement="left"
            width={280}
            onClose={onMobileSideBarClose}
            onRequestClose={onMobileSideBarClose}
        >
            <MailSideBarContent />
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
            <MailSideBarContent />
        </div>
    )
}

export default MailSidebar
