import React from 'react'
import MenuItems from './MenuItems'

interface MenuItem {
  title: string
  url?: string
  submenu?: MenuItem[]
}

interface DropdownProps {
  submenus: MenuItem[]
  dropdown: boolean
  depthLevel: number
}

const Dropdown: React.FC<DropdownProps> = ({
  submenus,
  dropdown,
  depthLevel
}) => {
  const updatedDepthLevel = depthLevel + 1
  const dropdownClass = updatedDepthLevel > 1 ? 'dropdown-submenu' : ''

  return (
    <ul className={`dropdown ${dropdownClass} ${dropdown ? 'show' : ''}`}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} depthLevel={updatedDepthLevel} />
      ))}
    </ul>
  )
}

export default Dropdown
