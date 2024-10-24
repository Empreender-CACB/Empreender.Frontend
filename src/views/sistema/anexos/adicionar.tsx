import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Upload from '@/components/ui/Upload';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';

type FormModel = {
    nome: string;
    nomeArquivo: File | null;
    tipoId: string;
    vencimento: Date | null;
    necessitaAprovacao: string;
    descricao: string;
};

const optionsTipoDocumento = [
    { value: '1', label: 'Tipo 1' },
    { value: '2', label: 'Tipo 2' },
];

const optionsSimNao = [
    { value: '1', label: 'Sim' },
    { value: '0', label: 'Não' },
];

const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório'),
    nomeArquivo: Yup.mixed().required('Arquivo obrigatório'),
    tipoId: Yup.string().required('Selecione um tipo de documento'),
    vencimento: Yup.date().nullable(),
    necessitaAprovacao: Yup.string().required('Campo obrigatório'),
    descricao: Yup.string(),
    tipoVinculo: Yup.string()
});

const breadcrumbItems = [
    { label: 'Início', link: '/' },
    { label: 'Adicionar documento', link: '/sistema/insert-excel' },
]

const AdicionarAnexo = () => {
    const [arquivosTipos, setArquivosTipos] = useState([]);

    const fetchArquivosTipos = async () => {
        try {
            const response = await ApiService.fetchData({
                url: '/arquivos-tipos',
                method: 'get',
            });
            setArquivosTipos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os tipos de arquivos:', error);
        }
    };

    useEffect(() => {
        fetchArquivosTipos();
    }, []);

    return (
        <Container>
            <div className="w-full max-w-4xl mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-2xl font-semibold text-gray-800">Adição de Anexo</h1>
            </div>

            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <Formik
                    initialValues={{
                        nome: '',
                        nomeArquivo: null,
                        tipoId: '',
                        vencimento: null,
                        necessitaAprovacao: '',
                        descricao: '',
                        tipoVinculo: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log('Form values:', values);
                        setSubmitting(false);
                    }}
                >
                    {({ values, setFieldValue, errors, touched }) => (
                        <Form>
                            <FormContainer>
                                <div className="mb-6">
                                    <FormItem
                                        label="Nome"
                                        asterisk
                                        invalid={!!errors.nome && touched.nome}
                                        errorMessage={errors.nome}
                                    >
                                        <Field
                                            name="nome"
                                            as={Input}
                                            placeholder="Nome do documento"
                                            className="w-full"
                                        />
                                    </FormItem>
                                </div>

                                {/* Seção Carga */}
                                <div className="mb-6 bg-blue-100 p-4 rounded-lg">
                                    <h5 className="text-lg font-semibold mb-4">Carga</h5>
                                    <div className="flex flex-wrap gap-4">
                                        <FormItem
                                            label="Arquivo"
                                            asterisk
                                            invalid={!!errors.nomeArquivo && touched.nomeArquivo}
                                            errorMessage={errors.nomeArquivo}
                                            className="flex-1 w-full md:w-auto"
                                        >
                                            <Field name="nomeArquivo">
                                                {({ field }: any) => (
                                                    <Upload
                                                        isFullWidth={true}
                                                        variant='solid'
                                                        uploadLimit={1}
                                                        onChange={(files) => setFieldValue('nomeArquivo', files[0])}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem
                                            label="Selecione o tipo do documento"
                                            asterisk
                                            invalid={!!errors.tipoId && touched.tipoId}
                                            errorMessage={errors.tipoId}
                                            className="flex-1 w-full md:w-auto" 
                                        >
                                            <Field name="tipoId">
                                                {({ field, form }: any) => (
                                                    <Select
                                                        field={field}
                                                        form={form}
                                                        placeholder="Selecione o tipo do documento"
                                                        options={arquivosTipos.map((tipo: any) => ({ label: tipo.tipo, value: tipo.id }))}
                                                        value={arquivosTipos.find((option: any) => option.value === values.tipoId)}
                                                        onChange={(option: any) =>
                                                            form.setFieldValue('tipoId', option?.value)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem label="Vencimento" className="w-full md:w-auto"> 
                                            <Field name="vencimento" type="date" as={Input} className="w-full" />
                                        </FormItem>

                                        <FormItem
                                            label="Tipo vínculo"
                                            asterisk
                                            invalid={!!errors.tipoVinculo && touched.tipoVinculo}
                                            errorMessage={errors.tipoVinculo}
                                            className="w-full md:w-1/4" 
                                        >
                                            <Field name="tipoVinculo">
                                                {({ field, form }: any) => (
                                                    <Select
                                                        field={field}
                                                        form={form}
                                                        isDisabled={true}
                                                        options={[{ label: 'Projeto', value: 'projeto' }]}
                                                        value={{ label: 'Projeto', value: 'projeto' }}
                                                        onChange={() => { }}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem
                                            label="Necessita de Aprovação?"
                                            asterisk
                                            invalid={!!errors.necessitaAprovacao && touched.necessitaAprovacao}
                                            errorMessage={errors.necessitaAprovacao}
                                            className="w-full md:w-auto" 
                                        >
                                            <Field name="necessitaAprovacao">
                                                {({ field, form }: any) => (
                                                    <Select
                                                        field={field}
                                                        form={form}
                                                        placeholder="Necessita de Aprovação?"
                                                        options={optionsSimNao}
                                                        value={optionsSimNao.find(
                                                            (option) => option.value === values.necessitaAprovacao
                                                        )}
                                                        onChange={(option: any) =>
                                                            form.setFieldValue('necessitaAprovacao', option?.value)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
                                </div>




                                <div className="mb-6">
                                    <h5 className="text-lg font-semibold mb-4">Vincular</h5>
                                    <FormItem label="Vinculado a" asterisk>
                                        <Field
                                            name="vinculado"
                                            as={Input}
                                            disabled
                                            value="2148 - Apoio para melhoria de Autogestão e Liderança do Núcleo de Jovens Empreendedores ACCIJUC - Clone"
                                            className="w-full"
                                        />
                                    </FormItem>
                                </div>

                                <div className="mb-6">
                                    <h5 className="text-lg font-semibold mb-4">Descrição</h5>
                                    <FormItem label="Descrição">
                                        <Field
                                            name="descricao"
                                            as="textarea"
                                            textArea
                                            placeholder="Descrição do documento"
                                            className="w-full h-32"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="reset" className="bg-gray-300">Cancelar</Button>
                                    <Button type="submit" variant='solid'>Salvar</Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    );
};

export default AdicionarAnexo;
