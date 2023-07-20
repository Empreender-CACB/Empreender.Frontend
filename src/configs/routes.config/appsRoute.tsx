import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'sistema.inicio',
        path: `${APP_PREFIX_PATH}/inicio`,
        component: lazy(() => import('@/views/sistema/inicio')),
        authority: [ADMIN, USER],
    },
    {
        key: 'sistemaEmpresas.empresas',
        path: `${APP_PREFIX_PATH}/empresas`,
        component: lazy(() => import('@/views/sistema/empresas')),
        authority: [ADMIN, USER],
    },
]

export default appsRoute
