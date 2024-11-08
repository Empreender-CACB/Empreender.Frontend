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
import { Link, useParams } from 'react-router-dom';
import capitalize from '@/components/ui/utils/capitalize';
import { Notification, toast } from '@/components/ui';

const optionsSimNao = [
    { value: 's', label: 'Sim' },
    { value: 'n', label: 'Não' },
];

const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório'),
    nomeArquivo: Yup.mixed().required('Arquivo obrigatório'),
    tipoId: Yup.string().required('Selecione um tipo de documento'),
    vencimento: Yup.date().nullable(),
    necessitaAprovacao: Yup.string().required('Campo obrigatório'),
    descricao: Yup.string(),
    tipoVinculo: Yup.string(),
    idVinculo: Yup.string().required('ID de vínculo obrigatório'),
});

const breadcrumbItems = [
    { label: 'Início', link: '/' },
    { label: 'Adicionar documento', link: '/sistema/insert-excel' },
]

const AdicionarAnexo = () => {
    const [arquivosTipos, setArquivosTipos] = useState<any>([]);
    const [nomeArquivoSubstituto, setNomeArquivoSubstituto] = useState('');
    const [nomeEnte, setNomeEnte] = useState('');
    const [mostrarVencimento, setMostrarVencimento] = useState(true);
    const [loading, setLoading] = useState(false);
    const [necessitaAprovacaoDisabled, setNecessitaAprovacaoDisabled] = useState(false);
    const { tipoVinculo, idVinculo, substitutoId } = useParams<string>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tiposResponse = await ApiService.fetchData({
                    url: '/anexos/getArquivosTipo',
                    method: 'get',
                });
                setArquivosTipos(tiposResponse.data);

                if (tipoVinculo && idVinculo) {
                    const enteResponse = await ApiService.fetchData({
                        url: `/anexos/getVinculo/${tipoVinculo}/${idVinculo}`,
                        method: 'get',
                    });
                    setNomeEnte(enteResponse.data.nomeVinculo);
                }

                if (substitutoId) {
                    const substitutoResponse = await ApiService.fetchData({
                        url: `/anexo/${substitutoId}`,
                        method: 'get',
                    });
                    setNomeArquivoSubstituto(substitutoResponse.data.nome);

                    // Definir o tipoId e passar para o formik
                    const tipoId = substitutoResponse.data.tipo_id;
                    setTipoIdInicial(tipoId);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [tipoVinculo, idVinculo, substitutoId]);

    const [tipoIdInicial, setTipoIdInicial] = useState('');

    const query = new URLSearchParams(window.location.search);
    const redirectUrl = query.get("redirectUrl");

    const handleSave = async (values: any) => {
        setLoading(true);
        toast.push(
            <Notification title="Salvando arquivo, aguarde..." type="success" />
        );

        const formData = new FormData();
        formData.append('nome', values.nome);
        formData.append('descricao', values.descricao);
        formData.append('tipoId', values.tipoId);
        formData.append('vencimento', values.vencimento ? values.vencimento.toString() : '');
        formData.append('necessitaAprovacao', values.necessitaAprovacao);
        formData.append('tipoVinculo', tipoVinculo || '');
        formData.append('idVinculo', idVinculo || '');
        if (substitutoId) formData.append('substitutoId', substitutoId);
        if (values.nomeArquivo) formData.append('nomeArquivo', values.nomeArquivo);

        try {
            const response = await ApiService.fetchData({
                url: `/anexos/storeAnexo/${tipoVinculo}/${idVinculo}/${substitutoId || ''}`,
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const anexoId = response.data.anexo.id;

            if (redirectUrl) {
                window.location.href = `${redirectUrl}`;
            } else {
                window.location.href = `${import.meta.env.VITE_PHP_URL}/sistema/anexo/detalhe/bid/${btoa(anexoId)}`;
            }
        } catch (error) {
            toast.push(
                <Notification title="Erro ao salvar arquivo." type="danger" />
            );
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="w-full max-w-4xl mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-2xl font-semibold text-gray-800">Adição de Documento</h1>
            </div>

            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <Formik
                    initialValues={{
                        nome: '',
                        nomeArquivo: null,
                        tipoId: tipoIdInicial || '',
                        vencimento: null,
                        necessitaAprovacao: '',
                        descricao: '',
                        tipoVinculo: tipoVinculo || '',
                        idVinculo: idVinculo || ''
                    }}
                    enableReinitialize // Para garantir que o formulário seja reiniciado quando tipoIdInicial mudar
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSave(values);
                        setSubmitting(false);
                    }}
                >
                    {({ setFieldValue, values, errors, touched }) => {
                        useEffect(() => {
                            // Chama a função de configuração do tipo de arquivo quando tipoIdInicial estiver disponível
                            if (tipoIdInicial) {
                                buscarTipoArquivo(tipoIdInicial);
                            }
                        }, [tipoIdInicial]);

                        const buscarTipoArquivo = (tipoId: string) => {
                            const tipoArquivo = arquivosTipos.find((tipo: any) => tipo.id === tipoId);

                            if (!tipoArquivo) return;

                            if (tipoArquivo.obrigatorio === 'nao_aplica') {
                                setFieldValue('necessitaAprovacao', 'n');
                                setFieldValue('status', 'nao_aplica');
                                setNecessitaAprovacaoDisabled(true);
                            } else if (tipoArquivo.obrigatorio === 'obrigatorio') {
                                setFieldValue('necessitaAprovacao', 's');
                                setFieldValue('status', 'aa');
                                setNecessitaAprovacaoDisabled(true);
                            } else if (tipoArquivo.obrigatorio === 'opcional') {
                                setFieldValue('status', 'aa');
                                setNecessitaAprovacaoDisabled(false);
                            }

                            setMostrarVencimento(tipoArquivo.vencimento_obrigatorio !== 'nao_aplica');
                        };

                        return (
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
                                                            {...field}
                                                            placeholder="Selecione o tipo do documento"
                                                            options={arquivosTipos.map((tipo: any) => ({
                                                                label: tipo.tipo,
                                                                value: tipo.id,
                                                            }))}
                                                            value={
                                                                form.values.tipoId
                                                                    ? { label: arquivosTipos.find((tipo: any) => tipo.id === form.values.tipoId)?.tipo, value: form.values.tipoId }
                                                                    : null
                                                            }
                                                            onChange={(option: any) => {
                                                                form.setFieldValue('tipoId', option?.value);
                                                                buscarTipoArquivo(option?.value);
                                                            }}
                                                            isDisabled={!!substitutoId}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>


                                            {mostrarVencimento && (
                                                <FormItem label="Vencimento">
                                                    <Field name="vencimento" type="date" as={Input} className="w-full" />
                                                </FormItem>
                                            )}

                                            <FormItem
                                                label="Tipo vínculo"
                                                asterisk
                                                invalid={!!errors.tipoVinculo && touched.tipoVinculo}
                                                errorMessage={errors.tipoVinculo}
                                                className="w-full md:w-1/4"
                                            >
                                                <Field>
                                                    {({ form }: any) => (
                                                        <Select
                                                            isDisabled={true}
                                                            options={[{ label: capitalize(tipoVinculo || ''), value: tipoVinculo || '' }]}
                                                            value={{ label: capitalize(tipoVinculo || ''), value: tipoVinculo || '' }}
                                                            onChange={() => { }}
                                                        />
                                                    )}
                                                </Field>
                                                <Field type="hidden" name="tipoVinculo" value={tipoVinculo} />
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
                                                            {...field}
                                                            options={optionsSimNao}
                                                            isDisabled={necessitaAprovacaoDisabled}
                                                            placeholder="Necessita de Aprovação?"
                                                            value={optionsSimNao.find(option => option.value === form.values.necessitaAprovacao)}
                                                            onChange={(option: any) => form.setFieldValue('necessitaAprovacao', option?.value)}
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
                                                value={nomeEnte}
                                                className="w-full"
                                            />
                                        </FormItem>
                                    </div>

                                    {substitutoId && (
                                        <div className="mb-6">
                                            <h5 className="text-lg font-semibold mb-4">Substituindo</h5>
                                            <p className="text-lg font-semibold">
                                                <Link
                                                    to={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/detalhe/bid/${btoa(substitutoId)}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {nomeArquivoSubstituto}
                                                </Link>
                                            </p>
                                        </div>
                                    )}

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
                                        <Button
                                            type="submit"
                                            variant='solid'
                                            disabled={loading}
                                        >
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </Button>
                                    </div>
                                </FormContainer>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </Container>
    );
};

export default AdicionarAnexo;
