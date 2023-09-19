import Dropdown from '@/components/ui/Dropdown'
import HorizontalMenuItem from './HorizontalMenuItem'
import HorizontalMenuDropdownItem from './HorizontalMenuDropdownItem'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavMode } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation' // Import NavigationTree type
import { useNavigationConfig } from '@/utils/hooks/useNavigation'

type HorizontalMenuContentProps = {
    manuVariant: NavMode
    userAuthority?: string[]
}

const HorizontalMenuContent = ({
    manuVariant
}: HorizontalMenuContentProps) => {

    const { navigationConfig } = useNavigationConfig();

    const renderSubMenuItems = (subMenu: NavigationTree[]) => {
        return subMenu.map((subNavItem) => {
            if (subNavItem.type === NAV_ITEM_TYPE_ITEM) {
                return (
                    <HorizontalMenuDropdownItem
                        key={subNavItem.key}
                        nav={subNavItem}
                    />
                )
            } else if (subNavItem.type === NAV_ITEM_TYPE_COLLAPSE) {
                return (
                    <Dropdown.Menu
                        key={subNavItem.key}
                        title={subNavItem.title}
                    >
                        {renderSubMenuItems(subNavItem.subMenu)}
                    </Dropdown.Menu>
                )
            }
            return null
        })
    }

    const renderMenuItems = (navItems: NavigationTree[]) => {
        return navItems.map((navItem) => {
            if (
                navItem.type === NAV_ITEM_TYPE_TITLE ||
                navItem.type === NAV_ITEM_TYPE_COLLAPSE
            ) {
                return (
                    <Dropdown
                        key={navItem.key}
                        trigger="hover"
                        renderTitle={
                            <HorizontalMenuItem
                                manuVariant={manuVariant}
                                nav={navItem}
                            />
                        }
                    >
                        {renderSubMenuItems(navItem.subMenu)}
                    </Dropdown>
                )
            } else if (navItem.type === NAV_ITEM_TYPE_ITEM) {
                return (
                    <HorizontalMenuItem
                        key={navItem.key}
                        isLink
                        nav={navItem}
                        manuVariant={manuVariant}
                    />
                )
            }
            return null
        })
    }

    return (
        <span className="flex items-center">
            {navigationConfig && renderMenuItems(navigationConfig)}
        </span>
    )
}

export default HorizontalMenuContent
