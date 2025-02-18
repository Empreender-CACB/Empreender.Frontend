import { FormItem, FormContainer } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Container } from '@/components/shared';
import ApiService from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Notification, toast, Tooltip } from '@/components/ui';
import { VscFile } from 'react-icons/vsc';

const optionsSimNao = [
    { value: 's', label: 'Sim' },
    { value: 'n', label: 'Não' },
];

const acessoItems = [
    { label: 'Livre', value: 'Livre' },
    { label: 'Limitado', value: 'Limitado' },
    { label: 'Restrito', value: 'Restrito' },
]


const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Campo obrigatório'),
    tipoId: Yup.string().required('Selecione um tipo de documento'),
    vencimento: Yup.date().nullable(),
    necessitaAprovacao: Yup.string().required('Campo obrigatório'),
    descricao: Yup.string(),
    status: Yup.string(),
    acesso: Yup.string().required('Acesso é obrigatório'),
    vinculadosGrupos: Yup.array().when(['acesso'], {
        is: (acesso: string) => acesso === 'Restrito',
        then: (schema) => schema,
        otherwise: (schema) => schema
    }),
    vinculadosUsuarios: Yup.array().when(['acesso'], {
        is: (acesso: string) => acesso === 'Restrito',
        then: (schema) => schema,
        otherwise: (schema) => schema
    })
});


const EditarAnexo = () => {
    const { idAnexo } = useParams<{ idAnexo: any }>();
    const [anexo, setAnexo] = useState<any>(null);
    const [loading, setLoading] = useState<any>(null);
    const [arquivosTipos, setArquivosTipos] = useState<any>([]);
    const [usuarios, setUsuarios] = useState<any>([]);
    const [grupos, setGrupos] = useState<any>([]);
    const [necessitaAprovacaoDisabled, setNecessitaAprovacaoDisabled] = useState(false);
    const [mostrarVencimento, setMostrarVencimento] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tiposResponse, usuariosResponse, gruposResponse, anexoResponse] = await Promise.all([
                    ApiService.fetchData({ url: '/anexos/tipo', method: 'get' }),
                    ApiService.fetchData({ url: '/usuarios-ativos', method: 'get' }),
                    ApiService.fetchData({ url: '/grupos?tipoGrupo=usuario', method: 'get' }),
                    ApiService.fetchData({ url: `/anexo-completo/${idAnexo}`, method: 'get' }),
                ]);

                setAnexo(anexoResponse.data);
                setArquivosTipos(tiposResponse.data);
                setUsuarios(usuariosResponse.data.map((item: any) => ({
                    label: item.nmusuario,
                    value: item.nucpf,
                })));
                setGrupos(gruposResponse.data.map((item: any) => ({
                    label: item.nome,
                    value: item.id,
                })));
            } catch (error) {
                console.error('Erro ao buscar dados do anexo:', error);
            }
        };

        fetchData();
    }, [idAnexo]);

    if (!anexo) return <p className="text-center text-gray-500">Carregando...</p>;

    const query = new URLSearchParams(window.location.search);
    const redirectUrl = query.get("redirectUrl");

    const handleSave = async (values: any) => {
        setLoading(true);
        toast.push(
            <Notification title="Salvando arquivo, aguarde..." type="success" />
        );

        const formData = new FormData();
        formData.append('status', values.status);
        formData.append('nome', values.nome);
        formData.append('descricao', values.descricao);
        formData.append('tipoId', values.tipoId);
        formData.append('vencimento', values.vencimento ? values.vencimento.toString() : '');
        formData.append('necessitaAprovacao', values.necessitaAprovacao);
        formData.append('acesso', values.acesso);

        if (values.acesso === 'Restrito') {
            formData.append('vinculadosGrupos', JSON.stringify(values.vinculadosGrupos || []));
            formData.append('vinculadosUsuarios', JSON.stringify(values.vinculadosUsuarios || []));
        }


        try {
            const response = await ApiService.fetchData({
                url: `/anexo/${idAnexo}`,
                method: 'PUT',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const anexoId = response.data.anexo.id;

            toast.push(
                <Notification title="Arquivo salvo com sucesso!" type="success" />
            );

            if (redirectUrl) {
                window.location.href = `${redirectUrl}`;
            } else {
                window.location.href = `${import.meta.env.VITE_PHP_URL}/sistema/anexo/detalhe/bid/${btoa(anexoId)}`;
            }
        } catch (error) {
            console.error('Erro ao salvar arquivo:', error);
            toast.push(
                <Notification title="Erro ao salvar arquivo." type="danger" />
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="w-full max-w-4xl mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">Edição de anexo</h1>
            </div>

            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <Formik
                    enableReinitialize
                    initialValues={{
                        nome: anexo?.nome || '',
                        tipoId: anexo?.tipo_id || '',
                        vencimento: anexo?.vencimento || null,
                        necessitaAprovacao: anexo?.necessitaAprovacao || '',
                        descricao: anexo?.descricao || '',
                        status: anexo?.status || '',
                        acesso: anexo?.acesso || 'Livre',
                        vinculadosGrupos: anexo?.vinculadosGrupos?.map((grupo: any) => grupo.id) || [],
                        vinculadosUsuarios: anexo?.vinculadosUsuarios?.map((usuario: any) => usuario.nucpf) || [],
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSave(values);
                        setSubmitting(false);
                    }}
                >
                    {({ setFieldValue, values, errors, touched }) => {
                        useEffect(() => {
                            if (anexo?.tipo_id) {
                                buscarTipoArquivo(anexo.tipo_id);
                                setFieldValue('tipoId', anexo.tipo_id);
                            }
                        }, [anexo]);

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
                            } else {
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
                                            invalid={Boolean(errors.nome && touched.nome)}
                                            errorMessage={errors.nome as string | undefined}
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
                                        <h5 className="text-lg font-semibold mb-4">Arquivo
                                            <Tooltip
                                                title={
                                                    <div className="text-sm">
                                                        O arquivo em si não poderá ser editado. Caso deseje alterar o arquivo use a funcionalidade substituição.
                                                    </div>
                                                }
                                            >
                                                <span className="text-gray-500 cursor-pointer ml-2">ℹ️</span>
                                            </Tooltip>
                                        </h5>

                                        <div className="flex flex-wrap gap-4">
                                            <Link
                                                to={`${import.meta.env.VITE_PHP_URL}/sistema/anexo/download-anexo/aid/${btoa(idAnexo)}`}
                                                target='_blank'
                                            >
                                                <div className="upload-file">
                                                    <div className="flex pr-4">
                                                        <div className="upload-file-thumbnail"><span className="text-4xl"><VscFile /></span></div>
                                                        <div className="upload-file-info">
                                                            <h6 className="upload-file-name">{anexo?.nome_arquivo || 'Nome do arquivo'}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <FormItem
                                                label="Selecione o tipo do documento"
                                                asterisk
                                                invalid={Boolean(errors.tipoId && touched.tipoId)}
                                                errorMessage={errors.tipoId as string | undefined}
                                                className="flex-1 w-full md:w-1/6"
                                            >
                                                <Field name="tipoId">
                                                    {({ field, form }: any) => {
                                                        const selectedOption = arquivosTipos.find((tipo: any) => tipo.id === form.values.tipoId);

                                                        return (
                                                            <Select
                                                                {...field}
                                                                placeholder="Selecione o tipo do documento"
                                                                options={arquivosTipos.map((tipo: any) => ({
                                                                    label: tipo.tipo,
                                                                    value: tipo.id,
                                                                }))}
                                                                value={selectedOption ? { label: selectedOption.tipo, value: selectedOption.id } : null}
                                                                onChange={(option: any) => {
                                                                    form.setFieldValue('tipoId', option?.value);
                                                                    buscarTipoArquivo(option?.value);
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                </Field>
                                            </FormItem>

                                            <FormItem
                                                label={
                                                    <div className="flex items-center">
                                                        Acesso
                                                        <Tooltip
                                                            title={
                                                                <div className="text-sm">
                                                                    <p><strong>Livre:</strong> Todos os usuários têm acesso ao documento.</p>
                                                                    <p><strong>Limitado:</strong> Somente usuários autorizados ou gestores podem acessar.</p>
                                                                    <p><strong>Restrito:</strong> Apenas usuários específicos indicados podem acessar.</p>
                                                                </div>
                                                            }
                                                        >
                                                            <span className="text-gray-500 cursor-pointer ml-2">ℹ️</span>
                                                        </Tooltip>
                                                    </div>
                                                }
                                                asterisk
                                                invalid={Boolean(errors.acesso && touched.acesso)}
                                                errorMessage={errors.acesso as string | undefined}
                                                className="flex-1 w-full md:w-1/8"
                                            >
                                                <Field name="acesso">
                                                    {({ field, form }: any) => (
                                                        <Select
                                                            {...field}
                                                            placeholder="Selecione o tipo do acesso"
                                                            options={acessoItems}
                                                            value={acessoItems.find(option => option.value === form.values.acesso)}
                                                            onChange={(option: any) => {
                                                                form.setFieldValue('acesso', option?.value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            {mostrarVencimento && (
                                                <FormItem label="Vencimento" className="flex-1 w-full md:w-1/6">
                                                    <Field name="vencimento" type="date" as={Input} className="w-full" />
                                                </FormItem>
                                            )}

                                            <FormItem
                                                label="Necessita de Aprovação?"
                                                asterisk
                                                invalid={Boolean(errors.necessitaAprovacao && touched.necessitaAprovacao)}
                                                errorMessage={errors.necessitaAprovacao as string | undefined}
                                                className="flex-1 w-full md:w-1/6"
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

                                    {values.acesso === 'Restrito' && (
                                        <>
                                            <div className="mb-6">
                                                <FormItem label="Grupos Vinculados" asterisk>
                                                    <Field name="vinculadosGrupos">
                                                        {({ field, form }: any) => (
                                                            <Select
                                                                {...field}
                                                                isMulti
                                                                placeholder="Selecione os grupos"
                                                                options={grupos}
                                                                value={grupos.filter((option: any) => field.value?.includes(option.value))}
                                                                onChange={(options: any) =>
                                                                    setFieldValue('vinculadosGrupos', options ? options.map((opt: any) => opt.value) : [])
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            </div>

                                            {usuarios.length > 0 && (
                                                <div className="mb-6">
                                                    <FormItem label="Usuários Vinculados" asterisk>
                                                        <Field name="vinculadosUsuarios">
                                                            {({ field, form }: any) => (
                                                                <Select
                                                                    {...field}
                                                                    isMulti
                                                                    placeholder="Selecione os usuários"
                                                                    options={usuarios}
                                                                    value={usuarios.filter((option: any) => field.value?.includes(option.value))}
                                                                    onChange={(selectedOptions: any) => {
                                                                        const selectedValues = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
                                                                        setFieldValue('vinculadosUsuarios', selectedValues);
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                </div>
                                            )}
                                        </>
                                    )}


                                    <div className="mb-6">
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
                                        <Link
                                            to={`${import.meta.env.VITE_PHP_URL
                                            }/sistema/anexo/detalhe/bid/${btoa(anexo.id)}`}
                                            className="block lg:inline-block"
                                        >
                                            <Button variant="default">Cancelar</Button>
                                        </Link>

                                        <Button type="submit" variant="solid" disabled={loading}>
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

export default EditarAnexo;
