import Menu from '@/components/ui/Menu'
import Dropdown from '@/components/ui/Dropdown'
import { Link } from 'react-router-dom'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Trans } from 'react-i18next'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'

const { MenuItem, MenuCollapse } = Menu

interface DefaultItemProps extends CommonProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
}

interface CollapsedItemProps extends DefaultItemProps {
    direction: Direction
}

interface VerticalCollapsedMenuItemProps extends CollapsedItemProps {
    sideCollapsed?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RenderItem = ({ subNav, onLinkClick }: { subNav: NavigationTree, onLinkClick?: any }) => {
    return subNav.path ? (
        <Link
            className="h-full w-full flex items-center"
            to={subNav.path}
            onClick={() =>
                onLinkClick?.({
                    key: subNav.key,
                    title: subNav.title,
                    path: subNav.path,
                })
            }
            target={subNav.target}
        >
            <span>
                <Trans
                    i18nKey={subNav.translateKey}
                    defaults={subNav.title}
                />
            </span>
        </Link>
    ) : (
        <span>
            <Trans
                i18nKey={subNav.translateKey}
                defaults={subNav.title}
            />
        </span>
    );
}

const DefaultItem = ({ nav, onLinkClick }: DefaultItemProps) => {
    return (
        <MenuCollapse
            key={nav.key}
            label={
                <>
                    <VerticalMenuIcon icon={nav.icon} />
                    <span>
                        <Trans
                            i18nKey={nav.translateKey}
                            defaults={nav.title}
                        />
                    </span>
                </>
            }
            eventKey={nav.key}
            expanded={false}
            className="mb-2"
        >
            {nav.subMenu.map((subNav) => (
                subNav.subMenu && subNav.subMenu.length > 0 ? 
                <DefaultItem key={subNav.key} nav={subNav} onLinkClick={onLinkClick} />
                :
                <MenuItem key={subNav.key} eventKey={subNav.key}>
                    <RenderItem subNav={subNav} onLinkClick={onLinkClick} />
                </MenuItem>
            ))}
        </MenuCollapse>
    )
}

const renderSubMenuItems = (subMenu: NavigationTree[]) => {
    return subMenu.map((subNavItem) => {
        if (subNavItem.subMenu && subNavItem.subMenu.length > 0) {
            return (
                <Dropdown.Menu key={subNavItem.key} title={subNavItem.title}>
                    {renderSubMenuItems(subNavItem.subMenu)}
                </Dropdown.Menu>
            )
        } else {
            return (
                <Dropdown.Item key={subNavItem.key} eventKey={subNavItem.key}>
                    <RenderItem subNav={subNavItem} />
                </Dropdown.Item>
            );
        }
    })
}

export const CollapsedItem = ({ nav, direction }: CollapsedItemProps) => {
    const menuItem = (
        <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
            <VerticalMenuIcon icon={nav.icon} />            
        </MenuItem>
    );

    return (
        <Dropdown
            trigger="hover"
            renderTitle={menuItem}
            placement={direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'}
        >
            {renderSubMenuItems(nav.subMenu)}
        </Dropdown>
    )
}

const VerticalCollapsedMenuItem = ({ sideCollapsed, ...rest }: VerticalCollapsedMenuItemProps) => {
    return sideCollapsed ? (
        <CollapsedItem {...rest} />
    ) : (
        <DefaultItem {...rest} />
    )
}

export default VerticalCollapsedMenuItem
