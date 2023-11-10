import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const publicRoute: Routes = [
    {
        key: 'inscricoes',
        path: `/inscricoes`,
        component: lazy(() => import('@/views/Candidatura')),
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },    
]

export default publicRoute
