import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import { HiOutlinePlus } from 'react-icons/hi'
import { CgClose as CloseIcon } from 'react-icons/cg'
import estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros'
import { IMaskInput } from 'react-imask';
import { BsFilePdf, BsFileWord } from 'react-icons/bs'
import ParametrosGeraisService from '@/services/ParametrosGeraisService'

const ErrorComponent = ({ errors }: any) => {
    if (!errors || errors.length === 0) {
        return null; // Não há erros, não renderiza nada
    }

    return (
        <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CloseIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-strong text-red-800">{`Há ${errors.length === 1 ? '' : ''
                        } ${errors.length} erro${errors.length === 1 ? '' : 's'} com o seu envio`}</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc space-y-1 pl-5">
                            {errors.map((error, index) => (
                                <li key={index}>{error.message}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

function CadastraProposta() {
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(false)
    const [inputs, setInputs] = useState([{}])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(true) // Estado para deixar o form inativo
    const [parametro, setParametro] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ParametrosGeraisService.show(2);
                setParametro(response.data.data);
            } catch (error) {
                console.error('Erro ao buscar parâmetros gerais:', error);
            }
        };

        fetchData();
    }, []);

    const handleAddInput = () => {
        setInputs([...inputs, {}]);
    };

    const handleDeleteInput = (index: any) => {
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
        index.preventDefault()
        index.stopPropagation()
        // index.stopImmediatePropagation()
        return false
    };

    const SuccessComponent = () => {
        if (success == false) {
            return null; // Não há erros, não renderiza nada
        }

        return (
            <div className="bg-indigo-700">
                <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-4xl font-bold tracking-tight text-white">
                            Obrigado, inscrição realizada com sucesso!
                            <br />
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
                            Obrigado pela participação. Você receberá uma mensagem de confirmação. Caso não a receba ainda hoje, por favor entre em contato pelo email empreender@cacb.org.br.
                        </p>

                    </div>
                </div>
            </div>
        )
    }

    const toastNotification = (
        <Notification title="Falha na inscrição." type="danger">
            Não foi possível completar a operação. Por favor, tente novamente.
        </Notification>
    )

    const toastNotificationSucess = (
        <Notification title="Obrigado por participar." type="info">
            Por favor, aguarde a confirmação da sua inscrição por email.
        </Notification>
    )

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);

        const fields = ['nome', 'email', 'sexo', 'cpf', 'uf', 'cidade', 'telefone']

        const formData = new FormData()
        for (const field of fields) {
            if (event.target[field] === undefined) continue;
            formData.append(field, event.target[field].value);
            console.log(event.target[field].value)
        }

        // Adiciona os arquivos
        const fileInputs = event.target.querySelectorAll('[name="files"]');

        fileInputs.forEach((fileInput) => {
            const files = fileInput.files;
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
        });

        const selectElements = event.target.querySelectorAll('[name="type_document"]');

        selectElements.forEach((selectElement) => {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].selected) {
                    formData.append('selectValues', selectElement.options[i].value);
                }
            }
        });

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/candidaturas`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setErrors(null);
            setSuccess(true);
            toast.push(toastNotificationSucess)

        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors(error.response.data.errors);
            toast.push(toastNotification)
            document.getElementById('errors').scrollIntoView({
                behavior: 'smooth'
            });
        }

        setIsSubmitting(false);

    };

    return (
        <div className='flex justify-center items-center tracking-tight sm:w-90'>
            {isRegistrationClosed && (
                <div className="flex justify-center items-center tracking-tight sm:w-90 min-h-screen bg-gray-100">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 sm:w-full lg:w-9/12">
                        <div className="flex items-center space-x-4">
                            <div className="mt-10 mx-auto center max-w-7xl pb-5 px-6">
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-6">
                                    <div className="col-span-1 flex justify-center items-center min-h-16">
                                        <img className="h-11" src="/img/logo/GLOBALGATEWAY.png" alt="GlobalGateway" />
                                    </div>
                                    <div className="col-span-1 flex justify-center items-center ">
                                        <img className="h-11" src="/img/logo/ALINVEST.png" alt="AL Invest" />
                                    </div>
                                    <div className="col-span-1 flex justify-center items-center ">
                                        <img className="ml-10 h-16" src="/img/logo/UNIAOEUROPEIA.png" alt="União Europeia" />
                                    </div>
                                    <div className="col-span-1 flex justify-center items-center ">
                                        <img className="h-11" src="/img/logo/SEBRAE.png" alt="SEBRAE" />
                                    </div>
                                    <div className="col-span-2 md:col-span-2 lg:col-span-2 flex justify-center items-center ">
                                    <img className="h-11" src="/img/logo/EMPREENDER+CACB.png" alt="Empreender e CACB" />
                                </div>                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center w-11/12 mx-auto xl:w-full xl:mx-0">
                            <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mt-10">
                                Seleção de consultores de núcleos setoriais
                            </h1>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-10">
                            <h1 className="text-xl text-center text-gray-800 dark:text-gray-100 font-bold">
                            Inscrições encerradas. Para acessar o resultado,&nbsp;
                            <a target="_blank" href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTE0OTY=" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                                clique aqui
                            </a>.
                            </h1>
                        </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center leading-5 text-gray-500">
                            <span className="font-semibold">{parametro.valor}</span><br />
                        </p>
                    </div>

                    </div>
                </div>

            )}
            {!isRegistrationClosed && (
                <form className='bg-white sm:w-full lg:w-9/12' id="login" onSubmit={handleSubmit}>
                    <div className="flex items-center space-x-4">
                        <div className="mt-10 mx-auto center max-w-7xl pb-5 px-6">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-6">
                                <div className="col-span-1 flex justify-center items-center min-h-16">
                                    <img className="h-11" src="/img/logo/GLOBALGATEWAY.png" alt="GlobalGateway" />
                                </div>
                                <div className="col-span-1 flex justify-center items-center ">
                                    <img className="h-11" src="/img/logo/ALINVEST.png" alt="AL Invest" />
                                </div>
                                <div className="col-span-1 flex justify-center items-center ">
                                    <img className="ml-10 h-16" src="/img/logo/UNIAOEUROPEIA.png" alt="União Europeia" />
                                </div>
                                <div className="col-span-1 flex justify-center items-center ">
                                    <img className="h-11" src="/img/logo/SEBRAE.png" alt="SEBRAE" />
                                </div>
                                <div className="col-span-2 md:col-span-2 lg:col-span-2 flex justify-center items-center ">
                                    <img className="h-11" src="/img/logo/EMPREENDER+CACB.png" alt="Empreender e CACB" />
                                </div>                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center w-11/12 mx-auto xl:w-full xl:mx-0">
                        <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold">
                            Seleção de consultores de núcleos setoriais
                        </h1>
                    </div>

                    <ErrorComponent errors={errors} />
                    <SuccessComponent />
                    <div className="mx-auto max-w-2xl py-10 px-4 sm:px-6 lg:px-8">
                        <div className="space-y-4">
                            {inputs.map((input, index) => (
                                <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Adicione aqui campos e estilos conforme necessário */}
                                    <div className="relative flex flex-col gap-4 rounded-md p-4 shadow-md">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">Informações {index + 1}</h2>
                                            <Button type="button" onClick={() => handleDeleteInput(index)} className="text-red-500">
                                                <HiOutlinePlus />
                                            </Button>
                                        </div>
                                        {/* Adicione aqui os campos de input */}
                                    </div>
                                </div>
                            ))}
                            <Button type="button" onClick={handleAddInput} className="mt-4 flex items-center">
                                <HiOutlinePlus className="mr-2" /> Adicionar mais
                            </Button>
                        </div>
                        <div className="mt-10 flex justify-center">
                            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600" disabled={isSubmitting}>
                                {isSubmitting ? 'Enviando...' : 'Enviar'}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default CadastraProposta;
