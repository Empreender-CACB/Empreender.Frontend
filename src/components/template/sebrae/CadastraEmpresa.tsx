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

function CadastraEmpresa() {
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/rfb/info-empresa?cnpj=${newCnpj}`, { method: 'GET' });
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
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="header-container">
        <div className="flex items-center space-x-4">
          <div className="mt-10 mx-auto center max-w-7xl pb-12 px-6">
            <div className="grid grid-cols-2 gap-8">
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
        <div className="text-container mb-10">
          <h2>Diagnóstico ESG Sebrae</h2>
        </div>
      </div>
      <FormContainer layout="vertical" labelWidth={100}>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8'>
            <FormItem invalid asterisk className='sm:col-span-2' label="Nome completo" htmlFor="nome" >
              <Input required type="text" id="nome" name="nome" size="sm" />
            </FormItem>

            <FormItem invalid asterisk label="Sexo" htmlFor="sexo" >
              <Select
                required
                name='sexo'
                placeholder="Selecione"
                options={sexoOptions}
                size="sm"
              />
            </FormItem>

            <FormItem asterisk invalid label="Ano de nascimento"  htmlFor="nascimento" >
              <Input required type='number' id='nascimento' name='nascimento' 
                placeholder="Digite seu ano de nascimento"
                size="sm"
              />
            </FormItem>


            <FormItem asterisk className='sm:col-span-2' label="Email" htmlFor="email" invalid={!emailIsValid}>
              <Input
                required
                type="email"
                id="email"
                name="email"
                size="sm"
                value={email}
                onChange={(event) => {
                  const newValue = event.target.value;
                  setEmail(newValue);
                  setEmailIsValid(validaEmail(newValue));
                }}
              />
              {emailIsValid ? true : <span style={{ color: 'red' }}>Email inválido</span>}
            </FormItem>

            <FormItem asterisk className='sm:col-span-2' label="CNPJ" htmlFor="cnpj" invalid={!isValid}>
              <Input
                required
                type="text"
                id="cnpj"
                name="cnpj"
                size="sm"
                value={cnpj}
                onChange={handleCnpjChange}
              />
              {isValid ? true : <span style={{ color: 'red' }}>CNPJ inválido</span>}

            </FormItem>

            <FormItem invalid label="Nome Fantasia" htmlFor="nomeFantasia">
              <Input
                readOnly
                type="text"
                id="nomeFantasia"
                name="nomeFantasia"
                size="sm"
                value={empresaData !== undefined ? empresaData.st_nome_fantasia : ''}
              />
            </FormItem>

            <FormItem invalid label="Porte da Empresa" htmlFor="porteEmpresa">
              <Input
                readOnly
                type="text"
                id="porteEmpresa"
                name="porteEmpresa"
                size="sm"
                value={empresaData !== undefined ? porteMapping[empresaData.porte] : ''}
              />
            </FormItem>

            <FormItem invalid label="UF" htmlFor="ufEmpresa">
              <Input
                readOnly
                type="text"
                id="ufEmpresa"
                name="ufEmpresa"
                size="sm"
                value={empresaData !== undefined ? ufMapping[empresaData.st_uf] : ''}
              />
            </FormItem>

            <FormItem invalid label="Cidade" htmlFor="cidadeEmpresa">
              <Input
                readOnly
                type="text"
                id="cidadeEmpresa"
                name="cidadeEmpresa"
                size="sm"
                value={empresaData !== undefined ? empresaData.nmcidade : ''}
              />
            </FormItem>
          </div>


          <div className='flex center items-center mt-5'>
            <Button variant="solid" type="submit" size="sm" disabled={!emailIsValid || !isValid}>
              Enviar
            </Button>

            <span className='ml-5'>
              Ao clicar em enviar você será redirecionado para a plataforma do Sebrae
            </span>
          </div>
        </form>
      </FormContainer>
    </AdaptableCard>
  );
}

export default CadastraEmpresa;
