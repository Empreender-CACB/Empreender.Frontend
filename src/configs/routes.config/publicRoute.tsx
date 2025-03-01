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
        key: 'poupmax',
        path: `/poupmax`,
        component: lazy(() => import('@/views/Cogecon')),
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
/*     {
        key: 'sistema.showExcel',
        path: `/show-excel`,
        component: lazy(() => import('@/views/sistema/empresas/insert-excel2')),
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    }, */
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
        path: `/esg2/diagnostico/:token`,
        component: lazy(() => import('@/views/Inscricoes/esg/diagnostico')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
    {
        key: 'diagnostico_esg_visualizacao',
        path: `/esg2/diagnostico/visualizacao/:token`,
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
    {
        key: 'confirmacao_esg',
        path: `/esg2/diagnostico/confirmacao`,
        component: lazy(() => import('@/views/Inscricoes/esg/diagnostico/confirmacao')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
    {
        key: 'substituicao_arquivos_evidencias',
        path: `/diagnosticos/substituicao/:idEntidade`,
        component: lazy(() => import('@/views/diagnosticos/substituicao')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
    {
        key: 'ranking.diag',
        path: `/ranking/diagnosticos`,
        component: lazy(() => import('@/views/ranking/diagnosticos')),
        meta: {
            layout: 'blank',
        },
    },
    {
        key: 'pesquisa-teste',
        path: `/pesquisa-cef`,
        component: lazy(() => import('@/views/pesquisa-teste')),
        meta: {
            layout: 'blank',
            footer: false,
        },
    },
]

export default publicRoute
