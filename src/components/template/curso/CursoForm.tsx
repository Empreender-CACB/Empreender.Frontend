/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import FormItem from '@/components/ui/Form/FormItem'
import FormContainer from '@/components/ui/Form/FormContainer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Upload } from '@/components/ui'
import InputMask from 'react-input-mask'
import { Formik, Field, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import Select from '@/components/ui/Select'

import axios from 'axios'
import FileItem from '@/components/ui/Upload/FileItem'
import CloseButton from '@/components/ui/CloseButton'

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

// const validationSchema = Yup.object().shape({
//     nome: Yup.string().required('Nome completo é obrigatório'),
//     cpf: Yup.string().required('CPF é obrigatório'),
//     uf: Yup.string().required('UF é obrigatório'),
//     cidade: Yup.string().required('Cidade é obrigatória'),
//     email: Yup.string().email('Email inválido').required('Email é obrigatório'),
//     celular: Yup.string().required('Celular é obrigatório'),
// })

const tipoArquivoOptions = [
    { value: 'documento', label: 'Documento' },
    { value: 'imagem', label: 'Imagem' },
    { value: 'outra-coisa', label: 'Outra Coisa' },
]

const initialValues = {
    nome: '',
    cpf: '',
    uf: '',
    cidade: '',
    email: '',
    arquivos: [{ arquivo: null, tipoArquivo: null }],
}

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

    const [arquivos, setArquivos] = useState(initialValues.arquivos)

    const removeFile = (fileIndex) => {
        // Implemente a lógica de remoção aqui
        // Por exemplo:
        const updatedArquivos = [...arquivos]
        updatedArquivos.splice(fileIndex, 1)
        setArquivos(updatedArquivos)
    }

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('nome', values.nome);
        formData.append('cpf', values.cpf);
        formData.append('uf', values.uf);
        formData.append('cidade', values.cidade);
        formData.append('telefone', values.telefone);
        formData.append('email', values.email);
        formData.append('arquivos', values.arquivos);
    
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/candidaturas`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (error) {
            console.log('Emanoel só quer jogar, preguiçoso')
        }
      };

    return (
        <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <FormItem asterisk label="Nome completo" htmlFor="nome">
                            <Field
                                type="text"
                                id="nome"
                                name="nome"
                                size="sm"
                                component={Input}
                            />
                        </FormItem>

                        <FormItem asterisk label="CPF" htmlFor="cpf">
                            <Field name="cpf" size="sm">
                                {({ field }: any) => (
                                    <InputMask
                                        {...field}
                                        mask="999.9999.99-99"
                                        placeholder="000.0000.00-00"
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

                        <FormItem asterisk label="UF" htmlFor="uf">
                            <Field
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

                        <FormItem asterisk label="Celular" htmlFor="celular">
                            <Field name="celular" size="sm">
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

                        {/* <Upload
                            draggable
                            multiple
                            showList
                            onChange={(files) => {
                                setFieldValue('arquivo', files)
                            }}
                        /> */}

                        <FormItem asterisk label="Arquivos" htmlFor="arquivos">
                            {/* Campos de upload de arquivo dinâmicos */}
                            <FieldArray name="arquivos">
                                {({ push, remove }) => (
                                    <div>
                                        {values.arquivos.map(
                                            (arquivo, index) => (
                                                <div
                                                    key={index}
                                                    className="file-upload-container grid grid-cols-12 gap-4 flex items-center"
                                                >
                                                    {arquivo.arquivo ? (
                                                        <>
                                                            <div className="col-span-8">
                                                                <div className="file-item-container">
                                                                    {/* FileItem */}
                                                                    <FileItem
                                                                        key={
                                                                            arquivo
                                                                                .arquivo
                                                                                .name +
                                                                            index
                                                                        }
                                                                        file={
                                                                            arquivo.arquivo
                                                                        }
                                                                    >
                                                                        <CloseButton
                                                                            className="upload-file-remove"
                                                                            onClick={() => {
                                                                                // Remova o arquivo e o tipo do arquivo
                                                                                const updatedArquivos =
                                                                                    [
                                                                                        ...values.arquivos,
                                                                                    ]
                                                                                updatedArquivos[
                                                                                    index
                                                                                ] =
                                                                                    {
                                                                                        arquivo:
                                                                                            null,
                                                                                        tipoArquivo:
                                                                                            '',
                                                                                    }
                                                                                setFieldValue(
                                                                                    'arquivos',
                                                                                    updatedArquivos
                                                                                )
                                                                            }}
                                                                        />
                                                                    </FileItem>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-4">
                                                                <Field
                                                                    component={
                                                                        Select
                                                                    }
                                                                    options={
                                                                        tipoArquivoOptions
                                                                    }
                                                                    name={`arquivos[${index}].tipoArquivo`}
                                                                    className="tipo-arquivo-select"
                                                                    onChange={(
                                                                        selectedOption
                                                                    ) =>
                                                                        setFieldValue(
                                                                            `arquivos[${index}].tipoArquivo`,
                                                                            selectedOption.value
                                                                        )
                                                                    }
                                                                    value={
                                                                        tipoArquivoOptions.find(
                                                                            (
                                                                                option
                                                                            ) =>
                                                                                option.value ===
                                                                                values
                                                                                    .arquivos[
                                                                                    index
                                                                                ]
                                                                                    .tipoArquivo
                                                                        ) || ''
                                                                    }
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="col-span-8">
                                                            <Upload
                                                                onFileRemove={
                                                                    removeFile
                                                                }
                                                                onChange={(
                                                                    files
                                                                ) => {
                                                                    // Atualize o arquivo no índice especificado
                                                                    const updatedArquivos =
                                                                        [
                                                                            ...values.arquivos,
                                                                        ]
                                                                    updatedArquivos[
                                                                        index
                                                                    ] = {
                                                                        arquivo:
                                                                            files[0],
                                                                        tipoArquivo:
                                                                            '',
                                                                    }
                                                                    setFieldValue(
                                                                        'arquivos',
                                                                        updatedArquivos
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        )}
                                        {/* Botão "Adicionar Arquivo" */}
                                        <div>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    push({
                                                        arquivo: null,
                                                        tipoArquivo: '',
                                                    })
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                Adicionar Arquivo
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>
                        </FormItem>
                        <Button variant="solid" type="submit" size="sm">
                            Enviar
                        </Button>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CursoForm
