import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Dialog, Notification } from '@/components/ui';
import ApiService from '@/services/ApiService';
import toast from '@/components/ui/toast'

interface Alternativa {
    id: number;
    alternativa: string;
}

interface Quesito {
    id: number;
    descricao: string;
    alternativas: Alternativa[];
}

interface Area {
    id: number;
    nome: string;
    quesitos: Quesito[];
}

interface Respostas {
    [quesitoId: number]: number;
}

interface AlternativaComSelecao extends Alternativa {
    isSelected: boolean;
}

const DiagnosticoEsg = () => {
    const [currentArea, setCurrentArea] = useState<number>(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [diagnosticData, setDiagnosticData] = useState<Area[]>([]);
    const [selectedOption, setSelectedOption] = useState<Alternativa | null>(null);
    const [respostas, setRespostas] = useState<Respostas>({});
    const [diagId, setDiagId] = useState(0);
    const [dialogIsOpen, setIsOpen] = useState<boolean>(false)

    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verificarDiagnostico = async () => {
            try {
                const response: any = await ApiService.fetchData({
                    url: `esg/diagnostico/${token}`,
                    method: 'get',
                });

                if (!response.data.diagnostico) {
                    navigate('/esg2/cadastro');
                } else if (response.data.diagnostico.status === "Encerrado") {
                    navigate(`/esg2/diagnostico/visualizacao/${token}`);
                } else {
                    setDiagId(response.data.diagnostico.id);
                    console.log(diagId); 

                    // Busca as respostas para preencher as alternativas já marcardas
                    await ApiService.fetchData({
                        url: `esg/respostas-diagnostico/${diagId}`,
                        method: 'get',
                    }).then((response: any) => {
                        setRespostas(response.data);
                    }).catch(error => {
                        toast.push(
                            <Notification title={error.response?.data?.message} type="danger" />
                        );
                    });

                    // Busca os quesitos e suas alternativas
                    await ApiService.fetchData({
                        url: 'esg/get-quesitos-esg-diagnostico',
                        method: 'get',
                    }).then(response => {
                        setDiagnosticData(response.data as Area[]);
                    }).catch(error => {
                        toast.push(
                            <Notification title={error.response?.data?.message} type="danger" />
                        );
                    });
                }
            } catch (error) {
                navigate('/esg2/cadastro');
            }
        };

        verificarDiagnostico();
    }, [diagId, navigate]);


    const getTotalQuestions = (areaIndex: number): number => {
        return diagnosticData[areaIndex]?.quesitos?.length || 0;
    };

    const getCurrentQuestionOptions = (): AlternativaComSelecao[] => {
        const currentQuesitos = diagnosticData[currentArea]?.quesitos[currentQuestionIndex];
        const alternativas = currentQuesitos?.alternativas || [];

        return alternativas.map(alt => ({
            ...alt,
            isSelected: selectedOption?.id === alt.id || respostas[currentQuesitos?.id] === alt.id
        }));
    };

    const handleNextQuestion = async () => {
        const quesitoId = diagnosticData[currentArea].quesitos[currentQuestionIndex].id;
        const alternativaId = selectedOption?.id;

        if (alternativaId !== undefined) {
            try {
                await ApiService.fetchData({
                    url: 'esg/enviar-resposta-diagnostico',
                    method: 'post',
                    data: { id: diagId, answers: { [quesitoId]: alternativaId } }
                });

                setRespostas(prevRespostas => ({
                    ...prevRespostas,
                    [quesitoId]: alternativaId
                }));

            } catch (error: any) {
                toast.push(
                    <Notification title={error?.data.message} type="danger" />
                );
            }
        }

        const totalQuestionsInCurrentArea = getTotalQuestions(currentArea);
        const isLastArea = currentArea === diagnosticData.length - 1;
        const isLastQuestion = currentQuestionIndex === totalQuestionsInCurrentArea - 1;

        if (isLastArea && isLastQuestion) {
            navigate(`/esg2/diagnostico/visualizacao/${diagId}`);
        } else if (currentQuestionIndex < totalQuestionsInCurrentArea - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentArea < diagnosticData.length - 1) {
            setCurrentArea(currentArea + 1);
            setCurrentQuestionIndex(0);
        }

        setSelectedOption(null);
    };


    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else if (currentArea > 0) {
            const previousAreaIndex = currentArea - 1;
            const totalQuestionsInPreviousArea = getTotalQuestions(previousAreaIndex);
            setCurrentArea(previousAreaIndex);
            setCurrentQuestionIndex(totalQuestionsInPreviousArea - 1);
        }
    };

    const handleOptionSelect = (option: Alternativa) => {
        setSelectedOption(option);

        const quesitoId = diagnosticData[currentArea].quesitos[currentQuestionIndex].id;
        setRespostas(prevRespostas => ({
            ...prevRespostas,
            [quesitoId]: option.id
        }));
    };

    const handleAreaChange = (newAreaIndex: number) => {
        setCurrentArea(newAreaIndex);
        setCurrentQuestionIndex(0);
    };

    const isAreaCompleted = (areaIndex: number): boolean => {
        const quesitos = diagnosticData[areaIndex]?.quesitos || [];

        return quesitos.every(quesito => {
            const respostaQuesito = respostas[quesito.id];
            return respostaQuesito !== undefined && respostaQuesito !== null;
        });
    };

    const isAreaPartiallyCompleted = (areaIndex: number) => {
        const quesitos = diagnosticData[areaIndex]?.quesitos;
        let hasAnswered = false;
        let hasUnanswered = false;

        quesitos.forEach(quesito => {
            if (respostas[quesito.id] !== undefined) {
                hasAnswered = true;
            } else {
                hasUnanswered = true;
            }
        });

        return hasAnswered && hasUnanswered;
    };

    const handleEncerrarDiagModal = () => {
        setIsOpen(!dialogIsOpen)
    }

    const EncerrarDiagnostico = async () => {
        try {
            await ApiService.fetchData({
                url: 'esg/alterar-status-diag',
                method: 'POST',
                data: {
                    id: diagId,
                    status: 'Encerrado'
                }
            });
            navigate(`/esg2/diagnostico/visualizacao/${token}`);
        } catch (error: any) {
            toast.push(
                <Notification title={error.response?.data?.message} type="danger" />
            );
        }
    }


    const isLastQuestionOfLastArea = currentArea === diagnosticData.length - 1 && currentQuestionIndex === getTotalQuestions(currentArea) - 1;

    return (
        <div className='bg-white sm:w-full lg:w-9/12 mx-auto'>

            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleEncerrarDiagModal}
                onRequestClose={handleEncerrarDiagModal}
                style={{
                    content: {
                        marginTop: 250,
                    },
                }}
            >
                <h5 className="mb-4">Deseja encerrar o diagnóstico?</h5>
                <p>
                    Ao encerrar o diagnóstico, você não poderá mais responder seus quesitos.
                </p>
                <div className="text-right mt-6 flex flex-col sm:flex-row justify-between">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleEncerrarDiagModal}
                    >
                        Cancelar
                    </Button>
                    <Button variant="solid" color="orange-500" onClick={EncerrarDiagnostico}>
                        Encerrar Diagnóstico
                    </Button>
                </div>
            </Dialog>

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

                <div className="dark:bg-gray-800 px-10 w-full p-6">
                    <div className="container mx-auto bg-white dark:bg-gray-800 rounded">
                        <h1 className="text-2xl font-bold mb-4">Diagnóstico ESG</h1>

                        <nav aria-label="Progress">
                            <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                                {diagnosticData.map((area, index) => {
                                    const isCompleted = isAreaCompleted(index);
                                    const isPartiallyCompleted = isAreaPartiallyCompleted(index);
                                    const tooltipText = isCompleted
                                        ? "Todos os quesitos respondidos"
                                        : isPartiallyCompleted
                                            ? "Ainda há quesitos a serem respondidos"
                                            : "Nenhum quesito respondido";

                                    return (
                                        <li key={area.id} className="md:flex-1">
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAreaChange(index);
                                                }}
                                                className={`group pl-4 py-2 flex flex-col ${index === currentArea
                                                    ? 'border-blue-600'
                                                    : isCompleted
                                                        ? 'border-green-600'
                                                        : isPartiallyCompleted
                                                            ? 'border-yellow-300'
                                                            : 'border-gray-200'
                                                    } hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`}
                                                title={tooltipText}
                                            >
                                                <span
                                                    className={`text-xs ${index === currentArea
                                                        ? 'text-blue-600'
                                                        : isCompleted
                                                            ? 'text-green-600'
                                                            : isPartiallyCompleted
                                                                ? 'text-yellow-600'
                                                                : 'text-gray-500'
                                                        } font-semibold tracking-wide uppercase group-hover:text-indigo-800`}
                                                >
                                                    {area.nome}
                                                </span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>



                        <div className="mt-8">
                            <div className='flex flex-col sm:flex-row justify-between items-center my-4'>
                                <p className="text-lg font-semibold mb-2 sm:mb-0">
                                    {diagnosticData[currentArea]?.quesitos[currentQuestionIndex]?.descricao || ''}
                                </p>

                                <nav className="flex items-center justify-center" aria-label="Progress">
                                    <p className="text-sm font-medium">
                                        Quesito {currentQuestionIndex + 1} de {getTotalQuestions(currentArea)}
                                    </p>
                                    <ol role="list" className="ml-8 flex items-center space-x-5">
                                        {diagnosticData[currentArea]?.quesitos.map((quesito, index) => (
                                            <li key={quesito.id}>
                                                {index === currentQuestionIndex ? (
                                                    <span className="block w-2.5 h-2.5 bg-indigo-600 rounded-full">
                                                        <span className="sr-only">{quesito.descricao}</span>
                                                    </span>
                                                ) : (
                                                    <span className="block w-2.5 h-2.5 bg-gray-200 rounded-full">
                                                        <span className="sr-only">{quesito.descricao}</span>
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        <div className="bg-white rounded-md -space-y-px">
                            {getCurrentQuestionOptions().map((option, optionIdx) => (
                                <div
                                    key={option.id}
                                    className={`relative border p-4 flex cursor-pointer ${optionIdx === 0 ? 'rounded-tl-md rounded-tr-md' : ''} ${optionIdx === getCurrentQuestionOptions().length - 1 ? 'rounded-bl-md rounded-br-md' : ''} ${option.isSelected ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200'}`}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    <div className="flex-shrink-0 flex items-center justify-center">
                                        <span
                                            className={`rounded-full border flex items-center justify-center ${option.isSelected ? 'bg-indigo-600 border-transparent' : 'border-gray-300'}`}
                                            style={{ width: '16px', height: '16px' }}
                                            aria-hidden="true"
                                        >
                                            <span
                                                className={`rounded-full ${option.isSelected ? 'bg-white' : ''}`}
                                                style={{ width: '8px', height: '8px' }}
                                            />
                                        </span>
                                    </div>
                                    <div className="ml-3 flex flex-col">
                                        <span className={`block text-sm font-medium ${option.isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                            {option.alternativa}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Button
                                onClick={handlePreviousQuestion}
                            >
                                Voltar
                            </Button>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Button
                                    onClick={() => navigate(`/esg2/diagnostico/visualizacao/${token}`)}
                                variant='solid'
                                color="green-500"
                                >
                                Ver
                            </Button>
                            <Button
                                onClick={handleEncerrarDiagModal}
                                variant='solid'
                                color="orange-500"
                            >
                                Encerrar Diagnóstico
                            </Button>
                            {!isLastQuestionOfLastArea ?
                                <Button
                                    onClick={handleNextQuestion}
                                    variant='solid'
                                >
                                    Avançar
                                </Button> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div >
    );
};

export default DiagnosticoEsg;
