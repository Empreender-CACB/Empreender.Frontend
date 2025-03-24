import { useEffect, useState } from 'react'
import axios from 'axios'
import Steps from '@/components/ui/Steps'
import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import ContactForm from './Contactform'
import { IMaskInput } from 'react-imask';
import { FaBuilding, FaHome, FaUser } from 'react-icons/fa';
import Alert from '@/components/ui/Alert'
import { BsFilePdf } from 'react-icons/bs';
import { toast } from '@/components/ui'
import ApiService from '@/services/ApiService'


const SectionDivider = ({ label }: { label: string }) => {
    return (
        <div className="relative py-5 pb-7 mx-5">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-400"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-gray-50 uppercase font-thin px-2 text-sm text-gray-800">{label}</span>
            </div>
        </div>
    );
}

function CadastraProposta() {
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(false)
    const [inputs, setInputs] = useState([{}])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(true) // Estado para deixar o form inativo
    const [cnpj, setCnpj] = useState('');
    const [empresaData, setEmpresaData] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [tipoCadastro, setTipoCadastro] = useState('');
    const [isManualContact, setIsManualContact] = useState<any>(true);

    const [loading, setLoading] = useState(false);

    const handleSave = async (values: any) => {
        setLoading(true);
        toast.push(<Notification title="Salvando arquivo, aguarde..." type="success" />);

        const formData = new FormData();
        console.log(values.upload);
        Object.entries(values.upload).forEach(([key, file]) => {
            if (file instanceof File) {
                console.log('to aqui', key, file);
                formData.append(key, file);
            }
        });

        formData.append('cnpj', cnpj);
        formData.append('tipo_cadastro', tipoCadastro);
        formData.append('idContato', values.idContato || '');
        formData.append('nomeContato', values.nomeContato || '');
        formData.append('cpfContato', values.cpfContato || '');
        formData.append('emailContato', values.emailContato || '');
        formData.append('celularContato', values.celularContato || '');
        formData.append('concessionaria_energia', values.concessionaria_energia || '');
        formData.append('login_concessionaria', values.usuario_concessionaria || '');
        formData.append('senha_concessionaria', values.senha_concessionaria || '');
        formData.append('status', 'analise');

        try {
            const response = await ApiService.fetchData({
                url: `/cogecom`,
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess(true);
            setEmpresaData(null);
        } catch (error) {
            toast.push(<Notification title="Erro ao realizar candidatura. Verifique os possíveis erros." type="danger" />);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            if ((cnpj.length === 11 && tipoCadastro == 'pessoa_fisica' || cnpj.length === 14 && tipoCadastro !== 'pessoa_fisica')) {
                verify();
            }
            else {
                alert("Insira um número de CNPJ ou CPF válido.")
            }
        }
    }

    const [step, setStep] = useState(0)

    const onChange = (nextStep: number) => {
        if (step < 1) {

            setEmpresaData(null)

        }
        if (nextStep < 0) {
            setStep(0)
        } else if (nextStep > 3) {
            setStep(3)
        } else {
            setStep(nextStep)
        }
    }

    const onNext = () => onChange(step + 1)

    const onPrevious = () => { onChange(0), setError(false), setIsManualContact(false) }


    const toastNotification = (
        <Notification title="Falha na submissão." type="danger">
            Não foi possível completar a operação. Por favor, verifique os arquivos e tente novamente.
        </Notification>
    )

    const toastNotificationSucess = (
        <Notification title="Obrigado por participar." type="info">
            Atualização enviada com sucesso.
        </Notification>
    )


    const verify = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/cogecom/status/${cnpj}`);
            if (response.data.permissao.habil === false) {
                setError(!response.data.permissao.habil);
                setErrorMessage(response.data.permissao.mensagem);
            }
            else {
                await setEmpresaData(response.data);
                await setStatus(response.data.status);
                setError(false);
                onNext();
            }

        } catch (err) {
            setError(true);
            setErrorMessage('');
        }
        finally {
            setIsLoading(false);
        }
    };

    const SuccessComponent = () => {
        if (success == false) {
            return null; // Não há erros, não renderiza nada
        }

        return (
            <div className="bg-blue-700">
                <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-white">
                            ✅ Inscrição realizada com sucesso.
                            <br />
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
                            ⚡️Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum totam maiores libero consequuntur aspernatur corporis nostrum officia obcaecati. Illum iusto provident officiis, inventore placeat repudiandae nam illo debitis deserunt sit.
                        </p>

                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-center items-center tracking-tight sm:w-90'>
            {isRegistrationClosed && (

                <div className="flex justify-center items-center tracking-tight sm:w-90 min-h-screen bg-gray-100">

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md  sm:w-full lg:w-9/12">
                        <div className="flex items-center space-x-4">

                            <div className="max-w-7xl mx-auto center ">
                                <img className="w-30" src="https://www.empreender.org.br/img/cogecom/cogecom_original.jpeg" alt="GlobalGateway" />

                            </div>

                        </div>

                        <div className="w-full rounded-t-lg">
                            {/* <div className='p-5 max-w-4xl mx-auto'> */}
                            <div className='mx-auto p-5'>
                                {/* <p className=" font-extrabold text-gray-200 text-2xl  mb-2">Projeto COGECOM</p>

                                <p className="mb-4 text-white">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde molestias, accusantium expedita adipisci rerum similique nihil? Cupiditate temporibus esse nulla reprehenderit. Temporibus earum neque quas obcaecati eum nam quaerat magni?Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime assumenda vel quibusdam, deserunt voluptas iste earum distinctio in provident beatae, excepturi quidem commodi repudiandae fugiat asperiores, eum debitis quisquam. Quaerat!
                                    ipsum dolor sit amet consectetur adipisicing elit. Maxime assumenda vel quibusdam, deserunt voluptas iste earum distinctio in provident beatae, excepturi quidem commodi repudiandae fugiat asperiores, eum debitis quisquam. Quaerat!
                                </p> */}

                                <div className="flex">
                                    <a target="_blank" href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTM5MDY3" className="flex items-center text-base mt-2 font-semibold leading-7 text-black mr-5" rel="noreferrer">
                                        <span className='text-red-600 font-bold'><BsFilePdf /></span>  <i className='text-ms'>Termo de Adesão</i>
                                    </a>
                                </div>

                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                            <h1 className="text-2xl font-semibold mb-4">Informações sobre a adesão</h1>

                            <p className="mb-4">
                                Nesta página, você poderá iniciar o processo de adesão ao Projeto POUP MAX.
                            </p>

                            <p className="mb-4">
                                Para começar, informe o CNPJ da empresa ou condominio, ou o CPF da pessoa física. Com base nesses dados, o sistema irá:
                            </p>

                            <ul className="list-disc list-inside mb-4">
                                <li>Exibir informações principais do cadastro na Receita Federal (RFB) para conferência.</li>
                                <li>Solicitar o preenchimento de informações adicionais, caso necessário.</li>
                                <li>Verificar possíveis restrições aplicáveis.</li>
                                <li>Incluir a empresa no cadastro do Portal do Empreender (PDE).</li>
                            </ul>

                        </div>


                        <div className=" max-w-4xl mx-auto px-2 pt-10">


                            <Steps current={step} status={error ? 'error' : undefined}>
                                <Steps.Item title="Tipo" />
                                <Steps.Item title="Dados" />
                                <Steps.Item title="Cadastro" />
                            </Steps>
                            <div className="mt-6  bg-gray-50 dark:bg-gray-700 rounded px-3 ">
                                {step === 0 && (
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                                        <div
                                            className={`p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer shadow-lg hover:bg-blue-50 transition ${tipoCadastro === 'empresa' ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                            onClick={() => {
                                                setTipoCadastro('empresa');
                                                onNext();
                                            }}
                                        >
                                            <FaBuilding className="text-4xl text-blue-500 mx-auto mb-4" />
                                            <h4 className="text-center font-semibold">Empresa</h4>
                                        </div>

                                        <div
                                            className={`p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer shadow-lg hover:bg-green-50 transition ${tipoCadastro === 'pessoa_fisica' ? 'ring-2 ring-green-500' : ''
                                                }`}
                                            onClick={() => {
                                                setTipoCadastro('pessoa_fisica');
                                                onNext();
                                            }}
                                        >
                                            <FaUser className="text-4xl text-green-500 mx-auto mb-4" />
                                            <h4 className="text-center font-semibold">Pessoa Física</h4>
                                        </div>

                                        <div
                                            className={`p-4 md:p-6 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer shadow-lg hover:bg-yellow-50 transition ${tipoCadastro === 'condominio' ? 'ring-2 ring-yellow-500' : ''
                                                }`}
                                            onClick={() => {
                                                setTipoCadastro('condominio');
                                                onNext();
                                            }}
                                        >
                                            <FaHome className="text-4xl text-yellow-500 mx-auto mb-4" />
                                            <h4 className="text-center font-semibold">Condomínio</h4>
                                        </div>
                                    </div>

                                )}

                                {step === 1 && (
                                    <div className="mt-6">

                                        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">Informe o {tipoCadastro === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}</label>
                                        <IMaskInput
                                            mask={tipoCadastro === 'pessoa_fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                                            unmask={true}
                                            onKeyDown={handleKeyDown}
                                            onAccept={(value) => setCnpj(value)}
                                            placeholder={tipoCadastro === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />

                                        <div className='mt-6'>
                                            <Button
                                                variant="solid"
                                                disabled={!(cnpj.length === 11 && tipoCadastro == 'pessoa_fisica' || cnpj.length === 14 && tipoCadastro !== 'pessoa_fisica')}
                                                color="indigo-700"
                                                className="w-full mb-10"
                                                loading={isLoading}
                                                onClick={verify}

                                            >
                                                Avançar
                                            </Button>

                                            {error && (
                                                <Alert showIcon className="mb-4" type="danger">
                                                    {errorMessage ? (
                                                        <>{errorMessage}</>
                                                    ) : (
                                                        tipoCadastro === 'pessoa_fisica' ? (
                                                            <>Essa pessoa não está em nossa base de dados. Por favor, entre em contato com <a href="mailto:contato@cacb.org.br">contato@cacb.org.br</a>.</>
                                                        ) : (
                                                            <>Esta empresa não está em nossa base de dados da “Receita Federal”. Por favor, entre em contato com <a href="mailto:contato@cacb.org.br">contato@cacb.org.br</a>.</>
                                                        )
                                                    )}
                                                </Alert>
                                            )}


                                        </div>

                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="">
                                        {success && (<SuccessComponent />)}
                                        {empresaData && (
                                            <div className="w-full max-w-4xl mx-auto p-2">
                                                <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
                                                    <div className="p-6">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h2 className="text-2xl font-bold text-gray-800">{empresaData.empresa.nurazaosocial}</h2>
                                                            <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                                {'fonte: ' + empresaData.fonte}
                                                            </span>
                                                        </div>

                                                        <div className="text-gray-700 space-y-2">
                                                            <p><strong>Nome Fantasia:</strong>{empresaData.empresa.nmfantasia}</p>
                                                            <p><strong>CNPJ:</strong>{empresaData.empresa.nucnpjcpf}</p>
                                                            <p>{empresaData.empresa.iduf} - {empresaData.empresa.nmcidade}  </p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                        {!success && (
                                            <ContactForm
                                                tipoCadastro="empresa"       // ou "condominio", conforme sua lógica
                                                empresaData={empresaData}    // dados da empresa para preencher os contatos
                                                handleSave={handleSave}      // função que trata o submit do formulário
                                            />
                                        )}
                                    </div>




                                )}
                            </div>
                            <div className="mt-16 text-right">
                                <Button
                                    className="mx-2"
                                    disabled={step === 0}
                                    onClick={onPrevious}
                                >
                                    Recomeçar
                                </Button>
                                {/* <button
                                    hidden={step === 2}
                                    className={`py-2 px-4 ${canAdvance ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400'
                                        } text-white rounded shadow`}
                                    disabled={!canAdvance}
                                    onClick={onNext}
                                >
                                    {step === 2 ? 'Enviar' : 'Avançar'}
                                </button> */}
                            </div>
                        </div>



                        <div className="mt-8 md:order-1 md:mt-0">
                            <p className="text-center leading-5 text-gray-500">
                                <span className="font-semibold">Portal do Empreender - V5 - 2025</span><br />
                            </p>
                        </div>


                    </div>
                </div>

            )}

        </div>
    )
}

export default CadastraProposta;
