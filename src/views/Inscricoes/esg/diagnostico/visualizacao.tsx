import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Empresa } from '@/@types/generalTypes';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface AlternativaEscolhida {
    descricao: string;
    nota: number;
}

interface RadarData {
    labels: string[];
    data: number[];
}

interface UsuarioSebrae {
    id: number;
    nome: string;
    email: string;
    data_inclusao: Date;
}

interface AlternativaEscolhida {
    descricao: string;
    nota: number;
}

interface QuesitoAgrupado {
    descricao: string;
    alternativaEscolhida: AlternativaEscolhida;
}

interface AreaAgrupada {
    nome: string;
    quesitos: QuesitoAgrupado[];
}

interface DadosDiagnostico {
    dados: {
        areaNome: string;
        quesitoDescricao: string;
        alternativaEscolhida: AlternativaEscolhida;
    }[];
    radarData: RadarData;
    empresa: Empresa;
    usuarioSebrae: UsuarioSebrae;
}


const VisualizacaoDiagnosticoEsg = () => {
    const [dadosDiagnostico, setDadosDiagnostico] = useState<DadosDiagnostico | null>(null);
    const { id_diagnostico } = useParams();

    useEffect(() => {
        const buscarDadosDiagnostico = async () => {
            try {
                const response = await ApiService.fetchData({
                    url: `esg/visualizar-diagnostico/${id_diagnostico}`,
                    method: 'get',
                });
                if (response.data) {
                    setDadosDiagnostico(response.data as DadosDiagnostico);
                }
            } catch (error) {
                console.error(error);
            }
        };

        buscarDadosDiagnostico();
    }, [id_diagnostico]);

    const agrupadosPorArea: Record<string, AreaAgrupada> = dadosDiagnostico?.dados.reduce((acc: Record<string, AreaAgrupada>, item) => {
        if (!acc[item.areaNome]) {
            acc[item.areaNome] = {
                nome: item.areaNome,
                quesitos: []
            };
        }
        acc[item.areaNome].quesitos.push({
            descricao: item.quesitoDescricao,
            alternativaEscolhida: item.alternativaEscolhida
        });

        return acc;
    }, {}) ?? {};

    const dataRadar = dadosDiagnostico?.radarData ? {
        labels: dadosDiagnostico.radarData.labels,
        datasets: [{
            label: 'Notas (%)',
            data: dadosDiagnostico.radarData.data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        }]
    } : {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: '',
            borderColor: '',
            pointBackgroundColor: '',
            pointBorderColor: '',
            pointHoverBackgroundColor: '',
            pointHoverBorderColor: '',
        }]
    };

    const options = {
        maintainAspectRatio: true,
        aspectRatio: 1,
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 100
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };


    return (
        <div className='bg-white sm:w-full lg:w-9/12 mx-auto'>
            <div className="flex flex-col items-center">
                {/* LOGOS DAS EMPRESAS */}
                <div className=" flex items-center space-x-4">
                    <div className="mt-10 mx-auto center max-w-7xl pb-5 px-6">
                        <div className="grid grid-cols-4 gap-8">
                            <div className="col-span-2 flex justify-center sm:col-span-1">
                                <img className="img object-contain sm:h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-cacb.png" />
                            </div>
                            <div className="col-span-2 flex justify-center sm:col-span-1">
                                <img className=" w-11/12 img object-contain sm:h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-empreender.png" />
                            </div>
                            <div className="col-span-2 flex justify-center sm:col-span-1">
                                <img className="img object-contain sm:h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" />
                            </div>
                            <div className="col-span-2 flex justify-center sm:col-span-1">
                                <img
                                    className="img object-contain sm:h-12"
                                    src="https://beta.cacbempreenderapp.org.br/img/logo/sebrae.svg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {dadosDiagnostico && (
                <div className="bg-white sm:w-full lg:w-9/12 mx-auto px-4 py-5 sm:p-6">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full lg:w-7/12 px-4">
                            <h2 className="text-xl font-semibold mb-4">Visualização do Diagnóstico ESG</h2>
                            {Object.values(agrupadosPorArea).map((area, index) => (
                                <div key={index} className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">{area.nome}</h3>
                                    <div className="border p-4 rounded-md">
                                        {area.quesitos.map((quesito, quesitoIndex) => (
                                            <div key={quesitoIndex} className="mb-4">
                                                <p className="font-medium">{quesito.descricao}</p>
                                                <ul className="list-disc pl-5 mt-2">
                                                    <li className="text-green-600">{quesito.alternativaEscolhida.descricao} (Nota: {quesito.alternativaEscolhida.nota})</li>
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full lg:w-5/12 px-4">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-4">Informações Gerais</h3>
                                <div className="border p-6 rounded-lg shadow-sm bg-white">
                                    <p className="mb-4"><strong>Nome da Empresa:</strong> <span className="text-gray-600">{dadosDiagnostico.empresa.nmfantasia}</span></p>
                                    <p className="mb-4"><strong>CNPJ:</strong> <span className="text-gray-600">{dadosDiagnostico.empresa.nucnpjcpf}</span></p>
                                    <p className="mb-4"><strong>Usuário:</strong> <span className="text-gray-600">{dadosDiagnostico.usuarioSebrae.nome}</span></p>
                                    <p className="mb-4"><strong>Email:</strong> <span className="text-gray-600">{dadosDiagnostico.usuarioSebrae.email}</span></p>
                                    <p className="mb-2"><strong>Data do Preenchimento:</strong> <span className="text-gray-600">{format(new Date(dadosDiagnostico.usuarioSebrae.data_inclusao), 'dd/MM/yyyy')}</span></p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-white p-5 border rounded-lg shadow-sm">
                                <div className="w-full max-w-lg">
                                    <Radar data={dataRadar} options={options} />
                                </div>
                                <p className="text-sm text-gray-500 text-center max-w-md" style={{ marginTop: '-50px' }}>
                                    O gráfico acima representa a situação da empresa em cada área do diagnóstico ESG, calculada como uma porcentagem do valor máximo possível. Para cada área considera-se a soma das notas obtidas comparada com o total de pontos possível. Assim, o valor apresentado reflete o quão próximo a empresa está de atingir a pontuação máxima em cada área.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default VisualizacaoDiagnosticoEsg;
