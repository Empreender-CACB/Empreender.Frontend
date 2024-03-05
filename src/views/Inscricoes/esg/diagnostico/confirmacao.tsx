import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui";

const DiagnosticoEsgConfirmacao = () => {

    const navigate = useNavigate();

    return (
        <div className='bg-white sm:w-full lg:w-4/12 mx-auto mt-12'>

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
                        <h1 className="text-2xl font-bold mb-4 text-center">Diagnóstico ESG</h1>
                        <h5>Verifique o e-mail cadastrado para acessar seu diagnóstico.</h5>
                        <div className='flex row justify-center'>
                            <Button
                                onClick={() => navigate('/esg2/cadastro')}
                                variant='solid'
                                color="blue-500"
                                className='mt-4'
                            >
                                Voltar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default DiagnosticoEsgConfirmacao;
