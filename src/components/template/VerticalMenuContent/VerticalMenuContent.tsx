import React, { useState, useEffect } from 'react'
import Menu from '@/components/ui/Menu'
import { themeConfig } from '@/configs/theme.config'
import useMenuActive from '@/utils/hooks/useMenuActive'
import type { NavigationTree } from '@/@types/navigation'
import { Link } from 'react-router-dom'
import VerticalMenuIcon from './VerticalMenuIcon'
import { NavMode } from '@/@types/theme'
import { CollapsedItem } from './VerticalCollapsedMenuItem'
import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import { fetchRfbVersion } from '@/views/sistema/adminutils/outros/versao-rfb'

interface MenuItemProps {
    nav: NavigationTree;
    onLinkClick: () => void;
    sideCollapsed: boolean;
}

const handleVersionButtonClick = async () => {
  try {
      const rfbVersion = await fetchRfbVersion()
      const toastNotification = (

          <Notification duration={3000}>
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
}

const MenuItem: React.FC<MenuItemProps> = ({ nav, onLinkClick, sideCollapsed }) => {
  if (nav.subMenu && nav.subMenu.length > 0) {
    return sideCollapsed ? (
      <CollapsedItem
        nav={nav}
        direction={'ltr'}
        onLinkClick={onLinkClick}
      />
    ) : (
      <Menu.MenuCollapse
        key={nav.key}
        label={
          <>
            <VerticalMenuIcon icon={nav.icon} />
            <span
              style={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                maxWidth: '150px',
              }}
            >
              {nav.title}
            </span>
          </>
        }
        eventKey={nav.key}
        expanded={false}
        className="mb-2"
      >
        {nav.subMenu.map((subNav) => (
          <MenuItem
            key={subNav.key}
            nav={subNav}
            sideCollapsed={sideCollapsed}
            onLinkClick={onLinkClick}
          />
        ))}
      </Menu.MenuCollapse>
    );
  } else {
    return (
      <Menu.MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
        {nav.path ?
          <Link
            to={nav.path}
            className="flex items-center h-full w-full"
            onClick={onLinkClick}
            target={nav.target}
          >
            <VerticalMenuIcon icon={nav.icon} />
            {(nav.type !== 'item' || !sideCollapsed) && (
              <span
                style={{
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  maxWidth: '150px',
                }}
              >
                {nav.title}
              </span>
            )}
          </Link>
          :
          <>
            {nav.key == 'appVersaoRfb' ? <span onClick={handleVersionButtonClick}>{nav.title}</span> : <span>{nav.title}</span>}
          </>
        }
      </Menu.MenuItem>
    );
  }
};

interface VerticalMenuContentProps {
    navMode: NavMode
    collapsed: boolean
    routeKey: string
    navigationTree: NavigationTree[]
    onMenuItemClick: () => void
    direction: string
}

const VerticalMenuContent: React.FC<VerticalMenuContentProps> = ({
    navMode = themeConfig.navMode,
    collapsed,
    routeKey,
    navigationTree = [],
    onMenuItemClick,
    // direction = themeConfig.direction,
}) => {
    const [defaulExpandKey, setDefaulExpandKey] = useState<string[]>([])
    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    useEffect(() => {
        if (defaulExpandKey.length === 0 && activedRoute?.parentKey) {
            setDefaulExpandKey([activedRoute?.parentKey])
        }
    }, [activedRoute?.parentKey, defaulExpandKey.length])

    const handleLinkClick = () => {
        onMenuItemClick()
    }

    return (
        <Menu
            className="px-4 pb-4"
            variant={navMode}
            sideCollapsed={collapsed}
            defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
            defaultExpandedKeys={defaulExpandKey}
        >
            {navigationTree.map((nav) => (
                <MenuItem
                    key={nav.key}
                    sideCollapsed={collapsed}
                    nav={nav}
                    onLinkClick={handleLinkClick}
                />
            ))}
        </Menu>
    )
}

export default VerticalMenuContent
