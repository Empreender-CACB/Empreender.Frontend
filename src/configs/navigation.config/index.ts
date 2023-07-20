import appsNavigationConfig from './apps.navigation.config'
import authNavigationConfig from './auth.navigation.config'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    ...appsNavigationConfig,
    // ...authNavigationConfig,
]

export default navigationConfig
