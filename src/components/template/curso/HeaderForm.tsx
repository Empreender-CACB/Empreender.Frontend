import { useAppSelector } from '@/store'
import LogoEmpreender from './LogoEmpreender'

const HeaderForm = () => {
    const mode = useAppSelector((state) => state.theme.mode)

    return <LogoEmpreender mode={mode} className="hidden md:block" />
}

export default HeaderForm
