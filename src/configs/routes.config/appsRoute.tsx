import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'apps.inicio',
        path: `${APP_PREFIX_PATH}/inicio`,
        component: lazy(() => import('@/views/home')),
        authority: [USER],
    },
    {
        key: 'appsEmpresas.listar',
        path: `${APP_PREFIX_PATH}/empresas`,
        component: lazy(() => import('@/views/empresas')),
        authority: [USER],
    },
]

export default appsRoute
