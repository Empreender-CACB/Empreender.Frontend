import { Link } from 'react-router-dom'
import classNames from 'classnames'
import type { PropsWithChildren } from 'react'

export type HorizontalMenuNavLinkProps = PropsWithChildren<{
    path: string
    className?: string
    target?: string
}>

const HorizontalMenuNavLink = ({
    path,
    children,
    className,
    target
}: HorizontalMenuNavLinkProps) => {
    return (
        <Link 
            className={
                classNames(
                    'h-full w-full flex items-center',
                    className
                )} 
            to={path}
            target={target}
        >
            <span>{children}</span>
        </Link>
    )
}

export default HorizontalMenuNavLink
