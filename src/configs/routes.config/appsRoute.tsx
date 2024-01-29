import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'sistema.inicio',
        path: `${APP_PREFIX_PATH}/inicio`,
        component: lazy(() => import('@/views/sistema/inicio')),
    },
    {
        key: 'Empresas.lista',
        path: `${APP_PREFIX_PATH}/empresas/`,
        component: lazy(() => import('@/views/sistema/empresas')),
    },
    {
        key: 'Empresas.detalhes',
        path: `${APP_PREFIX_PATH}/empresas/:id`,
        component: lazy(() => import('@/views/sistema/empresas/detalhes')),
    },
    {
        key: 'sistemaNucleos.nucleos',
        path: `${APP_PREFIX_PATH}/nucleos`,
        component: lazy(() => import('@/views/sistema/nucleos')),
    },
    {
        key: 'sistemaPreferencias.index',
        path: `${APP_PREFIX_PATH}/preferencias`,
        component: lazy(() => import('@/views/sistema/preferencias')),
    },
    {
        key: 'sistemaNucleos.detalhes',
        path: `${APP_PREFIX_PATH}/nucleos/:idnucleo`,
        component: lazy(() => import('@/views/sistema/nucleos/detalhes')),

        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'sistemaNucleos.reunioes',
        path: `${APP_PREFIX_PATH}/nucleos/reunioes/:idnucleo`,
        component: lazy(() => import('@/views/sistema/nucleos/reunioes')),

        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'sistemaUsuario.usuarios',
        path: `${APP_PREFIX_PATH}/usuarios`,
        component: lazy(() => import('@/views/sistema/usuarios')),
    },
    {
        key: 'sistemaEntidades.diagnosticos.painel-diag',
        path: `${APP_PREFIX_PATH}/entidades/diagnosticos/painel-diagnosticos`,
        component: lazy(() => import('@/views/sistema/entidades/diagnosticos/painel-diagnosticos')),
    },
    {
        key: 'sistemaEntidades.perfil-aces',
        path: `${APP_PREFIX_PATH}/entidades/perfil-aces`,
        component: lazy(() => import('@/views/sistema/entidades/perfil-aces')),
    },
    {
        key: 'sistemaPrestcontas.painel-gestao-financeira',
        path: `${APP_PREFIX_PATH}/prestcontas/painel-gestao-financeira`,
        component: lazy(() => import('@/views/sistema/prestcontas/painel-gestao-financeira')),
    },
    {
        key: 'sistemaPrestcontas.painel-documentos-aguardando-aprovacao',
        path: `${APP_PREFIX_PATH}/prestcontas/painel-documentos-aguardando-aprovacao`,
        component: lazy(() => import('@/views/sistema/prestcontas/painel-documentos-aguardando-aprovacao')),
    },
    {
        key: 'sistemaConcurso.painel',
        path: `${APP_PREFIX_PATH}/concurso/painel-entidade/:idconcurso/:identidade`,
        component: lazy(() => import('@/views/sistema/concurso/painel-entidade')),
    },
    {
        key: 'sistemaConcurso.e2022-painel',
        path: `${APP_PREFIX_PATH}/concurso/e2022-painel/:idconcurso`,
        component: lazy(() => import('@/views/sistema/concurso/e2022-painel')),
    },
    {
        key: 'sistemaAdminutils.quadro',
        path: `${APP_PREFIX_PATH}/adminutils/acompanhamento-geral/quadro/:idquadro`,
        component: lazy(() => import('@/views/sistema/adminutils/acompanhamento-geral/quadro')),
    },
    {
        key: 'sistema.cursoform',
        path: `${APP_PREFIX_PATH}/curso-form`,
        component: lazy(() => import('@/views/Inscricoes/cursoform/index')),
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'sistema.selecao',
        path: `${APP_PREFIX_PATH}/selecoes/e2022-consultores`,
        component: lazy(() => import('@/views/sistema/selecoes/e2022-consultores')),
    },
]

export default appsRoute
