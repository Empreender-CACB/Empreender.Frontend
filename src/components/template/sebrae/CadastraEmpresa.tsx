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
import {formataCNPJ, validaCNPJ} from './CnpjInput';


const sexoOptions = [
  { value:'M', label: 'Masculino'},
  { value:'F', label: 'Feminino'},
  { value:'PNI', label: 'Prefiro não me identificar'},
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
          const response = await fetch(`http://localhost:3000/rfb/info-empresa/?cnpj=${newCnpj}`, { method: 'GET' });
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
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    
      const formData = new FormData(event.currentTarget);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      console.log(formData)
      try {
        const response = await fetch('http://localhost:3000/empresas/cadastra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          // a parada de ir pra página do sebrae fica aqui
        } else {
          console.error('Erro ao enviar os dados:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao enviar os dados:', error);
      }
    };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="header-container">
      <div className="flex items-center space-x-4">
    <div style={{ maxWidth: '200px' }}>
        <HeaderForm />
      </div>
      <div style={{ maxWidth: '200px' }}>
        <HeaderLogo />
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
        <h2 style={{ marginBottom: '40px' }}></h2>
        <div className="text-container">
          <h2 style={{ marginBottom: '30px' }}>Diagnóstico ESG Sebrae</h2>
        </div>
      </div>
      <FormContainer layout="vertical" labelWidth={100}>
      <form onSubmit={handleSubmit}>
          <FormItem label="Nome completo" asterisk htmlFor="nome" invalid>
            <Input type="text" id="nome" name="nome" required size="sm" />
          </FormItem>

          <div style={{ display: 'flex', gap: '100px' }}>
            <FormItem label="Sexo" asterisk htmlFor="sexo" invalid>
              <Select
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
          </div>


          <FormItem label="Email" asterisk htmlFor="email" invalid={!emailIsValid}>
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

          <FormItem label="CNPJ" asterisk htmlFor="cnpj" invalid={!isValid}>
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
          <div style={{ display: 'flex', gap: '100px' }}>

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

          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Button variant="solid" type="submit" size="sm" disabled={!emailIsValid || !isValid}>
              Enviar
            </Button>

            <div style={{ marginLeft: '10px', fontWeight: 'bold' }}>
              Ao clicar em enviar você será redirecionado para a plataforma do Sebrae
            </div>
          </div>
        </form>
      </FormContainer>
    </AdaptableCard>
  );
}

export default CadastraEmpresa;
