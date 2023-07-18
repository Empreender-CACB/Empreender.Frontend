import navigationConfig from '@/configs/navigation.config'
import Dropdown from '@/components/ui/Dropdown'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import HorizontalMenuItem from './HorizontalMenuItem'
import HorizontalMenuDropdownItem from './HorizontalMenuDropdownItem'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { useTranslation } from 'react-i18next'
import type { NavMode } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'
type HorizontalMenuContentProps = {
    manuVariant: NavMode
    userAuthority?: string[]
}

const HorizontalMenuContent = ({
    manuVariant,
    userAuthority = [],
}: HorizontalMenuContentProps) => {
    const { t } = useTranslation()

    const renderSubMenuItems = (subMenu: NavigationTree[]) => {
        return subMenu.map((subNavItem) => {
            if (subNavItem.type === NAV_ITEM_TYPE_ITEM) {
                return (
                    <AuthorityCheck
                        key={subNavItem.key}
                        authority={subNavItem.authority}
                        userAuthority={userAuthority}
                    >
                        <HorizontalMenuDropdownItem
                            nav={subNavItem}
                        />
                    </AuthorityCheck>
                )
            } else if (subNavItem.type === NAV_ITEM_TYPE_COLLAPSE) {
                return (
                    <AuthorityCheck
                        key={subNavItem.key}
                        authority={subNavItem.authority}
                        userAuthority={userAuthority}
                    >
                        <Dropdown.Menu
                            title={subNavItem.title}
                        >
                            {renderSubMenuItems(subNavItem.subMenu)}
                        </Dropdown.Menu>
                    </AuthorityCheck>
                )
            }
            return null
        })
    }

    const renderMenuItems = (navItems: NavigationTree[]) => {
        return navItems.map((navItem) => {
            if (navItem.type === NAV_ITEM_TYPE_TITLE || navItem.type === NAV_ITEM_TYPE_COLLAPSE) {
                return (
                    <AuthorityCheck
                        key={navItem.key}
                        authority={navItem.authority}
                        userAuthority={userAuthority}
                    >
                        <Dropdown
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
                    </AuthorityCheck>
                )
            } else if (navItem.type === NAV_ITEM_TYPE_ITEM) {
                return (
                    <AuthorityCheck
                        key={navItem.key}
                        authority={navItem.authority}
                        userAuthority={userAuthority}
                    >
                        <HorizontalMenuItem
                            isLink
                            nav={navItem}
                            manuVariant={manuVariant}
                        />
                    </AuthorityCheck>
                )
            }
            return null
        })
    }

    return (
        <span className="flex items-center">
            {renderMenuItems(navigationConfig)}
        </span>
    )
}

export default HorizontalMenuContent
