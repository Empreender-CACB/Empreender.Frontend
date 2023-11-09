import React, { useState, useEffect } from 'react'
import FormItem from '@/components/ui/Form/FormItem'
import FormContainer from '@/components/ui/Form/FormContainer'
import Input from '@/components/ui/Input'
// import HeaderLogo from '@/components/template/HeaderLogo'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { AdaptableCard } from '@/components/shared'
import CpfInput from './CpfInput'
import { Upload } from '@/components/ui'

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
    { value: 'TO', label: 'Tocantins' },
]

const turmaOptions = [
    { value: 'T01', label: 'Turma 01' },
    { value: 'T02', label: 'Turma 02' },
]

function CursoForm() {
    const [estadoSelecionado, setEstadoSelecionado] = useState('')
    const [cidade, setCidade] = useState([])
    const [isValid, setIsValid] = useState(true)
    const [email, setEmail] = useState()
    const [emailIsValid, setEmailIsValid] = useState(true)

    const validaEmail = (value) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        return emailRegex.test(value)
    }

    const checaEmail = (event) => {
        const newValue = event.target.value
        setEmail(newValue)
        setEmailIsValid(validaEmail(newValue))
    }

    useEffect(() => {
        if (estadoSelecionado) {
            buscaCidades(estadoSelecionado)
        }
    }, [estadoSelecionado])

    const buscaCidades = async ({ value, label }) => {
        try {
            const response = await fetch(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`,
                { method: 'GET' }
            )

            if (!response.ok) {
                throw new Error(
                    `Erro na solicitação: ${response.status} - ${response.statusText}`
                )
            }

            const data = await response.json()
            setCidade(data)
        } catch (error) {
            console.error('Erro ao buscar cidades do IBGE:', error)
        }
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="header-container">
                {/* <HeaderForm /> */}
                <h2 style={{ marginBottom: '20px' }}></h2>
                <div className="text-container">
                    <h3 style={{ marginBottom: '10px' }}>
                        Formação de consultores de núcleos setoriais
                    </h3>
                    <h4 style={{ marginBottom: '40px' }}>Módulo a distância</h4>
                </div>
            </div>
            <FormContainer layout="vertical" labelWidth={100}>
                <form>
                    <FormItem
                        asterisk
                        invalid
                        label="Nome completo"
                        htmlFor="nome"
                    >
                        <Input
                            required
                            type="text"
                            id="nome"
                            name="nome"
                            size="sm"
                        />
                    </FormItem>

                    <FormItem asterisk invalid label="UF" htmlFor="uf">
                        <Select
                            required
                            placeholder="Selecione o estado"
                            options={ufOptions}
                            size="sm"
                            onChange={(value) => {
                                setEstadoSelecionado(value)
                            }}
                        />
                    </FormItem>

                    <FormItem asterisk invalid label="Cidade" htmlFor="cidade">
                        <Select
                            required
                            placeholder="Selecione a cidade"
                            options={cidade.map((city) => ({
                                value: city.id,
                                label: city.nome,
                            }))}
                            size="sm"
                        />
                    </FormItem>

                    <FormItem
                        asterisk
                        label="Email"
                        htmlFor="email"
                        invalid={!emailIsValid}
                    >
                        <Input
                            required
                            type="email"
                            id="email"
                            name="email"
                            size="sm"
                            value={email}
                            onChange={checaEmail}
                        />
                        {emailIsValid ? (
                            true
                        ) : (
                            <span style={{ color: 'red' }}>Email inválido</span>
                        )}
                    </FormItem>

                    <FormItem
                        asterisk
                        label="CPF"
                        htmlFor="cpf"
                        invalid={!isValid}
                    >
                        <CpfInput isValid={isValid} setIsValid={setIsValid} />
                    </FormItem>

                    <FormItem
                        asterisk
                        invalid
                        label="Turma do Curso"
                        htmlFor="turma"
                    >
                        <Select
                            required
                            placeholder="Selecione a turma"
                            options={turmaOptions}
                            size="sm"
                        />
                    </FormItem>

                    <Upload draggable multiple showList />

                    <Button
                        variant="solid"
                        type="submit"
                        size="sm"
                        disabled={!isValid || !emailIsValid}
                    >
                        Enviar
                    </Button>
                </form>
            </FormContainer>
        </AdaptableCard>
    )
}

export default CursoForm
