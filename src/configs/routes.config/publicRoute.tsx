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
        component: lazy(() => import('@/views/Inscricoes/cursoform')),
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'cadastro_empresa',
        path: `/cadastro/empresa`,
        component: lazy(() => import('@/views/Inscricoes/sebrae')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
    {
        key: 'cadastro_empresa_esg',
        path: `/esg/cadastro`,
        component: lazy(() => import('@/views/Inscricoes/sebrae/proposta')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
    {
        key: 'diagnostico_esg',
        path: `/esg2/diagnostico/:cnpj`,
        component: lazy(() => import('@/views/Inscricoes/esg/diagnostico')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
    {
        key: 'diagnostico_esg_visualizacao',
        path: `/esg2/diagnostico/visualizacao/:cnpj`,
        component: lazy(() => import('@/views/Inscricoes/esg/diagnostico/visualizacao')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
    {
        key: 'cadastro_empresa_esg',
        path: `/esg2/cadastro`,
        component: lazy(() => import('@/views/sistema/sebrae/proposta2')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
]

export default publicRoute
