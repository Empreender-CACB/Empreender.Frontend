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
        key: 'Anexos.lista',
        path: `${APP_PREFIX_PATH}/anexos/`,
        component: lazy(() => import('@/views/sistema/anexos')),
        meta: {
            pageContainerType: 'default',
        },
    },
    {
        key: 'Anexos.adicionar',
        path: `${APP_PREFIX_PATH}/anexos/adicionar/:tipoVinculo/:idVinculo?/:tipoVinculoSecundario?/:idVinculoSecundario?`,
        component: lazy(() => import('@/views/sistema/anexos/adicionar')),
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
        key: 'Projetos.lista',
        path: `${APP_PREFIX_PATH}/projetos/`,
        component: lazy(() => import('@/views/sistema/projetos')),
    },
    {
        key: 'Entidades.lista',
        path: `${APP_PREFIX_PATH}/entidades/`,
        component: lazy(() => import('@/views/sistema/entidades')),
    },
    {
        key: 'Entidades.detalhes',
        path: `${APP_PREFIX_PATH}/entidades/:id/:aba?`,
        component: lazy(() => import('@/views/sistema/entidades/detalhes')),
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'Entidades.editar',
        path: `${APP_PREFIX_PATH}/entidades/editar/:id`,
        component: lazy(() => import('@/views/sistema/entidades/detalhes/editar')),
    },
    {
        key: 'Entidades.adicionarPerfil',
        path: `${APP_PREFIX_PATH}/perfil-entidade/adicionar/:id`,
        component: lazy(() => import('@/views/sistema/entidades/detalhes/adicionar-perfil')),
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
        key: 'sistema.parametros-gerais',
        path: `${APP_PREFIX_PATH}/parametros-gerais`,
        component: lazy(() => import('@/views/sistema/parametros-gerais')),
    },

    {
        key: 'sistema.faq.blog',
        path: `${APP_PREFIX_PATH}/faq/blog`,
        component: lazy(() => import('@/views/sistema/faq/blog')),
    },

    {
        key: 'sistema.feedbacks',
        path: `${APP_PREFIX_PATH}/feedbacks`,
        component: lazy(() => import('@/views/sistema/feedbacks')),
    },
    {
        key: 'sistema.notificacoes',
        path: `${APP_PREFIX_PATH}/notificacoes`,
        component: lazy(() => import('@/views/sistema/account/ActivityLog')),
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
        key: 'sistema.insertExcel',
        path: `${APP_PREFIX_PATH}/insert-excel`,
        component: lazy(() => import('@/views/sistema/empresas/insert-excel')),
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'sistema.showExcel',
        path: `${APP_PREFIX_PATH}/show-excel`,
        component: lazy(() => import('@/views/sistema/empresas/show-excel')),
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
    {
        key: 'sistemaPrestcontas.listaGeralLancamentos',
        path: `${APP_PREFIX_PATH}/prestcontas/lista-geral-lancamentos`,
        component: lazy(() => import('@/views/sistema/prestcontas/acompanhamento-financeiro/lista-geral-lancamentos')),
    },
    {
        key: 'sistema.selecaoPainel',
        path: `${APP_PREFIX_PATH}/selecoes/painel-inscricoes`,
        component: lazy(() => import('@/views/sistema/selecoes/painel-inscricoes'))
    },
    {
        key: 'sistemaPrestContas.contaEspecial',
        path: `${APP_PREFIX_PATH}/prestcontas/painel-conta-especial`,
        component: lazy(() => import('@/views/sistema/prestcontas/acompanhamento-financeiro/conta-especial'))
    },
    {
        key: 'sistemaEntidade.painelAcompanhamento',
        path: `${APP_PREFIX_PATH}/entidades/painel-acompanhamento`,
        component: lazy(() => import('@/views/sistema/entidades/acompanhamento'))
    },
    {
        key: 'logout',
        path: `${APP_PREFIX_PATH}/logout`,
        component: lazy(() => import('@/views/auth/Logout'))
    },
    {
        key: 'representatividade.marcosCriticos',
        path: `${APP_PREFIX_PATH}/representatividade/acompanhamento/:id`,
        component: lazy(() => import('@/views/sistema/representatividade/acompanhamento')),
    },
    {
        key: 'representatividade.marcosCriticosGeral',
        path: `${APP_PREFIX_PATH}/representatividade/acompanhamento-geral`,
        component: lazy(() => import('@/views/sistema/representatividade/acompanhamento-geral')),
    },
    {
        key: 'sistemaLancamento.transferenciasPagamentos',
        path: `${APP_PREFIX_PATH}/lancamentos/transferencias-pagamentos`,
        component: lazy(() => import('@/views/sistema/lancamentos/transferencias-pagamentos')),
    },
    {
        key: 'sistema.versaoRfb',
        path: `${APP_PREFIX_PATH}/rfb`,
        component: lazy(() => import('@/views/sistema/empresas/versao-rfb')),
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'representatividade.marcosCriticosNucleos',
        path: `${APP_PREFIX_PATH}/representatividade/acompanhamento-nucleo/:id`,
        component: lazy(() => import('@/views/sistema/representatividade/acompanhamento-nucleo')),
    },
    {
        key: 'representatividade.marcosCriticosGeralNucleos',
        path: `${APP_PREFIX_PATH}/representatividade/acompanhamento-geral-nucleos`,
        component: lazy(() => import('@/views/sistema/representatividade/acompanhamento-geral-nucleos')),
    },
    {
        key: 'Anotacoes.adicionar',
        path: `${APP_PREFIX_PATH}/anotacoes/adicionar/:tipoVinculo/:idVinculo/:idAnotacao?`,
        component: lazy(() => import('@/views/sistema/anotacao/adicionar')),
    },     
    {
        key: 'Anotacoes.index',
        path: `${APP_PREFIX_PATH}/anotacoes/:tipoVinculo/:idVinculo`,
        component: lazy(() => import('@/views/sistema/anotacao/index')),
    },
    {
        key: 'Contatos.lista',
        path: `${APP_PREFIX_PATH}/contatos/`,
        component: lazy(() => import('@/views/sistema/contatos')),
    },
    {
        key: 'Contatos.malaDireta',
        path: `${APP_PREFIX_PATH}/contatos/mala-direta`,
        component: lazy(() => import('@/views/sistema/contatos/mala-direta')),
    },
    {
        key: 'Projetos.vincularEmpresasNucleo',
        path: `${APP_PREFIX_PATH}/projetos/vincular-empresas-nucleo`,
        component: lazy(() => import('@/views/sistema/projetos/vincularEmpresasNucleo')),
    },
    {
        key: 'Cogecom.lista',
        path: `${APP_PREFIX_PATH}/cogecom/`,
        component: lazy(() => import('@/views/sistema/cogecom')),
        meta: {
            pageContainerType: 'default',
        },
    },
    {
        key: 'Cogecom.detalhe',
        path: `${APP_PREFIX_PATH}/cogecom/detalhes/:id/`,
        component: lazy(() => import('@/views/sistema/cogecom/detalhes')),
    },
    {
        key: 'Cogecom.cogecomEntidade',
        path: `${APP_PREFIX_PATH}/cogecom/entidade/:id`,
        component: lazy(() => import('@/views/sistema/cogecom/entidade')),
    },
    {
        key: 'Cogecom.cogecomLista',
        path: `${APP_PREFIX_PATH}/cogecom/entidade/lista-geral`,
        component: lazy(() => import('@/views/sistema/cogecom/entidade/listaGeral')),
    },
    {
        key: 'Pendencias.adicionarPendencia',
        path: `${APP_PREFIX_PATH}/pendencias/adicionar/:temBloqueio/:tipoVinculo/:idVinculo/:tipoVinculoAux?/:idVinculoAux?/:idPendencia?`,
        component: lazy(() => import('@/views/sistema/pendencias/adicionar')),
    },
    {
        key: 'Pendencias.listar',
        path: `${APP_PREFIX_PATH}/pendencias/:tipoVinculo/:idVinculo/:tipoVinculoAux?/:idVinculoAux?`,
        component: lazy(() => import('@/views/sistema/pendencias/index')),
    },    
    {
        key: 'Anexos.listar',
        path: `${APP_PREFIX_PATH}/anexos/:tipoVinculo/:idVinculo/:tipoVinculoAux?/:idVinculoAux?`,
        component: lazy(() => import('@/views/sistema/anexos/listar')),
    },    
    {
        key: 'Anexos.editar',
        path: `${APP_PREFIX_PATH}/anexos/editar/:idAnexo`,
        component: lazy(() => import('@/views/sistema/anexos/editar')),
    },  
    {
        key: 'AjudaAtendimento.index',
        path: `${APP_PREFIX_PATH}/ajuda-atendimento`,
        component: lazy(() => import('@/views/sistema/ajudaEAtendimento/index')),
    }, 
    {
        key: 'AjudaAtendimento.documentos',
        path: `${APP_PREFIX_PATH}/ajuda-atendimento/documentos`,
        component: lazy(() => import('@/views/sistema/ajudaEAtendimento/documentos')),
    },   
]

export default appsRoute
