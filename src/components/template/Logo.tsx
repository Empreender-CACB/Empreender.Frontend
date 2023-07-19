import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import { useAppSelector } from '@/store'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = '150px',
    } = props

    const layout = useAppSelector((state) => state.theme.layout.type)
    console.log(layout);

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: layout === 'classic' || layout === 'modern' ? '250px' : logoWidth },
                paddingTop: layout === 'classic' || layout === 'modern' ? '20px' : 0,
            }}
        >
            <img
                className={imgClass}
                // src={`${LOGO_SRC_PATH}logo-${mode}-${type}.png`}
                src={`${LOGO_SRC_PATH}logo-cacb.png`}
                alt={`${APP_NAME} logo`}
            />
        </div>
    )
}

export default Logo
