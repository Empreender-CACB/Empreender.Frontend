import { useState } from 'react';
import Input from '@/components/ui/Input';
import { validaCNPJ } from './CnpjInput';
import axios from 'axios';
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { CgClose as CloseIcon } from 'react-icons/cg'
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

type PorteMapping = {
    [key: string]: string;
};

const porteMapping: PorteMapping = {
    'MPE': 'Micro Empresa',
    'EPP': 'Empresa de Pequeno Porte',
    'OUTRA': 'Outra',
    'NÃO INFORMADO': 'Não Informado',
};

const ErrorComponent = ({ errors }: any) => {
    if (!errors || errors.length === 0) {
        return null;
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
                            {errors.map((error: any, index: number) => (
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
    const [cnpj, setCnpj] = useState('');
    const [empresaData, setEmpresaData] = useState<any>(null);
    const [validCNPJ, setValidCNPJ] = useState(false);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();

    const handleCnpjChange = async (event: any) => {
        const newCnpj = event.target.value.replace(/\D/g, '');
        const isValidCnpj = validaCNPJ(newCnpj);
        setValidCNPJ(isValidCnpj);

        if (isValidCnpj) {
            try {
                // Usamos axios. Mudar
                const response = await fetch(`${import.meta.env.VITE_API_URL}/rfb/info-empresa/?cnpj=${newCnpj}`, { method: 'GET' });
                if (response.ok) {
                    const data = await response.json();
                    setEmpresaData(data);
                }
            } catch (error) {
                console.error('Erro ao obter os dados da empresa:', error);
            }
        }
        setCnpj(newCnpj);
    };

    const toastNotification = (
        <Notification title="Falha na inscrição." type="danger">
            Não foi possível completar a operação. Por favor, tente novamente.
        </Notification>
    )

    const toastNotificationSucess = (
        <Notification title="Obrigado por participar." type="info">
            Participação enviada com sucesso.
        </Notification>
    )


    const handleSubmit = async (event: any) => {
        event.preventDefault();    
        const fields = ['nome', 'email', 'sexo', 'ano_nascimento', 'cnpj'];
    
        const formData = new FormData();
        for (const field of fields) {
            if (event.target[field] === undefined) continue;
            formData.append(field, event.target[field].value);
        }
    
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/empresas/esg/cadastro`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setErrors(null);
            toast.push(toastNotificationSucess);
    
            if (response.status === 200) {
                navigate(`/esg/diagnostico/${event.target['cnpj'].value}`);
            }
        } catch (error: any) {
            setErrors(error.response?.data?.errors);
            toast.push(toastNotification);
            const errorsElement = document.getElementById('errors');
            if (errorsElement) {
                errorsElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    };


    return (
        <form className=' bg-white sm:w-full lg:w-9/12' id="login" onSubmit={handleSubmit}>
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

            <div className="dark:bg-gray-800 px-10">
                <div className="container mx-auto bg-white dark:bg-gray-800 rounded">

                    <div className="mb-10" id="errors" ><ErrorComponent errors={errors} /></div>

                    <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 pb-5 bg-white dark:bg-gray-800">
                        <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                            <h1 className="text-4xl text-gray-800 dark:text-gray-100 font-bold texts">Diagnóstico ESG</h1>
                        </div>
                        <p className='font-bold mt-4 texts text-gray-400'>A CACB, no âmbito dos projetos EMPREENDER e AL Invest Verde, participa da inciativa do Sebrae no sentido de oferecer às empresas um diagnóstico de sua situação no que se refere às práticas ESG. Sua participação é muito importante. Abaixo, pedimos algumas poucas informações e logo após você será redirecionado para a plataforma do Sebrae.</p>

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
                            <div className="flex flex-col w-full col-span-2 sm:col-span-1">
                                <label htmlFor="sexo" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    Sexo
                                </label>
                                <select required id="sexo" name="sexo" className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent text-gray-500 dark:text-gray-400">
                                    {/* <option selected disabled>Escolha uma das opções</option> */}
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                    <option value="PNI">Prefiro não informar</option>
                                </select>                            </div>
                            <div className="flex flex-col w-full col-span-2 sm:col-span-1">
                                <label htmlFor="ano_nascimento" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    Ano de Nascimento
                                </label>
                                <input required type="number" id="ano_nascimento" name="ano_nascimento" className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe apenas o ano de nascimento" />
                            </div>

                            <div className="flex flex-col w-full col-span-2 sm:col-span-2">
                                <label htmlFor="cnpj" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    CNPJ da empresa
                                </label>
                                {/* <input required type="text" id="cnpj" name="cnpj"  placeholder="Informe o cnpj da empresa" /> */}
                                <Input
                                    required
                                    placeholder='Infome o CNPJ da empresa'
                                    className='focus:border-blue-700 bg-transparent placeholder-gray-500 '
                                    type="text"
                                    id="cnpj"
                                    name="cnpj"
                                    value={cnpj}
                                    onChange={handleCnpjChange}
                                />
                                {validCNPJ ? true : <span style={{ color: 'red' }}>Informe um CNPJ válido</span>}
                            </div>

                        </div>
                    </div>

                </div>

                {empresaData !== null && validCNPJ ? <div className=" bg-white dark:bg-gray-800 mt-10 rounded px-4">
                    <div className="xl:w-full w-11/12 border-b border-gray-300 dark:border-gray-700 py-5">
                        <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                            <p className="text-lg text-gray-800 dark:text-gray-100 font-bold">Informações da Empresa</p>
                        </div>
                    </div>

                    <div className="relative px-4 pt-2">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-baseline">
                                <span className="bg-teal-200 text-teal-800 text-xs px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
                                    {porteMapping[empresaData.porte_empresa]}
                                </span>
                                <div className="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                    {empresaData.dsendereco}  &bull; {empresaData.dsbairro}
                                </div>
                            </div>

                            <h4 className="mt-1 text-xl font-semibold uppercase leading-tight sm:truncate">{empresaData.nurazaosocial}</h4>

                            <div className="mt-1">
                                <span className='text-bold'>Nome fantasia: </span>{empresaData.nmfantasia}
                            </div>
                        </div>
                    </div>

                </div> : ''}


                <div className="container mx-auto w-11/12 xl:w-full pt-10">
                    <div className="w-full py-4 sm:px-0 bg-white dark:bg-gray-800 flex justify-between">
                        <div className='flex'>
                            <button className="bg-blue-800 focus:outline-none transition duration-150 ease-in-out hover:bg-blue-700 rounded text-white px-8 py-2 text-sm" type="submit">
                                Enviar
                            </button>

                            <span className='ml-2 flex items-center'>Ao enviar você será redirecionado para a plataforma do Sebrae.</span>
                        </div>

                        <Button variant='solid' className='ml-2'>
                            <Link to="/esg/diagnostico">
                                Diagnóstico
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="bg-gray-100 flex flex-col justify-between pt-5 pb-10 border-t border-gray-300 sm:flex-row">
                <p className="text-sm text-gray-500">
                    Programa Empreender 1999-2023 - Versão 5
                </p>

            </div>

        </form>

    );
}

export default CadastraProposta;
