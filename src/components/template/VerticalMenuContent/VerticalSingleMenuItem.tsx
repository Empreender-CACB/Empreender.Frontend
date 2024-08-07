import Tooltip from '@/components/ui/Tooltip'
import Menu from '@/components/ui/Menu'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'

const { MenuItem } = Menu

interface CollapsedItemProps extends CommonProps {
    title: string
    direction?: Direction
}

interface DefaultItemProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    sideCollapsed?: boolean
}

interface VerticalMenuItemProps extends CollapsedItemProps, DefaultItemProps {}

const CollapsedItem = ({ title, children, direction }: CollapsedItemProps) => {
    return (
        <Tooltip
            title={title}
            placement={direction === 'rtl' ? 'left' : 'right'}
        >
            {children}
        </Tooltip>
    )
}

const DefaultItem = (props: DefaultItemProps) => {
    const { nav, onLinkClick, sideCollapsed } = props

    return (
        <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
            <Link
                to={nav.path}
                className="flex items-center h-full w-full"
                onClick={() =>
                    onLinkClick?.({
                        key: nav.key,
                        title: nav.title,
                        path: nav.path,
                    })
                }
                target={nav.target}
            >
                <VerticalMenuIcon icon={nav.icon} />
                {!sideCollapsed && (
                    <span>
                        <Trans
                            i18nKey={nav.translateKey}
                            defaults={nav.title}
                        />
                    </span>
                )}
            </Link>
        </MenuItem>
    )
}

const VerticalSingleMenuItem = ({
    nav,
    onLinkClick,
    sideCollapsed,
    direction,
}: Omit<VerticalMenuItemProps, 'title' | 'translateKey'>) => {
    return (
        <>
            {sideCollapsed ? (
                <CollapsedItem title={nav.title} direction={direction}>
                    <DefaultItem
                        nav={nav}
                        sideCollapsed={sideCollapsed}
                        onLinkClick={onLinkClick}
                    />
                </CollapsedItem>
            ) : (
                <DefaultItem
                    nav={nav}
                    sideCollapsed={sideCollapsed}
                    onLinkClick={onLinkClick}
                />
            )}
        </>
    )
}

export default VerticalSingleMenuItem
