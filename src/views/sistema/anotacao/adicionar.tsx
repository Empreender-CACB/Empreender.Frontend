import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { Button, FormItem, Input, Notification, Select, Tag, toast } from '@/components/ui';
import { Container } from '@/components/shared';
import Breadcrumb from '@/components/breadCrumbs/breadCrumb';
import capitalize from '@/components/ui/utils/capitalize';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

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


const AdicionarAnotacao = () => {
    const [nomeVinculo, setNomeVinculo] = useState('');
    const [loading, setLoading] = useState<boolean>();
    const { tipoVinculo, idVinculo } = useParams();
    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { label: 'Início', link: '/' },
    ]);

    useEffect(() => {
        const fetchVinculo = async () => {
            try {
                const vinculoResponse = await ApiService.fetchData({
                    url: `anexos/getVinculo/${tipoVinculo}/${idVinculo}`,
                    method: 'get',
                });

                const { nomeVinculo, breadcrumb } = vinculoResponse.data;

                setNomeVinculo(nomeVinculo);
                setBreadcrumbItems([
                    { label: 'Início', link: '/' },
                    ...breadcrumb.map((item: any) => ({ label: item.label, link: item.url })),
                    { label: 'Adicionar anotação', link: '#' },
                ]);
            } catch (error) {
                console.error('Erro ao buscar dados do vínculo:', error);
            }
        };

        fetchVinculo();
    }, [tipoVinculo, idVinculo]);


    const navigate = useNavigate();

    const handleSave = async (values: any) => {
        setLoading(true);
        toast.push(
            <Notification title="Salvando anotação, aguarde..." type="success" />
        );
    
        try {
            await ApiService.fetchData({
                url: '/anotacoes/adicionar',
                method: 'post',
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
            setLoading(false);
        }
    };
    

    return (
        <Container>
            <div className="w-full max-w-4xl mb-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <Formik
                    initialValues={{
                        descricao: '',
                        situacao: '',
                        privacidade: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSave(values);
                        setSubmitting(false);
                    }}
                >
                    {({ setFieldValue, errors, touched, isSubmitting }) => (
                        <Form>
                            <div className="mb-6">
                                <h5 className="text-xl font-semibold text-gray-700 mb-4 dark:text-black ">Você está criando uma nova anotação em:</h5>
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

export default AdicionarAnotacao;
