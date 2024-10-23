import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Upload from '@/components/ui/Upload';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';

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
});

const breadcrumbItems = [
    { label: 'Início', link: '/' },
    { label: 'Inserir novo Lote', link: '/sistema/insert-excel' },
]

const DocumentoForm = () => {
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
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <FormItem
                                            label="Arquivo"
                                            asterisk
                                            invalid={!!errors.nomeArquivo && touched.nomeArquivo}
                                            errorMessage={errors.nomeArquivo}
                                        >
                                            <Field name="nomeArquivo">
                                                {({ field }: any) => (
                                                    <div className="flex-1">
                                                        <Upload
                                                            isFullWidth={true}
                                                            variant='solid'
                                                            uploadLimit={1}
                                                            onChange={(files) => setFieldValue('nomeArquivo', files[0])}
                                                        />
                                                    </div>
                                                )}
                                            </Field>
                                        </FormItem>


                                        <FormItem
                                            label="Selecione o tipo do documento"
                                            asterisk
                                            invalid={!!errors.tipoId && touched.tipoId}
                                            errorMessage={errors.tipoId}
                                        >
                                            <Field name="tipoId">
                                                {({ field, form }: any) => (
                                                    <Select
                                                        field={field}
                                                        form={form}
                                                        options={optionsTipoDocumento}
                                                        value={optionsTipoDocumento.find(
                                                            (option) => option.value === values.tipoId
                                                        )}
                                                        onChange={(option: any) =>
                                                            form.setFieldValue('tipoId', option?.value)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem label="Vencimento">
                                            <Field name="vencimento" type="date" as={Input} className="w-full" />
                                        </FormItem>

                                        <FormItem
                                            label="Precisa de Aprovação?"
                                            asterisk
                                            invalid={!!errors.necessitaAprovacao && touched.necessitaAprovacao}
                                            errorMessage={errors.necessitaAprovacao}
                                        >
                                            <Field name="necessitaAprovacao">
                                                {({ field, form }: any) => (
                                                    <Select
                                                        field={field}
                                                        form={form}
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

                                {/* Seção Vincular */}
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

                                {/* Seção Descrição */}
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

                                {/* Botões de ação */}
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

export default DocumentoForm;
