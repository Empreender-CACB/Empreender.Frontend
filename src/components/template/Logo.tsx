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
        logoWidth = 'auto',
    } = props

    const layoutType = useAppSelector((state) => state.theme.layout.type)

    let logoWidthAux = '';

    if (layoutType === 'decked') {
        logoWidthAux = '180px'
    } else if (layoutType === 'classic') {
        logoWidthAux = '250px'
    } else if (layoutType === 'modern') {
        logoWidthAux = '250px'
    } else if (layoutType === 'simple') {
        logoWidthAux = '180px'
    }

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidthAux !== '' ? logoWidthAux : logoWidth },
                paddingTop: layoutType === 'classic' || layoutType === 'modern' ? '8px' : '0',
                paddingBottom: layoutType === 'classic' || layoutType === 'modern' ? '8px' : '0'

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
