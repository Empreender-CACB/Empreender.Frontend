import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const publicRoute: Routes = [
    {
        key: 'inscricoes',
        path: `/inscricoes`,
        component: lazy(() => import('@/views/Inscricoes')),
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'curso',
        path: `/curso-form`,
        component: lazy(() => import('@/views/sistema/cursoform')),
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'cadastra',
        path: `/cadastra-empresa`,
        component: lazy(() => import('@/views/sistema/sebrae')),
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default publicRoute
