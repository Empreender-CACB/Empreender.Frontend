import { Alert, Table } from '@/components/ui';
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
import { FaCity, FaUsers } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";
import { GiBrazil, GiProgression } from "react-icons/gi";
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdOutlineAnalytics } from 'react-icons/md';

interface NotaPorArea {
  [key: string]: string;
}

interface Diagnostico {
  id: number;
  entidade: string;
  sigla_entidade?: string;
  cidade: string;
  uf: string;
  notasPorArea: NotaPorArea;
  somaTotalNotas: number;
  rankingGeral: string;
  notaGeral: string;
}

interface State {
  diagnosticos: Diagnostico[];
  areas: { [key: string]: string };
  isLoading: boolean;
  ufs: string[];
  error: string | null;
  filtroUf: string;
}

interface ApiResponse {
  status: number;
  data: {
    ranking: Diagnostico[];
    areas: { [key: string]: string };
  };
}

function RankingDiagnostico() {
  const [state, setState] = useState<State>({
    diagnosticos: [],
    areas: {},
    ufs: [],
    isLoading: true,
    error: null,
    filtroUf: ''
  });

  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterDescription, setFilterDescription] = useState('Geral');
  const [selectedCity, setSelectedCity] = useState('');

  const updateFilterDescription = () => {
    let desc = 'Geral';
    if (state.filtroUf) {
      desc += ` em ${state.filtroUf}`;
    }
    if (selectedCity) {
      desc += `, ${selectedCity}`;
    }
    if (sortKey) {
      const areaName = state.areas[sortKey] || 'Total';
      if (areaName === 'Total') {
        desc = 'Geral';
        if (state.filtroUf) {
          desc += ` em ${state.filtroUf}`;
          if (selectedCity) {
            desc += `, ${selectedCity}`;
          }
        }
      } else {
        desc = `Área de ${areaName}`;
        if (state.filtroUf || selectedCity) {
          desc += ' -';
          if (state.filtroUf) {
            desc += ` ${state.filtroUf}`;
          }
          if (selectedCity) {
            desc += `, ${selectedCity}`;
          }
        }
      }
    }
    desc += ` | Ordenação: ${sortDirection !== 'asc' ? 'Crescente' : 'Decrescente'}`;
    setFilterDescription(desc);
  };

  useEffect(() => {
    updateFilterDescription();
  }, [state.filtroUf, selectedCity, sortKey, sortDirection, state.areas]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.fetchData({ url: 'ranking/diagnostico', method: 'GET' }) as ApiResponse;
        if (response.status === 200) {
          const uniqueUfs = Array.from(new Set(response.data.ranking.map(diag => diag.uf))).sort();
          setState({
            diagnosticos: response.data.ranking,
            areas: response.data.areas,
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

  // Limpa filtro de cidade ao mudar a UF
  useEffect(() => {
    setSelectedCity('');
  }, [state.filtroUf]);

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

  // Função para alterar a ordenação da lista
  const changeSort = (newSortKey: string) => {
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
    if (selectedCity) {
      filtered = filtered.filter(diagnostico => diagnostico.cidade === selectedCity);
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

  if (state.isLoading) return <p>Carregando...</p>;
  if (state.error) return <p>Erro: {state.error}</p>;

  const topTresDiagnosticos = sortedAndFilteredDiagnosticos.slice(0, 3);

  const renderPodium = (diagnostico: any, podiumPosition: number) => {
    let style = {};
    let heightClass = '';
    let paddingClass = '';
    let widthClass = 'w-36';
    let rankingDisplay = sortKey && sortKey !== 'total' ? diagnostico.notasPorArea[sortKey].split(' - ')[0] : diagnostico.rankingGeral;
    let notaDisplay = sortKey && sortKey !== 'total' ? diagnostico.notasPorArea[sortKey].split(' - ')[1] : diagnostico.notaGeral;
  
    // Atribui estilos baseado na posição visual no pódio
    switch (podiumPosition) {
      case 1: // Centro
        style = { background: 'linear-gradient(to bottom, #ffd700, #e6c200)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' };
        heightClass = 'h-52';
        paddingClass = 'pb-16';
        widthClass = 'w-40';
        break;
      case 0: // Esquerda
        style = { background: 'linear-gradient(to bottom, #c0c0c0, #a8a8a8)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' };
        heightClass = 'h-40';
        paddingClass = 'pb-10';
        break;
      case 2: // Direita
        style = { background: 'linear-gradient(to bottom, #cd7f32, #b76e29)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' };
        heightClass = 'h-32';
        paddingClass = 'pb-8';
        break;
    }
  
    return (
      <div key={diagnostico.id} className="text-center flex flex-col items-center">
        <p className="mb-2 font-bold">{diagnostico.cidade} - {diagnostico.uf}</p>
        <div
          style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'end', borderRadius: '0.5rem' }}
          className={`${heightClass} ${widthClass} flex justify-center items-end ${paddingClass}`}>
          <span className={`text-white text-6xl font-semibold`}>{rankingDisplay}</span>
        </div>
        <p className="mt-2">{parseFloat(notaDisplay).toFixed(2)}</p>
      </div>
    );
  };
  
  
  const renderPodiumLayout = () => {
    if (topTresDiagnosticos.length < 1) return null;
  
    topTresDiagnosticos.sort((a, b) => {
      const getRank = (diag: any) => parseInt((sortKey && sortKey !== 'total' ? diag.notasPorArea[sortKey].split(' - ')[0] : diag.rankingGeral).split('º')[0]);
      return getRank(a) - getRank(b);
    });
  
    let orderedPodium = [
      topTresDiagnosticos[1] || null, // Centro
      topTresDiagnosticos[0] || null, // Esquerda
      topTresDiagnosticos[2] || null  // Direita
    ].filter(diag => diag !== null); // Remove null positions if there are less than three diagnostics
  
    return (
      <div className="flex justify-center items-end mt-5 gap-8">
        {orderedPodium.map((diagnostico, index) => renderPodium(diagnostico, index))}
      </div>
    );
  };


  const getTotalUniqueCities = (diagnosticos: any) => {
    const uniqueCities = new Set();
    diagnosticos.forEach((diag: any) => uniqueCities.add(diag.cidade));
    return uniqueCities.size;
  };

  const totalCities = getTotalUniqueCities(state.diagnosticos);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full py-8 flex items-center" style={{ background: '#76A030' }}>
        <div className="max-w-screen-xl mx-auto w-full flex flex-wrap justify-between items-center">
          <div className="mb-6 md:mb-0 flex-1">
            <h1 className="text-white text-3xl md:text-3xl font-bold tracking-tight">
              Projeto Empreender 2022
            </h1>
            <h1 className="text-white text-5xl md:text-6xl mt-2 font-bold tracking-tight">
              Eixo Representatividade
            </h1>
            <div className="w-48 md:w-64 h-1 bg-white mt-4 md:mt-8"></div>
          </div>
          <div className="flex flex-col justify-center mx-auto items-center md:items-end space-y-4 md:space-y-0">
            <img
              className="h-12 md:h-20 mb-6"
              src="/img/logo/logo-cacb-vertical-branco.png"
              alt="CACB"
            />
            <img
              className="h-12 md:h-16 mb-2"
              src="/img/logo/logo-empreender-unir-para-crescer-branco.png"
              alt="Empreender"
            />
            <div className='w-full flex justify-center'>
              <img
                className="h-12 md:h-16 mt-4"
                src="/img/logo/sebrae-branco.svg"
                alt="Sebrae"
              />
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-screen-xl'>
        <div className='flex flex-col my-12 w-full'>
          <div className='flex justify-between items-start'>
            <div className="flex flex-col">
              <h2 className="text-3xl mt-6 mb-12 font-semibold">Classificação das entidades participantes</h2>
              <p className="w-full text-left">O Ranking de Entidades classifica as entidades participantes segundo o diagnóstico de avaliação.
                O “Ranking 1” em função da situação no início da participação no Empreender 2022.
                Assim é possível ver a situação relativa em geral e em cada estado.
                A classificação pode ser Geral ou segundo qualquer das áreas de análise (clique no ícone específico).</p>
            </div>
            <div className='flex gap-4'>
              <div>
                <label htmlFor="ufFilter" className="block text-sm font-medium text-gray-700">Estado</label>
                <select className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={state.filtroUf}
                  onChange={(e) => setState({ ...state, filtroUf: e.target.value })}>
                  <option value="">Todas</option>
                  {Array.from(new Set(state.diagnosticos.map(diag => diag.uf))).sort().map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="cityFilter" className="block text-sm font-medium text-gray-700">Cidade</label>
                <select
                  className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Todas</option>
                  {state.diagnosticos
                    .filter(diag => diag.uf === state.filtroUf)
                    .map(diag => diag.cidade)
                    .filter((city, index, self) => self.indexOf(city) === index) // Remove duplicações
                    .sort()
                    .map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                </select>
              </div>
              <div>
                <label htmlFor="cityFilter" className="block text-sm font-medium text-gray-700">Ranking</label>
                <select
                  className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="1" selected>Ranking 1</option>
                </select>
              </div>
            </div>
          </div>
        </div>


        <div className="flex w-full">
          <div className="flex justify-evenly items-center mt-5 gap-8 w-full">
            <div>
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold">{filterDescription}</h2>
              </div>
              {renderPodiumLayout()}
            </div>
            <div>
              <Alert showIcon type="success" customIcon={<MdOutlineAnalytics />} className='mb-4 w-full'>{state.diagnosticos.length} diagnosticos</Alert>
              <Alert showIcon type="info" customIcon={<GiBrazil />} className='mb-4'>{state.ufs.length} estados</Alert>
              <Alert showIcon type='danger' customIcon={<FaCity />} >{totalCities ?? 0} cidades</Alert>
            </div>
          </div>
        </div>

        <div className="my-10">
          <Table>
            <THead>
              <Tr>
                <Th>#</Th>
                <Th>Entidade</Th>
                <Th>Cidade/UF</Th>
                <Th style={{ textAlign: 'center' }} className={`cursor-pointer ${sortKey === 'total' ? 'font-bold border-b-4 border-indigo-500' : ''}`} onClick={() => changeSort('total')}>Geral</Th>
                {state.diagnosticos[0] && Object.entries(state.areas).map(([key, name]) => (
                  <Th key={key} onClick={() => changeSort(key)} className={`cursor-pointer ${sortKey === key ? 'font-bold border-b-4 border-indigo-500' : ''}`}>
                    <div className='flex flex-col items-center justify-center py-1' style={{ width: '100px' }}> {/* Adicionado width fixo */}
                      <div className={`rounded-full p-2 ${colorMapping[name]} flex justify-center items-center cursor-pointer`}>
                        {iconMapping[name]}
                      </div>
                      <span className={`mt-2 text-center ${sortKey === key ? 'font-bold' : ''}`} style={{ fontSize: '10px' }}>{name}</span>
                    </div>
                  </Th>
                ))}
              </Tr>
            </THead>
            <TBody>
              {sortedAndFilteredDiagnosticos.map((diagnostico, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{diagnostico.entidade} {diagnostico.sigla_entidade ? `- ${diagnostico.sigla_entidade}` : ''}</Td>
                  <Td>{diagnostico.cidade} - {diagnostico.uf}</Td>
                  <Td className="whitespace-nowrap">
                    {sortKey === 'total' ? <strong>{diagnostico.rankingGeral} - {diagnostico.notaGeral}</strong> : `${diagnostico.rankingGeral} - ${diagnostico.notaGeral}`}
                  </Td>
                  {Object.keys(state.areas).map(areaId => (
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
