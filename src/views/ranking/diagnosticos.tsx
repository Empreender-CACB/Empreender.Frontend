import { Table } from '@/components/ui';
import TBody from '@/components/ui/Table/TBody';
import THead from '@/components/ui/Table/THead';
import Td from '@/components/ui/Table/Td';
import Th from '@/components/ui/Table/Th';
import Tr from '@/components/ui/Table/Tr';
import ApiService from '@/services/ApiService';
import React, { useEffect, useState } from 'react';

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
  notasPorArea: NotaPorArea;
  somaTotalNotas: number;
  rankingGeral: string;
  notaGeral: string;
  areas: AreaNames;
}

interface State {
  diagnosticos: Diagnostico[];
  isLoading: boolean;
  error: string | null;
}

function RankingDiagnostico() {

  const [state, setState] = useState<State>({
    diagnosticos: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const getDados = async () => {
      try {
        const response = await ApiService.fetchData({
          url: 'ranking/diagnostico',
          method: 'GET'
        });

        if (response.status === 200) {
          setState({
            diagnosticos: response.data as Diagnostico[],
            isLoading: false,
            error: null
          });
        } else {
          throw new Error('Falha ao buscar dados');
        }
      } catch (error: any) {
        console.error(error);
        setState({
          diagnosticos: [],
          isLoading: false,
          error: error.message || 'Erro desconhecido'
        });
      }
    };

    getDados();
  }, []);

  if (state.isLoading) return <p>Carregando...</p>;
  if (state.error) return <p>Erro: {state.error}</p>;

  const topTresDiagnosticos = state.diagnosticos
    .sort((a, b) => parseInt(a.rankingGeral) - parseInt(b.rankingGeral))
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center">

      <div className="w-full py-16 flex items-center" style={{ background: '#76A030' }}>
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-white text-5xl font-bold tracking-tight">Ranking de Entidades 2024</h1>
            <div className="w-64 h-1 bg-white mt-8"></div>
          </div>
          {/* Espaço reservado para ícones ou outros elementos do lado direito */}
          <div>
            <img className="h-11" src="https://www.empreender.org.br/css/sistema/novo_css/img/logo-cacb-mini-novo.png" alt="CACB" />

          </div>
        </div>
      </div>

      {/* Podium Component */}
      <div className='max-w-screen-lg	'>
        <h2 className="mt-10 text-3xl mb-4 font-semibold">Top 3 Entidades</h2>
        <p>O ranking geral do Índice de Cidades Empreendedoras (ICE) 2023 leva em consideração cada um dos sete determinantes apresentados no
          relatório e o seu resultado é um instrumento de avaliação voltado para gestores públicos e organizações de apoio interessadas em
          gerar impactos na economia de seu município a partir do fomento à atividade empreendedora, assim como para empreendedores que
          queiram expandir seus negócios e para a mídia, que busca análises e dados qualificados.</p>

        <div className="flex justify-center w-full">
          <div className="flex justify-center items-end mt-5 gap-8">
            {topTresDiagnosticos.map((diagnostico, index) => {
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
                <div key={index} className="text-center">
                  <p className="mb-2 font-bold">{diagnostico.cidade}</p>
                  <div className={`bg-green-800 w-36 ${heightClass} flex justify-center items-end pb-2 rounded`}>
                    <span className="text-white text-6xl font-semibold pb-8">{diagnostico.rankingGeral}</span>
                  </div>
                  <p className="mt-2">{parseFloat(diagnostico.notaGeral).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Placeholder for Future Table */}
        <div className="my-10">
          <div className="flex flex-col items-center">
            <Table>
              <THead>
                <Tr>
                  {/* Inserir cabeçalhos com ícones, você precisará adicionar ícones relevantes */}
                  <Th>Entidade</Th>
                  <Th>Cidade</Th>
                  <Th>Total</Th>
                  {/* Cabeçalhos dinâmicos baseados nas áreas */}
                  {state.diagnosticos[0] && Object.entries(state.diagnosticos[0].areas).map(([key, name], index) => (
                    <Th key={key}>
                      <span className={`icon-${name.toLowerCase().replace(/\s/g, '-')}`}>{name}</span>
                    </Th>
                  ))}
                </Tr>
              </THead>
              <TBody>
                {state.diagnosticos.map((diagnostico, index) => (
                  <Tr key={index}>
                    <Td>{diagnostico.entidade}</Td>
                    <Td>{diagnostico.cidade}</Td>
                    <Td>{diagnostico.rankingGeral} - {diagnostico.notaGeral}</Td>

                    {Object.keys(diagnostico.areas).map(areaId => (
                      <Td key={areaId}>{diagnostico.notasPorArea[areaId]}</Td>
                    ))}
                  </Tr>
                ))}
              </TBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingDiagnostico;
