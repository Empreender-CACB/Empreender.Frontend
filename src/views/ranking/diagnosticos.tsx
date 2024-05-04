import { Table } from '@/components/ui';
import TBody from '@/components/ui/Table/TBody';
import THead from '@/components/ui/Table/THead';
import Td from '@/components/ui/Table/Td';
import Th from '@/components/ui/Table/Th';
import Tr from '@/components/ui/Table/Tr';
import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';

import { RiTeamLine } from "react-icons/ri";
import { BsFillHouseGearFill } from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";
import { GiProgression } from "react-icons/gi";
import { FaHandHoldingUsd } from "react-icons/fa";

interface NotaPorArea {
  [key: string]: string;
}

interface AreaNames {
  [key: string]: string;
}

interface Diagnostico {
  id: number;
  entidade: string;
  cidade: string;
  uf: string;
  notasPorArea: NotaPorArea;
  somaTotalNotas: number;
  rankingGeral: string;
  notaGeral: string;
  areas: AreaNames;
}

interface State {
  diagnosticos: Diagnostico[];
  isLoading: boolean;
  ufs: any[];
  error: string | null;
  filtroUf: string;
}

function RankingDiagnostico() {
  const [state, setState] = useState<State>({
    diagnosticos: [],
    ufs: [],
    isLoading: true,
    error: null,
    filtroUf: ''
  });

  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await ApiService.fetchData({
          url: 'ranking/diagnostico',
          method: 'GET'
        });
        if (response.status === 200) {
          const uniqueUfs = Array.from(new Set(response.data.map((item: any) => item.uf))).sort();
          setState({
            diagnosticos: response.data as Diagnostico[],
            ufs: uniqueUfs,
            isLoading: false,
            error: null,
            filtroUf: '',
          });
        } else {
          throw new Error('Falha ao buscar dados');
        }
      } catch (error: any) {
        console.error(error);
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          error: error.message || 'Erro desconhecido'
        }));
      }
    };

    fetchData();
  }, []);

  // Função para alterar a ordenação
  const changeSort = (newSortKey: any) => {
    if (sortKey === newSortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(newSortKey);
      setSortDirection('asc');
    }
  };

  // Função combinada de filtro e ordenação
  const getFilteredAndSortedDiagnosticos = () => {
    let filtered = [...state.diagnosticos];

    if (state.filtroUf) {
      filtered = filtered.filter(diagnostico => diagnostico.uf === state.filtroUf);
    }

    return filtered.sort((a, b) => {
      let aValue, bValue;
      if (sortKey === 'total') {
        aValue = a.somaTotalNotas;
        bValue = b.somaTotalNotas;
      } else {
        const aRating = a.notasPorArea[sortKey];
        const bRating = b.notasPorArea[sortKey];
        aValue = aRating ? parseInt(aRating.split('º - ')[0], 10) : Number.MAX_SAFE_INTEGER;
        bValue = bRating ? parseInt(bRating.split('º - ')[0], 10) : Number.MAX_SAFE_INTEGER;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };


  const sortedAndFilteredDiagnosticos = getFilteredAndSortedDiagnosticos();

  function renderPodium(diagnostico: any) {
    let heightClass = '';
    switch (diagnostico.rankingGeral) {
      case "1º":
        heightClass = 'h-52';
        break;
      case "2º":
        heightClass = 'h-40';
        break;
      case "3º":
        heightClass = 'h-32';
        break;
      default:
        heightClass = 'h-32';
    }

    return (
      <div key={diagnostico.id} className="text-center">
        <p className="mb-2 font-bold">{diagnostico.cidade}</p>
        <div className={`bg-green-800 w-36 ${heightClass} flex justify-center items-end pb-2 rounded`}>
          <span className="text-white text-6xl font-semibold pb-8">{diagnostico.rankingGeral}</span>
        </div>
        <p className="mt-2">{parseFloat(diagnostico.notaGeral).toFixed(2)}</p>
      </div>
    );
  }


  const iconStyles = "text-white text-2xl";

  const iconMapping: any = {
    "Pessoas": <RiTeamLine className={iconStyles} />,
    "Processos internos": <BsFillHouseGearFill className={iconStyles} />,
    "Finanças": <TbPigMoney className={iconStyles} />,
    "Clientes": <FaUsers className={iconStyles} />,
    "Cultura associativista": <FaHandshakeSimple className={iconStyles} />,
    "Desenvolvimento local": <GiProgression className={iconStyles} />,
    "Benefícios": <FaHandHoldingUsd className={iconStyles} />
  };

  const colorMapping: any = {
    "Pessoas": "bg-red-500",
    "Processos internos": "bg-blue-500",
    "Finanças": "bg-green-500",
    "Clientes": "bg-yellow-500",
    "Cultura associativista": "bg-pink-500",
    "Desenvolvimento local": "bg-purple-500",
    "Benefícios": "bg-indigo-500"
  };

  if (state.isLoading) return <p>Carregando...</p>;
  if (state.error) return <p>Erro: {state.error}</p>;

  const topTresDiagnosticos = state.diagnosticos
    .sort((a, b) => parseInt(a.rankingGeral) - parseInt(b.rankingGeral))
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center">

      <div className="w-full py-16 flex items-center" style={{ background: '#76A030' }}>
        <div className="max-w-screen-xl mx-auto w-full flex justify-between items-center">
          <div>
            <h1 className="text-white text-5xl font-bold tracking-tight">Ranking de Entidades 2024</h1>
            <div className="w-64 h-1 bg-white mt-8"></div>
          </div>
          <div>
            <img className="h-11" src="https://www.empreender.org.br/css/sistema/novo_css/img/logo-cacb-mini-novo.png" alt="CACB" />
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl'>
        <h2 className="mt-10 text-3xl mb-4 font-semibold">Top 3 Entidades</h2>
        <p>O ranking geral do Índice de Cidades Empreendedoras (ICE) 2023 leva em consideração cada um dos sete determinantes apresentados no
          relatório e o seu resultado é um instrumento de avaliação voltado para gestores públicos e organizações de apoio interessadas em
          gerar impactos na economia de seu município a partir do fomento à atividade empreendedora, assim como para empreendedores que
          queiram expandir seus negócios e para a mídia, que busca análises e dados qualificados.</p>

        <div className="flex justify-center w-full">
          <div className="flex justify-center items-end mt-5 gap-8">
            {topTresDiagnosticos
              .filter((diagnostico) => diagnostico.rankingGeral === "2º")
              .map((diagnostico) => renderPodium(diagnostico))}

            {topTresDiagnosticos
              .filter((diagnostico) => diagnostico.rankingGeral === "1º")
              .map((diagnostico) => renderPodium(diagnostico))}

            {topTresDiagnosticos
              .filter((diagnostico) => diagnostico.rankingGeral === "3º")
              .map((diagnostico) => renderPodium(diagnostico))}
          </div>
        </div>

        <div className="my-10">
          <div className="self-start mb-4">
            <label htmlFor="ufFilter" className="block text-sm font-medium text-gray-700">Filtrar por UF:</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={state.filtroUf}
              onChange={(e) => setState({ ...state, filtroUf: e.target.value })}>
              <option value="">Selecione uma UF</option>
              {Array.from(new Set(state.diagnosticos.map(diag => diag.uf))).map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
          <Table>
            <THead>
              <Tr>
                <Th>Entidade</Th>
                <Th>Cidade/UF</Th>
                <Th className="cursor-pointer" onClick={() => changeSort('total')}>Total</Th>
                {state.diagnosticos[0] && Object.entries(state.diagnosticos[0].areas).map(([key, name]) => (
                  <Th key={key} onClick={() => changeSort(key)} className="cursor-pointer">
                    <div className='flex flex-col items-center justify-center py-1'>
                      <div className={`rounded-full p-2 ${colorMapping[name]} flex justify-center items-center cursor-pointer`}>
                        {iconMapping[name]}
                      </div>
                      <span className="mt-2" style={{ fontSize: '10px', textAlign: 'center' }}>{name}</span>
                    </div>
                  </Th>
                ))}
              </Tr>
            </THead>
            <TBody>
              {sortedAndFilteredDiagnosticos.map((diagnostico, index) => (
                <Tr key={index}>
                  <Td>{diagnostico.entidade}</Td>
                  <Td>{diagnostico.cidade} - {diagnostico.uf}</Td>
                  <Td className="whitespace-nowrap">
                    {sortKey === 'total' ? <strong>{diagnostico.rankingGeral} - {diagnostico.notaGeral}</strong> : `${diagnostico.rankingGeral} - ${diagnostico.notaGeral}`}
                  </Td>
                  {Object.keys(diagnostico.areas).map(areaId => (
                    <Td className="text-center whitespace-nowrap" key={areaId}>
                      {sortKey === areaId ? <strong>{diagnostico.notasPorArea[areaId]}</strong> : diagnostico.notasPorArea[areaId]}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>

        </div>
      </div>
    </div>
  );
}

export default RankingDiagnostico;
