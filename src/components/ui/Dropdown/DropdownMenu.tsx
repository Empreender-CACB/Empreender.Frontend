import { forwardRef, useContext } from 'react'
import Menu from './DropdownInnerMenu'
import MenuContext from './context/menuContext'
import DropdownItem from './DropdownItem'
import classNames from 'classnames'
import type { DropdownInnerMenuProps } from './DropdownInnerMenu'
import type { ReactNode } from 'react'

export interface DropdownMenuProps extends DropdownInnerMenuProps {
    eventKey?: string
    title?: string | ReactNode
    id?: string
    openLeft?: boolean
    openDown?: boolean
}

const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>(
    (props, ref) => {
        const { eventKey, title, className, openLeft, placement, openDown, ...rest } =
            props

        const parentMenu = useContext(MenuContext)

        const dropdownMenuDefaultClass = `dropdown-menu`
        const dropdownMenuPositionClass = placement

        const dropdownMenuClass = classNames(
            dropdownMenuDefaultClass,
            dropdownMenuPositionClass,
            className
        )

        const dropdownSubmenuClass = classNames(
            dropdownMenuDefaultClass,
            openDown
                ? 'dropdown-submenu-down'
                : openLeft
                ? 'dropdown-submenu-left'
                : 'dropdown-submenu'
        )

        const dropdownSubmenu = (
            <Menu
                ref={ref}
                className={dropdownSubmenuClass}
                placement={placement}
                {...rest}
            />
        )

        if (parentMenu) {
            const itemClassName = classNames(className)

            return (
                <DropdownItem
                    className={itemClassName}
                    submenu={dropdownSubmenu}
                    eventKey={eventKey}
                >
                    {title}
                </DropdownItem>
            )
        }

        return (
            <Menu
                ref={ref}
                className={dropdownMenuClass}
                placement={placement}
                {...rest}
            />
        )
    }
)

DropdownMenu.displayName = 'DropdownMenu'

export default DropdownMenu
