
import { useState } from 'react';
import axios from 'axios';
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import { HiOutlinePlus } from 'react-icons/hi'
import { CgClose as CloseIcon } from 'react-icons/cg'
import estadosBrasileiros from '@/components/shared/Helpers/EstadosBrasileiros';
import { IMaskInput } from 'react-imask';
import { BsFilePdf, BsFileWord } from 'react-icons/bs';

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
    const [isRegistrationClosed, setIsRegistrationClosed] = useState(false) // Estado para deixar o form inativo

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

        const fields = ['nome', 'email', 'sexo', 'cpf', 'uf', 'cidade', 'telefone', 'tipo']

        const formData = new FormData()
        for (const field of fields) {
            if (event.target[field] === undefined) continue;
            formData.append(field, event.target[field].value);
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
                                <div className="grid grid-cols-4 gap-8">
                                    <div className="col-span-2 flex justify-center sm:col-span-1">
                                        <img className="img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/logo-cacb.png" alt="Logo CACB" />
                                    </div>
                                    <div className="col-span-2 flex justify-center sm:col-span-1">
                                        <img className="w-11/12 img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/logo-empreender.png" alt="Logo Empreender" />
                                    </div>
                                    <div className="col-span-2 flex justify-center sm:col-span-1">
                                        <img className="img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" alt="Logo AL Invest" />
                                    </div>
                                    <div className="col-span-2 flex justify-center sm:col-span-1">
                                        <img className="img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/sebrae.svg" alt="Logo Sebrae" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10">
                            <h1 className="text-4xl text-center text-gray-800 dark:text-gray-100 font-bold">
                                Inscrições Encerradas
                            </h1>
                        </div>

                        <div className="bg-white flex flex-col justify-between pt-5 pb-10 border-t border-gray-300 sm:flex-row">
                            <p className="pl-4 text-sm text-gray-500">
                                Programa Empreender 1999-2023 - Versão 5
                            </p>
                        </div>
                    </div>
                </div>

            )}
            {!isRegistrationClosed && (
                <form className=' bg-white sm:w-full lg:w-9/12' id="login" onSubmit={handleSubmit}>
                    <input type='hidden' name='tipo' value="2" />
                    <div className="flex items-center space-x-4">
                        <div className="mt-10 mx-auto center max-w-7xl pb-5 px-6">
                            <div className="grid grid-cols-4 gap-8">
                                <div className="col-span-2 flex justify-center sm:col-span-1">
                                    <img className="img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/logo-cacb.png" />
                                </div>
                                <div className="col-span-2 flex justify-center sm:col-span-1">
                                    <img className=" w-11/12 img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/logo-empreender.png" />
                                </div>
                                <div className="col-span-2 flex justify-center sm:col-span-1">
                                    <img className="img object-contain sm:h-12" src="https://empreender.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" />
                                </div>
                                <div className="col-span-2 flex justify-center sm:col-span-1">
                                    <img
                                        className="img object-contain sm:h-12"
                                        src="https://empreender.cacbempreenderapp.org.br/img/logo/sebrae.svg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* END LOGOS EMPRESAS */}
                    {success && (<SuccessComponent />)}
                    {!success && (
                        <div className="dark:bg-gray-800 px-10">
                            <div className="container mx-auto bg-white dark:bg-gray-800 rounded">
                                <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 pb-5 bg-white dark:bg-gray-800">
                                    <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                                        <h1 className="text-4xl text-gray-800 dark:text-gray-100 font-bold texts">Seleção de consultores de núcleos setoriais</h1>
                                    </div>

                                    <div className="flex">
                                        <a target="_blank" href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTMzMjM2" className="flex items-center text-base pt-2 font-semibold leading-7 mt-10 text-black mr-5" rel="noreferrer">
                                            <BsFilePdf /> Termo de Referência
                                        </a>
                                        <a target="_blank" href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/MTMzMjM1" className="flex items-center text-base pt-2 font-semibold leading-7 mt-10 text-black mr-5" rel="noreferrer">
                                            <BsFilePdf /> Resultados da avaliação
                                        </a>
                                        <a target="_blank" href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/NTYzMg==" className="flex items-center text-base pt-2 font-semibold leading-7 mt-10 text-black" rel="noreferrer">
                                            <BsFileWord className="blue" /> Modelo de Currículo
                                        </a>
                                    </div>

                                    <div className="mt-2" id="errors" ><ErrorComponent errors={errors} /></div>

                                </div>


                                <div className="mx-auto">
                                    <div className="grid grid-cols-2 gap-8 mt-9">
                                        {/* <div className="xl:w-9/12 w-11/12 mx-auto xl:mx-0"> */}

                                        <div className=" flex flex-col w-full col-span-2 sm:col-span-1">
                                            <label htmlFor="nome" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                                Nome Completo
                                            </label>
                                            <input required type="text" id="nome" name="nome" className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe seu nome completo" />
                                        </div>
                                        <div className="flex flex-col w-full col-span-2 sm:col-span-1">
                                            <label htmlFor="email" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                                Email
                                            </label>
                                            <input required type="email" id="email" name="email" className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe seu melhor email" />
                                        </div>
                                        <div className=" flex flex-col w-full col-span-2 sm:col-span-1">
                                            <label htmlFor="cpf" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                                CPF
                                            </label>
                                            <IMaskInput
                                                className='border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400'
                                                mask={'000.000.000-00'}
                                                name='cpf'
                                                placeholder='Informe os números do seu CPF'
                                            />
                                        </div>
                                        <div className="flex flex-col w-full col-span-2 sm:col-span-1">
                                            <label htmlFor="sexo" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                                Sexo
                                            </label>
                                            <select required id="sexo" name="sexo" className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent text-gray-500 dark:text-gray-400">
                                                {/* <option selected disabled>Escolha uma das opções</option> */}
                                                <option value="M">Masculino</option>
                                                <option value="F">Feminino</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col w-full col-span-2 sm:col-span-1">
                                            <label htmlFor="cidade" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                                Estado e cidade
                                            </label>
                                            <div className="flex space-x-4">
                                                <select
                                                    required
                                                    id="uf"
                                                    name="uf"
                                                    className="w-5/12 border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent text-gray-500 dark:text-gray-400"
                                                >
                                                    <option value="" disabled>
                                                        Selecione um estado
                                                    </option>
                                                    {estadosBrasileiros.map((estado) => (
                                                        <option key={estado.sigla} value={estado.sigla}>
                                                            {estado.sigla}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input required type="text" id="cidade" name="cidade" className="w-full border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe o nome da cidade" />

                                            </div>

                                        </div>

                                        <div className=" flex flex-col w-full col-span-2 sm:col-span-1">
                                            <label htmlFor="telefone" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                                Telefone
                                            </label>
                                            <IMaskInput
                                                className='border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400'
                                                mask={'(00)00000-00000'}
                                                placeholder='Informe seu número de telefone com DDD'
                                                name='telefone'
                                            />
                                        </div>


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
                                                                    <input type="file" name="files" className="w-50" accept=".pdf, .doc, .docx, .xlsx, .xls, .jpg, .jpeg, .png" />
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
                                </div>
                            </div>

                            <div className="container mx-auto w-11/12 xl:w-full pt-10">
                                <div className="w-full py-4 sm:px-0 bg-white dark:bg-gray-800 flex justify-start">
                                    <button
                                        disabled={isSubmitting}
                                        className={`bg-blue-800 focus:outline-none transition duration-150 ease-in-out rounded text-white px-8 py-2 text-sm ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                                        type="submit"
                                        title={isSubmitting ? "Enviando informações..." : ""}
                                    >
                                        Enviar
                                    </button>

                                    <span className='ml-2 flex items-center'>Ao enviar, você concorda com a manutenção dos seus dados na Plataforma do Empreender.</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-gray-100 flex flex-col justify-between pt-5 pb-10 border-t border-gray-300 sm:flex-row">
                        <p className="pl-4 text-sm text-gray-500">
                            Programa Empreender 1999-2023 - Versão 5
                        </p>
                    </div>
                </form>
            )}
        </div>

    )
}

export default CadastraProposta;

