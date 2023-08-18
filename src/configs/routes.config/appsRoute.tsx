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
    {
        key: 'sistemaEmpresas.detalhes',
        path: `${APP_PREFIX_PATH}/empresas/:idempresa`,
        component: lazy(() => import('@/views/sistema/empresas/detalhes')),
        authority: [ADMIN, USER],
        // meta: {
        //     pageContainerType: 'gutterless',
        // },
    },
    {
        key: 'sistemaNucleos.nucleos',
        path: `${APP_PREFIX_PATH}/nucleos`,
        component: lazy(() => import('@/views/sistema/nucleos')),
        authority: [ADMIN, USER],
    },
    {
        key: 'sistemaNucleos.detalhes',
        path: `${APP_PREFIX_PATH}/nucleos/:idnucleo`,
        component: lazy(() => import('@/views/sistema/nucleos/detalhes')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
            footer: false
        },
    },
    {
        key: 'sistemaNucleos.reunioes',
        path: `${APP_PREFIX_PATH}/nucleos/reunioes/:idnucleo`,
        component: lazy(() => import('@/views/sistema/nucleos/reunioes')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
            footer: false
        },
    },
    {
        key: 'sistemaUsuario.usuarios',
        path: `${APP_PREFIX_PATH}/usuarios`,
        component: lazy(() => import('@/views/sistema/usuarios')),
        authority: [ADMIN, USER],
    },
]

export default appsRoute
