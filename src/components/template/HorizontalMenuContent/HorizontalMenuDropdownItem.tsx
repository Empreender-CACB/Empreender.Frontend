import Dropdown from '@/components/ui/Dropdown'
import HorizontalMenuNavLink from './HorizontalMenuNavLink'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

export type HorizontalMenuItemProps = {
    nav: {
        key: string
        title: string
        translateKey?: string
        icon: string
        path: string
        target?: string
    }
}

const HorizontalMenuDropdownItem = ({ nav }: HorizontalMenuItemProps) => {
    const { title, translateKey, path, key, target } = nav

    const { t } = useTranslation()

    const itemTitle = translateKey ? t(translateKey, title) : title;

    return (
        <Dropdown.Item 
            eventKey={key} 
            className={
                classNames(
                    path && 'px-0'
                )
            }
        >
            {path ? (
                <HorizontalMenuNavLink 
                    path={path}
                    className={
                        classNames(
                            path && 'px-2'
                        )
                    }
                    target={target}
                >
                    {itemTitle}
                </HorizontalMenuNavLink>
            ) : (
                <span>{itemTitle}</span>
            )}
        </Dropdown.Item>
    )
}

export default HorizontalMenuDropdownItem
