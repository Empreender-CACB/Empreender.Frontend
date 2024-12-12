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
import { Link, useParams, useSearchParams } from 'react-router-dom';
import capitalize from '@/components/ui/utils/capitalize';
import { Notification, toast } from '@/components/ui';
import { VscFile } from 'react-icons/vsc';
import isEmpty from 'lodash/isEmpty';

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
    status: Yup.string(),
    versao: Yup.string().when('tipoVinculo', {
        is: (tipoVinculo: string) => tipoVinculo === 'documentacao',
        then: (schema) => schema.required('Versão é obrigatória'),
        otherwise: (schema) => schema.notRequired(),
    }),
    grupo: Yup.string().when('tipoVinculo', {
        is: (tipoVinculo: string) => tipoVinculo === 'documentacao',
        then: (schema) => schema.required('Grupo é obrigatório'),
        otherwise: (schema) => schema.notRequired(),
    }),
    referencia: Yup.string().when('tipoVinculo', {
        is: (tipoVinculo: string) => tipoVinculo === 'documentacao',
        then: (schema) => schema.required('Referência obrigatória'),
        otherwise: (schema) => schema.notRequired(),
    }),
    status_doc: Yup.string().when('tipoVinculo', {
        is: (tipoVinculo: string) => tipoVinculo === 'documentacao',
        then: (schema) => schema.required('Status é obrigatório'),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const AdicionarAnexo = () => {
    const [arquivosTipos, setArquivosTipos] = useState<any>([]);
    const [recursos, setRecursos] = useState<any>([]);
    const [nomeArquivoSubstituto, setNomeArquivoSubstituto] = useState('');
    const [nomeEnte, setNomeEnte] = useState('');
    const [nomeEnteSencundario, setNomeEnteSecundario] = useState('');
    const [mostrarVencimento, setMostrarVencimento] = useState(true);
    const [loading, setLoading] = useState(false);
    const [necessitaAprovacaoDisabled, setNecessitaAprovacaoDisabled] = useState(false);
    const [params] = useSearchParams();
    const [isTransferenciaLancamentoAcao, setIsTransferenciaLancamentoAcao] = useState(false);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [disableAnexoTransferencia, setDisableAnexoTransferencia] = useState(false);
    const [labelDocumento, setLabelDocumento] = useState('Adição de Documento');
    const { tipoVinculo, idVinculo, tipoVinculoSecundario, idVinculoSecundario, substitutoId } = useParams<string>();
    const idAnexoLancamento = params.get('idAnexoLancamento')


    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { label: 'Início', link: '/' },
        { label: 'Adicionar documento', link: '#' }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tiposResponse = await ApiService.fetchData({
                    url: '/anexos/tipo',
                    method: 'get',
                });
                setArquivosTipos(tiposResponse.data);

                if (tipoVinculo && idVinculo) {
                    
                    let url:string;
                    if(tipoVinculoSecundario && idVinculoSecundario && (idAnexoLancamento !== null && idAnexoLancamento !== 'null'))
                    {
                        url = `/anexos/getVinculo/${tipoVinculo}/${idVinculo}/${tipoVinculoSecundario}/${idVinculoSecundario}?idAnexoLancamento=${idAnexoLancamento}`
                    }else if(tipoVinculoSecundario && idVinculoSecundario) 
                    {
                        url = `/anexos/getVinculo/${tipoVinculo}/${idVinculo}/${tipoVinculoSecundario}/${idVinculoSecundario}`
                    }else{
                        url = `/anexos/getVinculo/${tipoVinculo}/${idVinculo}`
                    }
                    const enteResponse = await ApiService.fetchData({
                        url,
                        method: 'get',
                    });
                    setNomeEnte(enteResponse.data.nomeVinculoPrimario || enteResponse.data.nomeVinculo);
                    if (tipoVinculoSecundario && idVinculoSecundario) {
                        setNomeEnteSecundario(enteResponse.data.nomeVinculoSecundario || '');
                    }

                    if(enteResponse.data.arquivoLancamento !== null && enteResponse.data.arquivoLancamento !== undefined)
                    {
                        const anexoLancamento = enteResponse.data.arquivoLancamento;
                        setIsTransferenciaLancamentoAcao(true);
                        setNomeArquivo(anexoLancamento.nomeArquivo);
                        setDisableAnexoTransferencia(true);
                        setLabelDocumento('Transferência de anexo para ação');
                    }

                    const { breadcrumb } = enteResponse.data;

                    setBreadcrumbItems([
                        { label: 'Início', link: '/' },
                        ...breadcrumb.map((item: any) => ({
                            label: item.label,
                            link: item.url,
                        })),
                        { label: 'Documentos', link: '#' },
                    ]);
                }

                if (substitutoId) {
                    const substitutoResponse = await ApiService.fetchData({
                        url: `/anexo/${substitutoId}`,
                        method: 'get',
                    });
                    setNomeArquivoSubstituto(substitutoResponse.data.nome);

                    const tipoId = substitutoResponse.data.tipo_id;
                    setTipoIdInicial(tipoId);
                }

                if (tipoVinculo === 'documentacao') {
                    setNomeEnte("Documentação");
                    const recursosResponse = await ApiService.fetchData({
                        url: '/recursos',
                        method: 'get',
                    });
                    const formattedRecursos = recursosResponse.data.map((recurso: any) => ({
                        value: recurso.idrecurso,
                        label: recurso.nome,
                    }));
                    setRecursos(formattedRecursos);
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
        formData.append('status', values.status);
        formData.append('nome', values.nome);
        formData.append('descricao', values.descricao);
        formData.append('tipoId', values.tipoId);
        formData.append('vencimento', values.vencimento ? values.vencimento.toString() : '');
        formData.append('necessitaAprovacao', values.necessitaAprovacao);
        formData.append('tipoVinculo', tipoVinculo || '');
    
        if (values.nomeArquivo) {
            formData.append('nomeArquivo', values.nomeArquivo);
        }
    
        if (tipoVinculo === 'documentacao') {
            formData.append('versao', values.versao || '');
            formData.append('grupo', values.grupo || '');
            formData.append('status_doc', values.status_doc || '1');
            formData.append('direitos', values.direitos || '');
            formData.append('referencia', values.referencia || '');
        } else {
            formData.append('idVinculo', idVinculo || '');
            if (tipoVinculoSecundario && idVinculoSecundario) {
                formData.append('tipoVinculoSecundario', tipoVinculoSecundario);
                formData.append('idVinculoSecundario', idVinculoSecundario);
            }
        }
    
        if (substitutoId) {
            formData.append('substitutoId', substitutoId);
        }
        if(isTransferenciaLancamentoAcao && (idAnexoLancamento !== null && idAnexoLancamento !== 'null'))
        {
            formData.append('idAnexoLancamento', idAnexoLancamento!);
        }
    
        try {
            const url = tipoVinculoSecundario && idVinculoSecundario
                ? `/anexos/storeAnexo/${tipoVinculo}/${idVinculo}/${tipoVinculoSecundario}/${idVinculoSecundario}/${substitutoId || ''}`
                : `/anexos/storeAnexo/${tipoVinculo}/${idVinculo}/${substitutoId || ''}`;
    
            const response = await ApiService.fetchData({
                url,
                method: 'post',
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
                <Breadcrumb items={breadcrumbItems} />
                <h1 className="text-2xl font-semibold text-gray-800">{labelDocumento}</h1>
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
                        versao: '',
                        direitos: [],
                        grupo: '',
                        referencia: '',
                        status: '',
                        status_doc: '1',
                        tipoVinculo: tipoVinculo,
                        idVinculo: idVinculo || '',
                    }}
                    validationSchema={validationSchema}
                    validate={(values) => {
                        console.log('Validation step - values:', values);
                        const errors = {};
                        // Optionally, you can add custom validation logic here for debugging
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log('Submitted values:', values);
                        handleSave(values);
                        setSubmitting(false);
                    }}
                >
                    {({ setFieldValue, errors, touched }) => {
                        useEffect(() => {
                            if (tipoIdInicial) {
                                buscarTipoArquivo(tipoIdInicial);
                            }
                            if(nomeArquivo)
                            {
                                setFieldValue('nome', nomeArquivo);
                                setFieldValue('nomeArquivo', nomeArquivo);
                            }
                        }, [tipoIdInicial, nomeArquivo]);

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
                                                            disabled={disableAnexoTransferencia}

                                                            onChange={(files) => setFieldValue('nomeArquivo', files[0])}
                                                        />
                                                    )}
                                                </Field>
                                                {isTransferenciaLancamentoAcao && 
                                                    <div className="upload-file">
                                                        <div className="flex">
                                                            <div className="upload-file-thumbnail"><span className="text-4xl"><VscFile /></span> </div>
                                                            <div className="upload-file-info">
                                                                <h6 className="upload-file-name">{nomeArquivo}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                } 
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
                                        <FormItem label="Vinculado a" asterisk>
                                            <Field
                                                name="vinculado"
                                                as={Input}
                                                disabled
                                                value={`${nomeEnte} ${nomeEnteSencundario != null ? " - " + nomeEnteSencundario : ''}`}
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

                                    {tipoVinculo === 'documentacao' && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <FormItem
                                                    label="Versão"
                                                    asterisk
                                                    invalid={!!errors.versao && touched.versao}
                                                    errorMessage={errors.versao}
                                                >
                                                    <Field name="versao" as={Input} placeholder="Versão do documento" />
                                                </FormItem>

                                                <FormItem
                                                    label="Grupo"
                                                    asterisk
                                                    invalid={!!errors.grupo && touched.grupo}
                                                    errorMessage={errors.grupo}
                                                >
                                                    <Field name="grupo" as={Input} placeholder="Grupo do documento" />
                                                </FormItem>

                                                <FormItem
                                                    label="Status"
                                                    asterisk
                                                    invalid={!!errors.status_doc && touched.status_doc}
                                                    errorMessage={errors.status_doc}
                                                >
                                                    <Field name="status_doc">
                                                        {({ form }: any) => (
                                                            <Select
                                                                placeholder="Define se o documento será exibido ou não."
                                                                options={[
                                                                    { value: '1', label: 'Ativo' },
                                                                    { value: '0', label: 'Inativo' },
                                                                ]}
                                                                value={{
                                                                    value: form.values.status_doc || '1',
                                                                    label: form.values.status_doc === '0' ? 'Inativo' : 'Ativo',
                                                                }}
                                                                onChange={(option) => form.setFieldValue('status_doc', option?.value)}
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormItem
                                                    label="Direitos"
                                                >
                                                    <Select
                                                        options={recursos}
                                                        placeholder="Caso queira esconder um documento para usuários que possuam certo direito."
                                                        onChange={(option: { value: string } | null) => {
                                                            setFieldValue('direitos', option?.value || '');
                                                        }}
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    label="Referência"
                                                    asterisk
                                                    invalid={!!errors.referencia && touched.referencia}
                                                    errorMessage={errors.referencia}
                                                >
                                                    <Field name="referencia" as={Input} placeholder="A referência é utilizada para arquivos que podem ter várias versões." />
                                                </FormItem>
                                            </div>
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
                                            className="block lg:inline-block md:mb-0 mb-4"
                                            to={`${redirectUrl}`}
                                        >
                                            <Button
                                                block
                                                variant="default"
                                            >
                                                Cancelar
                                            </Button>
                                        </Link>
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
