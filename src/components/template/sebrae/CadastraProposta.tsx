import React, { useState, useEffect } from 'react';
import FormItem from '@/components/ui/Form/FormItem';
import FormContainer from '@/components/ui/Form/FormContainer';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { AdaptableCard } from '@/components/shared';
import { formataCNPJ, validaCNPJ } from './CnpjInput';
import axios from 'axios';



const sexoOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'PNI', label: 'Prefiro não me identificar' },
]

type PorteMapping = {
    [key: string]: string;
};

const porteMapping: PorteMapping = {
    '01': 'Micro Empresa',
    '03': 'Empresa de Pequeno Porte',
    '05': 'Outra',
    '00': 'Não Informado',
};

type UfMapping = {
    [key: string]: string;
};

const ufMapping: UfMapping = {
    'AC': 'Acre',
    'AL': 'Alagoas',
    'AP': 'Amapá',
    'AM': 'Amazonas',
    'BA': 'Bahia',
    'CE': 'Ceará',
    'DF': 'Distrito Federal',
    'ES': 'Espírito Santo',
    'GO': 'Goiás',
    'MA': 'Maranhão',
    'MT': 'Mato Grosso',
    'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais',
    'PA': 'Pará',
    'PB': 'Paraíba',
    'PR': 'Paraná',
    'PE': 'Pernambuco',
    'PI': 'Piauí',
    'RJ': 'Rio de Janeiro',
    'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul',
    'RO': 'Rondônia',
    'RR': 'Roraima',
    'SC': 'Santa Catarina',
    'SP': 'São Paulo',
    'SE': 'Sergipe',
    'TO': 'Tocantins',
};

function CadastraProposta() {
    const [isValid, setIsValid] = useState(true);
    const [cnpj, setCnpj] = useState('');
    const [empresaData, setEmpresaData] = useState({});
    const [email, setEmail] = useState('');
    const [emailIsValid, setEmailIsValid] = useState(true);

    const validaEmail = (value) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegex.test(value);
    };

    const handleCnpjChange = async (event) => {
        const newCnpj = event.target.value.replace(/\D/g, '');
        const isValidCnpj = validaCNPJ(newCnpj);
        setIsValid(isValidCnpj);

        if (isValidCnpj) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/rfb/info-empresa/?cnpj=34270694000107${newCnpj}`, { method: 'GET' });
                if (response.ok) {
                    const data = await response.json();
                    setEmpresaData(data[0]);
                } else {
                    console.error('Erro ao obter os dados da empresa:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao obter os dados da empresa:', error);
            }
        }
        setCnpj(newCnpj);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const fields = ['nome', 'email', 'sexo', 'ano_nascimento', 'cnpj']

        const formData = new FormData()
        for (const field of fields) {
            if (event.target[field] === undefined) continue;
            formData.append(field, event.target[field].value);
            console.log(event.target[field].value)
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/empresas/cadastra`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    return (
        <form className='sm:w-full lg:w-9/12' id="login" onSubmit={handleSubmit}>

            <div className="bg-white dark:bg-gray-800 px-10">
                <div className="container mx-auto bg-white dark:bg-gray-800 rounded">


                    {/* LOGOS DAS EMPRESAS */}

                    <div className="flex items-center space-x-4">
                        <div className="mt-10 mx-auto center max-w-7xl pb-12 px-6">
                            <div className="grid grid-cols-4 gap-8">
                                <div className="col-span-2 flex justify-center sm:col-span-1">
                                    <img className="h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-cacb.png" />
                                </div>
                                <div className="col-span-2 flex justify-center sm:col-span-1">
                                    <img className="h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/logo-empreender.png" />
                                </div>
                                <div className="col-span-2 flex justify-center sm:col-span-1">
                                    <img className="h-12" src="https://beta.cacbempreenderapp.org.br/img/logo/al_invest_logo.jpg" />
                                </div>
                                <div className="col-span-2 flex justify-center sm:col-span-1">
                                    <img
                                        className="h-12"
                                        src="https://beta.cacbempreenderapp.org.br/img/logo/sebrae.svg"

                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* END LOGOS EMPRESAS */}


                    <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 py-5 bg-white dark:bg-gray-800">
                        <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                            <h1 className="text-4xl text-gray-800 dark:text-gray-100 font-bold texts">Diagnóstico ESG Sebrae</h1>
                        </div>
                    </div>
                    <div className="mx-auto">
                        <div className="grid grid-cols-2 gap-8 mt-9">
                            {/* <div className="xl:w-9/12 w-11/12 mx-auto xl:mx-0"> */}

                            <div className=" flex flex-col w-full col-span-2 sm:col-span-1">
                                <label htmlFor="nome" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    Nome Completo
                                </label>
                                <input type="text" id="nome" name="nome" required className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe seu nome completo" />
                            </div>
                            <div className="flex flex-col w-full col-span-2 sm:col-span-1">
                                <label htmlFor="email" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    Email
                                </label>
                                <input type="email" id="email" name="email" required className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe seu melhor email" />
                            </div>
                            <div className="flex flex-col w-full col-span-2 sm:col-span-1">
                                <label htmlFor="email" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    Sexo
                                </label>
                                <input type="email" id="email" name="email" required className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe seu melhor email" />
                            </div>
                            <div className="flex flex-col w-full col-span-2 sm:col-span-1">
                                <label htmlFor="ano_nascimento" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    Ano de Nascimento
                                </label>
                                <input type="number" id="ano_nascimento" name="ano_nascimento" required className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe apenas o ano de nascimento" />
                            </div>

                            <div className="flex flex-col w-full col-span-2 sm:col-span-2">
                                <label htmlFor="ano_nascimento" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                                    CNPJ da empresa
                                </label>
                                <input type="text" id="cnpj" name="ano_nascimento" required className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-blue-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" placeholder="Informe o cnpj da empresa" />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="container mx-auto bg-white dark:bg-gray-800 mt-10 rounded px-4">
                    <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 py-5">
                        <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                            <p className="text-lg text-gray-800 dark:text-gray-100 font-bold">Informações da Empresa</p>
                        </div>
                    </div>

                    <div className="relative px-4 pt-2">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-baseline">
                                <span className="bg-teal-200 text-teal-800 text-xs px-2 inline-block rounded-full  uppercase font-semibold tracking-wide">
                                    Porte Empresa
                                </span>
                                <div className="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                                   UF  &bull; Cidade
                                </div>
                            </div>

                            <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">{'Nome da Empresa'}</h4>

                            <div className="mt-1">
                                {'cnpj'}
                            
                            </div>
                        </div>
                    </div>

                </div>

                <div className="container mx-auto w-11/12 xl:w-full pt-10">
                    <div className="w-full py-4 sm:px-0 bg-white dark:bg-gray-800 flex justify-start">
                        <button className="bg-blue-800 focus:outline-none transition duration-150 ease-in-out hover:bg-blue-700 rounded text-white px-8 py-2 text-sm" type="submit">
                            Enviar inscrição
                        </button>
                        <span className='ml-2 flex items-center'>Ao clicar em enviar você será redirecionado para a plataforma do Sebrae</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-between pt-5 pb-10 border-t border-gray-300 sm:flex-row">
                <p className="text-sm text-gray-500">
                    Programa Empreender 1999-2023 - Versão 5
                </p>

            </div>

        </form>

    );
}

export default CadastraProposta;
