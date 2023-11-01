import React, { useState, useEffect } from 'react';
import FormItem from '@/components/ui/Form/FormItem';
import FormContainer from '@/components/ui/Form/FormContainer';
import Input from '@/components/ui/Input';
import HeaderForm from './HeaderForm';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { AdaptableCard } from '@/components/shared'
import CpfInput from './CpfInput';

const ufOptions = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const turmaOptions = [
  { value:'T01', label: 'Turma 01'},
  { value:'T02', label: 'Turma 02'},
]


function CursoForm() {
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [cidade, setCidade] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [email, setEmail] = useState();
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

  useEffect(() => {
    if (estadoSelecionado) {
      buscaCidades(estadoSelecionado);
    }
  }, [estadoSelecionado]);

  const buscaCidades = async ({value,label}) => {
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`,
        {method:'GET'}
      );

      if (!response.ok) {
        throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setCidade(data);
    } catch (error) {
      console.error('Erro ao buscar cidades do IBGE:', error);
    }
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="header-container">
        <HeaderForm/>
        <h2 style={{ marginBottom: '20px' }}></h2>
        <div className="text-container">
          <h3 style={{ marginBottom: '10px' }}>Formação de consultores de núcleos setoriais</h3>
          <h4 style={{ marginBottom: '40px' }}>Módulo a distância</h4>
        </div>
      </div>
      <FormContainer layout="vertical" labelWidth={100}>
        <form>
          <FormItem label="Nome completo" asterisk htmlFor="nome" invalid>
            <Input type="text" id="nome" name="nome" required size="sm" />
          </FormItem>

          <FormItem label="UF" asterisk htmlFor="uf" invalid>
            <Select
              placeholder="Selecione o estado"
              options={ufOptions}
              required
              size="sm"
              onChange={(value) => {
                setEstadoSelecionado(value);
              }}
            />
          </FormItem>

          <FormItem label="Cidade" asterisk htmlFor="cidade" invalid>
            <Select
              placeholder="Selecione a cidade"
              options={cidade.map((city) => ({
                value: city.id,
                label: city.nome,
              }))}
              required
              size="sm"
            />
          </FormItem>

          <FormItem label="Email" asterisk htmlFor="email" invalid={!emailIsValid}>
            <Input
              type="email"
              id="email"
              name="email"
              required
              size="sm"
              value={email}
              onChange={checaEmail}
              />
              {emailIsValid ? true : <span style={{ color: 'red' }}>Email inválido</span>}
            </FormItem>

          <FormItem label="CPF" asterisk htmlFor="cpf" invalid={!isValid}>
            <CpfInput isValid={isValid} setIsValid={setIsValid} />
          </FormItem>

          <FormItem label="Turma do Curso" asterisk htmlFor="turma" invalid>
            <Select
              placeholder="Selecione a turma"
              options={turmaOptions}
              required
              size="sm"
            />
          </FormItem>

          <Button variant="solid" type="submit" size="sm" disabled = {!isValid || !emailIsValid}>
            Enviar
          </Button>
        </form>
      </FormContainer>
    </AdaptableCard>
  );
}

export default CursoForm;