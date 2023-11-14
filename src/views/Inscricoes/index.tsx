import { useState } from 'react'
import { Switch } from '@headlessui/react'
import axios from 'axios'
import { CgClose as CloseIcon } from 'react-icons/cg'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Button from '@/components/ui/Button'
import { HiOutlinePlus } from 'react-icons/hi'
import { BsFilePdf } from 'react-icons/bs'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const ErrorComponent = ({ errors }) => {
    console.log(errors, 'oi')
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



export default function Example() {
    const [agreed, setAgreed] = useState(false)
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(false)

    const [inputs, setInputs] = useState([{ firstName: "", lastName: "" }]);

    const handleAddInput = () => {
        setInputs([...inputs, { firstName: "", lastName: "" }]);
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
                            Inscrição realizada com sucesso!
                            <br />
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
                            Obrigado pela participação. Você receberá uma mensagem de confirmação. Caso não a receba ainda hoje, por favor informe pelo endereço empreender@cacb.org.br.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a
                                href="https://cacb.org.br/"
                                className="rounded-md bg-white px-3.5 py-1.5 text-base font-semibold leading-7 text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                cacb.org.br/
                            </a>
                            <a href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/NTM5OQ==" className="text-base font-semibold leading-7 text-white">
                                edital da seleção <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    const handleDeleteInput = (index) => {
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
    };

    const toastNotification = (
        <Notification title="Falha na inscrição." type="danger">
            Não foi possível completar a operação. Por favor, tente novamente.
        </Notification>
    )



    const handleSubmit = async (event) => {
        event.preventDefault()


        const formData = new FormData();
        formData.append('nome', event.target.nome.value);
        formData.append('cpf', event.target.cpf.value);
        formData.append('telefone', event.target.telefone.value);
        formData.append('email', event.target.email.value);
        formData.append('uf', event.target.uf.value);
        formData.append('cidade', event.target.cidade.value);

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
        } catch (error) {
            console.log('Emanoel só quer jogar, preguiçoso');

            setErrors(error.response.data.errors);
            toast.push(toastNotification)
        }
    }


    return (
        <>
            <div className="bg-white">
                <div className="mx-auto center max-w-7xl py-12 px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-4">
                        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                            <img className="h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-cacb.png" />
                        </div>
                        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                            <img className="h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-empreender.png" />
                        </div>
                        <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                            <img className="h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" />
                        </div>
                        <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
                            <img
                                className="h-12"
                                src="https://beta.cacbempreenderapp.org.br/img/logo/sebrae.svg"

                            />
                        </div>
                    </div>
                </div>
            </div>
            {success && (<SuccessComponent />)}

            <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">

                <div
                    className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0065B0] to-[#008668] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>

                {!success && (
                    <div>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Seleção de consultores de núcleos setoriais</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600 mb-10">
                        Faça parte da equipe <span className='underline decoration-2 decoration-sky-500 underline-offset-4'>EMPREENDER</span>
                    </p>
                    <a  target="_blank" href="https://www.empreender.org.br/sistema/anexo/download-anexo/aid/NTM5OQ==" className="text-base font-semibold leading-7 mt-10 text-black">
                     📕 edital da seleção <span aria-hidden="true">→</span>
                            </a>

                </div>                    
                
                <form onSubmit={handleSubmit} action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">


<div className="mb-10" ><ErrorComponent errors={errors} /></div>

<div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
    <div className='sm:col-span-2'>
        <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
            Nome Completo
        </label>
        <div className="mt-2.5">
            <input
                type="text"
                name="nome"
                id="nome"
                autoComplete="nome"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
        </div>
    </div>
    <div>
        <label htmlFor="cpf" className="block text-sm font-semibold leading-6 text-gray-900">
            CPF
        </label>
        <div className="mt-2.5">
            <input
                type="text"
                name="cpf"
                id="cpf"
                autoComplete="cpf"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
        </div>
    </div>

    <div>
        <label htmlFor="telefone" className="block text-sm font-semibold leading-6 text-gray-900">
            Telefone
        </label>
        <div className="mt-2.5">
            <input
                type="text"
                name="telefone"
                id="telefone"
                autoComplete="telefone"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
        </div>
    </div>

    <div className="sm:col-span-2">
        <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
            Email
        </label>
        <div className="mt-2.5">
            <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
        </div>
    </div>
    <div className="sm:col-span-2">
        <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
            Estado e cidade
        </label>
        <div className="relative mt-2.5">
            <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="uf" className="sr-only">
                    UF
                </label>
                <select
                    id="uf"
                    name="uf"
                    className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-90 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                >
                    <option>DF</option>
                    <option>BA</option>
                    <option>SP</option>
                </select>

            </div>
            <input
                type="string"
                name="cidade"
                id="cidade"
                autoComplete="cidade"
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
        </div>
    </div>
    <div className="sm:col-span-2">
        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
            Informações adicionais
        </label>
        <div className="mt-2.5">
            <textarea
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                defaultValue={''}
            />
        </div>
    </div>

    <div className="sm:col-span-2 sm:border-t sm:border-gray-200 pt-5">
        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
            Documentos
        </label>
        <div className="mt-2.5">
            <div className="container">
                {inputs.map((item, index) => (
                    <div className="input_container" key={index}>
                        <div className="flex items-center space-x-4 mb-2">
                            {/* Input de Upload */}
                            <label className="flex-shrink-0 bg-gray-200 py-2 px-4 rounded-md cursor-pointer">
                                <input type="file" name="files" className="w-50" />
                            </label>

                            {/* Select */}
                            <select name="type_document" className="border p-2 rounded-md">
                                <option value="tipo1">Currículo</option>
                                <option value="tipo2">Documento </option>
                                <option value="tipo3">Tipo 3</option>
                            </select>
                            {inputs.length > 1 && (
                                <Button
                                    variant="solid"
                                    color="red-400"
                                    shape="circle"
                                    size="xs"
                                    onClick={() => handleDeleteInput(index)}
                                    icon={<CloseIcon />}
                                />)}

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

    <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
        <div className="flex h-6 items-center">
            <Switch
                checked={agreed}
                onChange={setAgreed}
                className={classNames(
                    agreed ? 'bg-blue-600' : 'bg-gray-200',
                    'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                )}
            >
                <span className="sr-only">Concordar com termos</span>
                <span
                    aria-hidden="true"
                    className={classNames(
                        agreed ? 'translate-x-3.5' : 'translate-x-0',
                        'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                    )}
                />
            </Switch>
        </div>
        <Switch.Label className="text-sm leading-6 text-gray-600">
            Ao selecionar este campo, você concorda com nossos{' '}
            <a href="#" className="font-semibold text-blue-600">
                termos de privacidade
            </a>
            .
        </Switch.Label>
    </Switch.Group>
</div>
<div className="mt-10">
    <button
        type="submit"
        className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
        Enviar Candidatura
    </button>
</div>
</form>
                </div>
                )}



            <footer className="bg-white">
                <div className="mx-auto max-w-7xl py-12 px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-xs leading-5 text-gray-500">
                            &copy; Portal do Empreender - V5.
                        </p>
                    </div>
                </div>
            </footer>
        </div >
        </>



    )
}
