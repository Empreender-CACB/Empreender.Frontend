import { useState, useEffect } from 'react'
import axios from 'axios'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import { HiOutlinePlus } from 'react-icons/hi'
import { CgClose as CloseIcon } from 'react-icons/cg'
import Input from '@/components/ui/Input'
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
    const [cpf, setCpf] = useState('');
    const [apto, setApto] = useState(false);
    const [userData, setUserData] = useState(null);

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
                            Arquivos enviados com sucesso.
                            <br />
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
                            Obrigado pela participação.
                        </p>

                    </div>
                </div>
            </div>
        )
    }

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

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData()

        const fileInputs = event.target.querySelectorAll('[name="files"]');

        fileInputs.forEach((fileInput:any) => {
            const files = fileInput.files;
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
        });

        const selectElements = event.target.querySelectorAll('[name="type_document"]');

        selectElements.forEach((selectElement:any) => {
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].selected) {
                    formData.append('selectValues', selectElement.options[i].value);
                }
            }
        });


        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/candidaturas/${userData.cpf}`, formData, {
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

    // const handleSubmit = async (event: any) => {
    //     event.preventDefault();
    //     setIsSubmitting(true);

    //     const fields = ['nome', 'email', 'sexo', 'cpf', 'uf', 'cidade', 'telefone']

    //     const formData = new FormData()
    //     for (const field of fields) {
    //         if (event.target[field] === undefined) continue;
    //         formData.append(field, event.target[field].value);
    //         console.log(event.target[field].value)
    //     }

    //     // Adiciona os arquivos
    //     const fileInputs = event.target.querySelectorAll('[name="files"]');

    //     fileInputs.forEach((fileInput) => {
    //         const files = fileInput.files;
    //         for (let i = 0; i < files.length; i++) {
    //             formData.append('files', files[i]);
    //         }
    //     });

    //     const selectElements = event.target.querySelectorAll('[name="type_document"]');

    //     selectElements.forEach((selectElement) => {
    //         for (let i = 0; i < selectElement.options.length; i++) {
    //             if (selectElement.options[i].selected) {
    //                 formData.append('selectValues', selectElement.options[i].value);
    //             }
    //         }
    //     });

    //     try {
    //         await axios.post(`${import.meta.env.VITE_API_URL}/candidaturas`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         setErrors(null);
    //         setSuccess(true);
    //         toast.push(toastNotificationSucess)

    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //         setErrors(error.response.data.errors);
    //         toast.push(toastNotification)
    //         document.getElementById('errors').scrollIntoView({
    //             behavior: 'smooth'
    //         });
    //     }

    //     setIsSubmitting(false);

    // };
    const verifyCPF = async (value: any) => {
        console.log(value)
        if (value.length === 14) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/candidaturas/verify/${value}`);
                if (response.status === 200) {
                    setApto(true); // If status is 200, set apto to true
                    setUserData(response.data);
                } else {
                    setApto(false); // Otherwise, set apto to false
                    setUserData(null);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setApto(false); // In case of an error, also set apto to false
                setUserData(null);
            }
        }
        else {
            setApto(false);
            setUserData(null);
        }
    };

    return (
        <div className='flex justify-center items-center tracking-tight sm:w-90'>
            {isRegistrationClosed && (
                <div className="flex justify-center items-center tracking-tight sm:w-90 min-h-screen bg-gray-100">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 sm:w-full lg:w-9/12">
                        <div className="flex items-center space-x-4">
                            <div className="mt-5 mx-auto center max-w-7xl pb-5 px-6">
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
                            <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mt-5">
                                Seleção de consultores de núcleos setoriais
                            </h1>
                        </div>

                        {!success && (<SuccessComponent />)}
                {!success && (
                    <>
                        <div className="bg-white dark:bg-gray-800 p-10 center text-center">
                            <span className="text-xl text-gray-800 dark:text-gray-100 font-bold">
                                Inscrições encerradas. Para acessar o resultado,&nbsp;
                                <a target="_blank" href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTE0OTY=" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                                    clique aqui
                                </a>.
                            </span>
                        </div>

                        <div className='center text-center pb-5'>
                            {/* <h3 className='mb-2'>Complementar dados</h3> */}
                            <IMaskInput
                                className='input input-md h-11 focus:ring-sky-900 focus-within:ring-sky-900 focus-within:border-sky-900 focus:border-sky-900 mb-2'
                                mask={'000.000.000-00'}
                                name='cpf'
                                placeholder='Informe o seu CPF'
                                onAccept={verifyCPF}
                            />
                        </div>

                        {apto && userData && (

                            <>

                            <form onSubmit={handleSubmit}>
                                <div className="p-4 bg-white shadow-md rounded-lg mb-10">
                                    <h2 className="text-lg font-bold mb-2">Informações do candidato</h2>
                                    <p><strong>Nome:</strong> {userData.nome}</p>
                                    <p><strong>CPF:</strong> {userData.cpf}</p>
                                    <p><strong>Telefone:</strong> {userData.telefone}</p>
                                    <p><strong>Email:</strong> {userData.email}</p>
                                </div>
                                <div>
                                <ErrorComponent errors={errors} />

                                    <div className="sm:col-span-2 sm:border-t sm:border-gray-200 pt-5">
                                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                                            Documentos
                                        </label>
                                        <div className="mt-2">
                                            <div className="container">
                                                {inputs.map((item, index) => (
                                                    <div className="input_container" key={index}>
                                                        <div className="flex items-center space-x-4 mb-2 flex-wrap space-y-1">
                                                            {/* Input de Upload */}
                                                            <label className=" bg-gray-200 py-2 px-4 rounded-md cursor-pointer">
                                                                <input required type="file" name="files" className="w-50" accept=".pdf, .doc, .docx, .xlsx, .xls, .jpg, .jpeg, .png" />
                                                            </label>

                                                            {/* Select */}
                                                            <div className='flex items-center space-x-2'>
                                                                <select name="type_document" className="border p-2 rounded-md">
                                                                    <option value="Currículo profissional">Currículo Profissional</option>
                                                                    <option value="Formação acadêmica">Formação acadêmica</option>
                                                                    <option value="Experiência profissional">Experiência profissional</option>
                                                                    <option value="Cursos realizados">Cursos realizados</option>
                                                                </select>
                                                                {inputs.length > 1 && (

                                                                    <span onClick={() => handleDeleteInput(index)}>
                                                                        <CloseIcon />
                                                                    </span>
                                                                )}
                                                            </div>



                                                        </div>
                                                        {index === inputs.length - 1 && (
                                                            <Button onClick={() => handleAddInput()} variant="twoTone" size="sm" className="mr-2" icon={<HiOutlinePlus />}>
                                                                <span>Adicionar mais arquivos</span>
                                                            </Button>)}
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="center text-center ">
                               
                                <Button disabled={!apto} variant="solid">Complementar dados</Button>

                                </div>
                            </form>
                            </>

                        )}

                        <div className="mt-8 md:order-1 md:mt-0">
                            <p className="text-center leading-5 text-gray-500">
                                <span className="font-semibold">{parametro.valor}</span><br />
                            </p>
                        </div>
                        </>
                        )}
                    </div>
                </div>

            )}
            {/* {isRegistrationClosed && (
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
                                    <div className="relative flex flex-col gap-4 rounded-md p-4 shadow-md">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold">Informações {index + 1}</h2>
                                            <Button type="button" onClick={() => handleDeleteInput(index)} className="text-red-500">
                                                <HiOutlinePlus />
                                            </Button>
                                        </div>
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
            )} */}
        </div>
    )
}

export default CadastraProposta;
