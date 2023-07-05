export const navigation = [
  { title: 'Início', url: '#', resources: ['pj_restrito', 'premio21_gestor'] },
  {
    title: 'Entidades',
    url: '#',
    submenu: [
      {
        title: 'Adicionar Entidade',
        url: '#',
        submenu: [
          {
            title: 'Listar Entidades 2',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/associacao/',
            resources: ['ace_consu']
          },
          {
            title: 'Listar Entidades 3',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/associacao/',
            resources: ['ace_consu']
          }
        ],
        resources: ['ace_adici']
      },
      {
        title: 'Listar Entidades',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/associacao/',
        resources: ['ace_consu']
      },
      {
        title: 'Diagnósticos',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/lista-diagnosticos-geral',
        resources: ['mostrar_diagnosticos']
      },
      {
        title: 'Painel de Diagnósticos',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/painel-diagnosticos',
        resources: ['mostrar_diagnosticos']
      },
      {
        title: 'Perfil das ACEs',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/associacao/painel',
        resources: ['painel_entidade']
      }
    ]
  },
  {
    title: 'Núcleos',
    url: '#',
    submenu: [
      {
        title: 'Adicionar Núcleo',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/nucleo/adicionar/',
        resources: ['nuc_adici']
      },
      {
        title: 'Adicionar Plano de Ação',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/plano-acao/adicionar/',
        resources: ['pla_adici']
      },
      {
        title: 'Adicionar Reunião',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/reuniao/adicionar/',
        resources: ['reu_adici']
      },
      {
        title: 'Listar Núcleos',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/nucleo/',
        resources: ['nuc_consu']
      },
      {
        title: 'Listar Planos de Ação',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/plano-acao/',
        resources: ['pla_consu']
      },
      {
        title: 'Listar Reuniões',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/reuniao/',
        resources: ['reu_consu']
      }
    ]
  },
  {
    title: 'Empresas',
    url: '#',
    submenu: [
      {
        title: 'Adicionar Empresa',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/adicionar/',
        resources: ['emp_adici']
      },
      { title: 'Listar Empresas', url: '/empresas', resources: ['emp_lista'] },
      {
        title: 'Minhas Empresas',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/minhas-empresas',
        resources: ['emp_adici', 'emp_lista'],
        isGestor: true
      }
    ]
  },
  {
    title: 'Usuários',
    url: '#',
    submenu: [
      {
        title: 'Adicionar Usuário',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/usuario/adicionar/',
        resources: ['usu_adici']
      },
      {
        title: 'Listar Usuários',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/usuario/',
        resources: ['usu_consu']
      }
    ]
  },
  {
    title: 'Relatórios',
    url: '#',
    submenu: [
      {
        title: 'Adicionar Relatório',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/gerador-relatorio/modelo',
        resources: ['rel_adici']
      },
      {
        title: 'Listar Relatórios',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/relatorio/',
        current: false
      }
    ]
  },
  {
    title: 'Projetos',
    url: '#',
    submenu: [
      {
        title: 'Acompanhamento financeiro',
        url: '#',
        submenu: [
          {
            title: 'Painel das Entidades Proponentes',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-entidades/',
            resources: ['painel_entidades_origens']
          },
          {
            title: 'Painel Gestão Financeira',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-gestao-financeira/',
            resources: ['painel_gest_fin']
          },
          {
            title: 'Projetos Apoiados - FIN',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/projetos-apoiados-financeiro/',
            current: false
          },
          {
            title: 'Situação dos projetos',
            url: '#',
            submenu: [
              {
                title: 'Projetos sem lançamentos no período',
                url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-situacao-projetos/?tipo=periodo',
                resources: ['dah_rutli']
              },
              {
                title: 'Projetos com lançamentos para análise',
                url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-situacao-projetos/?tipo=analise',
                resources: ['dah_iseis']
              }
            ]
          },
          {
            title: 'Transferências e Pagamentos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/transferencias-e-pagamentos-novo',
            resources: ['lan_pgto', 'transf_pgto']
          }
        ]
      },
      {
        title: 'Acompanhamento técnico',
        url: '#',
        submenu: [
          {
            title: 'Acompanhamento da pesquisa',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-acompanhamento',
            current: false
          },
          {
            title: 'Documentos aguardando aprovação',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-aguardando',
            current: false
          },
          {
            title: 'Projetos Apoiados - TEC',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/projetos-apoiados-tec',
            current: false
          }
        ]
      },
      {
        title: 'Auditoria 189',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/projeto-auditoria/',
        resources: ['auditoria_189']
      },
      {
        title: 'E2022 - Acompanhamento Sebrae',
        url: '#',
        submenu: [
          {
            title: 'Acompanhamento de despesas',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/despesas-acompanhamento',
            resources: ['e2022_acomp']
          }
        ]
      },
      {
        title: 'E2022 / AL Invest Verde',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/concursos-geral/',
        current: false
      },
      {
        title: 'Prêmio 21',
        url: '#',
        submenu: [
          {
            title: 'Avaliação final',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/avaliacao-final',
            resources: ['premio21_gestor']
          },
          {
            title: 'Lista de Propostas',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/lista-propostas/',
            resources: ['premio21_gestor']
          },
          {
            title: 'Painel',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/painel',
            resources: ['premio21_gestor']
          },
          {
            title: 'Relatório de Notas',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/relatorio-notas',
            resources: ['premio21_gestor']
          },
          {
            title: 'Resultado final',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/avaliacao-final',
            current: false
          }
        ]
      }
    ]
  },
  {
    title: 'Arquivos',
    url: '#',
    submenu: [
      {
        title: 'Listar Arquivos',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/arquivos',
        current: false
      }
    ]
  },
  {
    title: 'Currículos',
    url: '#',
    submenu: [
      {
        title: 'Listar Currículos',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/curriculo/',
        current: false
      },
      {
        title: 'Listar Usuários',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/usuariocv/',
        current: false
      }
    ]
  },
  {
    title: 'ADM',
    url: '#',
    submenu: [
      {
        title: 'Acompanhamento geral',
        url:
          'https://teste.cacbempreenderapp.org.br/sistema/adminutils/acompanhamento-geral/quadro/' +
          btoa('quadro1'),
        current: false
      },
      {
        title: 'Ajustes de Dados',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/atualizacao-lancamento',
        resources: ['atual_expressa']
      },
      {
        title: 'Concurso',
        url: '#',
        submenu: [
          {
            title: 'Avaliadores',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/avaliador-lista',
            resources: ['premio21_gestor', 'e22_demandas_gestor']
          },
          {
            title: 'Categorias',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/categoria-lista',
            resources: ['premio21_gestor', 'e22_demandas_gestor']
          },
          {
            title: 'Concursos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/index',
            resources: ['premio21_gestor', 'e22_demandas_gestor']
          },
          {
            title: 'Quesitos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/quesito-lista',
            resources: ['premio21_gestor', 'e22_demandas_gestor']
          }
        ]
      },
      {
        title: 'Diagnósticos',
        url: '#',
        submenu: [
          {
            title: 'Quesitos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/quesitos-diagnostico-lista',
            current: false
          },
          {
            title: 'Consultores',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/consultor-lista',
            current: false
          },
          {
            title: 'Entidades cadastradas',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/entidades-lista',
            current: false
          }
        ]
      },
      {
        title: 'Direitos',
        url: '#',
        submenu: [
          {
            title: 'Associação Gestor-Recurso',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/gestor-recurso/',
            resources: ['adm_direitos']
          },
          {
            title: 'Associação Perfil-Recurso',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/aclrecurso/',
            resources: ['adm_direitos']
          },
          {
            title: 'Lista de direitos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/direitos/index',
            resources: ['adm_direitos']
          },
          {
            title: 'Perfis',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/usuarios/perfil-lista',
            resources: ['adm_direitos']
          },
          {
            title: 'Recurso',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/recurso/',
            resources: ['adm_direitos']
          }
        ]
      },
      {
        title: 'Documentos',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/documento/',
        current: false
      },
      {
        title: 'Empresas',
        url: '#',
        submenu: [
          {
            title: 'Cadastro empresa',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/cadastro',
            current: false
          },
          {
            title: 'Cadastro ramo atividade',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/ramoatividade',
            current: false
          },
          {
            title: 'Lista empresas',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/index',
            current: false
          },
          {
            title: 'Lista empreendimentos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/empreendimentos',
            current: false
          },
          {
            title: 'Lista ramos atividades',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/ramoatividade-lista',
            current: false
          },
          {
            title: 'Lista tipo empreendimento',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/tipoempreendimento-lista',
            current: false
          }
        ]
      },
      {
        title: 'Estatísticas',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/estatisticas/',
        current: false
      },
      {
        title: 'Eventos',
        url: '#',
        submenu: [
          {
            title: 'Cadastro',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/eventos/cadastro',
            resources: ['evento_geral']
          },
          {
            title: 'Participantes',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/eventos/participantes',
            resources: ['evento_geral']
          },
          {
            title: 'Programação',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/eventos/programacao',
            resources: ['evento_geral']
          },
          {
            title: 'Tipos eventos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/eventos/tipos',
            resources: ['evento_geral']
          }
        ]
      },
      {
        title: 'Informações',
        url: '#',
        submenu: [
          {
            title: 'Boletins',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/boletim/',
            resources: ['admin_boletins']
          },
          {
            title: 'Etapas Ciclos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/etapas-ciclos/',
            resources: ['admin_ciclos']
          },
          {
            title: 'Menu',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/menu/',
            resources: ['admin_menu']
          },
          {
            title: 'Textos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/texto/',
            resources: ['admin_textos']
          }
        ]
      },
      {
        title: 'Integrantes',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/integrantes/',
        current: false
      },
      {
        title: 'Notícias',
        url: '#',
        submenu: [
          {
            title: 'Cadastro',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/noticias/cadastro',
            current: false
          },
          {
            title: 'Lista',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/noticias/index',
            current: false
          }
        ]
      },
      {
        title: 'Recursos',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/recurso/',
        current: false
      },
      {
        title: 'Regras',
        url: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/regras/',
        current: false
      },
      {
        title: 'Relatórios',
        url: '#',
        submenu: [
          {
            title: 'Diagnósticos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/diagnosticos',
            current: false
          },
          {
            title: 'Empresas',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/empresas',
            current: false
          },
          {
            title: 'Eventos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/eventos',
            current: false
          },
          {
            title: 'Listagens',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/listagens',
            current: false
          },
          {
            title: 'Pontuação Geral',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/pontuacao-geral',
            current: false
          },
          {
            title: 'Recursos',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/recursos',
            current: false
          }
        ]
      },
      {
        title: 'Usuarios',
        url: '#',
        submenu: [
          {
            title: 'Associados',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/associado-lista',
            current: false
          },
          {
            title: 'Auditores',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/auditor-lista',
            current: false
          },
          {
            title: 'Empresas',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/empresa-lista',
            current: false
          },
          {
            title: 'Gestores',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/gestor-lista',
            current: false
          },
          {
            title: 'Usuários',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/usuario-lista',
            current: false
          }
        ]
      },
      {
        title: 'Videoaulas',
        url: '#',
        submenu: [
          {
            title: 'Categorias',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/videoaulas/categorias',
            resources: ['admin_videos']
          },
          {
            title: 'Lista',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/videoaulas/lista',
            resources: ['admin_videos']
          },
          {
            title: 'Tags',
            url: 'https://teste.cacbempreenderapp.org.br/sistema/videoaulas/tags',
            resources: ['admin_videos']
          }
        ]
      }
    ]
  }
]
