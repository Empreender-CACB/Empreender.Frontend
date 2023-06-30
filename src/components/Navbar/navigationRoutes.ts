export const navigation = [
  {
    name: 'Início',
    href: '#',
    current: true,
    resources: ['pj_restrito', 'premio21_gestor']
  },
  {
    name: 'Entidades',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Adicionar Entidade',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/associacao/adicionar/',
        current: false,
        resources: ['ace_adici']
      },
      {
        name: 'Listar Entidades',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/associacao/',
        current: false,
        resources: ['ace_consu']
      },
      {
        name: 'Diagnósticos',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/lista-diagnosticos-geral',
        current: false,
        resources: ['mostrar_diagnosticos']
      },
      {
        name: 'Painel de Diagnósticos',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/painel-diagnosticos',
        current: false,
        resources: ['mostrar_diagnosticos']
      },
      {
        name: 'Perfil das ACEs',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/associacao/painel',
        current: false,
        resources: ['painel_entidade']
      }
    ]
  },
  {
    name: 'Núcleos',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Adicionar Núcleo',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/nucleo/adicionar/',
        current: false,
        resources: ['nuc_adici']
      },
      {
        name: 'Adicionar Plano de Ação',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/plano-acao/adicionar/',
        current: false,
        resources: ['pla_adici']
      },
      {
        name: 'Adicionar Reunião',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/reuniao/adicionar/',
        current: false,
        resources: ['reu_adici']
      },
      {
        name: 'Listar Núcleos',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/nucleo/',
        current: false,
        resources: ['nuc_consu']
      },
      {
        name: 'Listar Planos de Ação',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/plano-acao/',
        current: false,
        resources: ['pla_consu']
      },
      {
        name: 'Listar Reuniões',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/reuniao/',
        current: false,
        resources: ['reu_consu']
      }
    ]
  },
  {
    name: 'Empresas',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Adicionar Empresa',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/adicionar/',
        current: false,
        resources: ['emp_adici']
      },
      {
        name: 'Listar Empresas',
        href: '/empresas',
        current: false,
        resources: ['emp_lista']
      },
      {
        name: 'Minhas Empresas',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/minhas-empresas',
        current: false,
        resources: ['emp_adici', 'emp_lista'],
        isGestor: true
      }
    ]
  },

  {
    name: 'Usuários',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Adicionar Usuário',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/usuario/adicionar/',
        current: false,
        resources: ['usu_adici']
      },
      {
        name: 'Listar Usuários',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/usuario/',
        current: false,
        resources: ['usu_consu']
      }
    ]
  },

  {
    name: 'Relatórios',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Adicionar Relatório',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/gerador-relatorio/modelo',
        current: false,
        resources: ['rel_adici']
      },
      {
        name: 'Listar Relatórios',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/relatorio/',
        current: false
      }
    ]
  },
  {
    name: 'Projetos',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Acompanhamento financeiro',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Painel das Entidades Proponentes',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-entidades/',
            current: false,
            resources: ['painel_entidades_origens']
          },
          {
            name: 'Painel Gestão Financeira',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-gestao-financeira/',
            current: false,
            resources: ['painel_gest_fin']
          },
          {
            name: 'Projetos Apoiados - FIN',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/projetos-apoiados-financeiro/',
            current: false
          },
          {
            name: 'Situação dos projetos',
            href: '#',
            current: false,
            dropdown: [
              {
                name: 'Projetos sem lançamentos no período',
                href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-situacao-projetos/?tipo=periodo',
                current: false,
                resources: ['dah_rutli']
              },
              {
                name: 'Projetos com lançamentos para análise',
                href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-situacao-projetos/?tipo=analise',
                current: false,
                resources: ['dah_iseis']
              }
            ]
          },
          {
            name: 'Transferências e Pagamentos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/transferencias-e-pagamentos-novo',
            current: false,
            resources: ['lan_pgto', 'transf_pgto']
          }
        ]
      },
      {
        name: 'Acompanhamento técnico',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Acompanhamento da pesquisa',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-acompanhamento',
            current: false
          },
          {
            name: 'Documentos aguardando aprovação',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/painel-aguardando',
            current: false
          },
          {
            name: 'Projetos Apoiados - TEC',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/projetos-apoiados-tec',
            current: false
          }
        ]
      },
      {
        name: 'Auditoria 189',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/projeto-auditoria/',
        current: false,
        resources: ['auditoria_189']
      },
      {
        name: 'E2022 - Acompanhamento Sebrae',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Acompanhamento de despesas',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/despesas-acompanhamento',
            current: false,
            resources: ['e2022_acomp']
          }
        ]
      },
      {
        name: 'E2022 / AL Invest Verde',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/concursos-geral/',
        current: false
      },
      {
        name: 'Prêmio 21',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Avaliação final',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/avaliacao-final',
            current: false,
            resources: ['premio21_gestor']
          },
          {
            name: 'Lista de Propostas',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/lista-propostas/',
            current: false,
            resources: ['premio21_gestor']
          },
          {
            name: 'Painel',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/painel',
            current: false,
            resources: ['premio21_gestor']
          },
          {
            name: 'Relatório de Notas',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/relatorio-notas',
            current: false,
            resources: ['premio21_gestor']
          },
          {
            name: 'Resultado final',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/avaliacao-final',
            current: false
          }
        ]
      }
    ]
  },
  {
    name: 'Arquivos',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Listar Arquivos',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/arquivos',
        current: false
      }
    ]
  },
  {
    name: 'Currículos',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Listar Currículos',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/curriculo/',
        current: false
      },
      {
        name: 'Listar Usuários',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/usuariocv/',
        current: false
      }
    ]
  },
  {
    name: 'ADM',
    href: '#',
    current: false,
    dropdown: [
      {
        name: 'Acompanhamento geral',
        href:
          'https://teste.cacbempreenderapp.org.br/sistema/adminutils/acompanhamento-geral/quadro/' +
          btoa('quadro1'),
        current: false
      },
      {
        name: 'Ajustes de Dados',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/prestcontas/atualizacao-lancamento',
        current: false,
        resources: ['atual_expressa']
      },
      {
        name: 'Concurso',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Avaliadores',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/avaliador-lista',
            current: false,
            resources: ['premio21_gestor', 'e22_demandas_gestor']
          },
          {
            name: 'Categorias',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/categoria-lista',
            current: false,
            resources: ['premio21_gestor', 'e22_demandas_gestor']
          },
          {
            name: 'Concursos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/index',
            current: false,
            resources: ['premio21_gestor', 'e22_demandas_gestor']
          },
          {
            name: 'Quesitos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/concurso/quesito-lista',
            current: false,
            resources: ['premio21_gestor', 'e22_demandas_gestor']
          }
        ]
      },
      {
        name: 'Diagnósticos',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Quesitos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/quesitos-diagnostico-lista',
            current: false
          },
          {
            name: 'Consultores',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/consultor-lista',
            current: false
          },
          {
            name: 'Entidades cadastradas',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/diagnosticos/entidades-lista',
            current: false
          }
        ]
      },
      {
        name: 'Direitos',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Associação Gestor-Recurso',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/gestor-recurso/',
            current: false,
            resources: ['adm_direitos']
          },
          {
            name: 'Associação Perfil-Recurso',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/aclrecurso/',
            current: false,
            resources: ['adm_direitos']
          },
          {
            name: 'Lista de direitos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/direitos/index',
            current: false,
            resources: ['adm_direitos']
          },
          {
            name: 'Perfis',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/usuarios/perfil-lista',
            current: false,
            resources: ['adm_direitos']
          },
          {
            name: 'Recurso',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/recurso/',
            current: false,
            resources: ['adm_direitos']
          }
        ]
      },
      {
        name: 'Documentos',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/documento/',
        current: false
      },
      {
        name: 'Empresas',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Cadastro empresa',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/cadastro',
            current: false
          },
          {
            name: 'Cadastro ramo atividade',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/ramoatividade',
            current: false
          },
          {
            name: 'Lista empresas',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/index',
            current: false
          },
          {
            name: 'Lista empreendimentos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/empreendimentos',
            current: false
          },
          {
            name: 'Lista ramos atividades',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/ramoatividade-lista',
            current: false
          },
          {
            name: 'Lista tipo empreendimento',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/empresa/tipoempreendimento-lista',
            current: false
          }
        ]
      },
      {
        name: 'Estatísticas',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/estatisticas/',
        current: false
      },
      {
        name: 'Eventos',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Cadastro',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/eventos/cadastro',
            current: false,
            resources: ['evento_geral']
          },
          {
            name: 'Participantes',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/eventos/participantes',
            current: false,
            resources: ['evento_geral']
          },
          {
            name: 'Programação',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/eventos/programacao',
            current: false,
            resources: ['evento_geral']
          },
          {
            name: 'Tipos eventos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/eventos/tipos',
            current: false,
            resources: ['evento_geral']
          }
        ]
      },
      {
        name: 'Informações',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Boletins',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/boletim/',
            current: false,
            resources: ['admin_boletins']
          },
          {
            name: 'Etapas Ciclos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/etapas-ciclos/',
            current: false,
            resources: ['admin_ciclos']
          },
          {
            name: 'Menu',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/menu/',
            current: false,
            resources: ['admin_menu']
          },
          {
            name: 'Textos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/texto/',
            current: false,
            resources: ['admin_textos']
          }
        ]
      },
      {
        name: 'Integrantes',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/integrantes/',
        current: false
      },
      {
        name: 'Notícias',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Cadastro',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/noticias/cadastro',
            current: false
          },
          {
            name: 'Lista',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/noticias/index',
            current: false
          }
        ]
      },
      {
        name: 'Recursos',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/recurso/',
        current: false
      },
      {
        name: 'Regras',
        href: 'https://teste.cacbempreenderapp.org.br/sistema/adminutils/regras/',
        current: false
      },
      {
        name: 'Relatórios',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Diagnósticos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/diagnosticos',
            current: false
          },
          {
            name: 'Empresas',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/empresas',
            current: false
          },
          {
            name: 'Eventos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/eventos',
            current: false
          },
          {
            name: 'Listagens',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/listagens',
            current: false
          },
          {
            name: 'Pontuação Geral',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/pontuacao-geral',
            current: false
          },
          {
            name: 'Recursos',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/relatorios/recursos',
            current: false
          }
        ]
      },
      {
        name: 'Usuarios',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Associados',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/associado-lista',
            current: false
          },
          {
            name: 'Auditores',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/auditor-lista',
            current: false
          },
          {
            name: 'Empresas',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/empresa-lista',
            current: false
          },
          {
            name: 'Gestores',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/gestor-lista',
            current: false
          },
          {
            name: 'Usuários',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/usuarios/usuario-lista',
            current: false
          }
        ]
      },
      {
        name: 'Videoaulas',
        href: '#',
        current: false,
        dropdown: [
          {
            name: 'Categorias',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/videoaulas/categorias',
            current: false,
            resources: ['admin_videos']
          },
          {
            name: 'Lista',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/videoaulas/lista',
            current: false,
            resources: ['admin_videos']
          },
          {
            name: 'Tags',
            href: 'https://teste.cacbempreenderapp.org.br/sistema/videoaulas/tags',
            current: false,
            resources: ['admin_videos']
          }
        ]
      }
    ]
  }
]
