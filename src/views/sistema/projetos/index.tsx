/* eslint-disable @typescript-eslint/no-explicit-any */
import '@inovua/reactdatagrid-community/index.css'

import { Link } from 'react-router-dom'
import moment from 'moment'
import DateFilter from '@inovua/reactdatagrid-community/DateFilter'
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import TagActiveInative from '@/components/ui/Tag/TagActiveInative'
import CustomReactDataGrid from '@/components/shared/CustomReactDataGrid'

import { HiOutlineReply, HiPlusCircle } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

import estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros'
// import { projetoCard } from '@/components/shared/TableCards/projetoCard'

moment.locale('pt-br')

const statusStyles: any = {
  'cadas': { label: 'Cadastrado', class: 'bg-yellow-400 text-white' },
  'inici': { label: 'Iniciado', class: 'bg-purple-500 text-white' },
  'andam': { label: 'Em Andamento', class: 'bg-blue-500 text-white' },
  'concl': { label: 'Concluído', class: 'bg-green-500 text-white' },
  'cance': { label: 'Cancelado', class: 'bg-red-500 text-white' },
  'desco': { label: 'Descartado', class: 'bg-gray-400 text-white' },
  'bloqu': { label: 'Bloqueado', class: 'bg-gray-500 text-white' },
  'nselc': { label: 'Não Selecionado', class: 'bg-gray-300 text-white' }
};

const StatusTag: React.FC<{ statusKey: string }> = ({ statusKey }) => {
  const statusInfo = statusStyles[statusKey] || { label: 'Indefinido', class: 'bg-gray-200 text-black' };

  return (
    <div className={`border-0 rounded-md text-center px-2 py-1 ${statusInfo.class}`}>
      {statusInfo.label}
    </div>
  );
};


const columns = [
  { name: 'idprojeto', header: 'ID Projeto', defaultFlex: 1, type: 'number' },
  { name: 'nmprojeto', header: 'Nome do Projeto', defaultFlex: 1.5, type: 'string' },
  { name: 'nmnucleo', header: 'Núcleo', defaultFlex: 1, type: 'string' },
  { name: 'dssegmento', header: 'Segmento', defaultFlex: 1, type: 'string' },
  { name: 'associacao_razao', header: 'Associação Razão', defaultFlex: 1.5, type: 'string' },
  { name: 'entidade_prop_razao', header: 'Entidade Proprietária', defaultFlex: 1, type: 'string' },
  { name: 'titulo', header: 'Título do Concurso', defaultFlex: 1, type: 'string' },
  {
    name: 'flstatus',
    header: 'Status',
    defaultFlex: 1,
    type: 'string',
    render: ({ data }: any) => <StatusTag statusKey={data.flstatus} />
  },
  { 
      name: 'classe_descricao',
      header: 'Classe Descrição',
      defaultFlex: 1,
      type: 'string',
      render: ({ data }: any) => <p title={data.classe_descricao}>{data.classe_descricao || '-'}</p>
  },
];

const projetos = () => {
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">Projetos</h3>
        <div className="flex flex-col lg:flex-row lg:items-center">

          <Button size="sm" icon={<HiOutlineReply />}>
            <Link
              className="menu-item-link"
              to={`${import.meta.env.VITE_PHP_URL}/sistema/prestcontas/projeto`}
            >
              Versão antiga
            </Link>
          </Button>
          <Link
            className="block lg:inline-block md:mb-0 mb-4 ml-2"
            to="/app/sales/product-new"
          >
            <Button
              block
              variant="solid"
              size="sm"
              icon={<HiPlusCircle />}
            >
              Adicionar Projeto
            </Button>
          </Link>
        </div>
      </div>
      <CustomReactDataGrid
        filename='projeto'
        columns={columns}
        url={`${import.meta.env.VITE_API_URL}/projetos`}
      // CardLayout={projetosCard}
      />

    </AdaptableCard>
  )
}

export default projetos
