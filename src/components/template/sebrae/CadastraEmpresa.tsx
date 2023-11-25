import React, { useState, useEffect } from 'react';
import FormItem from '@/components/ui/Form/FormItem';
import FormContainer from '@/components/ui/Form/FormContainer';
import Input from '@/components/ui/Input';
import HeaderLogo from '@/components/template/HeaderLogo';
import HeaderForm from '../curso/HeaderForm';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { AdaptableCard } from '@/components/shared';
import { method } from 'lodash';
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
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [cidade, setCidade] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [cnpj, setCnpj] = useState('');
  const [empresaData, setEmpresaData] = useState({});
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(true);

  const validaEmail = (value) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(value);
  };

  const checaEmail = (event) => {
    const newValue = event.target.value;
    setEmail(newValue);
    setEmailIsValid(validaEmail(newValue));
  };

  const handleCnpjChange = async (event) => {
    const newCnpj = event.target.value.replace(/\D/g, '');
    const isValidCnpj = validaCNPJ(newCnpj);
    setIsValid(isValidCnpj);

    if (isValidCnpj) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/rfb/info-empresa/?cnpj=${newCnpj}`, { method: 'GET' });
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
    const formData = new FormData();
    formData.append('nome', event.target.nome.value)
    formData.append('cnpj', event.target.cnpj.value)
    formData.append('email', event.target.email.value)
    formData.append('ano_nascimento', event.target.nascimento.value)
    formData.append('sexo', event.target.sexo.value)
    console.log(formData)

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/empresas/cadastra`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success, e.g., redirect or show a success message
    } catch (error) {
      console.error('Error submitting form:', error);

      // Handle error, e.g., show an error message to the user
    }
  };


  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="header-container">
        <div className="flex items-center space-x-4">
          <div className="mt-10 mx-auto center max-w-7xl pb-12 px-6">
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
        <div className="text-container mb-10">
          <h2>Diagnóstico ESG Sebrae</h2>
        </div>
      </div>
      <FormContainer layout="vertical" labelWidth={100}>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8'>
            <FormItem className='sm:col-span-2' label="Nome completo" asterisk htmlFor="nome" invalid>
              <Input type="text" id="nome" name="nome" required size="sm" />
            </FormItem>

            <FormItem label="Sexo" asterisk htmlFor="sexo" invalid>
              <Select
                name='sexo'
                placeholder="Selecione"
                options={sexoOptions}
                required
                size="sm"
              />
            </FormItem>

            <FormItem label="Ano de nascimento" asterisk htmlFor="nascimento" invalid>
              <Input type='number' id='nascimento' name='nascimento' required
                placeholder="Digite seu ano de nascimento"
                size="sm"
              />
            </FormItem>


            <FormItem className='sm:col-span-2' label="Email" asterisk htmlFor="email" invalid={!emailIsValid}>
              <Input
                type="email"
                id="email"
                name="email"
                required
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

            <FormItem className='sm:col-span-2' label="CNPJ" asterisk htmlFor="cnpj" invalid={!isValid}>
              <Input
                type="text"
                id="cnpj"
                name="cnpj"
                required
                size="sm"
                value={cnpj}
                onChange={handleCnpjChange}
              />
              {isValid ? true : <span style={{ color: 'red' }}>CNPJ inválido</span>}

            </FormItem>

            <FormItem label="Nome Fantasia" htmlFor="nomeFantasia" invalid>
              <Input
                type="text"
                id="nomeFantasia"
                name="nomeFantasia"
                size="sm"
                value={empresaData !== undefined ? empresaData.st_nome_fantasia : ''}
                readOnly
              />
            </FormItem>

            <FormItem label="Porte da Empresa" htmlFor="porteEmpresa" invalid>
              <Input
                type="text"
                id="porteEmpresa"
                name="porteEmpresa"
                size="sm"
                value={empresaData !== undefined ? porteMapping[empresaData.porte] : ''}
                readOnly
              />
            </FormItem>

            <FormItem label="UF" htmlFor="ufEmpresa" invalid>
              <Input
                type="text"
                id="ufEmpresa"
                name="ufEmpresa"
                size="sm"
                value={empresaData !== undefined ? ufMapping[empresaData.st_uf] : ''}
                readOnly
              />
            </FormItem>

            <FormItem label="Cidade" htmlFor="cidadeEmpresa" invalid>
              <Input
                type="text"
                id="cidadeEmpresa"
                name="cidadeEmpresa"
                size="sm"
                value={empresaData !== undefined ? empresaData.nmcidade : ''}
                readOnly
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
