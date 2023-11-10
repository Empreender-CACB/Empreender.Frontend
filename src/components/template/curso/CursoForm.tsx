/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import FormItem from '@/components/ui/Form/FormItem'
import FormContainer from '@/components/ui/Form/FormContainer'
import Input from '@/components/ui/Input'
// import HeaderLogo from '@/components/template/HeaderLogo'
import Button from '@/components/ui/Button'
import { AdaptableCard } from '@/components/shared'
import { Upload } from '@/components/ui'
import InputMask from 'react-input-mask'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import Select from '@/components/ui/Select'

import Logo from '../Logo'
import axios from 'axios'

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

// const turmaOptions = [
//     { value: 'T01', label: 'Turma 01' },
//     { value: 'T02', label: 'Turma 02' },
// ]

const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Nome completo é obrigatório'),
    cpf: Yup.string().required('CPF é obrigatório'),
    uf: Yup.string().required('UF é obrigatório'),
    cidade: Yup.string().required('Cidade é obrigatória'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    celular: Yup.string().required('Celular é obrigatório'),
    // turma: Yup.string().required('Turma do Curso é obrigatória'),
})

function CursoForm() {
    const [estadoSelecionado, setEstadoSelecionado] = useState('')
    const [cidades, setCidades] = useState([])

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
            console.log(data)
            setCidades(data)
        } catch (error) {
            console.error('Erro ao buscar cidades do IBGE:', error)
        }
    }

    return (
        <AdaptableCard className="h-full max-w-4xl mx-auto" bodyClass="h-full">
            <div className="header-container flex flex-col items-left">
                <span>Portal do Empreender - V5</span>
                <div className="flex items-center justify-between">
                    <div style={{ maxWidth: '200px', minWidth: '100px' }}>
                        <Logo />
                    </div>
                    <div style={{ maxWidth: '200px', minWidth: '100px' }}>
                        <Logo logoPath="logo-empreender.png" />
                    </div>
                    <div style={{ maxWidth: '200px', minWidth: '100px' }}>
                        <Logo logoPath="al_invest_logo.jpg" />
                    </div>
                    <div style={{ maxWidth: '150px' }}>
                        <Logo logoPath="sebrae.svg" />
                    </div>
                </div>
                <h2 style={{ marginBottom: '20px' }}></h2>
                <div className="text-container">
                    <h3 style={{ marginBottom: '10px' }}>
                        Seleção de consultores de núcleos setoriais
                    </h3>
                    <h4 style={{ marginBottom: '20px' }}>Inscrição</h4>
                </div>
            </div>
            <Formik
                initialValues={{
                    nome: '',
                    cpf: '',
                    uf: '',
                    cidade: '',
                    email: '',
                    turma: '',
                    arquivo: [],
                }}
                // validationSchema={validationSchema}
                onSubmit={(values) => {
                    const formData = new FormData()
                    values.arquivo.forEach((file) => {
                        formData.append('files', file)
                    })

                    formData.append('arquivo', values.arquivo) // Adicione seus arquivos aqui
                    formData.append('nome', values.nome)
                    formData.append('cpf', values.cpf)
                    formData.append('uf', values.uf.label)
                    formData.append('cidade', values.cidade.label)
                    formData.append('email', values.email)
                    formData.append('turma', values.turma)

                    axios({
                        method: 'post',
                        url: 'http://localhost:3333/candidaturas',
                        data: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data', 
                        },
                    })
                        .then((response) => {
                            console.log('Resposta do servidor:', response.data)
                        })
                        .catch((error) => {
                            console.error('Erro ao enviar formulário:', error)
                        })
                }}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                asterisk
                                label="Nome completo"
                                htmlFor="nome"
                            >
                                <Field
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    size="sm"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem asterisk label="CPF" htmlFor="cpf">
                                <Field
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    size="sm"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem asterisk label="UF" htmlFor="uf">
                                <Field
                                    required
                                    placeholder="Selecione o estado"
                                    name="uf"
                                    size="sm"
                                    component={Select}
                                    options={ufOptions}
                                    onChange={(value) => {
                                        setFieldValue('uf', value)
                                        setFieldValue('cidade', '')
                                        setEstadoSelecionado(value)
                                    }}
                                />
                            </FormItem>

                            <FormItem asterisk label="Cidade" htmlFor="cidade">
                                <Field
                                    required
                                    name="cidade"
                                    size="sm"
                                    component={Select}
                                    options={cidades.map((city) => ({
                                        value: city.id,
                                        label: city.nome,
                                    }))}
                                    onChange={(e) => {
                                        setFieldValue('cidade', e)
                                    }}
                                />
                            </FormItem>

                            <FormItem asterisk label="Email" htmlFor="email">
                                <Field
                                    type="text"
                                    id="email"
                                    name="email"
                                    size="sm"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                asterisk
                                label="Celular"
                                htmlFor="celular"
                            >
                                <Field required name="celular" size="sm">
                                    {({ field }: any) => (
                                        <InputMask
                                            {...field}
                                            mask="(99) 99999-9999"
                                            placeholder="(00) 00000-0000"
                                        >
                                            {(inputProps: any) => (
                                                <Input
                                                    {...inputProps}
                                                    autoComplete="off"
                                                    component={Input}
                                                />
                                            )}
                                        </InputMask>
                                    )}
                                </Field>
                            </FormItem>

                            <Upload
                                draggable
                                multiple
                                showList
                                onChange={(files) => {
                                    setFieldValue('arquivo', files)
                                }}
                            />

                            <Button variant="solid" type="submit" size="sm">
                                Enviar
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </AdaptableCard>
    )
}

export default CursoForm
