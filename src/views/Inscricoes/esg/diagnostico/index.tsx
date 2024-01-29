import { useEffect, useState } from 'react';
import { Button, Notification } from '@/components/ui';
import ApiService from '@/services/ApiService';
import { CheckIcon } from '@heroicons/react/20/solid';
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

const DiagnosticoEsg = () => {
    const [currentArea, setCurrentArea] = useState<number>(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [diagnosticData, setDiagnosticData] = useState<Area[]>([]);
    const [selectedOption, setSelectedOption] = useState<Alternativa | null>(null);
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        ApiService.fetchData({
            url: 'get-quesitos-esg-diagnostico',
            method: 'get',
        }).then(response => {
            setDiagnosticData(response.data as Area[]);
        }).catch(error => {
            console.error("Erro ao buscar dados: ", error);
        });
    }, []);

    const getTotalQuestions = (areaIndex: number): number => {
        return diagnosticData[areaIndex]?.quesitos?.length || 0;
    };

    const getCurrentQuestionOptions = (): Alternativa[] => {
        return diagnosticData[currentArea]?.quesitos[currentQuestionIndex]?.alternativas || [];
    };

    const handleNextQuestion = () => {
        const totalQuestionsInCurrentArea = getTotalQuestions(currentArea);
        const isLastArea = currentArea === diagnosticData.length - 1;
        const isLastQuestion = currentQuestionIndex === totalQuestionsInCurrentArea - 1;

        if (isLastArea && isLastQuestion) {
            handleSubmit();
        } else if (currentQuestionIndex < totalQuestionsInCurrentArea - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsNextButtonDisabled(true);
        } else if (currentArea < diagnosticData.length - 1) {
            setCurrentArea(currentArea + 1);
            setCurrentQuestionIndex(0);
            setIsNextButtonDisabled(true);
        }

        setSelectedOption(null);
    };


    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };


    const setSelectedOptionAndEnableNext = (option: Alternativa) => {
        setSelectedOption(option);
        setIsNextButtonDisabled(false);
    };

    const updateAnswers = (quesitoId: number, alternativaId: number) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [quesitoId]: alternativaId
        }));
    };

    const handleOptionSelect = (option: Alternativa) => {
        setSelectedOptionAndEnableNext(option);
        const quesitoId: number = diagnosticData[currentArea].quesitos[currentQuestionIndex].id;
        updateAnswers(quesitoId, option.id);
    };


    const handleSubmit = async () => {
        try {
            const response: any = await ApiService.fetchData({
                url: 'enviar-diagnostico-esg',
                method: 'post',
                data: answers
            });

            toast.push(
                <Notification title={response.data.message} type="success" />
            );
        } catch (error: any) {
            toast.push(
                <Notification title={error.response?.data?.message} type="danger" />
            );
        }
    };

    const isLastQuestionOfLastArea = currentArea === diagnosticData.length - 1 && currentQuestionIndex === getTotalQuestions(currentArea) - 1;

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
                <div className="dark:bg-gray-800 px-10 w-full p-6">
                    <div className="container mx-auto bg-white dark:bg-gray-800 rounded">

                        <h1 className="text-2xl font-bold mb-4">Diagnóstico ESG</h1>

                        {/* <nav aria-label="Progress">
                            <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
                                {diagnosticData.map((area, index) => (
                                    <li key={area.id} className="md:flex-1">
                                        <a
                                            href="#"
                                            className={`group pl-4 py-2 flex flex-col border-l-4 ${index === currentArea ? 'border-indigo-600' : 'border-gray-200'
                                                } hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4`}
                                        >
                                            <span
                                                className={`text-xs ${index === currentArea ? 'text-indigo-600' : 'text-gray-500'
                                                    } font-semibold tracking-wide uppercase group-hover:text-indigo-800`}
                                            >
                                                {area.nome}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </nav> */}

                        <nav aria-label="Progress">
                            <ol role="list" className="border border-gray-300 rounded-md divide-y divide-gray-300 md:flex md:divide-y-0">
                                {diagnosticData.map((area, index) => (
                                    <li key={area.id} className="relative md:flex-1 md:flex">
                                        {currentArea === index ? (
                                            // Área Atual
                                            <a className="group flex items-center w-full">
                                                <span className="px-6 py-4 flex items-center text-sm font-medium">
                                                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full">
                                                        <span className="text-white">{index + 1}</span>
                                                    </span>
                                                    <span className="ml-4 text-sm font-medium text-gray-900">{area.nome}</span>
                                                </span>
                                            </a>
                                        ) : index < currentArea ? (
                                            // Área Completada
                                            <a className="group flex items-center w-full">
                                                <span className="px-6 py-4 flex items-center text-sm font-medium">
                                                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
                                                        <CheckIcon className="w-6 h-6 text-white" aria-hidden="true" />
                                                    </span>
                                                    <span className="ml-4 text-sm font-medium text-gray-900">{area.nome}</span>
                                                </span>
                                            </a>
                                        ) : (
                                            // Área Futura
                                            <a className="group flex items-center">
                                                <span className="px-6 py-4 flex items-center text-sm font-medium">
                                                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                                                        <span className="text-gray-500 group-hover:text-gray-900">{index + 1}</span>
                                                    </span>
                                                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{area.nome}</span>
                                                </span>
                                            </a>
                                        )}

                                        {index !== diagnosticData.length - 1 ? (
                                            <div className="hidden md:block absolute top-0 right-0 h-full w-5" aria-hidden="true">
                                                <svg
                                                    className="h-full w-full text-gray-300"
                                                    viewBox="0 0 22 80"
                                                    fill="none"
                                                    preserveAspectRatio="none"
                                                >
                                                    <path
                                                        d="M0 -2L20 40L0 82"
                                                        vectorEffect="non-scaling-stroke"
                                                        stroke="currentcolor"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        ) : null}
                                    </li>
                                ))}
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
                                className={`relative border p-4 flex cursor-pointer ${optionIdx === 0 ? 'rounded-tl-md rounded-tr-md' : ''} ${
                                    optionIdx === getCurrentQuestionOptions().length - 1 ? 'rounded-bl-md rounded-br-md' : ''
                                } ${selectedOption?.id === option.id ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200'}`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    <span
                                        className={`rounded-full border flex items-center justify-center ${selectedOption?.id === option.id ? 'bg-indigo-600 border-transparent' : 'border-gray-300'
                                            }`}
                                        style={{ width: '16px', height: '16px' }}
                                        aria-hidden="true"
                                    >
                                        <span
                                            className={`rounded-full ${selectedOption?.id === option.id ? 'bg-white' : ''}`}
                                            style={{ width: '8px', height: '8px' }}
                                        />
                                    </span>
                                </div>
                                <div className="ml-3 flex flex-col">
                                    <span className={`block text-sm font-medium ${selectedOption?.id === option.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                                        {option.alternativa}
                                    </span>
                                </div>
                            </div>
                            

                            ))}
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <Button
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                            >
                                Voltar
                            </Button>

                            <Button
                                onClick={handleNextQuestion}
                                variant='solid'
                                disabled={isNextButtonDisabled}
                            >
                                {isLastQuestionOfLastArea ? "Enviar diagnóstico" : "Próximo"}
                            </Button>

                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
};

export default DiagnosticoEsg;
