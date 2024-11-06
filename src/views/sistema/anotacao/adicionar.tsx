import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { Button, FormItem, Input, Notification, Select, Tag, toast } from '@/components/ui';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import capitalize from '@/components/ui/utils/capitalize';

const validationSchema = Yup.object().shape({
    descricao: Yup.string().required('Campo obrigatório'),
    situacao: Yup.string().required('Campo obrigatório'),
    privacidade: Yup.string().required('Campo obrigatório'),
});

const situacaoOptions = [
    { value: 'ec', label: 'Em Cadastramento' },
    { value: 'di', label: 'Divulgada' },
];

const privacidadeOptions = [
    { value: 'si', label: 'Sem indicação' },
    { value: 'pr', label: 'Próprio' },
    { value: 'ep', label: 'Empresários participantes' },
    { value: 'ge', label: 'Gestores' },
    { value: 'na', label: 'Nacional' },
];

const AnotacaoForm = () => {
    const [nomeVinculo, setNomeVinculo] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        descricao: '',
        situacao: '',
        privacidade: '',
    });
    const { tipoVinculo, idVinculo, idAnotacao } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(idAnotacao);

    useEffect(() => {
        const fetchVinculo = async () => {
            try {
                const vinculoResponse = await ApiService.fetchData({
                    url: `anexos/getVinculo/${tipoVinculo}/${idVinculo}`,
                    method: 'get',
                });
                const { nomeVinculo } = vinculoResponse.data;
                setNomeVinculo(nomeVinculo);
            } catch (error) {
                console.error('Erro ao buscar dados do vínculo:', error);
            }
        };

        const fetchAnotacao = async () => {
            if (!isEditMode) return;
            try {
                const response = await ApiService.fetchData({
                    url: `/anotacoes/fetchAnotacao/${idAnotacao}`,
                    method: 'get',
                });
                setInitialValues({
                    descricao: response.data.descricao,
                    situacao: response.data.situacao,
                    privacidade: response.data.privacidade,
                });
            } catch (error) {
                console.error('Erro ao buscar dados da anotação:', error);
            }
        };

        fetchVinculo();
        fetchAnotacao();
    }, [tipoVinculo, idVinculo, idAnotacao, isEditMode]);

    const handleSave = async (values: any) => {
        setLoading(true);
        toast.push(
            <Notification title={`${isEditMode ? 'Editando' : 'Salvando'} anotação, aguarde...`} type="success" />
        );

        try {
            const url = isEditMode ? `/anotacoes/editar/${idAnotacao}` : '/anotacoes/adicionar';
            const method = isEditMode ? 'put' : 'post';
            await ApiService.fetchData({
                url,
                method,
                data: {
                    ...values,
                    tipoVinculo,
                    idVinculo,
                },
            });

            navigate(`/sistema/anotacoes/${tipoVinculo}/${idVinculo}`);
        } catch (error) {
            toast.push(
                <Notification title="Erro ao salvar anotação." type="danger" />
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="w-full max-w-4xl mb-4">
                <Breadcrumb items={[
                    { label: 'Início', link: '/' },
                    { label: `${isEditMode ? 'Editar' : 'Adicionar'} anotação`, link: '#' },
                ]} />
            </div>
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSave(values);
                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="mb-6">
                                <h5 className="text-xl font-semibold text-gray-700 mb-4">
                                    Você está {isEditMode ? 'editando' : 'criando'} uma anotação em:
                                </h5>
                                <div className="flex items-center space-x-2">
                                    <Tag className="bg-gray-400 text-white border-0 rounded">
                                        {capitalize(tipoVinculo || '')}
                                    </Tag>
                                    <Link to="#">
                                        <Tag className="bg-indigo-600 text-white border-0 rounded">
                                            {capitalize(nomeVinculo || '')}
                                        </Tag>
                                    </Link>
                                </div>
                            </div>

                            <div className="mb-6">
                                <FormItem asterisk label="Descrição" invalid={!!errors.descricao && touched.descricao}
                                    errorMessage={errors.descricao}>
                                    <Field
                                        name="descricao"
                                        as="textarea"
                                        textArea
                                        placeholder="Descrição da anotação"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

                            <div className="flex gap-4">
                                <FormItem
                                    label="Situação"
                                    asterisk
                                    invalid={!!errors.situacao && touched.situacao}
                                    errorMessage={errors.situacao}
                                    className="w-full md:w-auto"
                                >
                                    <Field name="situacao">
                                        {({ field, form }: any) => (
                                            <Select
                                                {...field}
                                                options={situacaoOptions}
                                                placeholder="Selecione a situação"
                                                value={situacaoOptions.find(option => option.value === form.values.situacao)}
                                                onChange={(option: any) => form.setFieldValue('situacao', option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem
                                    label="Privacidade"
                                    asterisk
                                    invalid={!!errors.privacidade && touched.privacidade}
                                    errorMessage={errors.privacidade}
                                    className="w-full md:w-auto"
                                >
                                    <Field name="privacidade">
                                        {({ field, form }: any) => (
                                            <Select
                                                {...field}
                                                options={privacidadeOptions}
                                                placeholder="Selecione a privacidade"
                                                value={privacidadeOptions.find(option => option.value === form.values.privacidade)}
                                                onChange={(option: any) => form.setFieldValue('privacidade', option?.value)}
                                            />
                                        )}
                                    </Field>
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
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    );
};

export default AnotacaoForm;
